-- ====================================================================
-- AVENZA CLOTHING STORE - EPIC E2: PRODUCT & INVENTORY MANAGEMENT
-- File: backend/database/epic2_product_and_inventory_queries.sql
-- Target Role: Inventory Staff (Operational Stock & Catalog Oversight)
-- Tables Covered: products, product_sizes, product_colors, categories
-- Database: achinis_fashion_db (MySQL / MariaDB via XAMPP)
-- ====================================================================

USE `achinis_fashion_db`;

-- ====================================================================
-- 1. CREATE OPERATIONS (INSERT)
-- ====================================================================

-- 1A. Insert a New Apparel Product into Master Catalog
INSERT INTO `products` (
    `id`, `sku`, `name`, `category_id`, `price_lkr`, `original_price_lkr`, 
    `stock`, `is_available`, `is_new`, `is_featured`, `rating`, `reviews_count`,
    `fabric`, `care_instructions`, `image_url`, `description`
) VALUES (
    'prod-custom-01', 
    'ACH-ME-770', 
    'Slim Fit Cotton Oxford Shirt', 
    'men', 
    5200.00, 
    6200.00, 
    45, 
    1, 1, 0, 0.0, 0,
    '100% Breathable Cotton', 
    'Machine wash warm, iron medium', 
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf',
    'Classic button-down Oxford cotton shirt designed for formal & smart casual wear.'
);

-- 1B. Insert Size Variants with Specific Stock Quantities (Multi-Variant Normalization)
INSERT INTO `product_sizes` (`product_id`, `size_code`, `stock`) VALUES
('prod-custom-01', 'S', 10),
('prod-custom-01', 'M', 15),
('prod-custom-01', 'L', 12),
('prod-custom-01', 'XL', 8);

-- 1C. Insert Available Color Swatches for Garment
INSERT INTO `product_colors` (`product_id`, `color_name`, `color_hex`) VALUES
('prod-custom-01', 'Classic White', '#FFFFFF'),
('prod-custom-01', 'Sky Blue', '#38bdf8'),
('prod-custom-01', 'Navy Blue', '#1e3a8a');

-- 1D. Create a New Product Category
INSERT INTO `categories` (`id`, `name`, `description`, `image_url`, `item_count`) VALUES
('sports-wear', 'Active & Sports Wear', 'Performance gym t-shirts and activewear', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd', 0);


-- ====================================================================
-- 2. READ OPERATIONS (SELECT)
-- ====================================================================

-- 2A. View Full Master Product Catalog with Stock Counts & Pricing
SELECT `id`, `sku`, `name`, `category_id`, `price_lkr`, `stock`, `is_available`, `fabric` 
FROM `products` 
ORDER BY `created_at` DESC;

-- 2B. Detailed Garment Query Joining Size Variants & Per-Size Stock (Crucial for Apparel)
SELECT 
    p.`id` AS product_id, 
    p.`sku`, 
    p.`name` AS product_name, 
    p.`category_id`, 
    p.`price_lkr`, 
    ps.`size_code`, 
    ps.`stock` AS size_stock_quantity
FROM `products` p
JOIN `product_sizes` ps ON p.`id` = ps.`product_id`
WHERE p.`id` = 'prod-custom-01';

-- 2C. Filter Apparel by Category (e.g. Men's Collection)
SELECT `id`, `name`, `price_lkr`, `stock`, `is_available` 
FROM `products` 
WHERE `category_id` = 'men';

-- 2D. Low-Stock Alert Query (Items with 5 or fewer units remaining in stock)
-- Used by Inventory Staff to trigger restock purchase orders
SELECT `id`, `sku`, `name`, `category_id`, `stock`, `is_available` 
FROM `products` 
WHERE `stock` <= 5 
ORDER BY `stock` ASC;

-- 2E. Out-of-Stock or Deactivated Items
SELECT `id`, `sku`, `name`, `stock`, `is_available` 
FROM `products` 
WHERE `stock` = 0 OR `is_available` = 0;

-- 2F. Search Garments by Keyword or SKU Code
SELECT `id`, `sku`, `name`, `price_lkr`, `stock` 
FROM `products` 
WHERE `name` LIKE '%Sweater%' OR `sku` LIKE '%ACH-ME%';

-- 2G. View All Categories and Total Item Counts
SELECT `id`, `name`, `description`, `item_count` 
FROM `categories` 
ORDER BY `name` ASC;


-- ====================================================================
-- 3. UPDATE OPERATIONS (UPDATE)
-- ====================================================================

-- 3A. Update Stock for a Specific Size Variant (e.g. Size M from 15 to 30)
UPDATE `product_sizes` 
SET `stock` = 30 
WHERE `product_id` = 'prod-custom-01' AND `size_code` = 'M';

-- 3B. Recompute & Update Master Total Stock from Size Table
UPDATE `products` 
SET `stock` = (SELECT SUM(`stock`) FROM `product_sizes` WHERE `product_id` = 'prod-custom-01'),
    `is_available` = IF((SELECT SUM(`stock`) FROM `product_sizes` WHERE `product_id` = 'prod-custom-01') > 0, 1, 0)
WHERE `id` = 'prod-custom-01';

-- 3C. Update Garment Retail Price and Promotional Discount
UPDATE `products` 
SET `price_lkr` = 4950.00, 
    `original_price_lkr` = 5950.00 
WHERE `id` = 'prod-custom-01';

-- 3D. Toggle Garment Availability (1 = Available, 0 = Temporarily Unavailable)
UPDATE `products` 
SET `is_available` = 0 
WHERE `id` = 'prod-custom-01';

-- 3E. Update Product Fabric & Care Instructions Specification
UPDATE `products` 
SET `fabric` = '100% GOTS Certified Organic Cotton', 
    `care_instructions` = 'Machine wash cold inside-out, tumble dry low' 
WHERE `id` = 'prod-custom-01';


-- ====================================================================
-- 4. DELETE OPERATIONS (DELETE)
-- ====================================================================

-- 4A. Clean Discontinued Product Deletion (Delete Child Sizes & Colors First)
-- Step 1: Remove size variant records
DELETE FROM `product_sizes` WHERE `product_id` = 'prod-custom-01';

-- Step 2: Remove color swatch records
DELETE FROM `product_colors` WHERE `product_id` = 'prod-custom-01';

-- Step 3: Remove master product record
DELETE FROM `products` WHERE `id` = 'prod-custom-01';

-- 4B. Remove a Specific Discontinued Size (e.g. discontinue 'XS' size for item)
DELETE FROM `product_sizes` 
WHERE `product_id` = 'prod-custom-01' AND `size_code` = 'XS';


-- ====================================================================
-- 5. INVENTORY STAFF ANALYTICS & VALUATION REPORTS
-- ====================================================================

-- 5A. Category Stock Summary Report (Garment distribution by Category)
SELECT 
    `category_id`, 
    COUNT(*) AS total_unique_items, 
    SUM(`stock`) AS total_garment_pieces, 
    AVG(`price_lkr`) AS average_price_lkr,
    MIN(`price_lkr`) AS min_price_lkr,
    MAX(`price_lkr`) AS max_price_lkr
FROM `products` 
GROUP BY `category_id`;

-- 5B. Total Inventory Valuation Metric (Store Total Asset Value in LKR)
SELECT 
    COUNT(*) AS total_catalog_products, 
    SUM(`stock`) AS total_units_in_warehouse, 
    SUM(`price_lkr` * `stock`) AS total_inventory_valuation_lkr 
FROM `products`;
