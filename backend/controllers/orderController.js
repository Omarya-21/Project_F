import * as OrderModel from '../models/orderModel.js';

export const createOrder = async (req, res) => {
  const { total_price, shipping_address, items, payment_method } = req.body;
  const userID = req.user.id;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Cart items are required to place an order.' });
  }

  if (!shipping_address) {
    return res.status(400).json({ message: 'Shipping address is required.' });
  }

  try {
    const orderID = await OrderModel.createOrder({
      userID,
      total_price,
      shipping_address,
      items,
      payment_method
    });

    console.log(`✅ Order placed successfully: ID ${orderID} for user ${userID} using ${payment_method || 'Card'}`);
    res.status(201).json({ orderID, message: 'Order has been placed successfully!' });
  } catch (error) {
    console.error('❌ Order placement error:', error);
    res.status(500).json({ message: 'Failed to place order. Please try again.' });
  }
};

export const getMyOrders = async (req, res) => {
  const userID = req.user.id;
  try {
    const orders = await OrderModel.getOrdersByUserId(userID);
    res.json(orders);
  } catch (error) {
    console.error('❌ Fetching user orders error:', error);
    res.status(500).json({ message: 'Failed to fetch your orders.' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('❌ Fetching all orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { orderID } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status is required.' });
  }

  try {
    await OrderModel.updateOrderStatus(orderID, status);
    console.log(`✅ Order ID ${orderID} status updated to: ${status}`);
    res.json({ message: 'Order status updated successfully.' });
  } catch (error) {
    console.error('❌ Updating order status error:', error);
    res.status(500).json({ message: 'Failed to update order status.' });
  }
};

export const cancelOrder = async (req, res) => {
  const { orderID } = req.params;
  const userID = req.user.id;

  try {
    await OrderModel.cancelUserOrder(orderID, userID);
    console.log(`✅ User ID ${userID} successfully cancelled Order ID ${orderID}`);
    res.json({ message: 'Order has been successfully cancelled.' });
  } catch (error) {
    console.error('❌ Direct order cancellation error:', error);
    res.status(400).json({ message: error.message || 'Failed to cancel the order.' });
  }
};

export const getStats = async (req, res) => {
  try {
    const stats = await OrderModel.getDatabaseStats();
    res.json(stats);
  } catch (error) {
    console.error('❌ Fetching database stats error:', error);
    res.status(500).json({ message: 'Failed to retrieve stats.' });
  }
};

