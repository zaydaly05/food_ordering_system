import { Link } from "react-router-dom";

export default function ProductDetail() {

  return (
    <div className="p-10 text-center">

      <h1 className="text-3xl font-bold mb-4">
        Product Details
      </h1>

      <p className="text-gray-600 mb-6">
        Products are now displayed inside restaurant menus.
      </p>

      <Link
        to="/restaurants"
        className="bg-orange-500 text-white px-6 py-3 rounded"
      >
        Browse Restaurants
      </Link>

    </div>
  );
}