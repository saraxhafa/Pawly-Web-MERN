import "../styles/App.css";

function AdoptSection() {
  const services = [
    {
      icon: "🐶",
      title: "Pet Adoption",
      text: "Find pets from shelters and individuals looking for a loving forever home."
    },
    {
      icon: "🏡",
      title: "Temporary Foster Care",
      text: "Provide a safe and caring temporary home until pets find permanent families."
    },
    {
      icon: "❤️",
      title: "Permanent Adoption",
      text: "Give pets a second chance with a stable and loving lifelong family."
    },
    {
      icon: "🌳",
      title: "Outdoor Activities",
      text: "Discover pet-friendly parks and open spaces to enjoy quality time with your companion."
    }
  ];

  return (
    <section className="adopt-section">
      <div className="adopt-header">
        <span className="section-tag">🐾 Adopt & Care</span>

        <h2>
          More Than Adoption – A Community for Pets and People
        </h2>

        <p>
          Pawly connects shelters, rescue centers, and individuals to create
          better opportunities for pets. Whether you're looking to adopt,
          foster, volunteer, or simply spend time with animals, our community
          makes it easier to help pets live happier lives.
        </p>
      </div>

      <div className="adopt-grid">
        {services.map((service, index) => (
          <div className="adopt-card" key={index}>
            <div className="adopt-icon">{service.icon}</div>

            <h3>{service.title}</h3>

            <p>{service.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdoptSection;