export default function About() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">About Us</h1>
      <p className="mt-4 text-gray-600">At our food ordering app, we’re all about making great food easily accessible with just a few taps. We connect you to a wide variety of local restaurants, offering everything from everyday favorites to unique dishes, all delivered quickly and reliably. Our goal is to simplify your dining experience—whether you’re at home, at work, or on the go—by combining convenience, quality, and a smooth user experience in one place.
</p>

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
