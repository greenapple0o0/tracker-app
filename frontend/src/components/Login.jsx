import React, { useState } from "react";
import axios from "axios";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("Apple");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/login", { username, password });
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
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit">Login</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
