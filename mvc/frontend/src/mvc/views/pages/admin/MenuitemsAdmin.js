import { useEffect, useState } from "react";

import {
  getAllMenuItems,
  addMenuItem,
  deleteMenuItem,
  updateMenuItem
} from "../../../models/context/MenuitemContext";
import { getAllRestaurants } from "../../../models/context/RestaurantContext";

export default function MenuitemsAdmin() {

  const [menuitems, setMenuitems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
    restaurantId: ""
  });

  useEffect(() => {
    loadMenuitems();
    loadRestaurants();
  }, []);

  const loadMenuitems = async () => {

    try {

      const data = await getAllMenuItems();

      setMenuitems(data);

    } catch (err) {
      console.error(err);
    }
  };

 const loadRestaurants = async () => {

  try {

    const data = await getAllRestaurants();

    console.log(data);

    setRestaurants(data);

  } catch (err) {

    console.error(err);
  }
};

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editingId) {

        await updateMenuItem(
          editingId,
          form
        );

        setEditingId(null);

      } else {

        await addMenuItem(form);
      }

      await loadMenuitems();

      setForm({
        name: "",
        price: "",
        description: "",
        image: "",
        category: "",
        restaurantId: ""
      });

    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {

    try {

      await deleteMenuItem(id);

      await loadMenuitems();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Menu Management
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
      >

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border p-3 rounded"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="border p-3 rounded"
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-3 rounded"
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="border p-3 rounded"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="border p-3 rounded"
        />

        <select
          name="restaurantId"
          value={form.restaurantId}
          onChange={handleChange}
          className="border p-3 rounded"
        >

        <option value="">
          Select Restaurant
        </option>
         {restaurants.map((restaurant, index) => (

        <option
          key={restaurant.id }
          value={restaurant.id}
        >
          {restaurant.name}
        </option>

))}
        </select>

        <button
          type="submit"
          className="bg-orange-500 text-white rounded p-3 hover:bg-orange-600"
        >
          {editingId ? "Update Menu Item" : "Add Menu Item"}
        </button>

      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {menuitems.map((item) => (

          <div
            key={item.id}
            className="bg-white rounded-xl shadow overflow-hidden"
          >

            <img
              src={item.image}
              alt={item.name}
              className="w-full h-52 object-cover"
            />

            <div className="p-5">

              <h2 className="text-xl font-bold">
                {item.name}
              </h2>

              <p className="text-gray-600 mt-2">
                {item.description}
              </p>

              <p className="text-orange-500 font-bold mt-4">
                {item.price} EGP
              </p>

              <div className="flex gap-2 mt-4">

                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>

                <button
                  onClick={() => {

                    setForm({
                      name: item.name,
                      price: item.price,
                      description: item.description,
                      image: item.image,
                      category: item.category,
                      restaurantId: item.restaurantId
                    });

                    setEditingId(item.id);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
