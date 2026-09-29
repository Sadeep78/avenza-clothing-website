# Avenza Clothing Store 🛍️👗

A full-stack modern e-commerce web application for **Avenza Clothing Store**, built with React 19, Tailwind CSS, Vite, Node.js/Express, and MySQL.

---

## 🌟 Key Features

- **Product Catalog & Sizing**: Real-time stock tracking per size (`S, M, L, XL, XXL`), category filtering, and instant search.
- **Cart & Order Management**: Intelligent cart quantity clamping based on real-time size availability, order cancellation, and item-level returns.
- **Checkout & Multi-Address**: Saved address manager, full shipping address validation, and instant delivery slot selection.
- **Secure Payment Simulation**: Luhn Mod-10 card verification, Visa/Mastercard detection, saved card manager, Cash on Delivery with LKR 500 advance slip upload.
- **Order Tracking & Invoice**: Live 4-stage tracking (`Processing` ➔ `Shipped` ➔ `In Transit` ➔ `Delivered`) and print-ready PDF invoices.
- **Admin Dispatch Portal**: Bulk order processing, courier assignment (Domex, Koombiyo, Prompt Xpress, Citypak), rider management, and reporting dashboard.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide React, Canvas Confetti
- **Backend**: Node.js, Express.js, MySQL (mysql2 / mssql)
- **Database**: MySQL / MariaDB (`achinis_fashion_db`)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MySQL (XAMPP on port 3314 or standard port 3306)

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your database credentials in .env
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The application runs on `http://localhost:5173` with backend API on `http://localhost:5000`.

---

## 📄 License
ISC
