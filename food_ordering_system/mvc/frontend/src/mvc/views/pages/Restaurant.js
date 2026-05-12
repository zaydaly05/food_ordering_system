import RestaurantSection from "../components/RestaurantSection";

export default function Restaurants() {

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto py-10">

        <h1 className="text-4xl font-bold text-center mb-10">
          Our Restaurants
        </h1>

        <RestaurantSection />

      </div>

    </div>
  );
}