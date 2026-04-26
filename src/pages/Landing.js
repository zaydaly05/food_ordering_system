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

  const extraImages = [
    "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?q=80&w=1600&auto=format&fit=crop",
  ];

  const images = [...baseImages, ...extraImages, ...baseImages];

  // 🔥 NEW: backend status
  const [backendStatus, setBackendStatus] = React.useState("checking");

  React.useEffect(() => {
    fetch("http://localhost:8080/api/test")
      .then((res) => res.text())
      .then(() => setBackendStatus("online"))
      .catch(() => setBackendStatus("offline"));
  }, []);

  return (
    <main className="p-6 max-w-6xl mx-auto">

      {/* 🔥 BACKEND STATUS BOX */}
      <div className="mb-4 p-3 rounded text-center font-bold text-white">
        {backendStatus === "online" && (
          <div className="bg-green-500 p-2 rounded">🟢 Backend Connected</div>
        )}

        {backendStatus === "offline" && (
          <div className="bg-red-500 p-2 rounded">🔴 Backend Not Connected</div>
        )}

        {backendStatus === "checking" && (
          <div className="bg-gray-500 p-2 rounded">⏳ Checking Backend...</div>
        )}
      </div>

      <section className="hero-animated p-6 rounded-lg mb-8">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="p-4">
            <h1 className="text-4xl font-extrabold text-slate-900">
              Welcome to FoodApp
            </h1>
            <p className="mt-4 text-slate-800">
              Fresh, delicious meals prepared with care.
            </p>

            <div className="mt-6 flex gap-3">
              <Link to="/menu" className="bg-orange-500 text-white px-4 py-2 rounded">
                View Menu
              </Link>
              <Link to="/about" className="px-4 py-2 border rounded">
                About Us
              </Link>
            </div>
          </div>

          <div className="p-4">
            <Slider images={images} />
          </div>
        </div>
      </section>
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-3">Why Choose Us?</h2>
        <p className="text-gray-700 mb-6">
          We use only the freshest ingredients, sourced locally whenever possible. Our chefs are passionate about creating delicious meals that satisfy every craving. With fast delivery and excellent customer service, we make ordering food easy and enjoyable.
        </p>
      </section>

    </main>
  );
}