import "../styles/App.css";

function AboutSection() {
  return (
    <section className="about-section">
      <div className="about-container">

        <div className="about-left">
          <span className="about-tag">🐾 About Pawly</span>

          <h2>
            Connecting Pets with Loving Homes
          </h2>

          <p>
            Pawly is a community-driven platform that brings together
            animal shelters, rescue centers, and individuals who are looking
            to find safe and loving homes for pets. We believe every animal
            deserves care, companionship, and a second chance.
          </p>

          <p>
            Whether you're searching for a lifelong companion, offering
            temporary foster care, or looking for trusted veterinary services,
            Pawly helps create meaningful connections between people and pets.
          </p>

          <button className="about-btn">
            Explore Pets
          </button>
        </div>

        <div className="about-right">

          <div className="stat-card">
            <h3>500+</h3>
            <p>Pets Adopted</p>
          </div>

          <div className="stat-card">
            <h3>50+</h3>
            <p>Partner Shelters</p>
          </div>

          <div className="stat-card">
            <h3>200+</h3>
            <p>Community Members</p>
          </div>

          <div className="stat-card">
            <h3>24/7</h3>
            <p>Pet Support</p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default AboutSection;