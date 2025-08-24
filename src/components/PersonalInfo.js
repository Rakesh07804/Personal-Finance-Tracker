import React, { useState, useEffect } from "react";
import "../css/personal.css";
export default function PersonalInfo({ setUser, setPage }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setForm(savedUser);
      setSaved(true); // show welcome message
    }
  }, []);

  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 20000);
      return () => clearTimeout(timer);
    }
  }, [saved]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email is invalid";
   if (!form.phone.trim()) {
  newErrors.phone = "Phone number is required";
} else if (!/^[9876]\d{9}$/.test(form.phone)) {
  newErrors.phone =
    "Phone number must be Valid";
}
    if (!form.dob) newErrors.dob = "Date of birth is required";
    else if (form.dob > today)
      newErrors.dob = "Date of birth cannot be in the future";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(form));
     setUser(form);         // ✅ pass user to App.js

    setSaved(true); // Optionally show a "Saved!" message
    // Do NOT call setPage here
    }
  };

  return (
    <div className="personal-page">
      <div className="personal-card">
        {saved && (
          <h2 className="welcome-msg">
            Hi, {form.name} 🤗 Welcome 🤜🤛
          </h2>
        )}
         {saved && (
    <div className="success">
      Personal information updated successfully!
    </div>
  )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={form.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              name="dob"
              id="dob"
              value={form.dob}
              onChange={handleChange}
            />
            {errors.dob && <span className="error">{errors.dob}</span>}
          </div>

          <button type="submit">Continue</button>
        </form>
      </div>
    </div>
  );
}
