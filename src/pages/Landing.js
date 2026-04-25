import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { foods } from "../data/foods";
import { Link } from "react-router-dom";

function Slider({ images }) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % images.length), 3500);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div className="relative w-full h-72 md:h-96 overflow-hidden rounded-lg">
      <AnimatePresence>
        <motion.img
          key={`${images[index]}-${index}`}
          src={images[index]}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.8 }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>
    </div>
  );
}

export default function Landing() {
  const baseImages = foods.map((f) => f.image);
  // add a few extra hero images and repeat the pattern to make the slider feel longer
  const extraImages = [
    "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=1",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=2",
    "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=3",
  ];

  const images = [...baseImages, ...extraImages, ...baseImages];

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <section className="hero-animated p-6 rounded-lg mb-8">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="p-4">
            <h1 className="text-4xl font-extrabold text-slate-900">Welcome to FoodApp</h1>
            <p className="mt-4 text-slate-800">Fresh, delicious meals prepared with care. Browse our menu and place orders quickly — sign in to order.</p>

            <div className="mt-6 flex gap-3">
              <Link to="/menu" className="bg-orange-500 text-white px-4 py-2 rounded">View Menu</Link>
              <Link to="/about" className="px-4 py-2 border rounded"> About Us</Link>
            </div>
          </div>

          <div className="p-4">
            <div className="bg-white/40 backdrop-blur-sm p-2 rounded shadow-sm">
              <Slider images={images} />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold">Mission & Vision</h2>
        <p className="mt-3 text-gray-600">Our mission is to connect people with great local food while supporting neighborhood kitchens. We deliver fresh, affordable meals quickly and sustainably. Our vision is to become the most trusted food delivery service, prioritizing quality, community, and convenience for every customer.</p>
      </section>
    </main>
  );
}
