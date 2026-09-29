-- ====================================================================
-- AVENZA CLOTHING STORE - MICROSOFT SQL SERVER (SSMS) DATABASE SCHEMA SCRIPT
-- Database Name: achinis_fashion_db
-- Compatibility: Microsoft SQL Server Management Studio 18/19/20 / T-SQL
-- ====================================================================

-- 1. Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = N'achinis_fashion_db')
BEGIN
    CREATE DATABASE [achinis_fashion_db];
END
GO

USE [achinis_fashion_db];
GO

-- 2. Drop Existing Tables if Re-running
IF OBJECT_ID('dbo.order_items', 'U') IS NOT NULL DROP TABLE dbo.order_items;
IF OBJECT_ID('dbo.orders', 'U') IS NOT NULL DROP TABLE dbo.orders;
IF OBJECT_ID('dbo.product_colors', 'U') IS NOT NULL DROP TABLE dbo.product_colors;
IF OBJECT_ID('dbo.product_sizes', 'U') IS NOT NULL DROP TABLE dbo.product_sizes;
IF OBJECT_ID('dbo.products', 'U') IS NOT NULL DROP TABLE dbo.products;
IF OBJECT_ID('dbo.categories', 'U') IS NOT NULL DROP TABLE dbo.categories;
IF OBJECT_ID('dbo.system_settings', 'U') IS NOT NULL DROP TABLE dbo.system_settings;
IF OBJECT_ID('dbo.users', 'U') IS NOT NULL DROP TABLE dbo.users;
GO

-- 3. Create Users Table
CREATE TABLE [dbo].[users] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(150) NOT NULL,
    [email] NVARCHAR(150) NOT NULL UNIQUE,
    [password] NVARCHAR(255) NOT NULL,
    [role] NVARCHAR(30) NOT NULL DEFAULT 'customer', -- 'customer', 'inventory_staff', 'manager', 'admin'
    [status] NVARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'inactive'
    [phone] NVARCHAR(30) NULL,
    [address] NVARCHAR(MAX) NULL,
    [city] NVARCHAR(100) NULL,
    [postal_code] NVARCHAR(20) NULL,
    [country] NVARCHAR(50) DEFAULT 'Sri Lanka',
    [created_at] DATETIME DEFAULT GETDATE()
);
GO

-- 4. Create Categories Table
CREATE TABLE [dbo].[categories] (
    [id] NVARCHAR(50) PRIMARY KEY,
    [name] NVARCHAR(100) NOT NULL,
    [description] NVARCHAR(MAX) NULL,
    [image_url] NVARCHAR(500) NULL,
    [item_count] INT DEFAULT 0
);
GO

-- 5. Create Products Table
CREATE TABLE [dbo].[products] (
    [id] NVARCHAR(50) PRIMARY KEY,
    [sku] NVARCHAR(50) NOT NULL UNIQUE,
    [name] NVARCHAR(200) NOT NULL,
    [category_id] NVARCHAR(50) NOT NULL FOREIGN KEY REFERENCES [dbo].[categories]([id]) ON DELETE CASCADE,
    [price_lkr] DECIMAL(10, 2) NOT NULL,
    [original_price_lkr] DECIMAL(10, 2) NULL,
    [rating] DECIMAL(3, 1) DEFAULT 5.0,
    [reviews_count] INT DEFAULT 0,
    [is_new] BIT DEFAULT 0,
    [is_featured] BIT DEFAULT 0,
    [is_available] BIT DEFAULT 1,
    [stock] INT NOT NULL DEFAULT 10,
    [image_url] NVARCHAR(500) NOT NULL,
    [description] NVARCHAR(MAX) NULL,
    [fabric] NVARCHAR(200) NULL,
    [care_instructions] NVARCHAR(200) NULL,
    [created_at] DATETIME DEFAULT GETDATE()
);
GO

-- 5b. Create System Settings Table (AVE-10)
CREATE TABLE [dbo].[system_settings] (
    [setting_key] NVARCHAR(100) PRIMARY KEY,
    [setting_value] NVARCHAR(MAX) NOT NULL,
    [updated_at] DATETIME DEFAULT GETDATE()
);
GO

