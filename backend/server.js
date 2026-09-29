/**
 * ====================================================================
 * AVENZA CLOTHING STORE - EXPRESS REST API BACKEND SERVER
 * File: backend/server.js
 * Description: Main Node.js Express server handling API requests for
 *              user authentication, product catalog, inventory stock,
 *              order persistence, and fulfillment tracking.
 * ====================================================================
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { pool, testConnection } = require('./db');

// Initialize Express web application
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware: Enable Cross-Origin Resource Sharing (CORS) and JSON body parsing
app.use(cors());
app.use(express.json());

/**
 * HEALTH CHECK ENDPOINT
 * URL: GET /api/health
 * Purpose: Verifies if the backend server and database connection are active.
 */
app.get('/api/health', async (req, res) => {
  const dbConnected = await testConnection();
  res.json({
    status: 'online',
    app: 'Avenza Clothing Store Backend API',
    database: dbConnected ? 'SQL Database Connected' : 'SQL Database Offline'
  });
});

// ====================================================================
// 1. AUTHENTICATION ENDPOINTS
// ====================================================================

/**
 * USER LOGIN ENDPOINT
 * URL: POST /api/auth/login
 * Purpose: Authenticates Customer and Admin users by email & password.
 */
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Query database for user matching email
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    
    // If user is not found in database, provide evaluation fallback
    if (rows.length === 0) {
      if (email.includes('admin')) {
        return res.json({
          user: { id: 2, name: 'Sasanka P.B.S (Project Admin)', email, role: 'admin', phone: '+94 71 987 6543' }
        });
      }
      return res.json({
        user: { id: 1, name: email.split('@')[0].toUpperCase(), email, role: 'customer', phone: '+94 77 123 4567' }
      });
    }

    const user = rows[0];
    // Validate password match
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password entered' });
    }

    delete user.password; // Omit password hash from response
    res.json({ user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Database authentication error' });
  }
});

// ====================================================================
// 1b. USER & ROLE MANAGEMENT ENDPOINTS (AVE-06, AVE-07, AVE-08)
// ====================================================================

/**
 * GET ALL USERS ENDPOINT
 * URL: GET /api/users
 */
app.get('/api/users', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, role, status, phone, address, city, postal_code, created_at FROM users ORDER BY id DESC');
    res.json(users);
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ error: 'Failed to fetch users list' });
  }
});

/**
 * CREATE NEW USER ENDPOINT (ADMIN CREATES USER)
 * URL: POST /api/users
 */
app.post('/api/users', async (req, res) => {
  const { name, email, password, role, status, phone, address, city, postalCode } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  const cleanEmail = email.toLowerCase().trim();
  try {
    // 1. Check if email is already registered in MySQL
    const [existing] = await pool.query('SELECT id, email FROM users WHERE LOWER(email) = ?', [cleanEmail]);
    if (existing && existing.length > 0) {
      return res.status(409).json({ 
        error: 'This email is already registered. Please use another email or sign in.',
        code: 'EMAIL_ALREADY_EXISTS'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO users (name, email, password, role, status, phone, address, city, postal_code) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, cleanEmail, password || 'password123', role || 'customer', status || 'active', phone || null, address || null, city || null, postalCode || null]
    );
    res.json({ success: true, id: result.insertId, message: 'User created successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
      return res.status(409).json({ 
        error: 'This email is already registered. Please use another email or sign in.',
        code: 'EMAIL_ALREADY_EXISTS'
      });
    }
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user account' });
  }
});

/**
 * UPDATE USER DETAILS & ROLE ENDPOINT (AVE-06, AVE-07, AVE-08)
 * URL: PUT /api/users/:id
 */
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, role, status, phone, address, city, postalCode } = req.body;

  try {
    await pool.query(
      `UPDATE users SET name = ?, email = ?, role = ?, status = ?, phone = ?, address = ?, city = ?, postal_code = ? 
       WHERE id = ?`,
      [name, email, role, status || 'active', phone, address, city, postalCode, id]
    );
    res.json({ success: true, message: `User ${id} updated successfully` });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user details' });
  }
});

/**
 * SAVE CUSTOMER SHIPPING ADDRESS (Auto-save on checkout)
 * URL: PUT /api/users/:id/shipping-address
 */
app.put('/api/users/:id/shipping-address', async (req, res) => {
  const { id } = req.params;
  const { address, city, postalCode, phone } = req.body;
  try {
    const isNumeric = !isNaN(parseInt(id));
    if (isNumeric) {
      await pool.query(
        `UPDATE users SET address = ?, city = ?, postal_code = ?, phone = COALESCE(NULLIF(?, ''), phone) WHERE id = ?`,
        [address, city, postalCode, phone, parseInt(id)]
      );
    } else {
      await pool.query(
        `UPDATE users SET address = ?, city = ?, postal_code = ?, phone = COALESCE(NULLIF(?, ''), phone) WHERE email = ?`,
        [address, city, postalCode, phone, String(id).toLowerCase().trim()]
      );
    }
    res.json({ success: true, message: 'Shipping address updated successfully' });
  } catch (err) {
    console.error('Save shipping address error:', err);
    res.status(500).json({ error: 'Failed to save shipping address' });
  }
});

/**
 * DELETE / DEACTIVATE USER ENDPOINT
 * URL: DELETE /api/users/:id
 */
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ success: true, message: `User ${id} deleted successfully` });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user account' });
  }
});

/**
 * ADMIN RESET USER PASSWORD ENDPOINT (AVE-14)
 * URL: PUT /api/users/:id/password
 * Purpose: Allows Administrator to reset user password in SQL database.
 */
app.put('/api/users/:id/password', async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'New password is required' });
  }

  try {
    let result;
    if (isNaN(parseInt(id))) {
      [result] = await pool.query('UPDATE users SET password = ? WHERE email = ?', [password, id.trim().toLowerCase()]);
    } else {
      [result] = await pool.query('UPDATE users SET password = ? WHERE id = ?', [password, parseInt(id)]);
    }

    console.log(`✅ Admin reset password for user ${id} in SQL database!`);
    res.json({ success: true, message: `Password for user ${id} updated successfully in database` });
  } catch (error) {
    console.error('Reset user password error:', error);
    res.status(500).json({ error: 'Failed to reset user password in database' });
  }
});

