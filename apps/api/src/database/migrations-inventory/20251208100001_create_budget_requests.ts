import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`SET search_path TO inventory, public`);

  // ==============================================
  // Create generate_budget_request_number function
  // ==============================================
  await knex.raw(`
    CREATE OR REPLACE FUNCTION inventory.generate_budget_request_number(
      p_fiscal_year INTEGER
    ) RETURNS VARCHAR(50) AS $$
    DECLARE
      v_seq INTEGER;
      v_number VARCHAR(50);
    BEGIN
      -- Get next sequence number for this fiscal year
      SELECT COALESCE(MAX(
        CAST(
          SUBSTRING(request_number FROM 'BR-[0-9]{4}-([0-9]{4})') AS INTEGER
        )
      ), 0) + 1 INTO v_seq
      FROM inventory.budget_requests
      WHERE fiscal_year = p_fiscal_year;

      -- Format: BR-2025-0001
      v_number := 'BR-' || p_fiscal_year || '-' || LPAD(v_seq::TEXT, 4, '0');

      RETURN v_number;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // ==============================================
  // Budget Requests (header)
  // ==============================================
  await knex.raw(`
    CREATE TABLE inventory.budget_requests (
      id BIGSERIAL PRIMARY KEY,
      request_number VARCHAR(50) UNIQUE NOT NULL,
      fiscal_year INTEGER NOT NULL,
      department_id INTEGER REFERENCES inventory.departments(id) NOT NULL,

      -- Status tracking
      status inventory.budget_request_status NOT NULL DEFAULT 'DRAFT',

      -- Request details
      total_requested_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
      justification TEXT,

      -- Approval tracking
      submitted_by UUID REFERENCES public.users(id),
      submitted_at TIMESTAMP WITH TIME ZONE,

      dept_reviewed_by UUID REFERENCES public.users(id),
      dept_reviewed_at TIMESTAMP WITH TIME ZONE,
      dept_comments TEXT,

      finance_reviewed_by UUID REFERENCES public.users(id),
      finance_reviewed_at TIMESTAMP WITH TIME ZONE,
      finance_comments TEXT,

      rejection_reason TEXT,

      -- Audit fields
      created_by UUID NOT NULL REFERENCES public.users(id),
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMP WITH TIME ZONE,
      is_active BOOLEAN DEFAULT true,

      -- Constraints
      CONSTRAINT budget_requests_status_check CHECK (
        status IN ('DRAFT', 'SUBMITTED', 'DEPT_APPROVED', 'FINANCE_APPROVED', 'REJECTED')
      )
    )
  `);

  // Indexes for budget_requests
  await knex.raw(
    `CREATE INDEX idx_budget_requests_fiscal_year ON inventory.budget_requests(fiscal_year)`,
  );
  await knex.raw(
    `CREATE INDEX idx_budget_requests_department ON inventory.budget_requests(department_id)`,
  );
  await knex.raw(
    `CREATE INDEX idx_budget_requests_status ON inventory.budget_requests(status)`,
  );
  await knex.raw(
    `CREATE INDEX idx_budget_requests_number ON inventory.budget_requests(request_number)`,
  );
  await knex.raw(
    `CREATE INDEX idx_budget_requests_created_by ON inventory.budget_requests(created_by)`,
  );

  // ==============================================
  // Budget Request Items (detail)
  // ==============================================
  await knex.raw(`
    CREATE TABLE inventory.budget_request_items (
      id BIGSERIAL PRIMARY KEY,
      budget_request_id BIGINT NOT NULL REFERENCES inventory.budget_requests(id) ON DELETE CASCADE,
      budget_id INTEGER NOT NULL REFERENCES inventory.budgets(id),

      -- Requested amounts
      requested_amount DECIMAL(15,2) NOT NULL,
      q1_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
      q2_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
      q3_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
      q4_amount DECIMAL(15,2) NOT NULL DEFAULT 0,

      -- Justification
      item_justification TEXT,

      -- Audit fields
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

      -- Validation constraint
      CONSTRAINT budget_request_items_quarterly_check CHECK (
        q1_amount + q2_amount + q3_amount + q4_amount = requested_amount
      ),
      CONSTRAINT budget_request_items_amount_check CHECK (
        requested_amount > 0
      )
    )
  `);

  // Indexes for budget_request_items
  await knex.raw(
    `CREATE INDEX idx_budget_request_items_request ON inventory.budget_request_items(budget_request_id)`,
  );
  await knex.raw(
    `CREATE INDEX idx_budget_request_items_budget ON inventory.budget_request_items(budget_id)`,
  );
}

export async function down(knex: Knex): Promise<void> {
  // Drop tables
  await knex.raw(`DROP TABLE IF EXISTS inventory.budget_request_items CASCADE`);
  await knex.raw(`DROP TABLE IF EXISTS inventory.budget_requests CASCADE`);

  // Drop function
  await knex.raw(
    `DROP FUNCTION IF EXISTS inventory.generate_budget_request_number(INTEGER)`,
  );
}
