# Avenza Clothing Store 🛍️👗

A full-stack enterprise-grade e-commerce web application for **Avenza Clothing Store**, built with React 19, Tailwind CSS, Vite, Node.js/Express, and MySQL.

---

## 🌟 Key Architecture & Features (All 4 Epics)

### 👤 Epic 1: User Administration & Authentication
- **Secure Authentication & Registration**: Validates First & Last Name formatting (space-separated) and email address rules.
- **Dynamic Quick Auto-Fill**: Real-time autocomplete suggestions for saved accounts upon typing 3 or more letters in the login field.
- **Role-Based Access Control (RBAC)**: Multi-role support for **Customer**, **Inventory Staff**, **Store Manager**, and **Administrator**.
- **Enterprise Audit Trail**: Comprehensive security event logging (`audit_logs` table) recording user identity, action, category, timestamp, and severity levels.
- **System Settings Configuration**: Dynamic store settings management (maintenance mode toggle, store tax, currency, and COD policies).

### 📦 Epic 2: Product Catalog & Inventory Management
- **Full Catalog Control**: Multi-size apparel items (`XS, S, M, L, XL, XXL, 3XL`), color swatches, SKU generation, and categories (Men, Women, Outerwear, Kids).
- **PC Image Uploads with Live Preview**: Support for local PC image uploads stored seamlessly using MySQL `LONGTEXT` / `NVARCHAR(MAX)` data URIs without truncation.
- **Authoritative Stock Persistence**: Synchronized total stock and per-size distribution that persists reliably across page refreshes (`F5`).
- **Low-Stock Alerting Engine**: Real-time warning banners for products with `<= 5` units remaining across both Customer and Staff dashboards.
- **Flexible Pricing & Discount Validation**: Allows custom pricing while enforcing that **Original Price must be strictly greater than Selling Price** (`Original Price > Price in LKR`) with real-time discount calculation (`% OFF`).

### 🛒 Epic 3: Shopping Cart, Orders & Payments
- **Real-Time Size-Level Stock Clamping**: Prevents overselling by checking available stock per size before adding to cart and during checkout.
- **ACID Database Transactions**: Order placement with atomic database transaction handling and automatic rollback on failure.
- **Bank Transfer Slip Verification**: Upload and storage of bank deposit slips (`orders.payment_slip`).
- **Card Payment Simulation**: Luhn Mod-10 card number validation with Visa/Mastercard auto-detection and saved cards manager.

### 🚚 Epic 4: Order Fulfillment, Delivery ISA & Customer Reviews
- **Dispatch & Courier ISA**: 4-stage tracking (`Processing` ➔ `Shipped` ➔ `In Transit` ➔ `Delivered`) with courier partner assignment (Domex, Koombiyo, Prompt Xpress, Citypak).
- **Verified Customer Reviews**: 1-5 star ratings, customer feedback submission, and official staff responses.
- **Printable Invoices**: Printable order receipts and exportable CSV reports for management.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide React, Canvas Confetti
- **Backend**: Node.js, Express.js, MySQL (`mysql2` connection pool) / Microsoft SQL Server (`mssql`)
- **Database**: MySQL / MariaDB (`achinis_fashion_db`)

---

## 👥 Demo / Evaluation Accounts

| Role | Username / Identifier | Password | Access Level |
| :--- | :--- | :--- | :--- |
| 👑 **Administrator** | `admin` / `admin@avenza.com` | `password123` | Full administrative oversight, users, settings & audit logs |
| 📦 **Inventory Staff** | `staff` / `staff@avenza.com` | `password123` | Catalog inventory, stock restocking & product management |
| 👔 **Store Manager** | `manager` / `manager@avenza.com` | `password123` | Orders dispatch, KPIs, courier assignment & moderation |
| 🛍️ **Customer** | `customer` / `customer@avenza.com` | `password123` | Browsing catalog, shopping cart, checkout & feedback |

*(Tip: In the login modal, typing 3 letters like `cus`, `adm`, `sta`, or `man` automatically displays role credentials!)*

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **MySQL / XAMPP** (Port 3314 or standard port 3306)

### 2. Database Setup
1. Open phpMyAdmin or MySQL Workbench.
2. Run the SQL script from `backend/schema.sql` to initialize `achinis_fashion_db` with all tables and seeded apparel products.

### 3. Backend Setup
```bash
cd backend
npm install
# Ensure database credentials in backend/db.js match your MySQL port and password
npm start
```
The backend API server will run on `http://localhost:5000`.

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend application runs on `http://localhost:5173`.

---

## 📄 License, Copyright & Permission Policy

Copyright (c) 2026 **Sadeep Sasanka** (Avenza Clothing). **All Rights Reserved.**

This project and source code are strictly proprietary. Unauthorized copying, modification, public display, re-hosting, or deployment on any other platform is strictly prohibited.

### 🤝 Requesting Permission for Use
Third parties, developers, evaluators, or organizations wishing to use, fork, deploy, or showcase any part of this project **may do so only after obtaining prior written permission** from the copyright holder.

**How to Request Permission:**
- 📧 **Email**: [sasankasadeep78@gmail.com](mailto:sasankasadeep78@gmail.com)
- 🐙 **GitHub Profile**: [@Sadeep78](https://github.com/Sadeep78)
- 📝 **Subject Line**: `[Permission Request] Avenza Clothing Project - <Your Name / Organization>`
- 📋 **Please Include**:
  1. Your full name & organization (if applicable)
  2. The specific intended purpose (Academic review, portfolio evaluation, testing, or commercial)
  3. The target environment / platform where you wish to run or host it

*Upon approval, written authorization or GitHub collaborator access will be granted.*
