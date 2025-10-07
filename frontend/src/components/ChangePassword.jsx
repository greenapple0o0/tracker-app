// ChangePassword.jsx
import React, { useState } from "react";
import axios from "axios";

export default function ChangePassword({ username }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = async () => {
    try {
      const res = await axios.put("http://localhost:5000/change-password", {
        username,
        oldPassword,
        newPassword
      });
      setMessage(res.data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to change password");
    }
  };

  return (
    <div className="change-password">
      <h3>Change Password</h3>
      <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
      <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      <button onClick={handleChange}>Change Password</button>
      {message && <p>{message}</p>}
    </div>
  );
}
