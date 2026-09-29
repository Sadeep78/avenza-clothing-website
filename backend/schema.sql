-- ====================================================================
-- ACHINI'S FASHION STORE - MYSQL WORKBENCH DATABASE SCHEMA SCRIPT
-- Database Name: achinis_fashion_db
-- Description: Complete SQL script creating tables, constraints,
--              and seeding 22+ clothing items, LKR pricing, and users.
-- ====================================================================

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS `achinis_fashion_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `achinis_fashion_db`;

-- 2. Drop Existing Tables (Clean Re-run Support)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `wishlists`;
DROP TABLE IF EXISTS `product_colors`;
DROP TABLE IF EXISTS `product_sizes`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- 3. Create Users Table
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('customer', 'inventory_staff', 'admin') NOT NULL DEFAULT 'customer',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `phone` VARCHAR(30) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `postal_code` VARCHAR(20) DEFAULT NULL,
  `country` VARCHAR(50) DEFAULT 'Sri Lanka',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Create Categories Table
CREATE TABLE `categories` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `item_count` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Create Products Table
CREATE TABLE `products` (
  `id` VARCHAR(50) PRIMARY KEY,
  `sku` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(200) NOT NULL,
  `category_id` VARCHAR(50) NOT NULL,
  `price_lkr` DECIMAL(10, 2) NOT NULL,
  `original_price_lkr` DECIMAL(10, 2) DEFAULT NULL,
  `rating` DECIMAL(3, 1) DEFAULT 5.0,
  `reviews_count` INT DEFAULT 0,
  `is_new` TINYINT(1) DEFAULT 0,
  `is_featured` TINYINT(1) DEFAULT 0,
  `is_available` TINYINT(1) DEFAULT 1,
  `stock` INT NOT NULL DEFAULT 10,
  `image_url` VARCHAR(500) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `fabric` VARCHAR(200) DEFAULT NULL,
  `care_instructions` VARCHAR(200) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5b. Create System Settings Table (AVE-10)
CREATE TABLE IF NOT EXISTS `system_settings` (
  `setting_key` VARCHAR(100) PRIMARY KEY,
  `setting_value` TEXT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Create Product Sizes Table
CREATE TABLE `product_sizes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` VARCHAR(50) NOT NULL,
  `size_code` VARCHAR(20) NOT NULL,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Create Product Colors Table
CREATE TABLE `product_colors` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` VARCHAR(50) NOT NULL,
  `color_name` VARCHAR(50) NOT NULL,
  `color_hex` VARCHAR(10) NOT NULL,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Create Orders Table
