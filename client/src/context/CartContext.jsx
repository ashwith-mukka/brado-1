import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({});

  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) setCartItems(JSON.parse(storedCart));

    const storedAddress = localStorage.getItem('shippingAddress');
    if (storedAddress) setShippingAddress(JSON.parse(storedAddress));
  }, []);

  const addToCart = (product, qty) => {
    const item = {
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      qty: Number(qty),
    };

    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x.product === item.product);
      let updatedItems;
      if (existItem) {
        updatedItems = prevItems.map((x) =>
          x.product === existItem.product ? item : x
        );
      } else {
        updatedItems = [...prevItems, item];
      }
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((x) => x.product !== id);
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const updateQuantity = (id, qty) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((x) =>
        x.product === id ? { ...x, qty: Number(qty) } : x
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const saveShippingAddress = (data) => {
    setShippingAddress(data);
    localStorage.setItem('shippingAddress', JSON.stringify(data));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