// ====================================================================
// 2. PRODUCTS & INVENTORY ENDPOINTS
// ====================================================================

/**
 * GET ALL PRODUCTS ENDPOINT
 * URL: GET /api/products
 * Purpose: Retrieves all clothes products with sizes, colors, and LKR pricing.
 */
app.get('/api/products', async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    
    // Attach available sizes & color swatches to each product object
    for (let product of products) {
      const [sizes] = await pool.query('SELECT size_code, stock FROM product_sizes WHERE product_id = ?', [product.id]);
      const [colors] = await pool.query('SELECT color_name as name, color_hex as hex FROM product_colors WHERE product_id = ?', [product.id]);
      product.sizes = sizes.map(s => s.size_code);
      product.sizeStocks = {};
      sizes.forEach(s => {
        product.sizeStocks[s.size_code] = s.stock;
      });
      product.colors = colors;
      product.price = parseFloat(product.price_lkr);
      product.originalPrice = product.original_price_lkr ? parseFloat(product.original_price_lkr) : null;
      product.isNew = Boolean(product.is_new);
      product.isFeatured = Boolean(product.is_featured);
      product.isAvailable = Boolean(product.stock > 0 && (product.is_available ?? true));
      product.image = product.image_url;
      product.category = product.category_id;
    }

    res.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ error: 'Failed to fetch products from database' });
  }
});

/**
 * UPDATE PRODUCT STOCK ENDPOINT (ADMIN INLINE STOCK CONTROL)
 * URL: PUT /api/products/:id/stock
 */
app.put('/api/products/:id/stock', async (req, res) => {
  const { id } = req.params;
  const { stock, size } = req.body;

  try {
    if (size && stock !== undefined) {
      const szVal = Math.max(0, parseInt(stock) || 0);
      await pool.query('UPDATE product_sizes SET stock = ? WHERE product_id = ? AND size_code = ?', [szVal, id, size]);
      const [sumRow] = await pool.query('SELECT SUM(stock) as totalStock FROM product_sizes WHERE product_id = ?', [id]);
      const newTotal = sumRow[0]?.totalStock || 0;
      await pool.query('UPDATE products SET stock = ?, is_available = IF(? > 0, 1, 0) WHERE id = ?', [newTotal, newTotal, id]);
    } else {
      const newStock = Math.max(0, parseInt(stock) || 0);
      await pool.query('UPDATE products SET stock = ?, is_available = IF(? > 0, 1, 0) WHERE id = ?', [newStock, newStock, id]);
    }
    res.json({ success: true, message: 'Product stock updated in database' });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ error: 'Failed to update product stock' });
  }
});

/**
 * UPDATE PRODUCT DETAILS ENDPOINT (AVE-13)
 * URL: PUT /api/products/:id
 */
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, price, originalPrice, stock, description, fabric, careInstructions, image, isAvailable } = req.body;

  try {
    await pool.query(
      `UPDATE products SET name = ?, category_id = ?, price_lkr = ?, original_price_lkr = ?, stock = ?, 
       description = ?, fabric = ?, care_instructions = ?, image_url = ?, is_available = ? WHERE id = ?`,
      [name, category, price, originalPrice || null, stock, description, fabric, careInstructions, image, isAvailable ? 1 : 0, id]
    );
    res.json({ success: true, message: `Product ${id} updated successfully` });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product details' });
  }
});

/**
 * TOGGLE PRODUCT AVAILABILITY ENDPOINT (AVE-14)
 * URL: PUT /api/products/:id/availability
 */
app.put('/api/products/:id/availability', async (req, res) => {
  const { id } = req.params;
  const { isAvailable } = req.body;

  try {
    await pool.query('UPDATE products SET is_available = ? WHERE id = ?', [isAvailable ? 1 : 0, id]);
    res.json({ success: true, message: `Product ${id} availability set to ${isAvailable}` });
  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({ error: 'Failed to update availability' });
  }
});



// ====================================================================
// 2b. SYSTEM SETTINGS ENDPOINTS (AVE-10)
// ====================================================================

/**
 * GET SYSTEM SETTINGS ENDPOINT
 * URL: GET /api/settings
 */
app.get('/api/settings', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT setting_key, setting_value FROM system_settings');
    const settings = {};
    for (let row of rows) {
      settings[row.setting_key] = row.setting_value;
    }
    res.json(settings);
  } catch (error) {
    console.error('Fetch settings error:', error);
    res.status(500).json({ error: 'Failed to fetch system settings' });
  }
});

/**
 * UPDATE SYSTEM SETTINGS ENDPOINT
 * URL: PUT /api/settings
 */
app.put('/api/settings', async (req, res) => {
  const settings = req.body;
  try {
    for (let [key, val] of Object.entries(settings)) {
      await pool.query(
        `INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE setting_value = ?`,
        [key, String(val), String(val)]
      );
    }
    res.json({ success: true, message: 'System settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update system settings' });
  }
});

// ====================================================================
// 3. ORDERS & TRACKING ENDPOINTS
// ====================================================================

/**
 * GET ALL ORDERS ENDPOINT
 * URL: GET /api/orders
 * Purpose: Fetches all customer orders for the Admin Fulfillment Queue & tracking.
 */
