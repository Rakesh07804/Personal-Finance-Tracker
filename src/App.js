// src/App.js
import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import PersonalInfo from "./components/PersonalInfo";
import Transaction from "./components/Transaction";
import Reports from "./components/Reports";
import Sidebar from "./components/Sidebar";

export default function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Load session
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("session"));
    if (saved) {
      setUser(saved);
      setPage("personal");
    }
  }, []);

  // Load transactions from localStorage on mount
  useEffect(() => {
    if (user && user.email) {
      const savedTx = JSON.parse(localStorage.getItem(`transactions_${user.email}`));
      if (Array.isArray(savedTx)) setTransactions(savedTx);
      else setTransactions([]);
    }
  }, [user]);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (user && user.email) {
      localStorage.setItem(`transactions_${user.email}`, JSON.stringify(transactions));
    }
  }, [transactions, user]);

  const handleLogout = () => {
    localStorage.removeItem("session");
    setUser(null);
    setPage("login");
  };

  return (
    <div className="app-container">
      {user && page !== "login" && page !== "register" && (
        <Sidebar setPage={setPage} handleLogout={handleLogout} />
      )}

      <div className="main-content">
        {page === "login" && <Login setPage={setPage} setUser={setUser} />}
        {page === "register" && <Register setPage={setPage} />}
        {page === "personal" && <PersonalInfo user={user} setUser={setUser} setPage={setPage} />}
        {page === "transactions" && (
          <Transaction user={user} transactions={transactions} setTransactions={setTransactions} />
        )}
        {page === "reports" && (
          <Reports transactions={transactions} setPage={setPage} />
        )}
      </div>
    </div>
  );
}

/* CSS in JS - Assuming you are using a CSS-in-JS solution or styled-components */
const styles = {
  transactionsContainer: {
    marginLeft: "200px", // Match sidebar width
    padding: "20px",
  },
};
