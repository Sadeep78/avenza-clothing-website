-- ====================================================================
-- AVENZA CLOTHING STORE - EPIC E3: SHOPPING CART & PAYMENT MANAGEMENT
-- File: backend/database/epic3_shopping_cart_and_payment_queries.sql
-- Target Role: Customer / Accounts (Checkout, Transactions & Order History)
-- Tables Covered: orders, order_items, payment, card_payment, cash_on_delivery
-- Database: achinis_fashion_db (MySQL / MariaDB via XAMPP)
-- ====================================================================

USE `achinis_fashion_db`;

-- ====================================================================
-- 1. CREATE OPERATIONS (INSERT / ORDER CHECKOUT)
-- ====================================================================

-- 1A. Step 1: Create Master Customer Order Record
INSERT INTO `orders` (
    `id`, `user_id`, `customer_name`, `email`, `order_date`, `total_amount_lkr`, 
    `status`, `tracking_number`, `estimated_delivery`, `shipping_address`, `payment_method`
) VALUES (
    'ORD-2026-9001', 
    1, 
    'Sasanka Perera', 
    'customer@avenza.com', 
    CURDATE(), 
    10400.00, 
    'Processing', 
    'AVZ-DOM-9001', 
    DATE_ADD(CURDATE(), INTERVAL 3 DAY), 
    'No. 25, Baseline Road, Colombo 09', 
    'Visa Card ending in 4242'
);

