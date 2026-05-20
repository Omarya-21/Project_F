import db from '../config/db.js';

export const createOrder = async ({ userID, total_price, shipping_address, items, payment_method = 'Card' }) => {
  // Start order creation
  const [result] = await db.query(
    'INSERT INTO Orders (userID, total_price, shipping_address, status) VALUES (?, ?, ?, ?)',
    [userID, total_price, shipping_address, 'pending']
  );
  
  const orderID = result.insertId;

  // Insert all ordered items and decrement stock
  for (const item of items) {
    await db.query(
      'INSERT INTO Order_Item (orderID, productID, quantity, price) VALUES (?, ?, ?, ?)',
      [orderID, item.productID, item.quantity, item.price]
    );

    // Decrement stock in Products database
    await db.query(
      'UPDATE Products SET stock = MAX(0, stock - ?) WHERE productID = ?',
      [item.quantity, item.productID]
    );
  }

  // Create mock payment & shipment entries automatically for a fully integrated system
  try {
    const paymentStatus = payment_method === 'Cash on Delivery' ? 'Pending' : 'Paid';
    await db.query(
      'INSERT INTO Payment (orderID, payment_method, payment_status, payment_date) VALUES (?, ?, ?, NOW())',
      [orderID, payment_method, paymentStatus]
    );
    await db.query(
      'INSERT INTO Shipment (orderID, delivery_address, shipment_status) VALUES (?, ?, ?)',
      [orderID, shipping_address, 'Processing']
    );
  } catch (err) {
    console.error('Warning creating Payment/Shipment records:', err.message);
  }

  return orderID;
};

export const getOrdersByUserId = async (userID) => {
  const [orders] = await db.query(
    'SELECT * FROM Orders WHERE userID = ? ORDER BY order_date DESC',
    [userID]
  );

  // For each order, find its items
  for (const order of orders) {
    const [items] = await db.query(`
      SELECT oi.*, p.name, p.image_url as image, b.brand_name as brand
      FROM Order_Item oi
      JOIN Products p ON oi.productID = p.productID
      LEFT JOIN Brands b ON p.brandID = b.brandID
      WHERE oi.orderID = ?
    `, [order.orderID]);
    
    order.items = items;
  }

  return orders;
};

export const getAllOrders = async () => {
  const [orders] = await db.query(`
    SELECT o.*, u.name as user_name, u.email as user_email
    FROM Orders o
    JOIN Users u ON o.userID = u.userID
    ORDER BY o.order_date DESC
  `);

  for (const order of orders) {
    const [items] = await db.query(`
      SELECT oi.*, p.name, p.image_url as image, b.brand_name as brand
      FROM Order_Item oi
      JOIN Products p ON oi.productID = p.productID
      LEFT JOIN Brands b ON p.brandID = b.brandID
      WHERE oi.orderID = ?
    `, [order.orderID]);
    
    order.items = items;
  }

  return orders;
};

export const updateOrderStatus = async (orderID, status) => {
  await db.query(
    'UPDATE Orders SET status = ? WHERE orderID = ?',
    [status, orderID]
  );
  
  // Sync shipping if present
  try {
    const shipmentStatus = status === 'shipped' ? 'Shipped' : (status === 'delivered' ? 'Delivered' : 'Processing');
    await db.query(
      'UPDATE Shipment SET shipment_status = ? WHERE orderID = ?',
      [shipmentStatus, orderID]
    );
  } catch (err) {
    console.error('Warning updating Shipment status:', err.message);
  }
};

export const getDatabaseStats = async () => {
  const [userResult] = await db.query("SELECT COUNT(*) as count FROM Users WHERE role = 'user'");
  const [orderResult] = await db.query("SELECT COUNT(*) as count FROM Orders");
  const [activeOrderResult] = await db.query("SELECT COUNT(*) as count FROM Orders WHERE status IN ('pending', 'shipped')");
  const [shipmentResult] = await db.query("SELECT COUNT(*) as count FROM Shipment WHERE shipment_status = 'Delivered'");
  const [revenueResult] = await db.query("SELECT SUM(total_price) as total FROM Orders WHERE status != 'cancelled'");
  const [stockResult] = await db.query("SELECT COUNT(*) as count FROM Products WHERE stock < 5");

  return {
    totalUsers: userResult[0]?.count || 0,
    totalOrders: orderResult[0]?.count || 0,
    activeOrders: activeOrderResult[0]?.count || 0,
    deliveredShipments: shipmentResult[0]?.count || 0,
    totalRevenue: parseFloat(revenueResult[0]?.total || 0),
    stockAlerts: stockResult[0]?.count || 0
  };
};

