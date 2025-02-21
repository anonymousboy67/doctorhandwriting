const UserGuide = () => {
  const steps = [
    {
      title: "Launch App",
      description: "Open the app and navigate to the upload section.",
      icon: "🚀", // Replace with actual icon/image
    },
    {
      title: "Upload or Capture",
      description: "Select or capture an image of handwritten text.",
      icon: "📸",
    },
    {
      title: "Process",
      description: 'Click the "Press Button" to start recognition.',
      icon: "⚙️",
    },
    {
      title: "View & Save",
      description: "The app will analyze and display the recognized text. You can copy or save the output.",
      icon: "💾",
    },
  ];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-16">
      <h2 className="text-4xl font-extrabold mb-10 drop-shadow-lg">📖 User Guide</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white text-gray-800 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="text-5xl mb-4">{step.icon}</div>
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="mt-2 text-center text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UserGuide;
