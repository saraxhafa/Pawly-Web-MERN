import "../styles/App.css";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // frontend validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast.error("❌ Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://turbo-doodle-7v775r6479wg2p9px-5173.app.github.dev/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      toast.success("✅ Message sent successfully!");

      setFormData({
        fullName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-page">
      <div className="contact-overlay"></div>

      <div className="contact-header">
        <h1>Contact Pawly</h1>
        <p>
          Have questions about pet adoption, veterinary services,
          pet products, or foster care? Our team is here to help.
        </p>
      </div>

      <div className="contact-container">

        {/* LEFT */}
        <div className="contact-info">
          <h2>Get In Touch</h2>

          <div className="info-card">
            <FaMapMarkerAlt className="info-icon" />
            <div>
              <h3>Address</h3>
              <p>Tirana, Albania</p>
            </div>
          </div>

          <div className="info-card">
            <FaPhoneAlt className="info-icon" />
            <div>
              <h3>Phone</h3>
              <p>+355 69 123 4567</p>
            </div>
          </div>

          <div className="info-card">
            <FaEnvelope className="info-icon" />
            <div>
              <h3>Email</h3>
              <p>support@pawly.com</p>
            </div>
          </div>

          <div className="info-card">
            <FaClock className="info-icon" />
            <div>
              <h3>Working Hours</h3>
              <p>Monday - Sunday: 08:00 - 20:00</p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="contact-form">
          <h2>Send a Message</h2>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
            />

            <textarea
              rows="6"
              placeholder="Tell us how we can help..."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            />

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message 🐾"}
            </button>

          </form>
        </div>

      </div>

      <div className="map-container">
        <iframe
          title="Pawly Location"
          src="https://maps.google.com/maps?q=Tirana&t=&z=13&ie=UTF8&iwloc=&output=embed"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </section>
  );
}

export default Contact;