export const getMenuByRestaurant = async (restaurantId) => {

  const response = await fetch(
    `http://localhost:8080/menuitems/restaurant/${restaurantId}`
  );

  return await response.json();
};

export const getAllMenuItems = async () => {

  const response = await fetch(
    "http://localhost:8080/menuitems"
  );

  return await response.json();
};

export const addMenuItem = async (menuitem) => {

  const response = await fetch(
    "http://localhost:8080/menuitems",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(menuitem)
    }
  );

  return await response.json();
};

export const deleteMenuItem = async (id) => {

  await fetch(
    `http://localhost:8080/menuitems/${id}`,
    {
      method: "DELETE"
    }
  );
};

export const updateMenuItem = async (id, menuitem) => {

  const response = await fetch(
    `http://localhost:8080/menuitems/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(menuitem)
    }
  );

  return await response.json();
};