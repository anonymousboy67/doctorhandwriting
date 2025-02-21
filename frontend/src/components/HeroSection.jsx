
import './HeroSection.css'; // Import the CSS file

const HeroSection = () => {
  return (
    <section className="hero">
      <h1>Welcome to Our Platform</h1>
      <p>Empower your creativity with seamless uploads and real-time camera access.</p>
      <img src="/public/medical.png" alt="Hero Image" />
      <button className="hero-button">Get Started</button>
    </section>
  );
};

export default HeroSection;
