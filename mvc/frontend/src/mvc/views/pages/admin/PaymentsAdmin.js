import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { usePayment } from "../../../models/context/PaymentContext";

export default function PaymentsAdmin() {
  const { getAllPayments, updatePaymentStatus, deletePayment } = usePayment();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllPayments();
        setPayments(data);
      } catch (err) {
        toast.error("Failed to load payments");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [getAllPayments]);

  const changeStatus = async (paymentId, newStatus) => {
    try {
      setSavingId(paymentId);
      await updatePaymentStatus(paymentId, newStatus);
      setPayments((prev) =>
        prev.map((p) => (p.id === paymentId ? { ...p, paymentStatus: newStatus } : p))
      );
      toast.success("Payment status updated");
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setSavingId(null);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    try {
      await deletePayment(paymentId);
      setPayments((prev) => prev.filter((p) => p.id !== paymentId));
      toast.success("Payment deleted");
    } catch (err) {
      toast.error("Failed to delete payment");
    }
  };

  const statusColor = (status) => {
    if (status === "COMPLETED") return "bg-green-100 text-green-700";
    if (status === "FAILED") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  if (loading) return <div className="p-6 text-gray-500">Loading payments...</div>;

 return (
  <div className="p-6 bg-gray-100 dark:bg-slate-950 min-h-screen">

    <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
      Payments
    </h1>

    {payments.length === 0 ? (
      <p className="text-gray-500 dark:text-gray-400">
        No payments found.
      </p>
    ) : (
      <div className="grid gap-4">

        {payments.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-gray-100 dark:border-slate-800 p-5"
          >

            <div className="flex justify-between items-start mb-3">

              <div>
                <h2 className="font-bold text-gray-800 dark:text-white">
                  Payment #{p.id?.slice(-8)}
                </h2>

                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  Order: #{p.orderId?.slice(-8)}
                </p>

                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {p.transactionDate
                    ? new Date(p.transactionDate).toLocaleString()
                    : ""}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(
                  p.paymentStatus
                )}`}
              >
                {p.paymentStatus}
              </span>

            </div>
            <div className="flex justify-between items-center border-t pt-3 border-gray-200 dark:border-slate-700">

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Method
                </p>

                <p className="font-medium text-gray-700 dark:text-gray-200">
                  {p.paymentMethod}
                </p>
              </div>
              <button
                onClick={() => handleDeletePayment(p.id)}
                className="text-red-500 hover:text-white hover:bg-red-500 border border-red-200 dark:border-red-900 px-3 py-1.5 rounded-lg transition-all duration-200 text-sm font-medium"
              >
                Delete
              </button>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Amount
                </p>

                <p className="text-xl font-bold text-orange-500">
                  {p.totalAmount?.toFixed(2)} EGP
                </p>
              </div>
              <select
                value={p.paymentStatus}
                disabled={savingId === p.id}
                onChange={(e) => changeStatus(p.id, e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-slate-700"
              >
                <option value="PENDING">PENDING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="FAILED">FAILED</option>
              </select>

            </div>

          </div>
        ))}

      </div>
    )}
  </div>
);
}