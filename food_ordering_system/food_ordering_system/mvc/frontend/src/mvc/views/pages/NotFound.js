import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="p-12 text-center">
      <div className="inline-block bg-white p-8 rounded shadow">
        <h1 className="text-6xl font-extrabold text-orange-500">404</h1>
        <p className="mt-4 text-lg">We couldn't find that page.</p>
        <Link to="/" className="mt-6 inline-block text-orange-500">Back to home</Link>
      </div>
    </div>
  );
}