-- 6. Create Product Sizes Table
CREATE TABLE [dbo].[product_sizes] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [product_id] NVARCHAR(50) NOT NULL FOREIGN KEY REFERENCES [dbo].[products]([id]) ON DELETE CASCADE,
    [size_code] NVARCHAR(20) NOT NULL
);
GO

-- 7. Create Product Colors Table
CREATE TABLE [dbo].[product_colors] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [product_id] NVARCHAR(50) NOT NULL FOREIGN KEY REFERENCES [dbo].[products]([id]) ON DELETE CASCADE,
    [color_name] NVARCHAR(50) NOT NULL,
    [color_hex] NVARCHAR(10) NOT NULL
);
GO

-- 8. Create Orders Table
CREATE TABLE [dbo].[orders] (
    [id] NVARCHAR(50) PRIMARY KEY,
    [user_id] INT NULL FOREIGN KEY REFERENCES [dbo].[users]([id]),
    [customer_name] NVARCHAR(150) NOT NULL,
    [email] NVARCHAR(150) NOT NULL,
    [order_date] DATE NOT NULL,
    [total_amount_lkr] DECIMAL(12, 2) NOT NULL,
    [status] NVARCHAR(50) DEFAULT 'Processing',
    [tracking_number] NVARCHAR(100) NULL,
    [estimated_delivery] DATE NULL,
    [shipping_address] NVARCHAR(MAX) NULL,
    [payment_method] NVARCHAR(100) DEFAULT 'Visa/Mastercard (LKR)',
    [created_at] DATETIME DEFAULT GETDATE()
);
GO

-- 9. Create Order Items Table
CREATE TABLE [dbo].[order_items] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [order_id] NVARCHAR(50) NOT NULL FOREIGN KEY REFERENCES [dbo].[orders]([id]) ON DELETE CASCADE,
    [product_id] NVARCHAR(50) NOT NULL,
    [product_name] NVARCHAR(200) NOT NULL,
    [price_lkr] DECIMAL(10, 2) NOT NULL,
    [size] NVARCHAR(20) NOT NULL,
    [color] NVARCHAR(50) NOT NULL,
    [quantity] INT NOT NULL DEFAULT 1,
    [image_url] NVARCHAR(500) NULL
);
GO

-- ====================================================================
-- SEED INITIAL DATA FOR MS SQL SERVER (SSMS)
-- ====================================================================

-- Insert Demo Users (Customer, Inventory Staff, Manager, Admin)
INSERT INTO [dbo].[users] ([name], [email], [password], [role], [status], [phone], [address], [city], [postal_code], [country]) VALUES
('Sasanka Perera', 'customer@avenza.com', 'password123', 'customer', 'active', '+94 77 123 4567', 'No. 45, Flower Road', 'Colombo 07', '00700', 'Sri Lanka'),
('Sasanka P.B.S', 'admin@avenza.com', 'admin123', 'admin', 'active', '+94 71 987 6543', 'SLIIT Campus, New Kandy Rd', 'Malabe', '10115', 'Sri Lanka'),
('Kamal Silva', 'staff@avenza.com', 'staff123', 'inventory_staff', 'active', '+94 72 345 6789', 'Main Warehouse, Galle Road', 'Dehiwala', '10350', 'Sri Lanka'),
('Nimali Jayasinghe', 'manager@avenza.com', 'manager123', 'manager', 'active', '+94 76 543 2109', 'Corporate HQ, Duplication Rd', 'Colombo 03', '00300', 'Sri Lanka');

