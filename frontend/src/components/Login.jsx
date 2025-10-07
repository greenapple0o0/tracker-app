import React, { useState } from "react";
import axios from "axios";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("Apple");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Use environment variable for API URL, fallback to localhost for development
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Make POST request to /api/login route
      const res = await axios.post(`${API_URL}/api/login`, { username, password });
      onLogin(res.data.username);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <select value={username} onChange={(e) => setUsername(e.target.value)}>
            <option value="Apple">Apple</option>
            <option value="Banana">Banana</option>
          </select>
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Login</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
