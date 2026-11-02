
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { logout } from "./store/slices/userSlice";
import { clearCart } from "./store/slices/cardSlice";

import "./styles/App.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // GET USER FROM REDUX
  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector(
    (state) => state.user.isAuthenticated
  );

  const closeMenu = () => setOpen(false);

  // CLOSE MENU WHEN PAGE CHANGES
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // LOGOUT
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());

    closeMenu();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="logo">
        <Link to="/">🐾 Pawly</Link>
      </div>

      <div
        className="hamburger"
        onClick={() => setOpen(!open)}
      >
        ☰
      </div>

      <nav className={open ? "nav open" : "nav"}>

        {/* LANDING PAGE SECTIONS */}
        <a href="/#home" onClick={closeMenu}>
          Home
        </a>

        <a href="/#adopt" onClick={closeMenu}>
          Adopt
        </a>

        <a href="/#about" onClick={closeMenu}>
          About
        </a>

        {/* SEPARATE PAGES */}
        <Link to="/veterinary" onClick={closeMenu}>
          Veterinary
        </Link>

        <Link to="/petshop" onClick={closeMenu}>
          Pet Shop
        </Link>

        <Link to="/contact" onClick={closeMenu}>
          Contact
        </Link>

        {/* AUTHENTICATION */}
        {!isAuthenticated || !user?.token ? (
          <>
            <Link
              className="auth-btn login-btn"
              to="/login"
              onClick={closeMenu}
            >
              Log In
            </Link>

            <Link
              className="auth-btn signup-btn"
              to="/register"
              onClick={closeMenu}
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            {/* DASHBOARD */}
            <Link to="/dashboard" onClick={closeMenu}>
              Dashboard
            </Link>

            {/* USER MENU */}
            <div className="user-menu">
              <span className="user-name">
                👤 {user.name}
              </span>

              <div className="dropdown-menu">
                <Link
                  to="/profile/edit"
                  onClick={closeMenu}
                >
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
