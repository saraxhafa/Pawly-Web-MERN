import { FaSignInAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { setUser } from "../store/slices/userSlice";
import { useLoginMutation } from "../store/api/userApi";

import "../styles/App1.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const user = useSelector((state) => state.user.user);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await login(formData).unwrap();

      dispatch(setUser(result));
      localStorage.setItem("user", JSON.stringify(result));

      toast.success(`Welcome ${result.name}`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.data?.message || "Login failed");
    }
  };
/*
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);*/

  return (
    <>
      <section className="heading">
        <h1>
          <FaSignInAlt /> Login
        </h1>
        <p>Login and start creating tasks</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
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

          <button className="btn btn-block" disabled={isLoading}>
            {isLoading ? "Please wait..." : "Login"}
          </button>
        </form>
      </section>
    </>
  );
};

export default Login;