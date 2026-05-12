


const BASE_URL = "http://localhost:8080/api/restaurants";

// GET ALL
export const getAllRestaurants = async () => {
  const response = await fetch(BASE_URL + "/all");

  if (!response.ok) {
    throw new Error("Failed to fetch restaurants");
  }

  return response.json();
};

export const getRestaurantById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch restaurant");
  }

  return response.json();
};

// ADD
export const addRestaurant = async (data) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("Failed to add restaurant");
  }

  return response.json();
};

// DELETE
export const deleteRestaurant = async (id) => {
  const response = await fetch(BASE_URL + "/" + id, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("Failed to delete restaurant");
  }
};

// UPDATE
export const updateRestaurant = async (id, data) => {
  const response = await fetch(BASE_URL + "/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("Failed to update restaurant");
  }

  return response.json();
};
