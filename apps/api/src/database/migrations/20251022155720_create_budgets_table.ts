import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('budgets', (table) => {
    table.increments('id').primary();
    table.string('budget_code', 10).notNullable().unique();
    table.string('budget_type', 10);
    table.string('budget_category', 10);
    table.text('budget_description');
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('budgets');
}
