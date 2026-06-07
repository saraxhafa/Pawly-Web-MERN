import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./styles/App.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");

    setUser(null);

    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="logo">
        <Link to="/">🐾 Pawly </Link>
      </div>

      <div
        className="hamburger"
        onClick={() => setOpen(!open)}
      >
        ☰
      </div>

      <nav className={open ? "nav open" : "nav"}>
        {/* Landing Page Sections */}
        <a href="/#home">Home</a>
        <a href="/#adopt">Adopt</a>
        <a href="/#about">About</a>

        {/* Separate Pages */}
        <Link to="/veterinary">Veterinary</Link>
        <Link to="/petshop">Pet Shop</Link>
        <Link to="/contact">Contact</Link>

      {!user ? (
  <>
    <Link className="auth-btn login-btn" to="/login">
      Log In
    </Link>

    <Link className="auth-btn signup-btn" to="/register">
      Sign Up
    </Link>
  </>
) : (
  <>
    <Link to="/dashboard">Dashboard</Link>

    <div className="user-menu">
      <span className="user-name">
        👤 {user.name}
      </span>

      <div className="dropdown-menu">
        <Link to="/profile/edit">
          Edit Profile
        </Link>

        <button className="delete-btn">
          Delete Account
        </button>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  </>
)}
      </nav>
    </header>
  );
}