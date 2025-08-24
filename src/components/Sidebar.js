// src/components/Sidebar.js
import React from "react";
import "../css/login.css";

export default function Sidebar({ setPage, handleLogout }) {
  return (
    <nav className="side-nav">
      <ul>
        <li onClick={() => setPage("personal")}>Personal Info</li>
        <li onClick={() => setPage("transactions")}>Finance</li>
        <li onClick={() => setPage("reports")}>Reports</li>
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </nav>
  );
}
