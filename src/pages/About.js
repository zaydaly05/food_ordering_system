export default function About() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">About FoodApp</h1>
      <p className="mt-4 text-gray-600">We are a small team passionate about food and fast delivery. Our chefs prepare meals daily with fresh ingredients. We partner with local suppliers to bring you diverse flavors and reliable service.</p>

      <section className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="font-semibold">Our Values</h2>
        <ul className="mt-3 list-disc list-inside text-gray-600">
          <li>Quality ingredients</li>
          <li>Fast delivery</li>
          <li>Friendly customer service</li>
        </ul>
      </section>
    </div>
  );
}