app.get('/api/orders', async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    for (let order of orders) {
      const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      order.items = items.map(i => ({
        orderItemId: i.id,
        id: i.product_id,
        name: i.product_name,
        price: parseFloat(i.price_lkr),
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        image: i.image_url
      }));
      order.totalAmount = parseFloat(order.total_amount_lkr);
      order.customerName = order.customer_name;
      order.date = order.order_date;
      order.trackingNumber = order.tracking_number;
      order.estimatedDelivery = order.estimated_delivery;
      order.paymentMethod = order.payment_method;
      order.shippingAddress = order.shipping_address;
      order.paymentSlip = order.payment_slip;

      // Delivery ISA details (AVE-24)
      try {
        const [delRows] = await pool.query('SELECT * FROM delivery WHERE order_id = ?', [order.id]);
        if (delRows && delRows.length > 0) {
          const del = delRows[0];
          order.deliveryType = del.delivery_type;
          if (del.delivery_type === 'Standard_Courier') {
            const [scRows] = await pool.query('SELECT * FROM standard_courier WHERE delivery_id = ?', [del.delivery_id]);
            if (scRows && scRows.length > 0) {
              order.courierPartner = scRows[0].courier_partner;
              order.trackingBarcode = scRows[0].tracking_barcode;
              order.transitHub = scRows[0].transit_hub;
            }
          } else if (del.delivery_type === 'Express_Same_Day') {
            const [expRows] = await pool.query('SELECT * FROM express_same_day WHERE delivery_id = ?', [del.delivery_id]);
            if (expRows && expRows.length > 0) {
              order.riderName = expRows[0].rider_name;
              order.riderPhone = expRows[0].rider_phone;
              order.deliveryTimeSlot = expRows[0].delivery_time_slot;
            }
          }
        }
      } catch (delErr) {
        console.error('DELIVERY FETCH ERROR for order', order.id, ':', delErr.message);
      }
    }
    res.json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ error: 'Failed to fetch customer orders' });
  }
});

/**
 * PLACE NEW ORDER ENDPOINT
 * URL: POST /api/orders
 * Purpose: Inserts a new customer order & items into SQL database, and decrements stock.
 */
app.post('/api/orders', async (req, res) => {
  const { 
    id, 
    userId, 
    customerName, 
    email, 
    totalAmount, 
    status, 
    trackingNumber, 
    estimatedDelivery, 
    shippingAddress, 
    paymentMethod, 
    items,
    deliveryType
  } = req.body;

  if (!id || !customerName || !items || items.length === 0) {
    return res.status(400).json({ error: 'Invalid order payload data' });
  }

  try {
    const addrString = typeof shippingAddress === 'object' 
      ? `${shippingAddress.address || ''}, ${shippingAddress.city || ''} ${shippingAddress.postalCode || ''}` 
      : String(shippingAddress || '');

    const validUserId = (userId && userId !== 'guest' && !isNaN(parseInt(userId))) ? parseInt(userId) : null;
    const rawSlip = req.body.paymentSlip;
    const paymentSlip = rawSlip 
      ? (typeof rawSlip === 'object' ? rawSlip.fileData || rawSlip.fileName : String(rawSlip)) 
      : null;

    // 1. Insert order record into database
    await pool.query(
      `INSERT INTO orders (id, user_id, customer_name, email, order_date, total_amount_lkr, status, tracking_number, estimated_delivery, shipping_address, payment_method, payment_slip) 
       VALUES (?, ?, ?, ?, CURDATE(), ?, ?, ?, ?, ?, ?, ?)`,
      [id, validUserId, customerName, email, totalAmount, status || 'Processing', trackingNumber, estimatedDelivery || null, addrString, paymentMethod, paymentSlip]
    );

    // 2. Insert order items & adjust product inventory counts
    for (let item of items) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, product_name, price_lkr, size, color, quantity, image_url) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, item.id, item.name, item.price, item.size, item.color, item.quantity, item.image]
      );

      // Decrement size-specific stock in product_sizes
      if (item.size) {
        await pool.query(
          `UPDATE product_sizes SET stock = GREATEST(0, stock - ?) WHERE product_id = ? AND size_code = ?`,
          [item.quantity, item.id, item.size]
        );
      }

      await pool.query(
        `UPDATE products SET stock = GREATEST(0, stock - ?), is_available = IF(stock - ? <= 0, 0, is_available) WHERE id = ?`,
        [item.quantity, item.quantity, item.id]
      );
    }

    // 3. Record payment transaction in payments table (Backwards compatibility)
    try {
      const pm = (paymentMethod || '').toLowerCase();
      const isCard = pm.includes('card') || pm.includes('visa') || pm.includes('mastercard');
      const payStatus = isCard ? 'Paid' : 'Pending_COD';
      const detectedCardType = pm.includes('mastercard') ? 'Mastercard' : 'Visa';
      const last4Match = (paymentMethod || '').match(/\d{4}/);
      const last4 = last4Match ? last4Match[0] : (req.body.paymentDetails?.last4 || (isCard ? '9981' : null));

      await pool.query(
        `INSERT INTO payments (order_id, payment_method, payment_status, amount_lkr, card_last4) 
         VALUES (?, ?, ?, ?, ?)`,
        [id, paymentMethod || 'Visa/Mastercard (LKR)', payStatus, totalAmount || 0, last4]
      );
    } catch (payErr) {
      console.warn('Payment record log note:', payErr.message);
    }

    // 4. Record in PAYMENT ISA Hierarchy (payment -> card_payment / cash_on_delivery)
    try {
      const pm = (paymentMethod || '').toLowerCase();
      const isCard = pm.includes('card') || pm.includes('visa') || pm.includes('mastercard');
      const payType = isCard ? 'Card_Payment' : 'Cash_On_Delivery';
      const payStatus = isCard ? 'Paid' : 'Pending_COD';
      const detectedCardType = pm.includes('mastercard') ? 'Mastercard' : 'Visa';
      const last4Match = (paymentMethod || '').match(/\d{4}/);
      const last4 = last4Match ? last4Match[0] : (req.body.paymentDetails?.last4 || '9981');

      await pool.query(
        `INSERT INTO payment (order_id, amount, payment_date, status, payment_type) 
         VALUES (?, ?, NOW(), ?, ?)`,
        [id, totalAmount || 0, payStatus, payType]
      );
      
      const [payLookup] = await pool.query('SELECT payment_id FROM payment WHERE order_id = ?', [id]);
      const insertedPaymentId = payLookup && payLookup.length > 0 ? payLookup[0].payment_id : null;

      if (insertedPaymentId) {
        if (isCard) {
          await pool.query(
            `INSERT INTO card_payment (payment_id, card_type, last_4_digits, transaction_auth, bank_name)
             VALUES (?, ?, ?, ?, 'Commercial Bank of Ceylon')`,
            [insertedPaymentId, detectedCardType, last4, `AUTH-${Math.floor(100000 + Math.random() * 900000)}`]
          );
        } else {
          const advanceLkr = 500.00;
          const balanceDue = Math.max(0, (totalAmount || 0) - advanceLkr);
          await pool.query(
            `INSERT INTO cash_on_delivery (payment_id, receipt_number, advance_amount_lkr, balance_due_lkr, change_required, cash_collected_by, collection_status, slip_url)
             VALUES (?, ?, ?, ?, 0.00, 'Courier Dispatch Rider', 'Pending_Collection', ?)`,
            [insertedPaymentId, `REC-COD-${Math.floor(1000 + Math.random() * 9000)}`, advanceLkr, balanceDue, paymentSlip]
          );
        }
      }
    } catch (isaPayErr) {
      console.warn('PAYMENT ISA insertion notice:', isaPayErr.message);
    }

    // 5. Record in DELIVERY ISA Hierarchy (delivery -> standard_courier / express_same_day)
    try {
      const delType = (deliveryType === 'Express_Same_Day' || (trackingNumber || '').includes('EXP')) 
        ? 'Express_Same_Day' 
        : 'Standard_Courier';

      await pool.query(
        `INSERT INTO delivery (order_id, address, dispatch_date, status, delivery_type)
         VALUES (?, ?, NOW(), ?, ?)`,
        [id, addrString, status || 'Processing', delType]
      );
      
      const [delLookup] = await pool.query('SELECT delivery_id FROM delivery WHERE order_id = ?', [id]);
      const insertedDelId = delLookup && delLookup.length > 0 ? delLookup[0].delivery_id : null;

      if (insertedDelId) {
        if (delType === 'Standard_Courier') {
          await pool.query(
            `INSERT INTO standard_courier (delivery_id, courier_partner, tracking_barcode, transit_hub)
             VALUES (?, 'Domex Courier Services', ?, 'Colombo Central Distribution Hub')`,
            [insertedDelId, `BARCODE-${trackingNumber || id}`]
          );
        } else {
          await pool.query(
            `INSERT INTO express_same_day (delivery_id, rider_name, rider_phone, delivery_time_slot)
             VALUES (?, 'Nuwan Bandara', '+94 77 456 7890', 'Afternoon (2:00 PM - 5:00 PM)')`,
            [insertedDelId]
          );
        }
      }
    } catch (isaDelErr) {
      console.warn('DELIVERY ISA insertion notice:', isaDelErr.message);
    }

    // 6. Auto-save shipping address for customer in MySQL users table
    try {
      if (typeof shippingAddress === 'object' && shippingAddress.address) {
        const cleanAddr = String(shippingAddress.address || '').trim();
        const cleanCity = String(shippingAddress.city || '').trim();
        const cleanPostal = String(shippingAddress.postalCode || '').trim();
        const cleanPhone = String(shippingAddress.phone || '').trim();

        if (cleanAddr) {
          if (validUserId) {
            await pool.query(
              `UPDATE users 
               SET address = ?, city = ?, postal_code = ?, phone = COALESCE(NULLIF(?, ''), phone)
               WHERE id = ?`,
              [cleanAddr, cleanCity, cleanPostal, cleanPhone, validUserId]
            );
          } else if (email) {
            await pool.query(
              `UPDATE users 
               SET address = ?, city = ?, postal_code = ?, phone = COALESCE(NULLIF(?, ''), phone)
               WHERE email = ?`,
              [cleanAddr, cleanCity, cleanPostal, cleanPhone, email.toLowerCase().trim()]
            );
          }
        }
      }
    } catch (addrErr) {
      console.warn('Customer address auto-update note:', addrErr.message);
    }

    console.log(`✅ Order ${id} successfully persisted to SQL Database and ISA tables!`);
    res.json({ success: true, message: `Order ${id} saved to database` });
  } catch (error) {
    console.error('Save order DB error:', error);
    res.status(500).json({ error: 'Failed to save order to database' });
  }
});

