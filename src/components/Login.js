// src/components/Login.js


import React, { useState } from "react";
import "../css/login.css";

export default function Login({ setPage, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (savedUser && savedUser.email === email && savedUser.password === password) {
      localStorage.setItem("session", JSON.stringify(savedUser));
      setUser(savedUser);
      setPage("personal");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <h2 className="login-heading">Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <label htmlFor="email" className="login-label">Email</label>
          <input
            id="email"
            type="email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password" className="login-label">Password</label>
          <input
            id="password"
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">Login</button>
        </form>
        {error && <p className="error">{error}</p>}
        <div className="register-link">
          <span>Don't have an account?</span>
          <button className="register-btn" onClick={() => setPage("register")}>Register</button>
        </div>
      </div>
    </div>
  );
}
