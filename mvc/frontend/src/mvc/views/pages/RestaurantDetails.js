import { useParams } from "react-router-dom";

export default function RestaurantDetails() {

  const { id } = useParams();

  return (
    <div className="p-10">

      <h1 className="text-4xl font-bold">
        Restaurant Details
      </h1>

      <p className="mt-4 text-gray-600">
        Restaurant ID: {id}
      </p>

    </div>
  );
}