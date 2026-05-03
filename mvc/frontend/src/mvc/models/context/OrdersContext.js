import { createContext, useContext } from "react";

const OrdersContext = createContext();

export const useOrders = () => useContext(OrdersContext);

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080/api/orders";

export const OrdersProvider = ({ children }) => {
   
    const getAllOrders = async () => {
    const response = await fetch(`${API_BASE_URL}/all/orders`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Failed to fetch orders");

    const orders = await response.json();
    return Array.isArray(orders) ? orders : [];
  };

  const UpdateOrderStatus = async (orderId, newStatus) => {
    const response = await fetch(`${API_BASE_URL}/${orderId}/status?status=${newStatus}`,
 {
      method: "PUT", 
      headers: { "Content-Type": "application/json" },
      
    });

    if (!response.ok) throw new Error("Failed to update order status");

    return await response.json();
  };
  
   const getUserOrders = async (userId) => {
    const response = await fetch(
      `${API_BASE_URL}/user/${userId}`
    );

    if (!response.ok) throw new Error("Failed to fetch user orders");

    return await response.json();
  };

  return (
    <OrdersContext.Provider
      value={{
        getAllOrders,
        UpdateOrderStatus,
        getUserOrders
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};
