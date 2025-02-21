export default function AboutPage() {
  const teamMembers = [
    { name: "Aashish Adhikari", role: "Frontend and Backend" },
    { name: "Kusum Kunwar", role: "Lead Developer" },
    { name: "Kusum Bist", role: "UI/UX Designer" },
    { name: "Abiral Chaudary", role: "AI & Python Model" },
    {name:"Mirage Shrestha", role:"Dataset"}
  ];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-16">
      <h2 className="text-4xl font-extrabold mb-10 drop-shadow-lg">👥 Our Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white text-gray-800 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <h3 className="text-2xl font-semibold">{member.name}</h3>
            <p className="mt-2 text-center text-gray-600">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
