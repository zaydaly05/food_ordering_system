import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ImageWithFallback from "./ImageWithFallback";
import { useAuth } from "../context/AuthContext";

export default function FoodCard({ food }) {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl shadow p-4"
    >
      <Link to={`/product/${food.id}`}>
        <ImageWithFallback src={food.image} alt={food.name} className="rounded-lg h-40 w-full object-cover" />
      </Link>

      <h2 className="mt-2 font-bold">{food.name}</h2>
      <p className="text-sm text-gray-500">{food.description}</p>

      <div className="flex justify-between mt-2 items-center">
        <span className="text-orange-500 font-bold">${food.price}</span>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (!isLoggedIn) return toast.error("Please log in to order");
            addToCart(food);
            toast.success("Added to cart");
          }}
          className={`px-3 py-1 rounded ${isLoggedIn ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
        >
          {isLoggedIn ? "Add" : "Preview"}
        </motion.button>
      </div>
    </motion.div>
  );
}