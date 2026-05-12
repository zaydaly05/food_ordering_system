import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const API = "http://localhost:8080/api/cart";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { isLoggedIn, user, openLogin } = useAuth();

  

  const loadCart = async () => {
    if (!user) return;

    try {
      const res = await fetch(`${API}/${user.id}`);
      const data = await res.json();

      setCart(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) loadCart();
  }, [user]);

 


  const addToCart = async (item) => {
    if (!isLoggedIn) {
      openLogin();
      toast.error("Please log in to add items to cart");
      return;
    }

    const productId = item.id || item._id;

    
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);

      if (existing) {
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [
        ...prev,
        {
          productId,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ];
    });

  
    try {
      await fetch(`${API}/${user.id}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          name: item.name,
          price: item.price,
          quantity: 1,
        }),
      });

    toast.success("Added to 🛒"); 
    } catch (err) {
      console.error(err);
      toast.error("Failed to add item to 🛒 ");
      loadCart(); 
    }
  };

  

  const updateQuantity = async (productId, change) => {
    // optimistic UI
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + change;

            if (newQty <= 0) return null;

            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean)
    );

    try {
      await fetch(
        `${API}/${user.id}/update/${productId}?change=${change}`,
        {
          method: "PUT",
        }
      );
    } catch (err) {
      console.error(err);
      loadCart(); 
    }
  };



  const removeFromCart = async (productId) => {
   
    setCart((prev) =>
      prev.filter((item) => item.productId !== productId)
    );

    try {
      await fetch(`${API}/${user.id}/item/${productId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error(err);
      loadCart();
    }
  };

  
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};