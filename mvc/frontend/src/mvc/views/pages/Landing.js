import React from "react";
import { Link } from "react-router-dom";
import RestaurantSection from "../components/RestaurantSection";

export default function Landing() {

  const [backendStatus, setBackendStatus] = React.useState("checking");

  React.useEffect(() => {
    fetch("http://localhost:8080/api/test")
      .then((res) => res.text())
      .then(() => setBackendStatus("online"))
      .catch(() => setBackendStatus("offline"));
  }, []);

  return (
    <main className="p-6 max-w-6xl mx-auto">

      <div className="mb-4 p-3 rounded text-center font-bold text-white">

        {backendStatus === "online" && (
          <div className="bg-green-500 p-2 rounded">
            🟢 Backend Connected
          </div>
        )}

        {backendStatus === "offline" && (
          <div className="bg-red-500 p-2 rounded">
            🔴 Backend Not Connected
          </div>
        )}

        {backendStatus === "checking" && (
          <div className="bg-gray-500 p-2 rounded">
            ⏳ Checking Backend...
          </div>
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

              <Link
                to="/menu"
                className="bg-orange-500 text-white px-4 py-2 rounded"
              >
                View Menu
              </Link>

              <Link
                to="/about"
                className="px-4 py-2 border rounded"
              >
                About Us
              </Link>

            </div>

          </div>

        </div>

      </section>

      <RestaurantSection />

      <section className="text-center">

        <h2 className="text-2xl font-bold mb-3">
          Why Choose Us?
        </h2>

        <p className="text-gray-700 mb-6">
          We use only the freshest ingredients, sourced locally whenever possible.
          Our chefs are passionate about creating delicious meals that satisfy
          every craving.
        </p>

      </section>

    </main>
  );
}