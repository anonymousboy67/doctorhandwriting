import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Navbar() {
  return (
    <nav className="glassmorphism-bg p-6 shadow-lg">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Logo/Handwritten Text */}
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-[#3E4B59] text-4xl font-extrabold font-serif  glow-text">
            HandwritingDetection
          </h1>
        </motion.div>

        {/* Navbar Links */}
        <ul className="flex space-x-8 text-[#3E4B59] text-lg font-semibold">
          <li>
            <Link
              to="/"
              className="link hover:text-[#FFD700] transition-all duration-300"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/user-guide"
              className="link hover:text-[#FFD700] transition-all duration-300"
            >
              User Guide
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="link hover:text-[#FFD700] transition-all duration-300"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="link hover:text-[#FFD700] transition-all duration-300"
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
