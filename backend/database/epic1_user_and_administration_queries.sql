-- ====================================================================
-- AVENZA CLOTHING STORE - EPIC E1: USER & ADMINISTRATION MANAGEMENT
-- File: backend/database/epic1_user_and_administration_queries.sql
-- Target Role: Administrator (Superuser Oversight & IAM)
-- Tables Covered: users, system_settings
-- Database: achinis_fashion_db (MySQL / MariaDB via XAMPP)
-- ====================================================================

USE `achinis_fashion_db`;

-- ====================================================================
-- 1. CREATE OPERATIONS (INSERT)
-- ====================================================================

-- 1A. Create a new Customer Account
INSERT INTO `users` (
    `name`, `email`, `password`, `role`, `status`, `phone`, `address`, `city`, `postal_code`, `country`
) VALUES (
    'Dilshan Perera', 
    'dilshan.perera@example.com', 
    'password123', 
    'customer', 
    'active', 
    '+94 77 123 4567', 
    'No. 45, Temple Road', 
    'Colombo', 
    '00300', 
    'Sri Lanka'
);

-- 1B. Create an Inventory Staff Account (For Epic E2 Operations)
INSERT INTO `users` (
    `name`, `email`, `password`, `role`, `status`, `phone`, `city`
) VALUES (
    'Kasun Wickramasinghe', 
    'kasun.inventory@avenza.com', 
    'staffPass123', 
    'inventory_staff', 
    'active', 
    '+94 71 888 9999', 
    'Kandy'
);

-- 1C. Create a Store Manager Account (For Epic E4 Operations)
INSERT INTO `users` (
    `name`, `email`, `password`, `role`, `status`, `phone`, `city`
) VALUES (
    'Nimali Senanayake', 
    'nimali.manager@avenza.com', 
    'managerPass123', 
    'manager', 
    'active', 
    '+94 76 555 4444', 
    'Galle'
);

-- 1D. Create a System Administrator Account
INSERT INTO `users` (
    `name`, `email`, `password`, `role`, `status`, `phone`, `city`
) VALUES (
    'Sasanka P.B.S (Project Admin)', 
    'admin.sasanka@avenza.com', 
    'adminSecure123!', 
    'admin', 
    'active', 
    '+94 70 111 2222', 
    'Colombo'
);

-- 1E. Insert or Update System Setting Parameter
INSERT INTO `system_settings` (`setting_key`, `setting_value`) 
VALUES ('store_notice', 'Grand Seasonal Sale: 20% Off Storewide!')
ON DUPLICATE KEY UPDATE `setting_value` = 'Grand Seasonal Sale: 20% Off Storewide!';


-- ====================================================================
-- 2. READ OPERATIONS (SELECT)
-- ====================================================================

-- 2A. View all registered users with roles and status (Admin IAM Console)
SELECT `id`, `name`, `email`, `role`, `status`, `phone`, `city`, `created_at` 
FROM `users` 
ORDER BY `id` DESC;

-- 2B. Authenticate User Login Query (Email & Password Match)
SELECT `id`, `name`, `email`, `role`, `status`, `phone`, `address`, `city` 
FROM `users` 
WHERE `email` = 'admin@avenza.com' AND `password` = 'password123';

-- 2C. Filter Users by Role (e.g. all Inventory Staff members)
SELECT `id`, `name`, `email`, `status`, `phone` 
FROM `users` 
WHERE `role` = 'inventory_staff';

-- 2D. Search Users by Name or Email
SELECT `id`, `name`, `email`, `role`, `city` 
FROM `users` 
WHERE `name` LIKE '%Sasanka%' OR `email` LIKE '%@avenza.com%';

-- 2E. View all Store System Settings & Configuration Parameters
SELECT `setting_key`, `setting_value`, `updated_at` 
FROM `system_settings` 
ORDER BY `setting_key` ASC;


-- ====================================================================
-- 3. UPDATE OPERATIONS (UPDATE)
-- ====================================================================

-- 3A. Update User Profile Details (Name, Phone, Address)
UPDATE `users` 
SET `name` = 'Dilshan P. Perera', 
    `phone` = '+94 77 999 0000', 
    `address` = 'No. 88, Marine Drive, Kollupitiya', 
    `city` = 'Colombo' 
WHERE `email` = 'dilshan.perera@example.com';

-- 3B. Update User Role (Promote Customer to Inventory Staff)
UPDATE `users` 
SET `role` = 'inventory_staff' 
WHERE `id` = 10;

-- 3C. Deactivate / Suspend User Account (Status = inactive)
UPDATE `users` 
SET `status` = 'inactive' 
WHERE `email` = 'dilshan.perera@example.com';

