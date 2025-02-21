
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Handwriting Converter</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/user-guide">User Guide</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li className='login-btn'><Link to="/login">Login/Signup</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;