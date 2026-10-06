# 🗄️ AVENZA CLOTHING STORE - SQL DATABASE CRUD MANUAL

This folder contains the complete, production-ready SQL scripts and CRUD queries for all **4 Project Epics** of the **Avenza Clothing Store** database (`achinis_fashion_db`).

---

## 📂 Epics to SQL Files Mapping

| Epic ID | Epic Name | Assigned Role | SQL Query File | Database Tables Covered |
| :--- | :--- | :--- | :--- | :--- |
| **E1** | **User and Administration Management** | System Administrator | [`epic1_user_and_administration_queries.sql`](./epic1_user_and_administration_queries.sql) | `users`, `system_settings` |
| **E2** | **Product and Inventory Management** | Inventory Staff | [`epic2_product_and_inventory_queries.sql`](./epic2_product_and_inventory_queries.sql) | `products`, `product_sizes`, `product_colors`, `categories` |
| **E3** | **Shopping Cart and Payment Management** | Customer & Accounts | [`epic3_shopping_cart_and_payment_queries.sql`](./epic3_shopping_cart_and_payment_queries.sql) | `orders`, `order_items`, `payment`, `card_payment`, `cash_on_delivery` |
| **E4** | **Delivery and Feedback Management** | Store Manager | [`epic4_delivery_and_feedback_queries.sql`](./epic4_delivery_and_feedback_queries.sql) | `delivery`, `standard_courier`, `express_same_day`, `feedback` |

---

## 🚀 How to Execute Queries in phpMyAdmin

1. Start **XAMPP Control Panel** and ensure **MySQL** is running (Port `3314` or default).
2. Open your web browser and navigate to: `http://localhost/phpmyadmin`
3. Click on the database **`achinis_fashion_db`** on the left panel.
4. Click on the **"SQL"** tab at the top.
5. Open the respective `.sql` file above, copy the query you wish to demonstrate (CREATE, READ, UPDATE, or DELETE), paste it into the SQL window, and click **"Go"**.
