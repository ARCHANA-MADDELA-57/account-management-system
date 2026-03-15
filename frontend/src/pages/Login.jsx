import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {

      const res = await api.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");

    } catch (err) {

      setError(err.response?.data?.message || "Invalid email or password");

    }

  };

  return (

    <div>

      <h2>Login</h2>

      <form onSubmit={handleLogin}>

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

<button type="submit">Login</button>

      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p style={{ textAlign: "center", marginTop: "10px" }}>
        Don't have an account?
        <Link to="/signup"> Signup here</Link>
      </p>

    </div>

  );

}

export default Login;