import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [shippingAddress, setShippingAddress] = useState(() => {
    const storedAddress = localStorage.getItem('shippingAddress');
    return storedAddress ? JSON.parse(storedAddress) : {
      fullName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
    };
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
  }, [shippingAddress]);

  // Sync cart with backend if user is logged in
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const { data } = await axios.get('cart');
          // Backend returns cart object with items array
          // We need to transform it to our local cartItems format
          const formattedItems = data.items.map(item => ({
            product: item.product?._id,
            name: item.product?.name,
            image: item.product?.image,
            price: item.product?.price,
            stock: item.product?.stock,
            qty: item.quantity
          })).filter(item => item.product); // Filter out any items where product is null
          setCartItems(formattedItems);
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      }
    };
    fetchCart();
  }, [user]);

  useEffect(() => {
    // Only save to localStorage if NOT logged in
    // If logged in, the state is already synced via APIs
    if (!user) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (product, qty) => {
    const item = {
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      stock: product.stock,
      qty: Number(qty),
    };

    if (user) {
      try {
        const { data } = await axios.post('cart', {
          productId: product._id,
          quantity: qty
        });
        
        // Re-format items from populated backend response
        const formattedItems = data.items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.image,
          price: item.product.price,
          stock: item.product.stock,
          qty: item.quantity
        }));
        setCartItems(formattedItems);
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else {
      setCartItems((prevItems) => {
        const existItem = prevItems.find((x) => x.product === item.product);
        if (existItem) {
          return prevItems.map((x) =>
            x.product === existItem.product 
              ? { ...existItem, qty: existItem.qty + Number(qty) } 
              : x
          );
        } else {
          return [...prevItems, item];
        }
      });
    }
  };

  const removeFromCart = async (id) => {
    if (user) {
      try {
        const { data } = await axios.delete(`cart/${id}`);
        const formattedItems = data.items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.image,
          price: item.product.price,
          stock: item.product.stock,
          qty: item.quantity
        }));
        setCartItems(formattedItems);
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    } else {
      setCartItems((prevItems) => prevItems.filter((x) => x.product !== id));
    }
  };

  const updateQuantity = async (id, qty) => {
    if (user) {
      try {
        const { data } = await axios.put(`cart/${id}`, { quantity: qty });
        const formattedItems = data.items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.image,
          price: item.product.price,
          stock: item.product.stock,
          qty: item.quantity
        }));
        setCartItems(formattedItems);
      } catch (error) {
        console.error('Error updating cart quantity:', error);
      }
    } else {
      setCartItems((prevItems) =>
        prevItems.map((x) =>
          x.product === id ? { ...x, qty: Number(qty) } : x
        )
      );
    }
  };

  const saveShippingAddress = (data) => {
    setShippingAddress(data);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  // Derived values
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const taxPrice = Number((0.05 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        shippingAddress,
        saveShippingAddress,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

