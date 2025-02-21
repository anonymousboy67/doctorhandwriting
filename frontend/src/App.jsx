import HeroSection from "./components/HeroSection";
import OCRUploader from "./components/OCRUploader";
import Navbar from "./navbar";

const App = () => {
  return (
    <>
    <Navbar/>
      <HeroSection/>
      <OCRUploader/>
    </>
  );
};

export default App;
