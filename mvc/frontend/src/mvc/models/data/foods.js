import chickenCeaser from "../../../assets/chicken_ceaser.jpeg";
import burger from "../../../assets/classic burger.jpeg";
import cake from "../../../assets/cake.webp";
import marg from "../../../assets/marg_pizza.png";
import pancake from "../../../assets/pancake.webp";
import spicy from "../../../assets/spicy.webp";
import sushi from "../../../assets/sushi.webp";
import vegan from "../../../assets/vegan.webp";
export const foods = [
  {
    id: 1,
    name: "Classic Burger",
    price: 8,
    image: burger,
    description: "Beef patty, lettuce, tomato, special sauce",
    category: "Burgers"
  },
  {
    id: 2,
    name: "Margherita Pizza",
    price: 12,
    image: marg,
    description: "Fresh mozzarella, basil, tomato sauce",
    category: "Pizza"
  },
  {
    id: 3,
    name: "Chicken Caesar",
    price: 10,
    image: chickenCeaser,
    description: "Grilled chicken, romaine, parmesan",
    category: "Salads"
  },
  {
    id: 4,
    name: "Sushi Platter",
    price: 18,
    image: sushi,
    description: "Assorted nigiri and rolls",
    category: "Sushi"
  },
  {
    id: 5,
    name: "Vegan Bowl",
    price: 11,
    image: vegan,
    description: "Quinoa, roasted veg, tahini",
    category: "Vegan"
  },
  {
    id: 6,
    name: "Pancake Stack",
    price: 7,
    image: pancake,
    description: "Fluffy pancakes with syrup",
    category: "Breakfast"
  },
  {
    id: 7,
    name: "Spicy Ramen",
    price: 13,
    image: spicy,
    description: "Rich broth, noodles, chili oil",
    category: "Noodles"
  },
  {
    id: 8,
    name: "Chocolate Cake",
    price: 6,
    image: cake,
    description: "Decadent chocolate slice",
    category: "Dessert"
  }
];