-- 3D. Reactivate User Account (Status = active)
UPDATE `users` 
SET `status` = 'active' 
WHERE `email` = 'dilshan.perera@example.com';

-- 3E. Admin Password Reset for Account
UPDATE `users` 
SET `password` = 'newTemporaryPass456' 
WHERE `id` = 10;

-- 3F. Update Store Configuration Settings (e.g. Free Shipping Threshold & Tax Rate)
UPDATE `system_settings` 
SET `setting_value` = '12000' 
WHERE `setting_key` = 'freeShippingThreshold';

UPDATE `system_settings` 
SET `setting_value` = '8.5' 
WHERE `setting_key` = 'taxRate';


-- ====================================================================
-- 4. DELETE OPERATIONS (DELETE)
-- ====================================================================

-- 4A. Delete User Account by ID
DELETE FROM `users` 
WHERE `id` = 10;

-- 4B. Delete User Account by Email
DELETE FROM `users` 
WHERE `email` = 'dilshan.perera@example.com';

-- 4C. Remove Custom System Setting Parameter
DELETE FROM `system_settings` 
WHERE `setting_key` = 'store_notice';


-- ====================================================================
-- 5. EXECUTIVE MANAGEMENT & AUDIT REPORTS (ADVANCED AGGREGATIONS)
-- ====================================================================

-- 5A. Count Total Users Grouped by Role
SELECT 
    `role`, 
    COUNT(*) AS total_users,
    SUM(CASE WHEN `status` = 'active' THEN 1 ELSE 0 END) AS active_count,
    SUM(CASE WHEN `status` = 'inactive' THEN 1 ELSE 0 END) AS inactive_count
FROM `users` 
GROUP BY `role`;

-- 5B. System User Summary Dashboard Metric
SELECT 
    COUNT(*) AS grand_total_users,
    SUM(CASE WHEN `role` = 'customer' THEN 1 ELSE 0 END) AS total_customers,
    SUM(CASE WHEN `role` = 'inventory_staff' THEN 1 ELSE 0 END) AS total_inventory_staff,
    SUM(CASE WHEN `role` = 'manager' THEN 1 ELSE 0 END) AS total_managers,
    SUM(CASE WHEN `role` = 'admin' THEN 1 ELSE 0 END) AS total_administrators
FROM `users`;


-- ====================================================================
-- 6. SYSTEM CALCULATIONS & FORMULA SQL QUERIES (EPIC E1)
-- ====================================================================

-- 6A. Calculation: Active User Engagement Percentage (%)
-- Formula: (Active Users / Total Users) * 100
SELECT 
    COUNT(*) AS total_registered_users,
    SUM(CASE WHEN `status` = 'active' THEN 1 ELSE 0 END) AS active_users,
    ROUND((SUM(CASE WHEN `status` = 'active' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) AS active_user_percentage
FROM `users`;

-- 6B. Calculation: Customer-to-Staff Ratio
-- Formula: Total Customers / (Total Inventory Staff + Total Managers + Total Admins)
SELECT 
    SUM(CASE WHEN `role` = 'customer' THEN 1 ELSE 0 END) AS total_customers,
    SUM(CASE WHEN `role` != 'customer' THEN 1 ELSE 0 END) AS total_staff_and_admin,
    ROUND(SUM(CASE WHEN `role` = 'customer' THEN 1 ELSE 0 END) / NULLIF(SUM(CASE WHEN `role` != 'customer' THEN 1 ELSE 0 END), 0), 2) AS customer_to_staff_ratio
FROM `users`;

-- 6C. Calculation: Simulated Store Tax Revenue (Configured % VAT/GST on Gross Sales)
-- Formula: Gross Store Sales * (Tax Rate / 100)
SELECT 
    (SELECT CAST(`setting_value` AS DECIMAL(10,2)) FROM `system_settings` WHERE `setting_key` = 'taxRate') AS configured_tax_rate_pct,
    SUM(`total_amount_lkr`) AS gross_sales_lkr,
    ROUND(SUM(`total_amount_lkr`) * ((SELECT CAST(`setting_value` AS DECIMAL(10,2)) FROM `system_settings` WHERE `setting_key` = 'taxRate') / 100), 2) AS calculated_tax_amount_lkr,
    ROUND(SUM(`total_amount_lkr`) - (SUM(`total_amount_lkr`) * ((SELECT CAST(`setting_value` AS DECIMAL(10,2)) FROM `system_settings` WHERE `setting_key` = 'taxRate') / 100)), 2) AS net_revenue_after_tax_lkr
FROM `orders`
WHERE `status` != 'Cancelled';
