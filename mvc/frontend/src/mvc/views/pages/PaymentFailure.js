import { useNavigate } from "react-router-dom";

export default function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 mt-10">
        <div className="text-5xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-red-700 mb-2">Payment Failed</h1>
        <p className="text-red-500 mb-6">
          Something went wrong while processing your payment. Please try again.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl font-semibold transition"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/menu")}
            className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50 py-2 rounded-xl font-semibold transition"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}