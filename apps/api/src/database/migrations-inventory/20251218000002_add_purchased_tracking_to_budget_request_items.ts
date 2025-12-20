import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`SET search_path TO inventory, public`);

  // ============================================================================
  // เพิ่มฟิลด์สำหรับติดตามการซื้อจริง (Purchased Tracking)
  // ============================================================================
  await knex.raw(`
    ALTER TABLE inventory.budget_request_items

    -- ติดตามการซื้อรายไตรมาส (Purchased Quantity per Quarter)
    ADD COLUMN q1_purchased_qty INTEGER DEFAULT 0,
    ADD COLUMN q2_purchased_qty INTEGER DEFAULT 0,
    ADD COLUMN q3_purchased_qty INTEGER DEFAULT 0,
    ADD COLUMN q4_purchased_qty INTEGER DEFAULT 0,

    -- ติดตามการซื้อรวม (Total Purchased)
    ADD COLUMN total_purchased_qty INTEGER DEFAULT 0,
    ADD COLUMN total_purchased_value DECIMAL(15,2) DEFAULT 0,

    -- ประวัติการใช้ย้อนหลัง 3 ปี (Historical Usage)
    ADD COLUMN last_year_qty INTEGER,
    ADD COLUMN two_years_ago_qty INTEGER,
    ADD COLUMN three_years_ago_qty INTEGER,

    -- เพิ่ม constraints
    ADD CONSTRAINT budget_request_items_purchased_qty_check
      CHECK (total_purchased_qty = q1_purchased_qty + q2_purchased_qty + q3_purchased_qty + q4_purchased_qty),

    ADD CONSTRAINT budget_request_items_purchased_value_check
      CHECK (total_purchased_value >= 0);
  `);

  // ============================================================================
  // เพิ่ม computed columns (views) สำหรับการวิเคราะห์
  // ============================================================================
  await knex.raw(`
    COMMENT ON COLUMN inventory.budget_request_items.q1_purchased_qty IS
      'ปริมาณที่ซื้อจริงในไตรมาส 1 (อัปเดตจาก PO approved)';

    COMMENT ON COLUMN inventory.budget_request_items.q2_purchased_qty IS
      'ปริมาณที่ซื้อจริงในไตรมาส 2 (อัปเดตจาก PO approved)';

    COMMENT ON COLUMN inventory.budget_request_items.q3_purchased_qty IS
      'ปริมาณที่ซื้อจริงในไตรมาส 3 (อัปเดตจาก PO approved)';

    COMMENT ON COLUMN inventory.budget_request_items.q4_purchased_qty IS
      'ปริมาณที่ซื้อจริงในไตรมาส 4 (อัปเดตจาก PO approved)';

    COMMENT ON COLUMN inventory.budget_request_items.total_purchased_qty IS
      'ปริมาณที่ซื้อจริงรวมทั้งปี';

    COMMENT ON COLUMN inventory.budget_request_items.total_purchased_value IS
      'มูลค่าที่ซื้อจริง (อาจต่างจากประมาณการ เนื่องจากต่อรองราคา)';

    COMMENT ON COLUMN inventory.budget_request_items.last_year_qty IS
      'ปริมาณที่ใช้ในปีที่แล้ว (ช่วยประมาณการ)';

    COMMENT ON COLUMN inventory.budget_request_items.two_years_ago_qty IS
      'ปริมาณที่ใช้เมื่อ 2 ปีที่แล้ว';

    COMMENT ON COLUMN inventory.budget_request_items.three_years_ago_qty IS
      'ปริมาณที่ใช้เมื่อ 3 ปีที่แล้ว';
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`SET search_path TO inventory, public`);

  await knex.raw(`
    ALTER TABLE inventory.budget_request_items
    DROP CONSTRAINT IF EXISTS budget_request_items_purchased_value_check,
    DROP CONSTRAINT IF EXISTS budget_request_items_purchased_qty_check,
    DROP COLUMN IF EXISTS three_years_ago_qty,
    DROP COLUMN IF EXISTS two_years_ago_qty,
    DROP COLUMN IF EXISTS last_year_qty,
    DROP COLUMN IF EXISTS total_purchased_value,
    DROP COLUMN IF EXISTS total_purchased_qty,
    DROP COLUMN IF EXISTS q4_purchased_qty,
    DROP COLUMN IF EXISTS q3_purchased_qty,
    DROP COLUMN IF EXISTS q2_purchased_qty,
    DROP COLUMN IF EXISTS q1_purchased_qty;
  `);
}
