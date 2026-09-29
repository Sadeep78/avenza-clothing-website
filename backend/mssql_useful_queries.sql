-- ====================================================================
-- ACHINI'S FASHION STORE - MICROSOFT SQL SERVER (SSMS 19) USEFUL QUERIES
-- Description: Ready-to-run T-SQL queries with clear comments for
--              User Registrations, Order Tracking (Ascending & Descending),
--              Product Inventory & Sales Analytics (NO SQUARE BRACKETS).
-- ====================================================================

USE achinis_fashion_db;
GO

-- ====================================================================
-- 1. USER REGISTRATION QUERIES
-- ====================================================================

-- 1.1 Show User Registrations (NEWEST First - Descending Order)
SELECT 
    id AS User_ID,
    name AS Full_Name,
    email AS Email_Address,
    role AS Account_Role,
    phone AS Phone,
    city AS City,
    created_at AS Registration_Date
FROM dbo.users
ORDER BY created_at DESC;

-- 1.2 Show User Registrations (OLDEST First - Ascending Order)
SELECT 
    id AS User_ID,
    name AS Full_Name,
    email AS Email_Address,
    role AS Account_Role,
    created_at AS Registration_Date
FROM dbo.users
ORDER BY created_at ASC;

-- 1.3 Show ONLY Customer Accounts
SELECT id, name, email, phone, city
FROM dbo.users
WHERE role = 'customer';

-- 1.4 Count Total Registered Users by Role (Customer vs Admin)
SELECT 
    role AS Account_Role,
    COUNT(*) AS Total_Registered_Users
FROM dbo.users
GROUP BY role;


-- ====================================================================
-- 2. ORDER TRACKING QUERIES (ASCENDING & DESCENDING)
-- ====================================================================

-- 2.1 Track Orders (NEWEST Orders First - Descending Order)
SELECT 
    id AS Order_ID,
    customer_name AS Customer_Name,
    email AS Email,
    order_date AS Order_Date,
    total_amount_lkr AS Total_LKR,
    status AS Current_Status,
    tracking_number AS Tracking_Number
FROM dbo.orders
ORDER BY created_at DESC;

-- 2.2 Track Orders (OLDEST Orders First - Ascending Order)
SELECT 
    id AS Order_ID,
    customer_name AS Customer_Name,
    order_date AS Order_Date,
    total_amount_lkr AS Total_LKR,
    status AS Current_Status
FROM dbo.orders
ORDER BY created_at ASC;

-- 2.3 Track Orders by Highest Value (Price High to Low - Descending)
SELECT 
    id AS Order_ID,
    customer_name AS Customer_Name,
    total_amount_lkr AS Total_LKR,
    status AS Status
FROM dbo.orders
ORDER BY total_amount_lkr DESC;

-- 2.4 Track Orders Filtered by Specific Status (e.g. 'Shipped' or 'Processing')
SELECT 
    id AS Order_ID,
    customer_name AS Customer,
    status AS Status,
    tracking_number AS Tracking_Number,
    estimated_delivery AS Est_Delivery
FROM dbo.orders
WHERE status = 'Shipped';

-- 2.5 Inspect Items Purchased Inside an Order (Joining Orders & Order Items)
SELECT 
    o.id AS Order_ID,
    o.customer_name AS Customer,
    o.tracking_number AS Tracking_Number,
    i.product_name AS Apparel_Item,
    i.size AS Size,
    i.color AS Color,
    i.quantity AS Qty,
    i.price_lkr AS Item_Price_LKR
FROM dbo.orders o
INNER JOIN dbo.order_items i ON o.id = i.order_id
WHERE o.id = 'ACH-99420';


-- ====================================================================
-- 3. CLOTHING INVENTORY & STOCK QUERIES
-- ====================================================================

-- 3.1 Clothes Sorted by Stock Count (Low to High - Ascending)
SELECT 
    id,
    sku,
    name,
    category_id,
    stock AS Stock_Available,
    price_lkr AS Price_LKR
FROM dbo.products
ORDER BY stock ASC;

-- 3.2 Clothes Sorted by Price (High to Low - Descending)
SELECT 
    name,
    category_id,
    price_lkr AS Price_LKR,
    stock
FROM dbo.products
ORDER BY price_lkr DESC;


-- ====================================================================
-- 4. SALES & REVENUE ANALYTICS SUMMARY
-- ====================================================================

SELECT 
    SUM(total_amount_lkr) AS Total_Revenue_LKR,
    COUNT(*) AS Total_Orders_Placed,
    AVG(total_amount_lkr) AS Average_Order_Value_LKR
FROM dbo.orders;
