import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMenuByRestaurant } from "../../models/context/MenuitemContext";
import { useCart } from "../../models/context/CartContext";

export default function RestaurantDetails() {
  const { id } = useParams();
  const [foods, setFoods] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadMenu = async () => {
      const data = await getMenuByRestaurant(id);
      setFoods(data);
    };
    loadMenu();
  }, [id]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{id} Menu</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {foods.map((food) => (
          <div key={food.id} className="bg-white shadow rounded p-4">
            <img src={food.image} className="h-40 w-full object-cover" />
            <h2 className="font-bold mt-2">{food.name}</h2>
            <p>{food.description}</p>
            <p className="text-orange-500 font-bold">${food.price}</p>

            <button
              onClick={() => addToCart(food)}
              className="w-full mt-3 bg-orange-500 text-white py-2 rounded"
            >
              Add To Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}