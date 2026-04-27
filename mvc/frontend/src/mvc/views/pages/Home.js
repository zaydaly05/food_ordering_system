import { foods } from "../../models/data/foods";
import FoodCard from "../components/FoodCard";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <section className="max-w-6xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900">Delicious food, delivered fast</h1>
        <p className="mt-3 text-gray-600">Browse our menu and add your favorites to the cart.</p>
      </section>

      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Menu</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {foods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>
    </motion.main>
  );
}