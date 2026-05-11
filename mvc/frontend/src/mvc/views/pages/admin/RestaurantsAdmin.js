import { useEffect, useState } from "react";

import {
  getAllRestaurants,
  addRestaurant,
  deleteRestaurant,
  updateRestaurant
} from "../../../models/context/RestaurantContext.js";

export default function RestaurantsAdmin() {

  const [restaurants, setRestaurants] = useState([]);

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    image: ""
  });

  const [editingId, setEditingId] = useState(null);

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

      await updateRestaurant(editingId, form);

    } else {

      await addRestaurant(form);

    }

    await loadRestaurants();

    setForm({
      name: "",
      address: "",
      phone: "",
      image: ""
    });

    setEditingId(null);

  } catch (err) {
    console.error(err);
  }
};
const handleDelete = async (id) => {
  try {

    await deleteRestaurant(id);

    await loadRestaurants();

  } catch (err) {
    console.error(err);
  }
};

const handleEdit = (restaurant) => {

  setEditingId(restaurant.id);

  setForm({
    name: restaurant.name,
    address: restaurant.address,
    phone: restaurant.phone,
    image: restaurant.image
  });
};
return (
  <div className="p-6 max-w-6xl mx-auto">

    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">
        Restaurant Management
      </h1>
    </div>

    <div className="bg-white p-6 rounded-lg shadow mb-8">

   <form
  onSubmit={handleSubmit}
  className="grid grid-cols-1 md:grid-cols-4 gap-4"
>
  
<input
  type="text"
  name="name"
  placeholder="Restaurant Name"
  value={form.name}
  onChange={handleChange}
  className="border p-3 rounded"
/>


<input
  type="text"
  name="image"
  placeholder="Image Name (example: pizza-hut.jpg)"
  value={form.image}
  onChange={handleChange}
  className="border p-3 rounded"
/>

   <input
  type="text"
  name="address"
  placeholder="Address"
  value={form.address}
  onChange={handleChange}
  className="border p-3 rounded"
/>

  <input
  type="text"
  name="phone"
  placeholder="Phone"
  value={form.phone}
  onChange={handleChange}
  className="border p-3 rounded"
/>

        <button
          type="submit"
          className="bg-orange-500 text-white rounded p-3 hover:bg-orange-600"
        >
          Add Restaurant
        </button>

      </form>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {restaurants.map((r) => (
        <div
          key={r.id}
          className="bg-white p-5 rounded-lg shadow"
        >
          <img
            src={r.image}
            alt={r.name}
            className="w-full h-48 object-cover rounded mb-4"
          />

          <h2 className="text-xl font-bold mb-2">
            {r.name}
          </h2>

          <p className="text-gray-600">
            {r.address}
          </p>

          <p className="text-gray-600 mb-4">
            {r.phone}
          </p>

          <div className="flex gap-2">

       <button
  onClick={() => handleEdit(r)}
  className="bg-blue-500 text-white px-4 py-2 rounded"
>
  Edit
</button>

      <button
  onClick={() => handleDelete(r.id)}
  className="bg-red-500 text-white px-4 py-2 rounded"
>
  Delete
</button>
          </div>

        </div>
      ))}

    </div>

  </div>
);
}