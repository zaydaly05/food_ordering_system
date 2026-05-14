import { createContext, useContext } from "react";

const DeliveryContext = createContext();
export const useDelivery = () => useContext(DeliveryContext);

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

export const DeliveryProvider = ({ children }) => {

  // Create delivery (only works after payment is COMPLETED)
  const createDelivery = async (deliveryData) => {
    const response = await fetch(`${API_BASE_URL}/deliveries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(deliveryData),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to create delivery");
    }
    return response.json();
  };

  // Get delivery info for an order
  const getDeliveryByOrder = async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/deliveries/order/${orderId}`);
    if (!response.ok) throw new Error("Delivery not found");
    return response.json();
  };

  // Update delivery status
  const updateDeliveryStatus = async (deliveryId, status) => {
    const response = await fetch(
      `${API_BASE_URL}/deliveries/${deliveryId}/status?status=${status}`,
      { method: "PUT", headers: { "Content-Type": "application/json" } }
    );
    if (!response.ok) throw new Error("Failed to update delivery status");
    return response.json();
  };

  // Get all deliveries (admin)
  const getAllDeliveries = async () => {
    const response = await fetch(`${API_BASE_URL}/deliveries`);
    if (!response.ok) throw new Error("Failed to fetch deliveries");
    return response.json();
  };

  // Delete a delivery by ID
  const deleteDelivery = async (deliveryId) => {
    const response = await fetch(`${API_BASE_URL}/deliveries/${deliveryId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete delivery");
    return response.json();
  };

  return (
    <DeliveryContext.Provider
      value={{ createDelivery, getDeliveryByOrder, updateDeliveryStatus, getAllDeliveries, deleteDelivery }}
    >
      {children}
    </DeliveryContext.Provider>
  );
};