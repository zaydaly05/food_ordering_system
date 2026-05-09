import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAllRestaurants }
from "../../models/context/RestaurantContext.js";

export default function RestaurantSection() {

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {

      const data = await getAllRestaurants();

      setRestaurants(data);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="py-16 px-6">

      <div className="max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold mb-10 text-center">
          Featured Restaurants
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {restaurants.map((r) => (

            <Link
              to={`/restaurants/${r.id}`}
              key={r.id}
            >

              <div className="bg-white rounded-xl shadow overflow-hidden hover:shadow-xl transition">

                <img
                  src={r.image}
                  alt={r.name}
                  className="w-full h-52 object-cover"
                />

                <div className="p-5">

                  <h3 className="text-xl font-bold mb-2">
                    {r.name}
                  </h3>

                  <p className="text-gray-600">
                    {r.address}
                  </p>

                  <p className="text-gray-500 mt-2">
                    {r.phone}
                  </p>

                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </section>
  );
}