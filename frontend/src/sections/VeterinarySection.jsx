import { Link } from "react-router-dom";
import veterinaryphoto1 from "../assets/images/veterinaryphoto1.jpg";
import "../styles/App.css";

function VeterinarySection() {
  return (
    <section
      className="vet-section"
      style={{ backgroundImage: `url(${veterinaryphoto1})` }}
    >
      <div className="vet-overlay">

        <h2>Trusted Veterinary Care</h2>

        <p>
          Professional healthcare for your pets with love and attention.
        </p>

        <Link to="/veterinary">
          <button className="vet-btn">View Veterinary Services</button>
        </Link>

      </div>
    </section>
  );
}

export default VeterinarySection;