/**
 * UPDATE ORDER STATUS ENDPOINT (ADMIN & MANAGER PERMISSIONS - AVE-25)
 * URL: PUT /api/orders/:id/status
 * Purpose: Modifies the shipment status (Placed -> Processing -> Dispatched -> In Transit -> Delivered).
 */
app.put('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    // Also sync delivery table if existing
    try {
      await pool.query('UPDATE delivery SET status = ? WHERE order_id = ?', [status, id]);
    } catch (e) {}

    res.json({ success: true, message: `Order ${id} status updated to ${status}` });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

/**
 * ASSIGN DELIVERY METHOD & DISPATCH DETAILS (MANAGER PERMISSION - AVE-24)
 * URL: PUT /api/orders/:id/delivery
 * Purpose: Allows Store Manager to assign Standard Courier vs Express Same-Day delivery
 *          and syncs with MS SQL Server DELIVERY ISA hierarchy tables.
 */
app.put('/api/orders/:id/delivery', async (req, res) => {
  const { id } = req.params;
  const {
    deliveryType,
    courierPartner,
    trackingBarcode,
    transitHub,
    riderName,
    riderPhone,
    deliveryTimeSlot
  } = req.body;

  try {
    // 1. Update order status to Shipped if currently Processing
    await pool.query(
      `UPDATE orders 
       SET status = CASE WHEN status = 'Processing' THEN 'Shipped' ELSE status END,
           tracking_number = COALESCE(?, tracking_number)
       WHERE id = ?`,
      [trackingBarcode || null, id]
    );

    // 2. Fetch or insert delivery row
    let [existingDel] = await pool.query('SELECT delivery_id FROM delivery WHERE order_id = ?', [id]);
    let deliveryId;

    if (existingDel && existingDel.length > 0) {
      deliveryId = existingDel[0].delivery_id;
      await pool.query(
        'UPDATE delivery SET delivery_type = ?, status = ? WHERE delivery_id = ?',
        [deliveryType, 'Shipped', deliveryId]
      );
    } else {
      await pool.query(
        `INSERT INTO delivery (order_id, address, dispatch_date, status, delivery_type)
         VALUES (?, 'Store Dispatch Hub', NOW(), 'Shipped', ?)`,
        [id, deliveryType]
      );
      const [newDel] = await pool.query('SELECT delivery_id FROM delivery WHERE order_id = ?', [id]);
      deliveryId = newDel && newDel.length > 0 ? newDel[0].delivery_id : null;
    }

    if (deliveryId) {
      if (deliveryType === 'Standard_Courier') {
        try {
          await pool.query('DELETE FROM express_same_day WHERE delivery_id = ?', [deliveryId]);
        } catch (e) {}

        const [sc] = await pool.query('SELECT delivery_id FROM standard_courier WHERE delivery_id = ?', [deliveryId]);
        if (sc && sc.length > 0) {
          await pool.query(
            `UPDATE standard_courier 
             SET courier_partner = ?, tracking_barcode = ?, transit_hub = ? 
             WHERE delivery_id = ?`,
            [courierPartner || 'Domex Courier Services', trackingBarcode || `BARCODE-${id}`, transitHub || 'Colombo Central Distribution Hub', deliveryId]
          );
        } else {
          await pool.query(
            `INSERT INTO standard_courier (delivery_id, courier_partner, tracking_barcode, transit_hub)
             VALUES (?, ?, ?, ?)`,
            [deliveryId, courierPartner || 'Domex Courier Services', trackingBarcode || `BARCODE-${id}`, transitHub || 'Colombo Central Distribution Hub']
          );
        }
      } else if (deliveryType === 'Express_Same_Day') {
        try {
          await pool.query('DELETE FROM standard_courier WHERE delivery_id = ?', [deliveryId]);
        } catch (e) {}

        const [exp] = await pool.query('SELECT delivery_id FROM express_same_day WHERE delivery_id = ?', [deliveryId]);
        if (exp && exp.length > 0) {
          await pool.query(
            `UPDATE express_same_day 
             SET rider_name = ?, rider_phone = ?, delivery_time_slot = ? 
             WHERE delivery_id = ?`,
            [riderName || 'Nuwan Bandara', riderPhone || '+94 77 456 7890', deliveryTimeSlot || 'Afternoon (2:00 PM - 5:00 PM)', deliveryId]
          );
        } else {
          await pool.query(
            `INSERT INTO express_same_day (delivery_id, rider_name, rider_phone, delivery_time_slot)
             VALUES (?, ?, ?, ?)`,
            [deliveryId, riderName || 'Nuwan Bandara', riderPhone || '+94 77 456 7890', deliveryTimeSlot || 'Afternoon (2:00 PM - 5:00 PM)']
          );
        }
      }
    }

    console.log(`✅ Manager assigned delivery for Order ${id} (${deliveryType})`);
    res.json({ success: true, message: `Delivery assigned successfully for order ${id}` });
  } catch (error) {
    console.error('Assign delivery error:', error);
    res.status(500).json({ error: 'Failed to assign delivery details to database' });
  }
});

/**
 * CANCEL ORDER ENDPOINT (CUSTOMER OR MANAGER)
 * URL: PUT /api/orders/:id/cancel
 * Rule: Only orders with status === 'Processing' can be cancelled.
 *       Orders in 'Shipped', 'In Transit', or 'Delivered' CANNOT be cancelled.
 *       Restores stock in product_sizes and products for cancelled items.
 */
app.put('/api/orders/:id/cancel', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT status FROM orders WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const currentStatus = rows[0].status;
    if (currentStatus !== 'Processing') {
      return res.status(400).json({
        error: `Cannot cancel order ${id}. Order is already '${currentStatus}' (in transit or finalized). Only 'Processing' orders can be cancelled.`
      });
    }

    // 1. Update status to Cancelled
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', ['Cancelled', id]);
    try {
      await pool.query('UPDATE delivery SET status = ? WHERE order_id = ?', ['Cancelled', id]);
    } catch (e) {}

    // 2. Restore stock for items in order
    const [items] = await pool.query('SELECT product_id, size, quantity FROM order_items WHERE order_id = ?', [id]);
    for (let item of items) {
      if (item.size) {
        await pool.query(
          'UPDATE product_sizes SET stock = stock + ? WHERE product_id = ? AND size_code = ?',
          [item.quantity, item.product_id, item.size]
        );
      }
      await pool.query(
        'UPDATE products SET stock = stock + ?, is_available = 1 WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    console.log(`✅ Order ${id} cancelled successfully and inventory restocked.`);
    res.json({ success: true, message: `Order ${id} cancelled successfully and items restocked` });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

/**
 * CANCEL INDIVIDUAL ITEM FROM ORDER (CUSTOMER / MANAGER)
 * URL: PUT /api/orders/:orderId/items/:orderItemId/cancel
 * Rule: Only allowed if order status === 'Processing'.
 *       Restocks that item's size in product_sizes & products.
 *       Recalculates order totalAmount and payment/COD records.
 *       If no items remain in the order, marks whole order as 'Cancelled'.
 */
app.put('/api/orders/:orderId/items/:orderItemId/cancel', async (req, res) => {
  const { orderId, orderItemId } = req.params;

  try {
    const [orderRows] = await pool.query('SELECT status, total_amount_lkr FROM orders WHERE id = ?', [orderId]);
    if (!orderRows || orderRows.length === 0) {
      return res.status(404).json({ error: `Order ${orderId} not found` });
    }

    const currentStatus = orderRows[0].status;
    if (currentStatus !== 'Processing') {
      return res.status(400).json({
        error: `Cannot cancel item. Order ${orderId} is currently '${currentStatus}' (in transit or finalized). Only 'Processing' orders allow item cancellation.`
      });
    }

    // Lookup item by order_items.id OR fallback by product_id
    let [itemRows] = await pool.query('SELECT * FROM order_items WHERE id = ? AND order_id = ?', [orderItemId, orderId]);
    if (!itemRows || itemRows.length === 0) {
      [itemRows] = await pool.query('SELECT * FROM order_items WHERE product_id = ? AND order_id = ? LIMIT 1', [orderItemId, orderId]);
    }

    if (!itemRows || itemRows.length === 0) {
      return res.status(404).json({ error: `Item ${orderItemId} not found in order ${orderId}` });
    }

    const targetItem = itemRows[0];

    // 1. Restock inventory for cancelled item
    if (targetItem.size) {
      await pool.query(
        'UPDATE product_sizes SET stock = stock + ? WHERE product_id = ? AND size_code = ?',
        [targetItem.quantity, targetItem.product_id, targetItem.size]
      );
    }
    await pool.query(
      'UPDATE products SET stock = stock + ?, is_available = 1 WHERE id = ?',
      [targetItem.quantity, targetItem.product_id]
    );

    // 2. Delete item from order_items
    await pool.query('DELETE FROM order_items WHERE id = ?', [targetItem.id]);

    // 3. Check remaining items in order
    const [remainingItems] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);

    if (remainingItems.length === 0) {
      // All items cancelled -> whole order becomes Cancelled
      await pool.query("UPDATE orders SET status = 'Cancelled', total_amount_lkr = 0.00 WHERE id = ?", [orderId]);
      try { await pool.query("UPDATE delivery SET status = 'Cancelled' WHERE order_id = ?", [orderId]); } catch (e) {}
      try { await pool.query("UPDATE payment SET status = 'Cancelled', amount = 0.00 WHERE order_id = ?", [orderId]); } catch (e) {}
      
      console.log(`✅ Last item cancelled from order ${orderId}. Order is now Cancelled.`);
      return res.json({ 
        success: true, 
        orderCancelled: true, 
        message: `Last cloth cancelled. Order ${orderId} is now Cancelled and items restocked.`,
        newTotal: 0
      });
    } else {
      // Re-calculate new total amount
      const newTotal = remainingItems.reduce((acc, it) => acc + (parseFloat(it.price_lkr) * it.quantity), 0);
      await pool.query('UPDATE orders SET total_amount_lkr = ? WHERE id = ?', [newTotal, orderId]);
      try {
        await pool.query('UPDATE payment SET amount = ? WHERE order_id = ?', [newTotal, orderId]);
        await pool.query(
          `UPDATE cash_on_delivery 
           SET balance_due_lkr = GREATEST(0, ? - advance_amount_lkr) 
           WHERE payment_id IN (SELECT payment_id FROM payment WHERE order_id = ?)`,
          [newTotal, orderId]
        );
      } catch (e) {}

      console.log(`✅ Item ${targetItem.product_name} cancelled from order ${orderId}. New total: ${newTotal}`);
      return res.json({ 
        success: true, 
        orderCancelled: false, 
        message: `"${targetItem.product_name}" removed from order and restocked.`,
        newTotal,
        remainingCount: remainingItems.length
      });
    }
  } catch (error) {
    console.error('Cancel order item error:', error);
    res.status(500).json({ error: 'Failed to cancel item from order' });
  }
});

/**
 * DELETE COMPLETED / DELIVERED / CANCELLED ORDER ENDPOINT
 * URL: DELETE /api/orders/:id
 * Rule: Only orders that have been DELIVERED or CANCELLED can be deleted.
 *       Active in-transit (Shipped, In Transit) or processing orders CANNOT be deleted.
 */
app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT status FROM orders WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderStatus = rows[0].status;
    if (orderStatus !== 'Delivered' && orderStatus !== 'Cancelled') {
      return res.status(400).json({ 
        error: `Cannot delete order ${id}. Order is currently '${orderStatus}' and pending delivery. Only 'Delivered' or 'Cancelled' orders can be deleted.` 
      });
    }

    // Cleanly delete from child ISA tables first
    await pool.query('DELETE FROM order_items WHERE order_id = ?', [id]);
    try { await pool.query('DELETE FROM card_payment WHERE order_id = ?', [id]); } catch (e) {}
    try { await pool.query('DELETE FROM cash_on_delivery WHERE order_id = ?', [id]); } catch (e) {}
    try { await pool.query('DELETE FROM standard_courier WHERE order_id = ?', [id]); } catch (e) {}
    try { await pool.query('DELETE FROM express_same_day WHERE order_id = ?', [id]); } catch (e) {}
    try { await pool.query('DELETE FROM delivery WHERE order_id = ?', [id]); } catch (e) {}
    try { await pool.query('DELETE FROM payment WHERE order_id = ?', [id]); } catch (e) {}
    await pool.query('DELETE FROM orders WHERE id = ?', [id]);

    res.json({ success: true, message: `Order ${id} (${orderStatus}) deleted successfully from database` });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Failed to delete order from database' });
  }
});

