import { createContext, useContext } from "react";
import { useCallback } from "react";

const OrdersContext = createContext();
export const useOrders = () => useContext(OrdersContext);

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080/api/orders";

export const OrdersProvider = ({ children }) => {

  

  const createOrder = async (orderData) => {
  const response = await fetch(`${API_BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.log("ORDER ERROR:", errorText);
    throw new Error(errorText || "Failed to create order");
  }

  return await response.json();
};

  

 const getAllOrders = useCallback(async () => {
  const response = await fetch(`${API_BASE_URL}/all/orders`);
  if (!response.ok) throw new Error("Failed to fetch orders");
  return await response.json();
}, []);

 
  
const updateOrderStatus = async (orderId, newStatus) => {

  const response = await fetch(
    `${API_BASE_URL}/${orderId}/status?status=${newStatus}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    }
  );

  const text = await response.text(); 

  console.log("STATUS CODE:", response.status);
  console.log("BACKEND RESPONSE:", text);

  if (!response.ok) {
    throw new Error(text || "Failed to update order status");
  }

  return text ? JSON.parse(text) : null;
};

  
  

  const getUserOrders = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`);

    if (!response.ok) throw new Error("Failed to fetch user orders");

    return await response.json();
  };

  const deleteOrder = async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/${orderId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete order");
    }

    return true;
  };

  return (
    <OrdersContext.Provider
      value={{
        createOrder,
        getAllOrders,
        updateOrderStatus,
        getUserOrders,
        deleteOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};