-- Insert System Settings
INSERT INTO [dbo].[system_settings] ([setting_key], [setting_value]) VALUES
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
INSERT INTO [dbo].[categories] ([id], [name], [description], [image_url], [item_count]) VALUES
('all', 'All Clothing', 'Browse our full fashion apparel collection', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80', 22),
('women', 'Women''s Clothes', 'Silk midi dresses, blazers, blouses, skirts & trench coats', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80', 10),
('men', 'Men''s Clothes', 'Tailored suits, compression tees, chinos, sweaters & jackets', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80', 10),
('outerwear', 'Coats & Jackets', 'Wool trench coats, denim jackets & double-breasted overcoats', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80', 6),
('kids', 'Kids & Youth', 'Cotton hoodies, t-shirts & cozy joggers for children', 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80', 2);

-- Insert Clothing Products in LKR
INSERT INTO [dbo].[products] ([id], [sku], [name], [category_id], [price_lkr], [original_price_lkr], [rating], [reviews_count], [is_new], [is_featured], [is_available], [stock], [image_url], [description], [fabric], [care_instructions]) VALUES
('prod-m1', 'ACH-MN-01', 'Apex Pro Performance Compression Tee', 'men', 4800.00, 6000.00, 4.9, 88, 1, 1, 1, 18, 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80', 'Ultra-lightweight performance stretch compression top.', '88% Nylon, 12% Spandex', 'Machine wash cold inside out.'),
('prod-m2', 'ACH-MN-02', 'Classic Egyptian Cotton Oxford Dress Shirt', 'men', 7800.00, 9500.00, 4.8, 56, 0, 1, 1, 25, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80', '100% Egyptian cotton Oxford shirt.', '100% Long-Staple Egyptian Cotton', 'Machine wash warm.'),
('prod-m3', 'ACH-MN-03', 'Vintage Wash Denim Trucker Jacket', 'outerwear', 14500.00, 17500.00, 4.9, 38, 1, 1, 1, 8, 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=80', 'Heavyweight 14oz organic cotton denim jacket.', '100% Organic Cotton Denim', 'Machine wash cold inside out.'),
('prod-w1', 'ACH-WM-01', 'Silk Cascade Midi Wrap Dress', 'women', 18500.00, 22500.00, 4.9, 61, 1, 1, 1, 12, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80', 'Flowing mulberry silk midi dress.', '100% Mulberry Silk', 'Hand wash cold or dry clean.'),
('prod-w2', 'ACH-WM-02', 'Pleated High-Waisted Wide-Leg Trousers', 'women', 11200.00, 14000.00, 4.8, 38, 0, 1, 1, 16, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80', 'Chic wide-leg pleated trousers with tailored waistband.', '70% Wool, 28% Viscose, 2% Elastane', 'Dry clean recommended.');

-- Insert Product Sizes
INSERT INTO [dbo].[product_sizes] ([product_id], [size_code]) VALUES
('prod-m1', 'S'), ('prod-m1', 'M'), ('prod-m1', 'L'), ('prod-m1', 'XL'),
('prod-m2', 'S'), ('prod-m2', 'M'), ('prod-m2', 'L'), ('prod-m2', 'XL'),
('prod-w1', 'XS'), ('prod-w1', 'S'), ('prod-w1', 'M'), ('prod-w1', 'L');

-- Insert Product Colors
INSERT INTO [dbo].[product_colors] ([product_id], [color_name], [color_hex]) VALUES
('prod-m1', 'Pitch Black', '#000000'), ('prod-m1', 'Stealth Grey', '#334155'),
('prod-m2', 'Crisp White', '#ffffff'), ('prod-m2', 'Sky Blue', '#38bdf8'),
('prod-w1', 'Emerald Green', '#065f46'), ('prod-w1', 'Champagne Rose', '#f43f5e');

-- Insert Order & Order Items
INSERT INTO [dbo].[orders] ([id], [user_id], [customer_name], [email], [order_date], [total_amount_lkr], [status], [tracking_number], [estimated_delivery], [shipping_address], [payment_method]) VALUES
('ACH-99420', 1, 'Sasanka Perera', 'customer@avenza.com', '2026-08-11', 26300.00, 'Shipped', 'TRK-ACH-8849201', '2026-08-14', 'No. 45, Flower Road, Colombo 07', 'Visa/Mastercard (LKR)');

INSERT INTO [dbo].[order_items] ([order_id], [product_id], [product_name], [price_lkr], [size], [color], [quantity], [image_url]) VALUES
('ACH-99420', 'prod-m2', 'Classic Egyptian Cotton Oxford Dress Shirt', 7800.00, 'L', 'Crisp White', 1, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=300&q=80'),
('ACH-99420', 'prod-w1', 'Silk Cascade Midi Wrap Dress', 18500.00, 'S', 'Emerald Green', 1, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=300&q=80');
GO

-- ====================================================================
-- 6. FEEDBACK & RATINGS TABLE (SSMS SQL SERVER T-SQL) (AVE-22, AVE-25)
-- ====================================================================
IF OBJECT_ID('dbo.feedback', 'U') IS NOT NULL DROP TABLE dbo.feedback;
GO

CREATE TABLE [dbo].[feedback] (
  [id] NVARCHAR(50) NOT NULL PRIMARY KEY,
  [customer_id] NVARCHAR(50) NOT NULL,
  [customer_name] NVARCHAR(100) NOT NULL,
  [customer_email] NVARCHAR(100) NOT NULL,
  [product_id] NVARCHAR(50) NULL,
  [product_name] NVARCHAR(150) NULL,
  [order_id] NVARCHAR(50) NULL,
  [rating] INT NOT NULL CHECK ([rating] >= 1 AND [rating] <= 5),
  [title] NVARCHAR(100) NULL,
  [comment] NVARCHAR(MAX) NOT NULL,
  [status] NVARCHAR(20) DEFAULT 'approved' CHECK ([status] IN ('pending', 'approved', 'hidden', 'archived')),
  [admin_reply_message] NVARCHAR(MAX) NULL,
  [admin_reply_at] DATETIME NULL,
  [admin_reply_by] NVARCHAR(100) NULL,
  [created_at] DATETIME DEFAULT GETDATE(),
  [updated_at] DATETIME DEFAULT GETDATE()
);
GO

INSERT INTO [dbo].[feedback] ([id], [customer_id], [customer_name], [customer_email], [product_id], [product_name], [order_id], [rating], [title], [comment], [status], [admin_reply_message], [admin_reply_at], [admin_reply_by], [created_at]) VALUES
('fb-101', 'user-cust-01', 'Sasanka Perera', 'customer@avenza.com', 'prod-m1', 'Apex Pro Performance Compression Tee', 'ACH-99420', 5, 'Outstanding Quality & Fit!', 'The compression tee fabric is extremely breathable and comfortable during high-intensity gym sessions. Highly recommended!', 'approved', 'Thank you Sasanka! We take pride in delivering top-tier performance activewear.', '2026-08-12 10:30:00', 'Project Admin', '2026-08-11 14:20:00'),
('fb-102', 'user-cust-02', 'Nipuni Fernando', 'nipuni@gmail.com', 'prod-w1', 'Silk Cascade Midi Wrap Dress', NULL, 4, 'Elegant silk dress', 'Fit was almost perfect. The emerald green color shines beautifully under evening lights.', 'approved', NULL, NULL, NULL, '2026-08-10 09:15:00');
GO

-- ====================================================================
-- 7. PAYMENT ISA HIERARCHY [Disjoint (d), Total]
-- ====================================================================
IF OBJECT_ID(N'[dbo].[card_payment]', N'U') IS NOT NULL DROP TABLE [dbo].[card_payment];
IF OBJECT_ID(N'[dbo].[cash_on_delivery]', N'U') IS NOT NULL DROP TABLE [dbo].[cash_on_delivery];
IF OBJECT_ID(N'[dbo].[payment]', N'U') IS NOT NULL DROP TABLE [dbo].[payment];
GO

-- Superclass: PAYMENT
CREATE TABLE [dbo].[payment] (
  [payment_id] INT IDENTITY(1,1) PRIMARY KEY,
  [order_id] NVARCHAR(50) NOT NULL,
  [amount] DECIMAL(10,2) NOT NULL,
  [payment_date] DATETIME DEFAULT GETDATE(),
  [status] NVARCHAR(30) NOT NULL DEFAULT 'Completed',
  [payment_type] NVARCHAR(30) NOT NULL CHECK ([payment_type] IN ('Card_Payment', 'Cash_On_Delivery')),
  CONSTRAINT [FK_payment_order] FOREIGN KEY ([order_id]) REFERENCES [dbo].[orders]([id]) ON DELETE CASCADE
);
GO

-- Subclass 1: Card_Payment
CREATE TABLE [dbo].[card_payment] (
  [payment_id] INT PRIMARY KEY,
  [card_type] NVARCHAR(50) NOT NULL,       -- e.g., 'Visa', 'Mastercard'
  [last_4_digits] NVARCHAR(4) NOT NULL,
  [transaction_auth] NVARCHAR(100) NOT NULL,
  [bank_name] NVARCHAR(100) NULL,
  CONSTRAINT [FK_card_payment_super] FOREIGN KEY ([payment_id]) REFERENCES [dbo].[payment]([payment_id]) ON DELETE CASCADE
);
GO

-- Subclass 2: Cash_On_Delivery
CREATE TABLE [dbo].[cash_on_delivery] (
  [payment_id] INT PRIMARY KEY,
  [receipt_number] NVARCHAR(50) NOT NULL,
  [advance_amount_lkr] DECIMAL(10,2) DEFAULT 500.00,
  [balance_due_lkr] DECIMAL(10,2) NULL,
  [change_required] DECIMAL(10,2) DEFAULT 0.00,
  [cash_collected_by] NVARCHAR(100) NULL,
  [collection_status] NVARCHAR(50) DEFAULT 'Pending',
  CONSTRAINT [FK_cod_payment_super] FOREIGN KEY ([payment_id]) REFERENCES [dbo].[payment]([payment_id]) ON DELETE CASCADE
);
GO

-- ====================================================================
-- 8. DELIVERY ISA HIERARCHY [Disjoint (d)]
-- ====================================================================
IF OBJECT_ID(N'[dbo].[standard_courier]', N'U') IS NOT NULL DROP TABLE [dbo].[standard_courier];
IF OBJECT_ID(N'[dbo].[express_same_day]', N'U') IS NOT NULL DROP TABLE [dbo].[express_same_day];
IF OBJECT_ID(N'[dbo].[delivery]', N'U') IS NOT NULL DROP TABLE [dbo].[delivery];
GO

-- Superclass: DELIVERY
CREATE TABLE [dbo].[delivery] (
  [delivery_id] INT IDENTITY(1,1) PRIMARY KEY,
  [order_id] NVARCHAR(50) NOT NULL,
  [address] NVARCHAR(MAX) NOT NULL,
  [dispatch_date] DATETIME DEFAULT GETDATE(),
  [status] NVARCHAR(50) NOT NULL DEFAULT 'Processing',
  [delivery_type] NVARCHAR(30) NOT NULL CHECK ([delivery_type] IN ('Standard_Courier', 'Express_Same_Day')),
  CONSTRAINT [FK_delivery_order] FOREIGN KEY ([order_id]) REFERENCES [dbo].[orders]([id]) ON DELETE CASCADE
);
GO

-- Subclass 1: Standard_Courier
CREATE TABLE [dbo].[standard_courier] (
  [delivery_id] INT PRIMARY KEY,
  [courier_partner] NVARCHAR(100) NOT NULL,   -- e.g. 'Domex Courier Services', 'Prompt Xpress'
  [tracking_barcode] NVARCHAR(100) NOT NULL,
  [transit_hub] NVARCHAR(100) NULL,
  CONSTRAINT [FK_standard_courier_super] FOREIGN KEY ([delivery_id]) REFERENCES [dbo].[delivery]([delivery_id]) ON DELETE CASCADE
);
GO

-- Subclass 2: Express_Same_Day
CREATE TABLE [dbo].[express_same_day] (
  [delivery_id] INT PRIMARY KEY,
  [rider_name] NVARCHAR(100) NOT NULL,
  [rider_phone] NVARCHAR(30) NOT NULL,
  [delivery_time_slot] NVARCHAR(50) NOT NULL, -- e.g. 'Morning 9am-12pm', 'Afternoon 2pm-5pm'
  CONSTRAINT [FK_express_same_day_super] FOREIGN KEY ([delivery_id]) REFERENCES [dbo].[delivery]([delivery_id]) ON DELETE CASCADE
);
GO

