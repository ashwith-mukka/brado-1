import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
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

  const addToCart = (product, qty) => {
    const item = {
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      stock: product.stock, // Updated from countInStock
      qty: Number(qty),
    };

    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x.product === item.product);
      if (existItem) {
        return prevItems.map((x) =>
          x.product === existItem.product ? { ...existItem, qty: Number(qty) } : x
        );
      } else {
        return [...prevItems, item];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((x) => x.product !== id));
  };

  const updateQuantity = (id, qty) => {
    setCartItems((prevItems) =>
      prevItems.map((x) =>
        x.product === id ? { ...x, qty: Number(qty) } : x
      )
    );
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

