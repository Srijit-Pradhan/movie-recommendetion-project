// Step 1: Hooks for functionality
import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// Step 2: Global state pawar jnno AuthContext import
import { AuthContext } from "../context/AuthContext";
import "./Auth.css";

const Login = () => {
  // Local state - form e ki type hochhe tao dekhar jonno ar store korar jwono
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // API theke bhul kono uttor asle error message print kora jabe
  const [isLoading, setIsLoading] = useState(false); // api dakar time a button ke disable rakhar jonno

  // Context theke user ar login function ta tule anchi
  const { login, user } = useContext(AuthContext);
  // page change korar rasta hocche useNavigate()
  const navigate = useNavigate();

  // Step 3: Jodi aage thekei user log in hoye thake, tahole login form a thakle hobena,
  // automatically Homepage ("/") a uriye debo. Eta componentDidMount er moto kaj korbe ba "user" state changes the.
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Step 4: Submit er function jate form theke post korar somoy page reload na hoy.
  const submitHandler = async (e) => {
    e.preventDefault(); // eta use na korlei full page refresh heye jeto submit button click korle
    setIsLoading(true);
    setError("");
    try {
      await login(email, password); // AuthContext er login function take call krlam API r kace jabe
      // Context e "user" update hoye gele amader upper e thaka useEffect automatically run heye amader "/"-a redirect kre dibo
    } catch (err) {
      // API call failed
      setError(err.response?.data?.message || "Failed to login");
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Welcome Back</h2>

        {/* Error thakle message block ta render korchi */}
        {error && <div className="error-message">{error}</div>}

        {/* Step 5: Amader form block jeta onSubmit er sathe function bind kora */}
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="input-field"
              placeholder="Enter email"
              value={email}
              // Email onchange onChange korle setEmail diye set hoccche
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
          {/* button disabled korchi state theikha thale, prevent double click */}
          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="auth-redirect">
          New to MoviFlex? <Link to="/register">Sign up now</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