-- 1B. Step 2: Insert Order Item Details
INSERT INTO `order_items` (
    `order_id`, `product_id`, `product_name`, `price_lkr`, `size`, `color`, `quantity`, `image_url`
) VALUES 
('ORD-2026-9001', 'prod-m1', 'Apex Pro Performance Compression Tee', 5200.00, 'M', 'Navy', 1, 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e'),
('ORD-2026-9001', 'prod-m2', 'Tech Stretch Chino Pant', 5200.00, 'L', 'Beige', 1, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80');

-- 1C. Step 3: Insert Payment Record (Payment ISA Supertype)
INSERT INTO `payment` (
    `payment_id`, `order_id`, `amount`, `payment_date`, `status`, `payment_type`
) VALUES (
    101, 
    'ORD-2026-9001', 
    10400.00, 
    NOW(), 
    'Paid', 
    'Card_Payment'
);

-- 1D. Step 4A: Insert Card Payment Subtype Record (For Visa / Mastercard checkout)
INSERT INTO `card_payment` (
    `payment_id`, `card_type`, `last_4_digits`, `transaction_auth`, `bank_name`
) VALUES (
    101, 
    'Visa', 
    '4242', 
    'AUTH-TXN-884920', 
    'Commercial Bank of Ceylon'
);

-- 1E. Step 4B: Alternative Cash on Delivery Subtype Record (For COD checkout)
-- (If customer chose Cash on Delivery instead of Card)
/*
INSERT INTO `payment` (`payment_id`, `order_id`, `amount`, `payment_date`, `status`, `payment_type`) 
VALUES (102, 'ORD-2026-9002', 4500.00, NOW(), 'Pending_COD', 'Cash_On_Delivery');

INSERT INTO `cash_on_delivery` (
    `payment_id`, `receipt_number`, `advance_amount_lkr`, `balance_due_lkr`, 
    `change_required`, `cash_collected_by`, `collection_status`
) VALUES (
    102, 'REC-COD-7721', 500.00, 4000.00, 0.00, 'Domex Courier Rider', 'Pending_Collection'
);
*/


-- ====================================================================
-- 2. READ OPERATIONS (SELECT & INVOICES)
-- ====================================================================

-- 2A. View All Orders in the System (Admin / Customer Order Listing)
SELECT 
    `id` AS order_id, 
    `customer_name`, 
    `order_date`, 
    `total_amount_lkr`, 
    `status`, 
    `tracking_number`, 
    `payment_method` 
FROM `orders` 
ORDER BY `id` DESC;

-- 2B. View Specific Customer Order History (e.g. for User ID 1)
SELECT `id`, `order_date`, `total_amount_lkr`, `status`, `shipping_address`, `payment_method` 
FROM `orders` 
WHERE `user_id` = 1 
ORDER BY `id` DESC;

-- 2C. Comprehensive Customer Order Invoice Query Joining Order Items
SELECT 
    o.`id` AS order_number, 
    o.`customer_name`, 
    o.`order_date`, 
    o.`status`, 
    oi.`product_name`, 
    oi.`size`, 
    oi.`color`, 
    oi.`quantity`, 
    oi.`price_lkr`, 
    (oi.`quantity` * oi.`price_lkr`) AS subtotal_lkr,
    o.`total_amount_lkr`
FROM `orders` o
JOIN `order_items` oi ON o.`id` = oi.`order_id`
WHERE o.`id` = 'ORD-2026-9001';

-- 2D. Detailed Payment & Card Transaction Audit Query (ISA Join)
SELECT 
    p.`payment_id`, 
    p.`order_id`, 
    p.`amount`, 
    p.`payment_date`, 
    p.`status` AS payment_status, 
    p.`payment_type`,
    cp.`card_type`, 
    cp.`last_4_digits`, 
    cp.`transaction_auth`, 
    cp.`bank_name`
FROM `payment` p
LEFT JOIN `card_payment` cp ON p.`payment_id` = cp.`payment_id`
WHERE p.`order_id` = 'ORD-2026-9001';


-- ====================================================================
-- 3. UPDATE OPERATIONS (UPDATE)
-- ====================================================================

-- 3A. Update Order Status (Processing -> Shipped -> Delivered)
UPDATE `orders` 
SET `status` = 'Shipped' 
WHERE `id` = 'ORD-2026-9001';

-- 3B. Mark Order Status as Delivered
UPDATE `orders` 
SET `status` = 'Delivered' 
WHERE `id` = 'ORD-2026-9001';

-- 3C. Update Cash on Delivery Balance Status once Rider collects Cash
UPDATE `cash_on_delivery` 
SET `collection_status` = 'Cash_Collected', 
    `balance_due_lkr` = 0.00 
WHERE `receipt_number` = 'REC-COD-7721';

-- 3D. Update Customer Order Shipping Address before dispatch
UPDATE `orders` 
SET `shipping_address` = 'No. 30/2, Galle Road, Bambalapitiya' 
WHERE `id` = 'ORD-2026-9001' AND `status` = 'Processing';


-- ====================================================================
-- 4. DELETE OPERATIONS (DELETE & CANCELLATIONS)
-- ====================================================================

-- 4A. Cancel an Order and Restock Garments (Business Rule: only if Processing)
UPDATE `orders` 
SET `status` = 'Cancelled' 
WHERE `id` = 'ORD-2026-9001' AND `status` = 'Processing';

-- 4B. Clean Cascade Delete of a Cancelled/Finalized Order
-- Step 1: Remove child order items
DELETE FROM `order_items` WHERE `order_id` = 'ORD-2026-9001';

-- Step 2: Remove card payment subtype record
DELETE FROM `card_payment` 
WHERE `payment_id` IN (SELECT `payment_id` FROM `payment` WHERE `order_id` = 'ORD-2026-9001');

-- Step 3: Remove parent payment record
DELETE FROM `payment` WHERE `order_id` = 'ORD-2026-9001';

-- Step 4: Remove master order record
DELETE FROM `orders` WHERE `id` = 'ORD-2026-9001';


-- ====================================================================
-- 5. REVENUE & FINANCIAL REPORTING QUERIES
-- ====================================================================

-- 5A. Total Store Revenue and Order Count
SELECT 
    COUNT(*) AS total_orders_placed, 
    SUM(`total_amount_lkr`) AS gross_store_revenue_lkr, 
    AVG(`total_amount_lkr`) AS average_order_value_lkr 
FROM `orders` 
WHERE `status` != 'Cancelled';

-- 5B. Sales Breakdown by Payment Method (Card vs COD)
SELECT 
    `payment_method`, 
    COUNT(*) AS transactions_count, 
    SUM(`total_amount_lkr`) AS total_lkr 
FROM `orders` 
WHERE `status` != 'Cancelled' 
GROUP BY `payment_method`;
