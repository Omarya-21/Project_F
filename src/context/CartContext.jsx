import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useAuth();

    const refreshCart = async () => {
        if (!user) {
            setCartItems([]);
            return;
        }
        try {
            const res = await api.get('/cart');
            setCartItems(res.data);
        } catch (err) {
            console.error('Failed to fetch cart');
        }
    };

    useEffect(() => {
        refreshCart();
    }, [user]);

    const addToCart = async (productId, quantity = 1) => {
        if (!user) {
            toast.error('Please login to add items to cart');
            return;
        }
        try {
            await api.post('/cart', { product_id: productId, quantity });
            await refreshCart();
            toast.success('Added to cart');
        } catch (err) {
            toast.error('Failed to add to cart');
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            await api.delete(`/cart/${cartItemId}`);
            await refreshCart();
            toast.success('Removed from cart');
        } catch (err) {
            toast.error('Failed to remove item');
        }
    };

    const updateQuantity = async (cartItemId, quantity) => {
        if (quantity < 1) return;
        try {
            await api.put(`/cart/${cartItemId}`, { quantity });
            await refreshCart();
        } catch (err) {
            toast.error('Failed to update quantity');
        }
    };

    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, refreshCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
};
