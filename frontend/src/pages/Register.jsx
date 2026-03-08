// Step 1: Hooks o Router theke dorkari jinis import korlam
import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Auth.css";

const Register = () => {
  // Step 2: Form er input filter gulo state a save rakhar jonno
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // jodi backend theke kono error ase
  const [isLoading, setIsLoading] = useState(false);

  // AuthContext theke register function ar current user ke ber kore niye atsam
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Step 3: Jodi aage thkei user login kora thake, auto home e return kore dibo
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  // Step 4: Register button a click korar por eta cholbe
  const submitHandler = async (e) => {
    e.preventDefault(); // Default Page reload bondho kora
    setError("");

    // Step 5: Frontend thekei ekta logic dewa - jodi duto password na mele
    if (password !== confirmPassword) {
      return setError("Passwords do not match (Password duto ek hoche na)");
    }

    setIsLoading(true); // Loading on krlam jate next click nite na pare (disable thaake)
    try {
      // AuthContext er func ke data pathalam
      await register(name, email, password);
    } catch (err) {
      // Backend jodi na boley tahole ei error dekhabo
      setError(err.response?.data?.message || "Failed to register");
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>
        {/* Error asle lal rong e message ta uproe display koro */}
        {error && <div className="error-message">{error}</div>}

        {/* Form body */}
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="input-field"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        {/* Ekta small link - already account thakle login e jabe */}
        <div className="auth-redirect">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