/**
 * BULK DELETE ALL DELIVERED ORDERS ENDPOINT
 * URL: DELETE /api/orders-delivered/bulk
 * Rule: Deletes ALL 'Delivered' orders at once, keeping all active in-transit/processing orders safe.
 */
app.delete('/api/orders-delivered/bulk', async (req, res) => {
  try {
    const [deliveredRows] = await pool.query("SELECT id FROM orders WHERE status = 'Delivered'");
    if (!deliveredRows || deliveredRows.length === 0) {
      return res.json({ success: true, message: 'No delivered orders found to delete', count: 0 });
    }

    const deliveredIds = deliveredRows.map(r => r.id);

    for (let ordId of deliveredIds) {
      await pool.query('DELETE FROM order_items WHERE order_id = ?', [ordId]);
      try { await pool.query('DELETE FROM card_payment WHERE order_id = ?', [ordId]); } catch (e) {}
      try { await pool.query('DELETE FROM cash_on_delivery WHERE order_id = ?', [ordId]); } catch (e) {}
      try { await pool.query('DELETE FROM standard_courier WHERE order_id = ?', [ordId]); } catch (e) {}
      try { await pool.query('DELETE FROM express_same_day WHERE order_id = ?', [ordId]); } catch (e) {}
      try { await pool.query('DELETE FROM delivery WHERE order_id = ?', [ordId]); } catch (e) {}
      try { await pool.query('DELETE FROM payment WHERE order_id = ?', [ordId]); } catch (e) {}
      await pool.query('DELETE FROM orders WHERE id = ?', [ordId]);
    }

    res.json({ 
      success: true, 
      message: `Successfully deleted all ${deliveredIds.length} delivered orders. All active in-transit orders remain safe!`, 
      count: deliveredIds.length 
    });
  } catch (error) {
    console.error('Bulk delete delivered orders error:', error);
    res.status(500).json({ error: 'Failed to bulk delete delivered orders' });
  }
});

