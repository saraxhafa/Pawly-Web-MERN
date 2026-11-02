
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LandingPage from "./pages/LandingPage";
import PetShop from "./pages/PetShop";
import Veterinary from "./pages/Veterinary";
import Dashboard from "./pages/DashboardCrud";
import Contact from "./pages/Contact";
import Layout from "./Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EditProfile from "./pages/EditProfile";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/petshop" element={<PetShop />} />
          <Route path="/veterinary" element={<Veterinary />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Route>
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;
