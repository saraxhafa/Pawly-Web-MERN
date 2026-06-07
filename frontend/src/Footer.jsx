import "./styles/App.css";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaPaw,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Logo */}
        <div className="footer-column">
          <div className="footer-logo">
            <FaPaw />
            <span>Pawly</span>
          </div>

          <p>
            Connecting pets with loving homes through adoption,
            foster care, and trusted veterinary services.
          </p>
        </div>

        {/* Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>

          <a href="#">Home</a>
          <a href="#">Adopt</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>

        {/* Services */}
        <div className="footer-column">
          <h3>Services</h3>

          <a href="#">Pet Adoption</a>
          <a href="#">Foster Care</a>
          <a href="#">Veterinary Centers</a>
          <a href="#">Community Support</a>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h3>Contact</h3>

          <p>Email: support@pawly.com</p>
          <p>Phone: +355 69 123 4567</p>
          <p>Tirana, Albania</p>

          <div className="social-icons">
            <a href="#">
              <FaFacebookF />
            </a>

            <a href="#">
              <FaInstagram />
            </a>

            <a href="#">
              <FaTwitter />
            </a>

            <a href="#">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 Pawly. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;