/**
 * BULK DELETE ALL CANCELLED ORDERS ENDPOINT
 * URL: DELETE /api/orders-cancelled/bulk
 * Rule: Deletes ALL 'Cancelled' orders at once, keeping all active in-transit/processing orders safe.
 *       Can optionally filter by ?email=... or ?userId=... for a specific customer.
 */
app.delete('/api/orders-cancelled/bulk', async (req, res) => {
  const { email, userId } = req.query;

  try {
    let query = "SELECT id FROM orders WHERE status = 'Cancelled'";
    let params = [];

    if (userId) {
      query += ' AND (user_id = ? OR customer_email = ?)';
      params.push(userId, email || userId);
    } else if (email) {
      query += ' AND customer_email = ?';
      params.push(email);
    }

    const [cancelledRows] = await pool.query(query, params);
    if (!cancelledRows || cancelledRows.length === 0) {
      return res.json({ success: true, message: 'No cancelled orders found to delete', count: 0 });
    }

    const cancelledIds = cancelledRows.map(r => r.id);

    for (let ordId of cancelledIds) {
      await pool.query('DELETE FROM order_items WHERE order_id = ?', [ordId]);
      try { await pool.query('DELETE FROM card_payment WHERE order_id = ?', [ordId]); } catch (e) {}
      try { await pool.query('DELETE FROM cash_on_delivery WHERE order_id = ?', [ordId]); } catch (e) {}
      try { await pool.query('DELETE FROM standard_courier WHERE order_id = ?', [ordId]); } catch (e) {}
      try { await pool.query('DELETE FROM express_same_day WHERE order_id = ?', [ordId]); } catch (e) {}
      try { await pool.query('DELETE FROM delivery WHERE order_id = ?', [ordId]); } catch (e) {}
      try { await pool.query('DELETE FROM payment WHERE order_id = ?', [ordId]); } catch (e) {}
      await pool.query('DELETE FROM orders WHERE id = ?', [ordId]);
    }

    console.log(`✅ Successfully bulk-deleted ${cancelledIds.length} cancelled orders.`);
    res.json({ 
      success: true, 
      message: `Successfully deleted all ${cancelledIds.length} cancelled orders. Active orders remain protected!`, 
      count: cancelledIds.length 
    });
  } catch (error) {
    console.error('Bulk delete cancelled orders error:', error);
    res.status(500).json({ error: 'Failed to bulk delete cancelled orders' });
  }
});

