import background from "../assets/images/background_pawly4.png";
import "../styles/App.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="content">
        <Link to="/contact" className="ask-btn">Ask question now →</Link>

        <div className="text-content">
          <h1>What you say?</h1>
          <p>Adopt, care and connect with pets.</p>
        </div>

        <div className="vertical-label">DOG ADOPTION 2026</div>
      </div>
    </section>
  );
}

export default Home;