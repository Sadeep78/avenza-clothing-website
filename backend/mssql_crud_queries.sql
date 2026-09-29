-- ====================================================================
-- ACHINI'S FASHION STORE - MICROSOFT SQL SERVER (SSMS 19) CRUD COMMANDS
-- Description: Ready-to-run T-SQL queries for Create, Read, Update, Delete.
-- ====================================================================

USE [achinis_fashion_db];
GO

-- ====================================================================
-- 1. READ COMMANDS (SELECT & VIEW DATA)
-- ====================================================================

-- 1.1 View All Clothes Products (Ordered by Price in LKR)
SELECT 
    id AS [Product ID],
    sku AS [SKU],
    name AS [Apparel Name],
    category_id AS [Category],
    price_lkr AS [Price (LKR)],
    stock AS [Stock Count],
    rating AS [Rating]
FROM dbo.products
ORDER BY price_lkr DESC;

-- 1.2 View Low Stock Clothes (Stock <= 5)
SELECT 
    id,
    name,
    category_id,
    stock,
    price_lkr
FROM dbo.products
WHERE stock <= 5;

-- 1.3 View All Users (Customer & Admin Accounts)
SELECT 
    id,
    name,
    email,
    role,
    phone,
    city,
    created_at
FROM dbo.users;

-- 1.4 View All Customer Orders & Status
SELECT 
    id AS [Order ID],
    customer_name AS [Customer Name],
    email AS [Email],
    order_date AS [Order Date],
    total_amount_lkr AS [Total (LKR)],
    status AS [Status],
    tracking_number AS [Tracking Number]
FROM dbo.orders
ORDER BY created_at DESC;

-- 1.5 View Detailed Order Items (Joining Orders & Order Items)
SELECT 
    o.id AS [Order ID],
    o.customer_name AS [Customer],
    i.product_name AS [Item Name],
    i.size AS [Size],
    i.color AS [Color],
    i.price_lkr AS [Unit Price (LKR)],
    i.quantity AS [Qty]
FROM dbo.orders o
INNER JOIN dbo.order_items i ON o.id = i.order_id;


-- ====================================================================
-- 2. CREATE COMMANDS (INSERT NEW RECORDS)
-- ====================================================================

-- 2.1 Add a New Clothes Product
INSERT INTO dbo.products (
    id, sku, name, category_id, price_lkr, original_price_lkr, 
    stock, image_url, description, fabric, care_instructions
) VALUES (
    'prod-m11', 'ACH-MN-11', 'Italian Silk & Wool Tuxedo Blazer', 'men', 
    35000.00, 42000.00, 10, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35', 
    'Luxury silk lined tuxedo jacket.', '70% Wool, 30% Silk', 'Dry clean only'
);

-- 2.2 Add Sizes for the New Product
INSERT INTO dbo.product_sizes (product_id, size_code) VALUES
('prod-m11', 'M'), ('prod-m11', 'L'), ('prod-m11', 'XL');

-- 2.3 Add Colors for the New Product
INSERT INTO dbo.product_colors (product_id, color_name, color_hex) VALUES
('prod-m11', 'Midnight Navy', '#1e293b'), ('prod-m11', 'Classic Black', '#000000');

-- 2.4 Add a New Customer User
INSERT INTO dbo.users (name, email, password, role, phone, address, city) 
VALUES ('Nimal Perera', 'nimal@gmail.com', 'user123', 'customer', '+94 77 999 8888', 'No. 12, Main Street', 'Kandy');


-- ====================================================================
-- 3. UPDATE COMMANDS (MODIFY EXISTING DATA)
-- ====================================================================

-- 3.1 Update Product Stock Level
UPDATE dbo.products
SET stock = 30
WHERE id = 'prod-m1';

-- 3.2 Update Product Price in LKR
UPDATE dbo.products
SET price_lkr = 5200.00
WHERE id = 'prod-m1';

-- 3.3 Update Order Fulfillment Status (Placed -> Processing -> Shipped -> Delivered)
UPDATE dbo.orders
SET status = 'Delivered'
WHERE id = 'ACH-99420';


-- ====================================================================
-- 4. DELETE COMMANDS (REMOVE RECORDS)
-- ====================================================================

-- 4.1 Delete a Product by ID
DELETE FROM dbo.products
WHERE id = 'prod-m11';

-- 4.2 Delete an Order by ID
DELETE FROM dbo.orders
WHERE id = 'ACH-99420';