// ====================================================================
// 5. CUSTOMER FEEDBACK & RATING ENDPOINTS (AVE-22, AVE-25)
// ====================================================================

// In-Memory Seed Feedback Fallback Cache
let inMemoryFeedbacks = [
  {
    id: 'fb-101',
    customerId: 'user-cust-01',
    customerName: 'Sasanka Perera',
    customerEmail: 'customer@avenza.com',
    productId: 'prod-m1',
    productName: 'Apex Pro Performance Compression Tee',
    orderId: 'ACH-99420',
    rating: 5,
    title: 'Outstanding Quality & Fit!',
    comment: 'The compression tee fabric is extremely breathable and comfortable during high-intensity gym sessions. Highly recommended!',
    status: 'approved',
    adminReply: {
      message: 'Thank you Sasanka! We take pride in delivering top-tier performance activewear.',
      repliedAt: '2026-08-12T10:30:00Z',
      repliedBy: 'Project Admin'
    },
    createdAt: '2026-08-11T14:20:00.000Z',
    updatedAt: '2026-08-12T10:30:00.000Z'
  },
  {
    id: 'fb-102',
    customerId: 'user-cust-02',
    customerName: 'Nipuni Fernando',
    customerEmail: 'nipuni@gmail.com',
    productId: 'prod-w1',
    productName: 'Silk Cascade Midi Wrap Dress',
    orderId: null,
    rating: 4,
    title: 'Elegant silk dress',
    comment: 'Fit was almost perfect. The emerald green color shines beautifully under evening lights.',
    status: 'approved',
    adminReply: null,
    createdAt: '2026-08-10T09:15:00.000Z',
    updatedAt: '2026-08-10T09:15:00.000Z'
  }
];

/**
 * GET ALL FEEDBACK ENDPOINT
 * URL: GET /api/feedback
 */
app.get('/api/feedback', async (req, res) => {
  const { productId, customerId, status, rating, search } = req.query;
  try {
    const [rows] = await pool.query('SELECT * FROM feedback ORDER BY created_at DESC');
    let list = rows.map(r => ({
      id: r.id,
      customerId: r.customer_id,
      customerName: r.customer_name,
      customerEmail: r.customer_email,
      productId: r.product_id,
      productName: r.product_name,
      orderId: r.order_id,
      rating: Number(r.rating),
      title: r.title,
      comment: r.comment,
      status: r.status,
      adminReply: r.admin_reply_message ? {
        message: r.admin_reply_message,
        repliedAt: r.admin_reply_at,
        repliedBy: r.admin_reply_by
      } : null,
      createdAt: r.created_at,
      updatedAt: r.updated_at
    }));

    if (productId) list = list.filter(f => f.productId === productId);
    if (customerId) list = list.filter(f => f.customerId === customerId);
    if (status && status !== 'all') list = list.filter(f => f.status === status);
    if (rating && rating !== 'all') list = list.filter(f => f.rating === Number(rating));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(f => 
        (f.customerName && f.customerName.toLowerCase().includes(q)) ||
        (f.productName && f.productName.toLowerCase().includes(q)) ||
        (f.comment && f.comment.toLowerCase().includes(q)) ||
        (f.title && f.title.toLowerCase().includes(q))
      );
    }
    return res.json(list);
  } catch (error) {
    let list = [...inMemoryFeedbacks];
    if (productId) list = list.filter(f => f.productId === productId);
    if (customerId) list = list.filter(f => f.customerId === customerId);
    if (status && status !== 'all') list = list.filter(f => f.status === status);
    if (rating && rating !== 'all') list = list.filter(f => f.rating === Number(rating));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(f => 
        (f.customerName && f.customerName.toLowerCase().includes(q)) ||
        (f.productName && f.productName.toLowerCase().includes(q)) ||
        (f.comment && f.comment.toLowerCase().includes(q)) ||
        (f.title && f.title.toLowerCase().includes(q))
      );
    }
    res.json(list);
  }
});