CREATE TABLE `orders` (
  `id` VARCHAR(50) PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `order_date` DATE NOT NULL,
  `total_amount_lkr` DECIMAL(12, 2) NOT NULL,
  `status` ENUM('Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Processing',
  `tracking_number` VARCHAR(100) DEFAULT NULL,
  `estimated_delivery` DATE DEFAULT NULL,
  `shipping_address` TEXT DEFAULT NULL,
  `payment_method` VARCHAR(100) DEFAULT 'Visa/Mastercard (LKR)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Create Order Items Table
CREATE TABLE `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` VARCHAR(50) NOT NULL,
  `product_id` VARCHAR(50) NOT NULL,
  `product_name` VARCHAR(200) NOT NULL,
  `price_lkr` DECIMAL(10, 2) NOT NULL,
  `size` VARCHAR(20) NOT NULL,
  `color` VARCHAR(50) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `image_url` VARCHAR(500) DEFAULT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ====================================================================
-- SEED INITIAL DATA (CATEGORIES, USERS, PRODUCTS, SETTINGS, ORDERS)
-- ====================================================================

-- Insert Demo Users (Customer, Inventory Staff, Admin)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `status`, `phone`, `address`, `city`, `postal_code`, `country`) VALUES
(1, 'Sasanka Perera', 'customer@avenza.com', 'password123', 'customer', 'active', '+94 77 123 4567', 'No. 45, Flower Road', 'Colombo 07', '00700', 'Sri Lanka'),
(2, 'Sasanka P.B.S', 'admin@avenza.com', 'admin123', 'admin', 'active', '+94 71 987 6543', 'SLIIT Campus, New Kandy Rd', 'Malabe', '10115', 'Sri Lanka'),
(3, 'Kamal Silva', 'staff@avenza.com', 'staff123', 'inventory_staff', 'active', '+94 72 345 6789', 'Main Warehouse, Galle Road', 'Dehiwala', '10350', 'Sri Lanka');

-- Insert System Settings Seed Data
INSERT INTO `system_settings` (`setting_key`, `setting_value`) VALUES
('storeName', 'Avenza Clothing Store'),
('storeEmail', 'support@avenza.com'),
('storePhone', '+94 11 234 5678'),
('currency', 'LKR (Rs.)'),
('taxRate', '8'),
('freeShippingThreshold', '15000'),
('lowStockThreshold', '5'),
('maintenanceMode', 'false'),
('emailNotifications', 'true');

-- Insert Categories
INSERT INTO `categories` (`id`, `name`, `description`, `image_url`, `item_count`) VALUES
('all', 'All Clothing', 'Browse our full fashion apparel collection', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80', 22),
('women', 'Women\'s Clothes', 'Silk midi dresses, blazers, blouses, skirts & trench coats', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80', 9),
('men', 'Men\'s Clothes', 'Tailored suits, compression tees, chinos, sweaters & jackets', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80', 7),
('outerwear', 'Coats & Jackets', 'Wool trench coats, denim jackets & double-breasted overcoats', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80', 4),
('kids', 'Kids & Youth', 'Cotton hoodies, t-shirts & cozy joggers for children', 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80', 2);

-- Insert Products in LKR
INSERT INTO `products` (`id`, `sku`, `name`, `category_id`, `price_lkr`, `original_price_lkr`, `rating`, `reviews_count`, `is_new`, `is_featured`, `is_available`, `stock`, `image_url`, `description`, `fabric`, `care_instructions`) VALUES
('prod-m1', 'ACH-MN-01', 'Apex Pro Performance Compression Tee', 'men', 4800.00, 6000.00, 4.9, 88, 1, 1, 1, 18, 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80', 'Ultra-lightweight performance stretch compression top engineered with four-way flex fabric.', '88% Nylon, 12% Spandex', 'Machine wash cold inside out.'),
('prod-m2', 'ACH-MN-02', 'Classic Egyptian Cotton Oxford Dress Shirt', 'men', 7800.00, 9500.00, 4.8, 56, 0, 1, 1, 25, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80', '100% Egyptian cotton Oxford shirt with button-down collar.', '100% Long-Staple Egyptian Cotton', 'Machine wash warm.'),
('prod-m3', 'ACH-MN-03', 'Vintage Wash Denim Trucker Jacket', 'outerwear', 14500.00, 17500.00, 4.9, 38, 1, 1, 1, 8, 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=80', 'Heavyweight 14oz organic cotton denim jacket.', '100% Organic Cotton Denim', 'Machine wash cold inside out.'),
('prod-m4', 'ACH-MN-04', 'Slim-Fit Stretch Chino Trousers', 'men', 8900.00, 11000.00, 4.7, 31, 0, 0, 1, 19, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80', 'Tailored slim-fit chinos with subtle stretch elastane.', '98% Cotton, 2% Elastane', 'Machine wash cold.'),
('prod-w1', 'ACH-WM-01', 'Silk Cascade Midi Wrap Dress', 'women', 18500.00, 22500.00, 4.9, 61, 1, 1, 1, 12, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80', 'Flowing mulberry silk midi dress with elegant side wrap drape.', '100% Mulberry Silk', 'Hand wash cold or dry clean.'),
('prod-w2', 'ACH-WM-02', 'Pleated High-Waisted Wide-Leg Trousers', 'women', 11200.00, 14000.00, 4.8, 38, 0, 1, 1, 16, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80', 'Chic wide-leg pleated trousers with tailored waistband.', '70% Wool, 28% Viscose, 2% Elastane', 'Dry clean recommended.');

-- Insert Sizes
INSERT INTO `product_sizes` (`product_id`, `size_code`) VALUES
('prod-m1', 'S'), ('prod-m1', 'M'), ('prod-m1', 'L'), ('prod-m1', 'XL'),
('prod-m2', 'S'), ('prod-m2', 'M'), ('prod-m2', 'L'), ('prod-m2', 'XL'),
('prod-w1', 'XS'), ('prod-w1', 'S'), ('prod-w1', 'M'), ('prod-w1', 'L');

-- Insert Colors
INSERT INTO `product_colors` (`product_id`, `color_name`, `color_hex`) VALUES
('prod-m1', 'Pitch Black', '#000000'), ('prod-m1', 'Stealth Grey', '#334155'),
('prod-m2', 'Crisp White', '#ffffff'), ('prod-m2', 'Sky Blue', '#38bdf8'),
('prod-w1', 'Emerald Green', '#065f46'), ('prod-w1', 'Champagne Rose', '#f43f5e');

-- Insert Demo Order
INSERT INTO `orders` (`id`, `user_id`, `customer_name`, `email`, `order_date`, `total_amount_lkr`, `status`, `tracking_number`, `estimated_delivery`, `shipping_address`, `payment_method`) VALUES
('ACH-99420', 1, 'Sasanka Perera', 'customer@avenza.com', '2026-08-11', 26300.00, 'Shipped', 'TRK-ACH-8849201', '2026-08-14', 'No. 45, Flower Road, Colombo 07', 'Visa/Mastercard (LKR)');

INSERT INTO `order_items` (`order_id`, `product_id`, `product_name`, `price_lkr`, `size`, `color`, `quantity`, `image_url`) VALUES
('ACH-99420', 'prod-m2', 'Classic Egyptian Cotton Oxford Dress Shirt', 7800.00, 'L', 'Crisp White', 1, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=300&q=80'),
('ACH-99420', 'prod-w1', 'Silk Cascade Midi Wrap Dress', 18500.00, 'S', 'Emerald Green', 1, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=300&q=80');

-- ====================================================================
-- 6. FEEDBACK & RATINGS TABLE (AVE-22, AVE-25)
-- ====================================================================
CREATE TABLE IF NOT EXISTS `feedback` (
  `id` VARCHAR(50) PRIMARY KEY,
  `customer_id` VARCHAR(50) NOT NULL,
  `customer_name` VARCHAR(100) NOT NULL,
  `customer_email` VARCHAR(100) NOT NULL,
  `product_id` VARCHAR(50) NULL,
  `product_name` VARCHAR(150) NULL,
  `order_id` VARCHAR(50) NULL,
  `rating` INT NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
  `title` VARCHAR(100) NULL,
  `comment` TEXT NOT NULL,
  `status` ENUM('pending', 'approved', 'hidden', 'archived') DEFAULT 'approved',
  `admin_reply_message` TEXT NULL,
  `admin_reply_at` DATETIME NULL,
  `admin_reply_by` VARCHAR(100) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_feedback_customer` (`customer_id`),
  INDEX `idx_feedback_product` (`product_id`),
  INDEX `idx_feedback_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Sample Feedback Data
INSERT INTO `feedback` (`id`, `customer_id`, `customer_name`, `customer_email`, `product_id`, `product_name`, `order_id`, `rating`, `title`, `comment`, `status`, `admin_reply_message`, `admin_reply_at`, `admin_reply_by`, `created_at`) VALUES
('fb-101', 'user-cust-01', 'Sasanka Perera', 'customer@avenza.com', 'prod-m1', 'Apex Pro Performance Compression Tee', 'ACH-99420', 5, 'Outstanding Quality & Fit!', 'The compression tee fabric is extremely breathable and comfortable during high-intensity gym sessions. Highly recommended!', 'approved', 'Thank you Sasanka! We take pride in delivering top-tier performance activewear.', '2026-08-12 10:30:00', 'Project Admin', '2026-08-11 14:20:00'),
('fb-102', 'user-cust-02', 'Nipuni Fernando', 'nipuni@gmail.com', 'prod-w1', 'Silk Cascade Midi Wrap Dress', NULL, 4, 'Elegant silk dress', 'Fit was almost perfect. The emerald green color shines beautifully under evening lights.', 'approved', NULL, NULL, NULL, '2026-08-10 09:15:00');

-- ====================================================================
-- 7. PAYMENT ISA HIERARCHY [Disjoint (d), Total]
-- ====================================================================
CREATE TABLE IF NOT EXISTS `payment` (
  `payment_id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` VARCHAR(50) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `payment_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(30) DEFAULT 'Completed',
  `payment_type` ENUM('Card_Payment', 'Cash_On_Delivery') NOT NULL,
  CONSTRAINT `fk_payment_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `card_payment` (
  `payment_id` INT PRIMARY KEY,
  `card_type` VARCHAR(50) NOT NULL,
  `last_4_digits` VARCHAR(4) NOT NULL,
  `transaction_auth` VARCHAR(100) NOT NULL,
  `bank_name` VARCHAR(100) NULL,
  CONSTRAINT `fk_card_payment_super` FOREIGN KEY (`payment_id`) REFERENCES `payment` (`payment_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `cash_on_delivery` (
  `payment_id` INT PRIMARY KEY,
  `receipt_number` VARCHAR(50) NOT NULL,
  `advance_amount_lkr` DECIMAL(10,2) DEFAULT 500.00,
  `balance_due_lkr` DECIMAL(10,2) NULL,
  `change_required` DECIMAL(10,2) DEFAULT 0.00,
  `cash_collected_by` VARCHAR(100) NULL,
  `collection_status` VARCHAR(50) DEFAULT 'Pending',
  CONSTRAINT `fk_cod_payment_super` FOREIGN KEY (`payment_id`) REFERENCES `payment` (`payment_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ====================================================================
-- 8. DELIVERY ISA HIERARCHY [Disjoint (d)]
-- ====================================================================
CREATE TABLE IF NOT EXISTS `delivery` (
  `delivery_id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` VARCHAR(50) NOT NULL,
  `address` TEXT NOT NULL,
  `dispatch_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(50) DEFAULT 'Processing',
  `delivery_type` ENUM('Standard_Courier', 'Express_Same_Day') NOT NULL,
  CONSTRAINT `fk_delivery_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `standard_courier` (
  `delivery_id` INT PRIMARY KEY,
  `courier_partner` VARCHAR(100) NOT NULL,
  `tracking_barcode` VARCHAR(100) NOT NULL,
  `transit_hub` VARCHAR(100) NULL,
  CONSTRAINT `fk_standard_courier_super` FOREIGN KEY (`delivery_id`) REFERENCES `delivery` (`delivery_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `express_same_day` (
  `delivery_id` INT PRIMARY KEY,
  `rider_name` VARCHAR(100) NOT NULL,
  `rider_phone` VARCHAR(30) NOT NULL,
  `delivery_time_slot` VARCHAR(50) NOT NULL,
  CONSTRAINT `fk_express_same_day_super` FOREIGN KEY (`delivery_id`) REFERENCES `delivery` (`delivery_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ====================================================================
-- END OF SCHEMA SCRIPT
-- ====================================================================

