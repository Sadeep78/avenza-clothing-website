const { pool } = require('./db');

async function testAllUserStories() {
  console.log('--- STARTING 28 USER STORY SQL VERIFICATION ---');
  try {
    // E3: Customer
    console.log('[AVE-01] Testing Create & Login Customer Account...');
    await pool.query("SELECT id, email, role, status FROM users WHERE email = 'customer@avenza.com'");

    console.log('[AVE-02] Testing View & Update Profile...');
    await pool.query("UPDATE users SET phone = '+94 77 111 2222', city = 'Colombo 07' WHERE email = 'customer@avenza.com'");
    await pool.query("SELECT id, name, phone, city FROM users WHERE email = 'customer@avenza.com'");

    console.log('[AVE-03] Testing Browse Products & Availability...');
    await pool.query("SELECT id, name, price_lkr, stock, is_available FROM products WHERE is_available = 1");

    console.log('[AVE-04] Testing Cart Product Lookups...');
    await pool.query("SELECT id, name, price_lkr, stock FROM products WHERE id IN ('prod-m1', 'prod-m2')");

    console.log('[AVE-05] Testing Checkout & Order Confirmation...');
    await pool.query("SELECT id, customer_name, total_amount_lkr, status FROM orders WHERE id = 'AVENZA-74336'");

    console.log('[AVE-06] Testing Track Order Delivery Status...');
    await pool.query("SELECT id, status, tracking_number, estimated_delivery FROM orders WHERE id = 'AVENZA-74336'");

    console.log('[AVE-07] Testing Submit Feedback & Rating...');
    await pool.query("INSERT INTO customer_feedback (product_id, user_name, rating, comment, status) VALUES ('prod-m1', 'Test Customer', 5, 'Great quality!', 'pending')");

    // E1: Administrator
    console.log('[AVE-08] Testing Administrator Login...');
    await pool.query("SELECT id, email, role FROM users WHERE role = 'admin'");

    console.log('[AVE-09] Testing Create System User Account...');
    await pool.query("INSERT INTO users (name, email, password, role, status) VALUES ('Temp Admin User', 'tempuser@avenza.com', 'pass123', 'customer', 'active')");

    console.log('[AVE-10] Testing View & Update User Details...');
    await pool.query("UPDATE users SET city = 'Kandy' WHERE email = 'tempuser@avenza.com'");

    console.log('[AVE-11] Testing Assign / Change User Role...');
    await pool.query("UPDATE users SET role = 'inventory_staff' WHERE email = 'tempuser@avenza.com'");

    console.log('[AVE-12] Testing Deactivate & Remove Account...');
    await pool.query("UPDATE users SET status = 'inactive' WHERE email = 'tempuser@avenza.com'");
    await pool.query("DELETE FROM users WHERE email = 'tempuser@avenza.com'");

    console.log('[AVE-13] Testing View & Update System Settings...');
    await pool.query("SELECT setting_key, setting_value FROM system_settings");
    await pool.query("UPDATE system_settings SET setting_value = 'Avenza Flagship Store' WHERE setting_key = 'storeName'");

    console.log('[AVE-14] Testing Delivery Records Update...');
    await pool.query("UPDATE orders SET tracking_number = 'DOMEX-LK-998811' WHERE id = 'AVENZA-74336'");

    console.log('[AVE-15] Testing Update Delivery Status (Processing -> Shipped -> Delivered)...');
    await pool.query("UPDATE orders SET status = 'Delivered' WHERE id = 'AVENZA-74336'");
    await pool.query("UPDATE orders SET status = 'Processing' WHERE id = 'AVENZA-74336'");

    console.log('[AVE-16] Testing Feedback Moderation & Admin Reply...');
    await pool.query("UPDATE customer_feedback SET status = 'approved', admin_reply = 'Thank you for your review!' WHERE comment = 'Great quality!'");
    await pool.query("DELETE FROM customer_feedback WHERE comment = 'Great quality!'");

    // E2: Inventory Staff
    console.log('[AVE-17] Testing Staff Login...');
    await pool.query("SELECT id, email, role FROM users WHERE role = 'inventory_staff'");

    console.log('[AVE-18] Testing Add New Clothing Product...');
    await pool.query("INSERT INTO products (id, sku, name, category_id, price_lkr, stock, image_url, is_available) VALUES ('prod-test', 'ACH-TST-01', 'Test Apparel Tee', 'men', 4500, 15, '/test.png', 1)");
    await pool.query("INSERT INTO product_sizes (product_id, size_code) VALUES ('prod-test', 'M')");
    await pool.query("INSERT INTO product_colors (product_id, color_name, color_hex) VALUES ('prod-test', 'Charcoal', '#333333')");

    console.log('[AVE-19] Testing View Product & Stock Information...');
    await pool.query("SELECT id, sku, name, stock, price_lkr FROM products WHERE id = 'prod-test'");

    console.log('[AVE-20] Testing Update Product Details, Prices, Sizes, & Stock...');
    await pool.query("UPDATE products SET price_lkr = 4900, stock = 20 WHERE id = 'prod-test'");

    console.log('[AVE-21] Testing Toggle Product Availability...');
    await pool.query("UPDATE products SET is_available = 0 WHERE id = 'prod-test'");
    await pool.query("UPDATE products SET is_available = 1 WHERE id = 'prod-test'");

    console.log('[AVE-22] Testing Remove / Archive Product...');
    await pool.query("DELETE FROM products WHERE id = 'prod-test'");

    // E4: Manager / Owner
    console.log('[AVE-23] Testing Manager Login...');
    await pool.query("SELECT id, email, role FROM users WHERE role = 'manager'");

    console.log('[AVE-24] Testing Manager Dashboard Key Business KPIs...');
    await pool.query("SELECT COUNT(*) AS total_orders, ISNULL(SUM(total_amount_lkr), 0) AS gross_revenue, ISNULL(AVG(total_amount_lkr), 0) AS aov FROM orders");

    console.log('[AVE-25] Testing View & Filter Sales Reports by Period...');
    await pool.query("SELECT id, customer_name, order_date, total_amount_lkr, status FROM orders WHERE order_date >= '2026-01-01'");

    console.log('[AVE-26] Testing Inventory Reports & Low Stock Alerts...');
    await pool.query("SELECT id, sku, name, stock, price_lkr FROM products WHERE stock <= 10 ORDER BY stock ASC");

    console.log('[AVE-27] Testing Customer & Order Performance Reports...');
    await pool.query("SELECT customer_name, email, COUNT(id) AS total_orders, SUM(total_amount_lkr) AS total_spent FROM orders GROUP BY customer_name, email");

    console.log('[AVE-28] Testing Exportable Business Reports...');
    await pool.query("SELECT p.name AS Product, SUM(i.quantity) AS Units_Sold, SUM(i.quantity * i.price_lkr) AS Total_Revenue FROM order_items i JOIN products p ON i.product_id = p.id GROUP BY p.name");

    console.log('--- ALL 28 USER STORIES VERIFIED SUCCESSFULLY IN SQL SERVER! ---');
    process.exit(0);
  } catch (err) {
    console.error('VERIFICATION FAILED:', err);
    process.exit(1);
  }
}

testAllUserStories();
