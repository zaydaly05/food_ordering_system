import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getMenuByRestaurant }
from "../../models/context/MenuitemContext";

import { useCart } from "../../models/context/CartContext";

export default function RestaurantDetails() {

  const { id } = useParams();

  const [foods, setFoods] = useState([]);

  const { addToCart } = useCart();

  useEffect(() => {

    const loadMenu = async () => {

      try {

        const data = await getMenuByRestaurant(id);

        setFoods(data);

      } catch (err) {
        console.error(err);
      }
    };

    loadMenu();

  }, [id]);

  const handleAddToCart = (food) => {

    addToCart(food);

    console.log("Added To Cart:", food);

  };

  return (

    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-8 capitalize">
        {id} Menu
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {foods.map((food) => (

          <div
            key={food.id}
            className="bg-white rounded-xl shadow overflow-hidden"
          >

            <img
              src={food.image}
              alt={food.name}
              className="w-full h-52 object-cover"
            />

            <div className="p-5">

              <h2 className="text-xl font-bold">
                {food.name}
              </h2>

              <p className="text-gray-600 mt-2">
                {food.description}
              </p>

              <p className="text-orange-500 font-bold mt-4">
                ${food.price}
              </p>

              <button
                onClick={() => handleAddToCart(food)}
                className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition duration-300"
              >
                Add To Cart
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}