import { foods } from "../../data/foods";
import { motion } from "framer-motion";
import ImageWithFallback from "../../components/ImageWithFallback";

export default function Products() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {foods.map((p) => (
          <motion.div key={p.id} whileHover={{ y: -4 }} className="bg-white rounded shadow p-4">
            <ImageWithFallback src={p.image} alt={p.name} className="h-36 w-full object-cover rounded" />
            <div className="mt-2 flex justify-between items-center">
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-gray-500">${p.price}</div>
              </div>
              <button className="text-sm px-3 py-1 border rounded">Edit</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}