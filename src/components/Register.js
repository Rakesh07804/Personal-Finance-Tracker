// src/components/Register.js
import React, { useState } from "react";
import "../css/login.css";

export default function Register({ setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone) =>
    /^\d{10}$/.test(phone);

  const validatePassword = (password) =>
    password.length >= 6;

  const today = new Date().toISOString().split("T")[0];


  const handleRegister = (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !dob || !password) {
      setError("All fields are required.");
      setSuccess("");
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid email format.");
      setSuccess("");
      return;
    }
     if (!phone.trim()) {
    setError("Phone number is required.");
    setSuccess("");
    return;
  } else if (!validatePhone(phone)) {
    setError("Phone number must be Valid");
    setSuccess("");
    return;
  }
  if (!dob) {
    setError("Date of birth is required.");
    setSuccess("");
    return;
  } else if (dob > today) {
    setError("Date of birth cannot be in the future.");
    setSuccess("");
    return;
  }
    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters.");
      setSuccess("");
      return;
    }
    const user = { name, email, phone, dob, password };
    localStorage.setItem("user", JSON.stringify(user));
    setSuccess("Registration successful! Please login.");
    setError("");
    setTimeout(() => setPage("login"), 1500);
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <h2 className="login-heading">Register</h2>
        <form onSubmit={handleRegister} className="login-form">
          <label htmlFor="name" className="login-label">Name</label>
          <input
            id="name"
            type="text"
            className="login-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="email" className="login-label">Email</label>
          <input
            id="email"
            type="email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="phone" className="login-label">Phone Number</label>
          <input
            id="phone"
            type="tel"
            className="login-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            maxLength={10}
            pattern="\d{10}"
            placeholder="10 digits"
          />
          <label htmlFor="dob" className="login-label">Date of Birth</label>
          <input
            id="dob"
            type="date"
            className="login-input"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
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
            minLength={6}
            placeholder="At least 6 characters"
          />
          <button type="submit" className="login-btn">Register</button>
        </form>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <div className="register-link">
          <span>Already have an account?</span>
          <button className="register-btn" onClick={() => setPage("login")}>Login</button>
        </div>
      </div>
    </div>
  );
}
