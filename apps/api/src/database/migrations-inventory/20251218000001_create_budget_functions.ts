import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`SET search_path TO inventory, public`);

  // ============================================================================
  // Function 1: check_budget_availability
  // Purpose: ตรวจสอบว่างบประมาณเพียงพอหรือไม่ (พิจารณาทั้ง spent และ reserved)
  // ============================================================================
  await knex.raw(`
    CREATE OR REPLACE FUNCTION inventory.check_budget_availability(
      p_fiscal_year INTEGER,
      p_budget_id INTEGER,
      p_department_id INTEGER,
      p_amount DECIMAL(15,2),
      p_quarter INTEGER
    )
    RETURNS TABLE(
      available BOOLEAN,
      remaining DECIMAL(15,2),
      budget_allocated DECIMAL(15,2),
      budget_spent DECIMAL(15,2),
      budget_reserved DECIMAL(15,2)
    )
    LANGUAGE plpgsql
    AS $$
    DECLARE
      v_allocation_id BIGINT;
      v_quarter_budget DECIMAL(15,2);
      v_quarter_spent DECIMAL(15,2);
      v_reserved_amount DECIMAL(15,2);
      v_available DECIMAL(15,2);
    BEGIN
      -- หา allocation_id
      SELECT id INTO v_allocation_id
      FROM inventory.budget_allocations
      WHERE fiscal_year = p_fiscal_year
        AND budget_id = p_budget_id
        AND department_id = p_department_id
        AND is_active = true;

      IF v_allocation_id IS NULL THEN
        -- ไม่มีงบจัดสรร
        RETURN QUERY SELECT false, 0::DECIMAL(15,2), 0::DECIMAL(15,2), 0::DECIMAL(15,2), 0::DECIMAL(15,2);
        RETURN;
      END IF;

      -- ดึงงบไตรมาสและยอดใช้ไป
      SELECT
        CASE
          WHEN p_quarter = 1 THEN q1_budget
          WHEN p_quarter = 2 THEN q2_budget
          WHEN p_quarter = 3 THEN q3_budget
          WHEN p_quarter = 4 THEN q4_budget
          ELSE 0
        END,
        CASE
          WHEN p_quarter = 1 THEN q1_spent
          WHEN p_quarter = 2 THEN q2_spent
          WHEN p_quarter = 3 THEN q3_spent
          WHEN p_quarter = 4 THEN q4_spent
          ELSE 0
        END
      INTO v_quarter_budget, v_quarter_spent
      FROM inventory.budget_allocations
      WHERE id = v_allocation_id;

      -- คำนวณยอดที่จองอยู่ (active reservations)
      SELECT COALESCE(SUM(reserved_amount), 0)
      INTO v_reserved_amount
      FROM inventory.budget_reservations
      WHERE allocation_id = v_allocation_id
        AND quarter = p_quarter
        AND is_released = false
        AND expires_date > NOW();

      -- คำนวณงบคงเหลือ
      v_available := v_quarter_budget - v_quarter_spent - v_reserved_amount;

      -- Return results
      RETURN QUERY SELECT
        (v_available >= p_amount)::BOOLEAN,
        v_available,
        v_quarter_budget,
        v_quarter_spent,
        v_reserved_amount;
    END;
    $$;
  `);

  // ============================================================================
  // Function 2: reserve_budget
  // Purpose: จองงบประมาณเมื่อสร้าง PR (ล็อคงบชั่วคราว)
  // ============================================================================
  await knex.raw(`
    CREATE OR REPLACE FUNCTION inventory.reserve_budget(
      p_fiscal_year INTEGER,
      p_budget_id INTEGER,
      p_department_id INTEGER,
      p_pr_id BIGINT,
      p_amount DECIMAL(15,2),
      p_quarter INTEGER,
      p_expires_days INTEGER DEFAULT 30
    )
    RETURNS TABLE(
      reservation_id BIGINT,
      success BOOLEAN,
      message TEXT
    )
    LANGUAGE plpgsql
    AS $$
    DECLARE
      v_allocation_id BIGINT;
      v_available BOOLEAN;
      v_remaining DECIMAL(15,2);
      v_reservation_id BIGINT;
      v_expires_date TIMESTAMP WITH TIME ZONE;
    BEGIN
      -- หา allocation_id
      SELECT id INTO v_allocation_id
      FROM inventory.budget_allocations
      WHERE fiscal_year = p_fiscal_year
        AND budget_id = p_budget_id
        AND department_id = p_department_id
        AND is_active = true;

      IF v_allocation_id IS NULL THEN
        RETURN QUERY SELECT NULL::BIGINT, false, 'Budget allocation not found'::TEXT;
        RETURN;
      END IF;

      -- ตรวจสอบงบคงเหลือ
      SELECT ca.available, ca.remaining
      INTO v_available, v_remaining
      FROM inventory.check_budget_availability(
        p_fiscal_year,
        p_budget_id,
        p_department_id,
        p_amount,
        p_quarter
      ) ca;

      IF NOT v_available THEN
        RETURN QUERY SELECT
          NULL::BIGINT,
          false,
          format('Insufficient budget. Available: %s, Requested: %s', v_remaining, p_amount)::TEXT;
        RETURN;
      END IF;

      -- คำนวณวันหมดอายุ
      v_expires_date := NOW() + (p_expires_days || ' days')::INTERVAL;

      -- สร้าง reservation
      INSERT INTO inventory.budget_reservations (
        allocation_id,
        pr_id,
        reserved_amount,
        quarter,
        reservation_date,
        expires_date,
        is_released,
        created_at,
        updated_at
      ) VALUES (
        v_allocation_id,
        p_pr_id,
        p_amount,
        p_quarter,
        NOW(),
        v_expires_date,
        false,
        NOW(),
        NOW()
      )
      RETURNING id INTO v_reservation_id;

      RETURN QUERY SELECT
        v_reservation_id,
        true,
        format('Budget reserved successfully. Expires: %s', v_expires_date)::TEXT;
    END;
    $$;
  `);

  // ============================================================================
  // Function 3: commit_budget
  // Purpose: ตัดงบจริงเมื่อ PO approved (update spent, release reservation)
  // ============================================================================
  await knex.raw(`
    CREATE OR REPLACE FUNCTION inventory.commit_budget(
      p_pr_id BIGINT,
      p_actual_amount DECIMAL(15,2),
      p_committed_by TEXT DEFAULT NULL
    )
    RETURNS TABLE(
      success BOOLEAN,
      message TEXT,
      allocation_id BIGINT,
      quarter INTEGER,
      previous_spent DECIMAL(15,2),
      new_spent DECIMAL(15,2)
    )
    LANGUAGE plpgsql
    AS $$
    DECLARE
      v_allocation_id BIGINT;
      v_reservation_id BIGINT;
      v_reserved_amount DECIMAL(15,2);
      v_quarter INTEGER;
      v_previous_spent DECIMAL(15,2);
      v_new_spent DECIMAL(15,2);
      v_field_name TEXT;
    BEGIN
      -- หา reservation
      SELECT br.id, br.allocation_id, br.reserved_amount, br.quarter
      INTO v_reservation_id, v_allocation_id, v_reserved_amount, v_quarter
      FROM inventory.budget_reservations br
      WHERE br.pr_id = p_pr_id
        AND br.is_released = false
      LIMIT 1;

      IF v_reservation_id IS NULL THEN
        RETURN QUERY SELECT
          false,
          'No active budget reservation found for this PR'::TEXT,
          NULL::BIGINT,
          NULL::INTEGER,
          NULL::DECIMAL(15,2),
          NULL::DECIMAL(15,2);
        RETURN;
      END IF;

      -- กำหนดชื่อ field ตามไตรมาส
      v_field_name := 'q' || v_quarter || '_spent';

      -- ดึงยอด spent ปัจจุบัน
      EXECUTE format('SELECT %I FROM inventory.budget_allocations WHERE id = $1', v_field_name)
      INTO v_previous_spent
      USING v_allocation_id;

      -- คำนวณยอด spent ใหม่
      v_new_spent := v_previous_spent + p_actual_amount;

      -- อัปเดตงบ (ตัดงบจริง)
      EXECUTE format('
        UPDATE inventory.budget_allocations
        SET %I = $1,
            total_spent = total_spent + $2,
            remaining_budget = total_budget - (total_spent + $2),
            updated_at = NOW()
        WHERE id = $3
      ', v_field_name)
      USING v_new_spent, p_actual_amount, v_allocation_id;

      -- ปลดล็อค reservation
      UPDATE inventory.budget_reservations
      SET is_released = true,
          released_at = NOW(),
          updated_at = NOW()
      WHERE id = v_reservation_id;

      RETURN QUERY SELECT
        true,
        format('Budget committed successfully. Quarter %s spent: %s -> %s',
               v_quarter, v_previous_spent, v_new_spent)::TEXT,
        v_allocation_id,
        v_quarter,
        v_previous_spent,
        v_new_spent;
    END;
    $$;
  `);

  // ============================================================================
  // Function 4: release_budget_reservation
  // Purpose: ปลดล็อคงบที่จองไว้ (เมื่อ PR rejected หรือยกเลิก)
  // ============================================================================
  await knex.raw(`
    CREATE OR REPLACE FUNCTION inventory.release_budget_reservation(
      p_pr_id BIGINT,
      p_reason TEXT DEFAULT NULL
    )
    RETURNS TABLE(
      success BOOLEAN,
      message TEXT,
      released_amount DECIMAL(15,2)
    )
    LANGUAGE plpgsql
    AS $$
    DECLARE
      v_reservation_id BIGINT;
      v_reserved_amount DECIMAL(15,2);
      v_updated_count INTEGER;
    BEGIN
      -- หา active reservation
      SELECT id, reserved_amount
      INTO v_reservation_id, v_reserved_amount
      FROM inventory.budget_reservations
      WHERE pr_id = p_pr_id
        AND is_released = false
      LIMIT 1;

      IF v_reservation_id IS NULL THEN
        RETURN QUERY SELECT
          false,
          'No active reservation found for this PR'::TEXT,
          0::DECIMAL(15,2);
        RETURN;
      END IF;

      -- ปลดล็อค
      UPDATE inventory.budget_reservations
      SET is_released = true,
          released_at = NOW(),
          updated_at = NOW()
      WHERE id = v_reservation_id;

      GET DIAGNOSTICS v_updated_count = ROW_COUNT;

      IF v_updated_count > 0 THEN
        RETURN QUERY SELECT
          true,
          format('Budget reservation released successfully. Amount: %s. Reason: %s',
                 v_reserved_amount, COALESCE(p_reason, 'Not specified'))::TEXT,
          v_reserved_amount;
      ELSE
        RETURN QUERY SELECT
          false,
          'Failed to release reservation'::TEXT,
          0::DECIMAL(15,2);
      END IF;
    END;
    $$;
  `);

  // ============================================================================
  // Function 5: auto_release_expired_reservations
  // Purpose: ปลดล็อคงบที่หมดอายุอัตโนมัติ (เรียกจาก cron job)
  // ============================================================================
  await knex.raw(`
    CREATE OR REPLACE FUNCTION inventory.auto_release_expired_reservations()
    RETURNS TABLE(
      released_count INTEGER,
      total_amount DECIMAL(15,2),
      details JSONB
    )
    LANGUAGE plpgsql
    AS $$
    DECLARE
      v_released_count INTEGER;
      v_total_amount DECIMAL(15,2);
      v_details JSONB;
    BEGIN
      -- หา expired reservations
      WITH expired_reservations AS (
        SELECT
          id,
          pr_id,
          reserved_amount,
          expires_date
        FROM inventory.budget_reservations
        WHERE is_released = false
          AND expires_date <= NOW()
      ),
      released AS (
        UPDATE inventory.budget_reservations
        SET is_released = true,
            released_at = NOW(),
            updated_at = NOW()
        WHERE id IN (SELECT id FROM expired_reservations)
        RETURNING id, pr_id, reserved_amount
      )
      SELECT
        COUNT(*)::INTEGER,
        COALESCE(SUM(reserved_amount), 0)::DECIMAL(15,2),
        jsonb_agg(
          jsonb_build_object(
            'reservation_id', id,
            'pr_id', pr_id,
            'amount', reserved_amount
          )
        )
      INTO v_released_count, v_total_amount, v_details
      FROM released;

      -- ถ้าไม่มีการ release ให้ส่ง array ว่าง
      IF v_details IS NULL THEN
        v_details := '[]'::JSONB;
      END IF;

      RETURN QUERY SELECT v_released_count, v_total_amount, v_details;
    END;
    $$;
  `);

  // ============================================================================
  // Add comments for documentation
  // ============================================================================
  await knex.raw(`
    COMMENT ON FUNCTION inventory.check_budget_availability(INTEGER, INTEGER, INTEGER, DECIMAL, INTEGER) IS
      'ตรวจสอบงบประมาณคงเหลือ พิจารณาทั้ง spent และ reserved';

    COMMENT ON FUNCTION inventory.reserve_budget(INTEGER, INTEGER, INTEGER, BIGINT, DECIMAL, INTEGER, INTEGER) IS
      'จองงบประมาณชั่วคราวเมื่อสร้าง PR (ล็อคงบ 30 วัน)';

    COMMENT ON FUNCTION inventory.commit_budget(BIGINT, DECIMAL, TEXT) IS
      'ตัดงบจริงเมื่อ PO approved และปลดล็อค reservation';

    COMMENT ON FUNCTION inventory.release_budget_reservation(BIGINT, TEXT) IS
      'ปลดล็อคงบที่จองไว้เมื่อ PR rejected หรือยกเลิก';

    COMMENT ON FUNCTION inventory.auto_release_expired_reservations() IS
      'ปลดล็อคงบที่หมดอายุอัตโนมัติ (เรียกจาก cron job)';
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`SET search_path TO inventory, public`);

  await knex.raw(
    `DROP FUNCTION IF EXISTS inventory.auto_release_expired_reservations()`,
  );
  await knex.raw(
    `DROP FUNCTION IF EXISTS inventory.release_budget_reservation(BIGINT, TEXT)`,
  );
  await knex.raw(
    `DROP FUNCTION IF EXISTS inventory.commit_budget(BIGINT, DECIMAL, TEXT)`,
  );
  await knex.raw(
    `DROP FUNCTION IF EXISTS inventory.reserve_budget(INTEGER, INTEGER, INTEGER, BIGINT, DECIMAL, INTEGER, INTEGER)`,
  );
  await knex.raw(
    `DROP FUNCTION IF EXISTS inventory.check_budget_availability(INTEGER, INTEGER, INTEGER, DECIMAL, INTEGER)`,
  );
}
