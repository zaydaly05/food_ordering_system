import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { isLoggedIn, openLogin } = useAuth();

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 8eb1c3758e122880a8b5d9a3e62fe8fa3e49870f
  const addToCart = (item) => {
    if (!isLoggedIn) {
      openLogin();
      toast.error("Please log in to add items to cart");
      return;
    }
    setCart(prev => [...prev, item]);
  };
<<<<<<< HEAD
=======
 const addToCart = (item) => {
  if (!isLoggedIn) {
    openLogin();
    toast.error("Please log in to add items to cart");
    return;
  }

  setCart((prev) => {
    const existingItem = prev.find((it) => it.id === item.id);

    if (existingItem) {
      return prev.map((it) =>
        it.id === item.id
          ? { ...it, quantity: (it.quantity || 1) + 1 }
          : it
      );
    }

    return [...prev, { ...item, quantity: 1 }];
  });
};
>>>>>>> 5a4c7ba0 (initial commit)
=======
>>>>>>> 8eb1c3758e122880a8b5d9a3e62fe8fa3e49870f

  const removeFromCart = (id) => {
    setCart(prev => prev.filter((it) => it.id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};