import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { setUser } from "../store/slices/userSlice";
import { useRegisterMutation } from "../store/api/userApi";

import "../styles/App1.css";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const result = await register(formData).unwrap();

      dispatch(setUser(result));
      localStorage.setItem("user", JSON.stringify(result));

      toast.success("Registration successful!");
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      <section className="heading">
        <h1>
          <FaUser /> Register
        </h1>
        <p>Please create an account</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={name}
              placeholder="Enter your name"
              onChange={onChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={onChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter password"
              onChange={onChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password2"
              value={password2}
              placeholder="Confirm password"
              onChange={onChange}
              className="form-control"
              required
            />
          </div>

          <button className="btn btn-block" disabled={isLoading}>
            {isLoading ? "Please wait..." : "Register"}
          </button>
        </form>
      </section>
    </>
  );
};

export default Register;