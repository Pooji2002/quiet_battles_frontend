
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("quietBattlesCart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem("quietBattlesCart", JSON.stringify(cartItems));
  }, [cartItems]);
const clearCart = () => {
  setCartItems([]);
};
const addToCart = (product, size) => {
  const cartProduct = {
    ...product,
    price: Number(product.price),
  };

  setCartItems((previousItems) => {
    const existingItem = previousItems.find(
      (item) => item.id === cartProduct.id && item.size === size
    );

    if (existingItem) {
      return previousItems.map((item) =>
        item.id === cartProduct.id && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [...previousItems, { ...cartProduct, size, quantity: 1 }];
  });
};

  const removeFromCart = (id, size) => {
    setCartItems((previousItems) =>
      previousItems.filter(
        (item) => !(item.id === id && item.size === size)
      )
    );
  };

  const updateQuantity = (id, size, quantity) => {
    if (quantity < 1) return;

    setCartItems((previousItems) =>
      previousItems.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        cartTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
