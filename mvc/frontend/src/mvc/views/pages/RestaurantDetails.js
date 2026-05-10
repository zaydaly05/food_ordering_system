import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getMenuByRestaurant }
from "../../models/context/MenuitemContext";

export default function RestaurantDetails() {

  const { id } = useParams();

  const [foods, setFoods] = useState([]);

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

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}