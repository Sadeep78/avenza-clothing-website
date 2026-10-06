-- ====================================================================
-- AVENZA CLOTHING STORE - EPIC E4: DELIVERY & FEEDBACK MANAGEMENT
-- File: backend/database/epic4_delivery_and_feedback_queries.sql
-- Target Role: Store Manager / Delivery Oversight & Customer Care
-- Tables Covered: delivery, standard_courier, express_same_day, feedback
-- Database: achinis_fashion_db (MySQL / MariaDB via XAMPP)
-- ====================================================================

USE `achinis_fashion_db`;

-- ====================================================================
-- 1. CREATE OPERATIONS (INSERT)
-- ====================================================================

-- 1A. Step 1: Create Master Delivery Record (Delivery ISA Supertype)
INSERT INTO `delivery` (
    `delivery_id`, `order_id`, `address`, `dispatch_date`, `status`, `delivery_type`
) VALUES (
    501, 
    'ORD-2026-9001', 
    'No. 25, Baseline Road, Colombo 09', 
    NOW(), 
    'Dispatched', 
    'Standard_Courier'
);

-- 1B. Step 2A: Assign to Standard Courier Partner (Subtype ISA Table)
INSERT INTO `standard_courier` (
    `delivery_id`, `courier_partner`, `tracking_barcode`, `transit_hub`
) VALUES (
    501, 
    'Domex Courier Services', 
    'BAR-DOMEX-9001', 
    'Colombo Central Sorting Hub'
);

-- 1C. Step 2B: Alternative Express Same-Day Rider Assignment (Subtype ISA Table)
-- (Used when customer chooses 3-hour Colombo express dispatch)
/*
INSERT INTO `delivery` (`delivery_id`, `order_id`, `address`, `dispatch_date`, `status`, `delivery_type`)
VALUES (502, 'ORD-2026-9002', 'Galle Face Terrace, Colombo 03', NOW(), 'In Transit', 'Express_Same_Day');

INSERT INTO `express_same_day` (`delivery_id`, `rider_name`, `rider_phone`, `delivery_time_slot`)
VALUES (502, 'Nuwan Bandara', '+94 77 456 7890', 'Afternoon (2:00 PM - 5:00 PM)');
*/

-- 1D. Create Customer Review & Rating Record (Feedback Table)
INSERT INTO `feedback` (
    `id`, `customer_id`, `customer_name`, `customer_email`, `product_id`, 
    `product_name`, `order_id`, `rating`, `title`, `comment`, `status`, `created_at`
) VALUES (
    'fb-custom-88', 
    '1', 
    'Sasanka Perera', 
    'customer@avenza.com', 
    'prod-m1', 
    'Apex Pro Performance Compression Tee', 
    'ORD-2026-9001', 
    5, 
    'Exceptional Quality & Stitching', 
    'The fabric breathability during workout sessions is remarkable. Very happy with the fit!', 
    'approved', 
    NOW()
);


-- ====================================================================
-- 2. READ OPERATIONS (SELECT)
-- ====================================================================

-- 2A. View All Deliveries with Subtype Details (Standard Courier Join)
SELECT 
    d.`delivery_id`, 
    d.`order_id`, 
    d.`status` AS delivery_status, 
    d.`delivery_type`, 
    d.`dispatch_date`, 
    sc.`courier_partner`, 
    sc.`tracking_barcode`, 
    sc.`transit_hub`
FROM `delivery` d
LEFT JOIN `standard_courier` sc ON d.`delivery_id` = sc.`delivery_id`
ORDER BY d.`delivery_id` DESC;

-- 2B. View Express Same-Day Active Dispatch Assignments (Express Join)
SELECT 
    d.`delivery_id`, 
    d.`order_id`, 
    d.`status`, 
    ex.`rider_name`, 
    ex.`rider_phone`, 
    ex.`delivery_time_slot`
FROM `delivery` d
JOIN `express_same_day` ex ON d.`delivery_id` = ex.`delivery_id`;

-- 2C. Customer Facing Tracking Query by Order ID
SELECT 
    o.`id` AS order_number, 
    o.`status` AS order_status, 
    o.`tracking_number`, 
    d.`status` AS shipment_progress, 
    COALESCE(sc.`courier_partner`, 'Express Rider') AS delivery_agent,
    COALESCE(sc.`tracking_barcode`, ex.`rider_phone`) AS tracking_ref
FROM `orders` o
LEFT JOIN `delivery` d ON o.`id` = d.`order_id`
LEFT JOIN `standard_courier` sc ON d.`delivery_id` = sc.`delivery_id`
LEFT JOIN `express_same_day` ex ON d.`delivery_id` = ex.`delivery_id`
WHERE o.`id` = 'ORD-2026-9001';

-- 2D. View Customer Reviews Filtered by Product (For Product Detail Modal)
SELECT 
    `id`, `customer_name`, `rating`, `title`, `comment`, `created_at`, `admin_reply_message`
FROM `feedback` 
WHERE `product_id` = 'prod-m1' AND `status` = 'approved'
ORDER BY `created_at` DESC;

-- 2E. View Feedback Awaiting Manager Moderation (Pending Reviews)
SELECT `id`, `customer_name`, `product_name`, `rating`, `comment`, `created_at` 
FROM `feedback` 
WHERE `status` = 'pending';