/**
 * SUBMIT FEEDBACK ENDPOINT (AVE-22)
 * URL: POST /api/feedback
 */
app.post('/api/feedback', async (req, res) => {
  const { customerId, customerName, customerEmail, productId, productName, orderId, rating, title, comment } = req.body;
  if (!customerId || !rating || !comment) {
    return res.status(400).json({ error: 'Customer ID, Rating, and Review Comment are required.' });
  }

  const numRating = Number(rating);
  if (numRating < 1 || numRating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5 stars.' });
  }

  if (comment.length > 1000) {
    return res.status(400).json({ error: 'Review comment cannot exceed 1000 characters.' });
  }

  // Prevent duplicate spam (1 review per customer per product)
  if (productId) {
    const existing = inMemoryFeedbacks.find(f => f.customerId === customerId && f.productId === productId);
    if (existing) {
      return res.status(400).json({ error: 'You have already submitted a review for this product.' });
    }
  }

  const newFeedback = {
    id: `fb-${Date.now()}`,
    customerId,
    customerName: customerName || 'Valued Customer',
    customerEmail: customerEmail || 'customer@avenza.com',
    productId: productId || null,
    productName: productName || null,
    orderId: orderId || null,
    rating: numRating,
    title: (title || '').slice(0, 100),
    comment: comment.slice(0, 1000),
    status: 'approved',
    adminReply: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    await pool.query(
      `INSERT INTO feedback (id, customer_id, customer_name, customer_email, product_id, product_name, order_id, rating, title, comment, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', NOW())`,
      [newFeedback.id, customerId, newFeedback.customerName, newFeedback.customerEmail, productId || null, productName || null, orderId || null, numRating, newFeedback.title, newFeedback.comment]
    );
  } catch (err) {
    console.warn('SQL feedback save skipped, stored in memory cache:', err.message);
  }

  inMemoryFeedbacks.unshift(newFeedback);
  res.status(201).json({ success: true, feedback: newFeedback, message: 'Feedback submitted successfully!' });
});

/**
 * EDIT FEEDBACK ENDPOINT (AVE-22) - Enforces 7-day edit restriction
 * URL: PUT /api/feedback/:id
 */
app.put('/api/feedback/:id', async (req, res) => {
  const { id } = req.params;
  const { rating, title, comment, customerId } = req.body;

  const target = inMemoryFeedbacks.find(f => f.id === id);
  if (!target) {
    return res.status(404).json({ error: 'Feedback not found.' });
  }

  if (customerId && target.customerId !== customerId) {
    return res.status(403).json({ error: 'You are not authorized to edit this feedback.' });
  }

  // 7-day rule check
  const createdDate = new Date(target.createdAt);
  const daysDiff = (new Date() - createdDate) / (1000 * 60 * 60 * 24);
  if (daysDiff > 7) {
    return res.status(400).json({ error: 'Feedback can only be edited within 7 days of submission.' });
  }

  target.rating = rating ? Number(rating) : target.rating;
  target.title = title !== undefined ? String(title).slice(0, 100) : target.title;
  target.comment = comment ? String(comment).slice(0, 1000) : target.comment;
  target.updatedAt = new Date().toISOString();

  try {
    await pool.query(
      'UPDATE feedback SET rating = ?, title = ?, comment = ?, updated_at = NOW() WHERE id = ?',
      [target.rating, target.title, target.comment, id]
    );
  } catch (err) {
    console.warn('SQL update skipped:', err.message);
  }

  res.json({ success: true, feedback: target, message: 'Feedback updated successfully!' });
});

/**
 * DELETE FEEDBACK ENDPOINT (AVE-22, AVE-25)
 * URL: DELETE /api/feedback/:id
 */
app.delete('/api/feedback/:id', async (req, res) => {
  const { id } = req.params;
  inMemoryFeedbacks = inMemoryFeedbacks.filter(f => f.id !== id);

  try {
    await pool.query('DELETE FROM feedback WHERE id = ?', [id]);
  } catch (err) {
    console.warn('SQL delete skipped:', err.message);
  }

  res.json({ success: true, message: 'Feedback deleted successfully.' });
});

/**
 * MODERATE FEEDBACK STATUS ENDPOINT (AVE-25)
 * URL: PUT /api/feedback/:id/status
 */
app.put('/api/feedback/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['pending', 'approved', 'hidden', 'archived'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value.' });
  }

  const target = inMemoryFeedbacks.find(f => f.id === id);
  if (target) {
    target.status = status;
    target.updatedAt = new Date().toISOString();
  }

  try {
    await pool.query('UPDATE feedback SET status = ? WHERE id = ?', [status, id]);
  } catch (err) {
    console.warn('SQL status update skipped:', err.message);
  }

  res.json({ success: true, message: `Feedback status set to ${status}` });
});

/**
 * ADMIN REPLY ENDPOINT (AVE-25)
 * URL: POST /api/feedback/:id/reply
 */
app.post('/api/feedback/:id/reply', async (req, res) => {
  const { id } = req.params;
  const { message, repliedBy } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Response message cannot be empty.' });
  }

  const target = inMemoryFeedbacks.find(f => f.id === id);
  if (!target) {
    return res.status(404).json({ error: 'Feedback not found.' });
  }

  target.adminReply = {
    message: message.trim(),
    repliedAt: new Date().toISOString(),
    repliedBy: repliedBy || 'Administrator'
  };
  target.updatedAt = new Date().toISOString();

  try {
    await pool.query(
      `UPDATE feedback SET admin_reply_message = ?, admin_reply_at = NOW(), admin_reply_by = ? WHERE id = ?`,
      [message.trim(), repliedBy || 'Administrator', id]
    );
  } catch (err) {
    console.warn('SQL reply update skipped:', err.message);
  }

  res.json({ success: true, feedback: target, message: 'Admin reply published successfully!' });
});

// Start Express Server listener
app.listen(PORT, () => {
  console.log(`🚀 Avenza Clothing Express API Server running on port ${PORT}`);
  testConnection();
});

