
import Home from "../sections/Home";
import About from "../sections/About";
import SectionAdopt from "../sections/SectionAdopt";
import VeterinarySection from "../sections/VeterinarySection";

function LandingPage() {
  return (
    <>

      <section id="home">
        <Home />
      </section>

      <section id="adopt">
        <SectionAdopt />
      </section>

      <section id="about">
        <About />
      </section>

      <section id="veterinary">
        <VeterinarySection />
      </section>

    </>
  );
}

export default LandingPage;