import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // 🛡️ PRODUCTION SAFETY: Skip in production
  const isDevelopment =
    process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

  if (!isDevelopment) {
    console.log('⏭️  [PROD] Skipping test_categories seed');
    return;
  }

  // Check if table exists
  const hasTable = await knex.schema.hasTable('test_categories');
  if (!hasTable) {
    console.log('⏭️  [DEV] test_categories table not found, skipping seed');
    return;
  }

  // Clear existing data
  await knex('test_categories').del();

  // Insert test data
  await knex('test_categories').insert([
    {
      code: 'ELEC',
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and accessories',
      is_active: true,
      is_featured: true,
      display_order: 1,
      item_count: 0,
      discount_rate: 10.5,
      status: 'active',
      metadata: JSON.stringify({
        icon: 'laptop',
        color: '#3B82F6',
        image_url: '/images/categories/electronics.jpg',
      }),
      settings: JSON.stringify({
        show_in_menu: true,
        featured_limit: 5,
        allow_pre_order: true,
      }),
    },
    {
      code: 'BOOK',
      name: 'Books',
      slug: 'books',
      description: 'Books and publications',
      is_active: true,
      is_featured: false,
      display_order: 2,
      item_count: 0,
      discount_rate: 5.0,
      status: 'active',
      metadata: JSON.stringify({
        icon: 'book',
        color: '#10B981',
      }),
      settings: JSON.stringify({
        show_in_menu: true,
      }),
    },
    {
      code: 'FURN',
      name: 'Furniture',
      slug: 'furniture',
      description: 'Home and office furniture',
      is_active: true,
      is_featured: true,
      display_order: 3,
      item_count: 0,
      status: 'active',
      metadata: JSON.stringify({
        icon: 'chair',
        color: '#F59E0B',
      }),
    },
    {
      code: 'CLOTH',
      name: 'Clothing',
      slug: 'clothing',
      description: 'Fashion and apparel',
      is_active: false,
      is_featured: false,
      display_order: 4,
      item_count: 0,
      status: 'draft',
      metadata: JSON.stringify({
        icon: 'tshirt',
        color: '#EC4899',
      }),
    },
  ]);

  console.log('✅ [DEV] Seeded test_categories with 4 records');
}
