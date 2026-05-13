import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../models/context/AuthContext";
import HeroImageSlider from "../components/HeroImageSlider";
import { heroSliderImages } from "../../../assets/slider/sliderImages";



export default function Landing() {

  const [backendStatus, setBackendStatus] = React.useState("checking");
  const { user } = useAuth();
  const isCustomer = user?.role === "CUSTOMER";

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

      <section className="hero-animated relative overflow-hidden p-6 rounded-lg mb-8 bg-gradient-to-r from-orange-100 via-orange-50 to-white">

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M30 5l5 15h15l-12 9 5 15-13-10-13 10 5-15-12-9h15z' fill='%230a1629'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative grid md:grid-cols-2 gap-8 items-center">

          <div className="p-2 md:p-4">

            <h1 className="text-4xl font-extrabold text-[#0a1629]">
              Welcome to FoodApp
            </h1>

            <p className="mt-4 text-slate-600">
              Fresh, delicious meals prepared with care.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">

              {isCustomer && (
                <Link
                  to="/restaurants"
                  className="rounded-lg bg-[#f57c24] px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-[#e56d18]"
                >
                  View Restaurants
                </Link>
              )}

              <Link
                to="/about"
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                About Us
              </Link>

            </div>

          </div>

          <HeroImageSlider slides={heroSliderImages} intervalMs={3000} />

        </div>

      </section>

      

      <section
      className="text-center bg-cover bg-center bg-no-repeat py-16 px-6 rounded-lg"
      
    >
      <div className="bg-black/50 p-6 rounded-lg text-white">
        <h2 className="text-2xl font-bold mb-3">
          Why Choose Us?
        </h2>

        <p className="mb-6">
          We use only the freshest ingredients, sourced locally whenever possible.
          Our chefs are passionate about creating delicious meals that satisfy
          every craving.
        </p>
      </div>
    </section>
    </main>
  );
}