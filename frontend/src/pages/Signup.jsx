import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Signup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {

      await api.post("/auth/signup", {
        name,
        email,
        password
      });

      setSuccess("Signup successful! Please login.");

      setName("");
      setEmail("");
      setPassword("");

    } catch (err) {

      setError(err.response?.data?.message || "Signup failed");

    }

  };

  return (

    <div>

      <h2>Signup</h2>

      <form onSubmit={handleSignup}>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
        type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Signup</button>

      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <p style={{ textAlign: "center", marginTop: "10px" }}>
        Already have an account?
        <Link to="/login"> Login here</Link>
      </p>

    </div>

  );

}

export default Signup;