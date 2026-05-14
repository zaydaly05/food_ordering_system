import { createContext, useContext } from "react";
import { useOrders } from "./OrdersContext";


const PaymentContext = createContext();
export const usePayment = () => useContext(PaymentContext);

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

export const PaymentProvider = ({ children }) => {
  const { updateOrderStatus } = useOrders();

  // Create a payment for a given order
  const createPayment = async (orderId, paymentMethod) => {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, paymentMethod }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to create payment");
    }
    return response.json();
  };

  // Get payment info for an order
  const getPaymentByOrder = async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/payments/order/${orderId}`);
    if (!response.ok) throw new Error("Payment not found");
    return response.json();
  };

  // Update payment status
  const updatePaymentStatus = async (paymentId, orderId, status) => {
    const response = await fetch(
      `${API_BASE_URL}/payments/${paymentId}/status?status=${status}`,
      { method: "PUT", headers: { "Content-Type": "application/json" } }
    );
     const payment = await response.json();

    // If payment completed -> confirm order
    if (status === "COMPLETED") {
      await updateOrderStatus(orderId, "CONFIRMED");
    }

    return payment;
  };

  // Get all payments (admin)
  const getAllPayments = async () => {
    const response = await fetch(`${API_BASE_URL}/payments`);
    if (!response.ok) throw new Error("Failed to fetch payments");
    return response.json();
  };

  const deletePayment = async (paymentId) => {
    const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to delete payment");
    }
    return response.json();
  };

  return (
    <PaymentContext.Provider
      value={{ createPayment, getPaymentByOrder, updatePaymentStatus, getAllPayments, deletePayment }}
    >
      {children}
    </PaymentContext.Provider>
  );
};