import { useParams, Link } from "react-router-dom";
import { foods } from "../data/foods";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import ImageWithFallback from "../components/ImageWithFallback";

export default function ProductDetail() {
  const { id } = useParams();
  const item = foods.find((f) => String(f.id) === String(id));
  const { addToCart } = useCart();

  if (!item) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Link to="/" className="text-orange-500">Back to menu</Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <ImageWithFallback src={item.image} alt={item.name} className="rounded-lg w-full h-80 object-cover" />

      <div>
        <h1 className="text-3xl font-bold">{item.name}</h1>
        <p className="mt-3 text-gray-600">{item.description}</p>
        <div className="mt-4 text-2xl font-extrabold text-orange-500">${item.price}</div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => { addToCart(item); toast.success("Added to cart"); }}
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            Add to cart
          </button>

          <Link to="/checkout" className="px-4 py-2 border rounded">Checkout</Link>
        </div>
      </div>
    </div>
  );
}
