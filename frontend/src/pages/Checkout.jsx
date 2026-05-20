import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService';
import { ArrowLeft, CreditCard, ShieldCheck, ShoppingCart, Truck, CheckCircle } from 'lucide-react';

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  // Shipping details state
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Payment Method selection state
  const [paymentMethod, setPaymentMethod] = useState('Credit Card'); // 'Credit Card', 'PayPal', 'Cryptocurrency', 'Cash on Delivery'

  // Card details state (simulated)
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  if (!user) {
    return (
      <div className="pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-md bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-xl">
          <ShieldCheck size={50} className="text-blue-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider">Authentication Required</h2>
          <p className="text-gray-400 mb-8">
            You must be logged in in order to securely checkout. Save your PC builds in your personalized account!
          </p>
          <div className="space-y-4">
            <Link to="/login" className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all">
              Login to Account
            </Link>
            <Link to="/register" className="block w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-3 px-6 rounded-xl transition-all">
              Create an Account
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0 && !orderSuccess) {
    return (
      <div className="pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <ShoppingCart size={60} className="text-gray-700 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-white mb-4 uppercase">Cart is Empty</h2>
          <p className="text-gray-400 mb-8 max-w-sm">You haven't added any premium PC components to your cart yet.</p>
          <Link to="/products" className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all">
            Browse Parts
          </Link>
        </motion.div>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address || !city || !zipCode || !phoneNumber) {
      setError('Please fill in all shipping fields.');
      return;
    }

    setLoading(true);
    setError('');

    // Prepare full shipping address string
    const fullAddress = `${address}, ${city}, ${zipCode} | Phone: ${phoneNumber}`;

    // Map cart items format to match DB scheme
    const orderItems = cart.map(item => ({
      productID: item.id,
      quantity: item.quantity,
      price: item.price
    }));

    try {
      const result = await createOrder({
        total_price: subtotal,
        shipping_address: fullAddress,
        items: orderItems,
        payment_method: paymentMethod
      });

      setOrderSuccess(result.orderID);
      clearCart();
    } catch (err) {
      console.error("CO Order Fail:", err);
      setError(err.response?.data?.message || 'Failed to submit your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render Order Success Screen
  if (orderSuccess) {
    return (
      <div className="pt-32 pb-20 flex flex-col items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/25"
          >
            <CheckCircle size={40} />
          </motion.div>

          <h2 className="text-3xl font-black text-white mb-2 uppercase italic tracking-wide">ORDER PLACED!</h2>
          <p className="text-gray-400 mb-2">Thank you, {user.name}. Your PC builder squad has been notified!</p>
          <div className="bg-blue-600/5 border border-blue-500/20 py-3 px-4 rounded-xl text-blue-400 font-mono text-xs max-w-xs mx-auto mb-8">
            ORDER ID: #{orderSuccess}
          </div>

          <div className="space-y-4">
            <Link to="/orders" className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-all uppercase tracking-widest text-sm text-center">
              View Your Orders
            </Link>
            <Link to="/products" className="block w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-black py-4 rounded-xl transition-all uppercase tracking-widest text-sm text-center">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/cart" className="text-gray-500 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Secure Checkout</h1>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-2xl mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Forms area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Shipping Form */}
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl">
            <h3 className="text-xl font-black mb-6 text-white uppercase italic flex items-center gap-2 tracking-wide border-b border-gray-800 pb-3">
              <Truck size={20} className="text-blue-500" /> 1. Shipping Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Street Address</label>
                <input 
                  type="text" 
                  className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="123 Silicon Valley Road, Apt 4"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">City</label>
                  <input 
                    type="text" 
                    className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="San Francisco"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Zip Code</label>
                  <input 
                    type="text" 
                    className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="94016"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="+1 (555) 019-2834"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl">
            <h3 className="text-xl font-black mb-6 text-white uppercase italic flex items-center gap-2 tracking-wide border-b border-gray-800 pb-3">
              <CreditCard size={20} className="text-blue-500" /> 2. Select Payment Method
            </h3>
            
            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { id: 'Credit Card', name: 'Credit Card', desc: 'Secure card checkout' },
                { id: 'PayPal', name: 'PayPal', desc: 'Fast digital wallet' },
                { id: 'Cryptocurrency', name: 'Crypto Coin', desc: 'BTC / ETH wallet' },
                { id: 'Cash on Delivery', name: 'Cash on Delivery', desc: 'Pay at your door' },
              ].map((method) => {
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-600/10 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                        : 'bg-black/40 border-gray-800 text-gray-400 hover:border-gray-700 hover:bg-black/60'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-wider block mb-1">{method.name}</span>
                    <span className="text-[10px] text-gray-500 block leading-tight">{method.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* Conditional Form Render based on paymentMethod */}
            {paymentMethod === 'Credit Card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cardholder Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Jane Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Card Number</label>
                  <input 
                    type="text" 
                    maxLength="16"
                    className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono"
                    placeholder="4111222233334444"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Expiration Date</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY"
                      maxLength="5"
                      className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono align-middle"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CVV</label>
                    <input 
                      type="password" 
                      maxLength="3"
                      className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono"
                      placeholder="***"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'PayPal' && (
              <div className="p-6 bg-black/40 border border-gray-800 rounded-2xl text-center space-y-4">
                <div className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  PayPal Secured Integration
                </div>
                <p className="text-gray-400 text-sm">
                  Upon clicking <strong>Place Secure Order</strong>, you will be redirected to the secure PayPal gate to complete the transaction of <span className="text-white font-bold">${subtotal.toFixed(2)}</span>.
                </p>
              </div>
            )}

            {paymentMethod === 'Cryptocurrency' && (
              <div className="p-6 bg-black/40 border border-gray-800 rounded-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Awaiting Coin Deposit</span>
                </div>
                <p className="text-xs text-gray-400">
                  Send exactly the equivalent of <strong className="text-white">${subtotal.toFixed(2)}</strong> to either wallet below. Your hardware parts reservation will hold for 15 minutes.
                </p>
                <div className="space-y-2 font-mono text-xs">
                  <div className="bg-black p-3 rounded-lg border border-gray-900 flex justify-between">
                    <span className="text-gray-500">BTC API address:</span>
                    <span className="text-blue-500 selection:bg-blue-500/30">bc1qpc_builders_vault_xq99x7p</span>
                  </div>
                  <div className="bg-black p-3 rounded-lg border border-gray-900 flex justify-between">
                    <span className="text-gray-500">USDT (ERC20):</span>
                    <span className="text-blue-500 selection:bg-blue-500/30">0xPCNexusBuilders77fa733d</span>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'Cash on Delivery' && (
              <div className="p-6 bg-black/40 border border-gray-800 rounded-2xl text-center space-y-3">
                <p className="text-gray-300 text-sm font-bold">
                  🚚 No payment needed today. Pay cash at your door!
                </p>
                <p className="text-gray-400 text-xs">
                  An Omar's PC builder technician will contact you on the phone number <span className="text-white font-bold">{phoneNumber || '(phone listed above)'}</span> to confirm shipping coordinates before dispatching shipment.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Sidebar Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl sticky top-24">
            <h3 className="text-xl font-black mb-6 text-white uppercase italic tracking-wide border-b border-gray-800 pb-3">
              Order Summary
            </h3>
            
            {/* Products overview */}
            <div className="max-h-60 overflow-y-auto mb-6 pr-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between gap-4 text-sm pb-2 border-b border-gray-800/50">
                  <div className="truncate">
                    <span className="font-bold text-white text-xs block truncate">{item.name}</span>
                    <span className="text-gray-500 text-xs">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-bold text-gray-400 font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-gray-800 pt-4 mb-6">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Shipping</span>
                <span className="text-green-500 font-bold uppercase text-xs">Free Delivery</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-800">
                <span className="font-bold uppercase tracking-[0.1em] text-white">Total</span>
                <span className="text-2xl font-black text-blue-500 font-mono">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-black py-4 rounded-xl transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? 'Processing...' : 'Place Secure Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