-- ====================================================================
-- 3. UPDATE OPERATIONS (UPDATE)
-- ====================================================================

-- 3A. Update Delivery Milestone Status (Dispatched -> In Transit -> Delivered)
UPDATE `delivery` 
SET `status` = 'In Transit' 
WHERE `order_id` = 'ORD-2026-9001';

-- 3B. Update Standard Courier Barcode & Transit Hub
UPDATE `standard_courier` 
SET `courier_partner` = 'Pronto Logistics', 
    `tracking_barcode` = 'BAR-PRONTO-9001', 
    `transit_hub` = 'Kandy Distribution Center' 
WHERE `delivery_id` = 501;

-- 3C. Manager Feedback Moderation: Approve or Hide a Review
UPDATE `feedback` 
SET `status` = 'approved' 
WHERE `id` = 'fb-custom-88';

-- 3D. Manager Post Official Reply to Customer Review
UPDATE `feedback` 
SET `admin_reply_message` = 'Thank you Sasanka! We appreciate your loyalty and feedback.',
    `admin_reply_at` = NOW(),
    `admin_reply_by` = 'Store Manager'
WHERE `id` = 'fb-custom-88';


-- ====================================================================
-- 4. DELETE OPERATIONS (DELETE)
-- ====================================================================

-- 4A. Clean Delivery Record Deletion (ISA Subtype Deletion First)
DELETE FROM `standard_courier` WHERE `delivery_id` = 501;
DELETE FROM `express_same_day` WHERE `delivery_id` = 501;
DELETE FROM `delivery` WHERE `delivery_id` = 501;

-- 4B. Remove Inappropriate / Abusive Feedback Review
DELETE FROM `feedback` 
WHERE `id` = 'fb-custom-88';


-- ====================================================================
-- 5. DELIVERY PERFORMANCE & CUSTOMER SATISFACTION REPORTS
-- ====================================================================

-- 5A. Average Rating per Product (Garment Satisfaction Metric)
SELECT 
    `product_id`, 
    `product_name`, 
    COUNT(*) AS total_reviews, 
    AVG(`rating`) AS average_star_rating 
FROM `feedback` 
WHERE `status` = 'approved' 
GROUP BY `product_id`, `product_name`;

-- 5B. Active Shipments Overview (Pending vs In Transit vs Delivered)
SELECT 
    `status` AS delivery_stage, 
    COUNT(*) AS total_shipments 
FROM `delivery` 
GROUP BY `status`;


-- ====================================================================
-- 6. SYSTEM CALCULATIONS & FORMULA SQL QUERIES (EPIC E4 - DELIVERY & REVIEWS)
-- ====================================================================

-- 6A. Calculation: Garment Customer Satisfaction Rating Average
-- Formula: Average Rating = SUM(rating) / COUNT(rating), rounded to 1 decimal
SELECT 
    `product_id`, 
    `product_name`, 
    COUNT(*) AS total_customer_reviews, 
    ROUND(AVG(`rating`), 1) AS average_rating_score, 
    ROUND((SUM(CASE WHEN `rating` = 5 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 1) AS five_star_percentage
FROM `feedback` 
WHERE `status` = 'approved' 
GROUP BY `product_id`, `product_name`;

-- 6B. Calculation: Delivery Fulfillment Success Rate (%)
-- Formula: (Delivered Orders / Total Dispatched Shipments) * 100
SELECT 
    COUNT(*) AS total_dispatched_shipments, 
    SUM(CASE WHEN `status` = 'Delivered' THEN 1 ELSE 0 END) AS successfully_delivered, 
    SUM(CASE WHEN `status` != 'Delivered' THEN 1 ELSE 0 END) AS pending_in_transit, 
    ROUND((SUM(CASE WHEN `status` = 'Delivered' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) AS delivery_success_rate_percentage
FROM `delivery`;

-- 6C. Calculation: Estimated Delivery Date Dispatch Lead Time
-- Formula: Estimated Arrival = dispatch_date + 3 Business Days
SELECT 
    `delivery_id`, 
    `order_id`, 
    `delivery_type`, 
    `dispatch_date`, 
    DATE_ADD(`dispatch_date`, INTERVAL 3 DAY) AS calculated_estimated_arrival_date, 
    DATEDIFF(NOW(), `dispatch_date`) AS days_in_transit
FROM `delivery`;

-- 6D. Calculation: Customer Feedback Sentiment Breakdown
-- Formula: Positive (4-5 stars), Neutral (3 stars), Negative (1-2 stars)
SELECT 
    COUNT(*) AS total_reviews, 
    SUM(CASE WHEN `rating` >= 4 THEN 1 ELSE 0 END) AS positive_reviews, 
    SUM(CASE WHEN `rating` = 3 THEN 1 ELSE 0 END) AS neutral_reviews, 
    SUM(CASE WHEN `rating` <= 2 THEN 1 ELSE 0 END) AS negative_reviews, 
    ROUND((SUM(CASE WHEN `rating` >= 4 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 1) AS positive_sentiment_pct
FROM `feedback` 
WHERE `status` = 'approved';
