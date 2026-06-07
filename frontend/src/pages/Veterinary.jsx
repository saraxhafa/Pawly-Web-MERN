import "../styles/App.css";

function Veterinary() {
  const services = [
    {
      icon: "🩺",
      title: "General Checkups",
      text: "Routine health examinations for pets of all ages.",
    },
    {
      icon: "💉",
      title: "Vaccinations",
      text: "Protect your pets with essential vaccines and boosters.",
    },
    {
      icon: "🦷",
      title: "Dental Care",
      text: "Full oral health care including cleaning and treatment.",
    },
    {
      icon: "🚑",
      title: "Emergency Care",
      text: "24/7 emergency medical support for urgent situations.",
    },
  ];

  const vets = [
    {
      name: "PetCare Clinic",
      address: "Rruga e Durrësit, Tirana",
      website: "www.petcare.al",
      phone: "+355 69 123 4567",
    },
    {
      name: "Happy Paws Vet",
      address: "Kashar, Tirana",
      website: "www.happypaws.al",
      phone: "+355 67 888 9999",
    },
    {
      name: "Animal Health Center",
      address: "Blloku, Tirana",
      website: "www.animalhealth.al",
      phone: "+355 68 222 1111",
    },
  ];

  return (
    <div className="vet-page">

      {/* HERO */}
      <section className="vet-hero">
        <div className="vet-hero-text">
          <h1>Trusted Veterinary Care</h1>
          <p>
            Professional healthcare for your pets with love, attention, and modern medical support.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="vet-services">
        <h2>Our Veterinary Services</h2>

        <div className="vet-grid">
          {services.map((item, i) => (
            <div className="vet-card" key={i}>
              <div className="icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🏥 VETERINARY BUSINESSES (NEW SECTION) */}
      <section className="vet-businesses">
        <h2>Veterinary Clinics Near You</h2>

        <div className="vet-grid">
          {vets.map((vet, i) => (
            <div className="vet-card" key={i}>
              <h3>{vet.name}</h3>

              <p>📍 {vet.address}</p>
              <p>🌐 {vet.website}</p>
              <p>📞 {vet.phone}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="vet-gallery">
        <h2>Care in Action</h2>

        <div className="gallery-grid">
          <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee" />
          <img src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97" />
          <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e" />
          <img src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1" />
        </div>
      </section>

    </div>
  );
}

export default Veterinary;