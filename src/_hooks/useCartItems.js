import { useState, useEffect } from 'react';
import { getCartItems } from '../_services/cart_items';

export const useCartItems = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const items = await getCartItems();
      setCartItems(items);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching cart items:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchCartItems();
  };

  return {
    cartItems,
    setCartItems,
    loading,
    error,
    refetch
  };
};