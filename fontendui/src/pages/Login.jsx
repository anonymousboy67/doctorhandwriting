function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">🔐 Login</h1>
        <form className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          <button 
            type="submit" 
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-lg w-full font-semibold shadow-md hover:opacity-90 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;