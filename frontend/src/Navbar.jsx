import { useState } from "react";
import "./App.css";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="logo">adopt.</div>

      <div className="hamburger" onClick={() => setOpen(!open)}>
        ☰
      </div>

      <nav className={open ? "nav open" : "nav"}>
        <a href="#" className="active">home</a>
        <a href="#">adopt</a>
        <a href="#">contact</a>
        <a href="#">about</a>
      </nav>
    </header>
  );
}

export default Navbar;