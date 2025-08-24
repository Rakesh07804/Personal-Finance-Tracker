// Transaction.js
import React, { useState } from "react";

export default function Transaction({ user, transactions, setTransactions }) {
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({
    date: "",
    description: "",
    amount: "",
    type: "income",
  });
  const [errors, setErrors] = useState({});

  // Greeting uses user's name
  const userName = user?.name || "";

  // Validation
  const validate = () => {
    const newErrors = {};
    const maxAmount = 1000000;
    const today = new Date().toISOString().split("T")[0];

    if (!form.date) newErrors.date = "Date is required";
    else if (form.date > today) newErrors.date = "Date cannot be in the future";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.amount) newErrors.amount = "Amount is required";
    else if (form.amount <= 0 || form.amount > maxAmount)
      newErrors.amount = `Amount must be between ₹1 and ₹${maxAmount.toLocaleString()}`;
    if (!form.type) newErrors.type = "Category is required";
    if (
      editIndex === null &&
      transactions.some(
        (t) =>
          t.date === form.date &&
          t.description === form.description &&
          Number(t.amount) === Number(form.amount) &&
          t.type === form.type &&
          !t.deleted
      )
    )
      newErrors.duplicate = "Duplicate transaction not allowed";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add/Edit Transaction
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (editIndex !== null) {
      const updated = [...transactions];
      updated[editIndex] = { ...form, amount: Number(form.amount) };
      setTransactions(updated);
    } else {
      setTransactions([
        ...transactions,
        { ...form, amount: Number(form.amount), deleted: false },
      ]);
    }
    setForm({ date: "", description: "", amount: "", type: "income" });
    setEditIndex(null);
    setShowModal(false);
    setErrors({});
  };

  // Edit Transaction
  const handleEdit = (i) => {
    if (transactions[i].deleted) return;
    setForm(transactions[i]);
    setEditIndex(i);
    setShowModal(true);
    setErrors({});
  };

  // Delete Transaction
  const handleDelete = (i) => {
    const updated = [...transactions];
    updated[i].deleted = true;
    setTransactions(updated);
  };

  // Sort by date
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Calculate totals (skip deleted)
  const totalIncome = sortedTransactions
    .filter((t) => t.type === "income" && !t.deleted)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = sortedTransactions
    .filter((t) => t.type === "expense" && !t.deleted)
    .reduce((sum, t) => sum + t.amount, 0);
  const savings = Math.max(totalIncome - totalExpenses, 0);
  const overBudget = totalExpenses > totalIncome ? totalExpenses - totalIncome : 0;

  // Running balance (skip deleted transactions)
  let runningBalance = 0;
  const transactionsWithBalance = sortedTransactions.map((t) => {
    if (!t.deleted) {
      runningBalance += t.type === "income" ? t.amount : -t.amount;
    }
    return { ...t, balanceAfter: runningBalance };
  });

  return (
    <div className="transactions-container">
      {/* Greeting */}
      <div style={{ marginBottom: "18px" }}>
        <h2
          style={{
            fontFamily: "'Edu NSW ACT Foundation', cursive",
            color: "#a084ca",
            fontSize: "1.5rem",
            margin: 0,
            textAlign: "left",
          }}
        >
          Hey, {userName}, your finance details here
        </h2>
      </div>

      {/* Add Transaction Button */}
      <button
        className="login-btn"
        style={{ marginBottom: "18px" }}
        onClick={() => {
          setShowModal(true);
          setEditIndex(null);
          setForm({ date: "", description: "", amount: "", type: "income" });
          setErrors({});
        }}
      >
        + Transactions 💰
      </button>

      {/* Summary Rectangle */}
      <div
        className="summary-bar"
        style={{
          display: "flex",
          margin: "20px 0",
          background: "linear-gradient(90deg, #f3e8ff 0%, #a084ca 100%)",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(160, 132, 202, 0.08)",
          padding: "18px 0",
          justifyContent: "space-around",
        }}
      >
        <div className="summary-item">
          <p className="summary-title" style={{ color: "#6c4ab6", margin: 0 }}>
            Income
          </p>
          <p className="summary-amount" style={{ color: "#27ae60", margin: 0 }}>
            ₹{totalIncome}
          </p>
        </div>
        <div className="summary-item">
          <p className="summary-title" style={{ color: "#ed4956", margin: 0 }}>
            Expenses
          </p>
          <p className="summary-amount" style={{ color: "#ed4956", margin: 0 }}>
            ₹{totalExpenses}
          </p>
        </div>
        <div className="summary-item savings">
          <p className="summary-title">Savings</p>
          <p className="summary-amount">₹{savings}</p>
        </div>
        <div className="summary-item overbudget">
          <p className="summary-title">Over Budget</p>
          <p className="summary-amount">₹{overBudget}</p>
        </div>
      </div>

      {/* Transaction Table */}
      <table
        className="transaction-table"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Available Balance</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactionsWithBalance.length > 0 ? (
            transactionsWithBalance.map((t, i) => (
              <tr
                key={i}
                style={{
                  textAlign: "center",
                  borderBottom: "1px solid #ccc",
                  backgroundColor: t.deleted ? "#e0e0e0" : "white",
                  color: t.deleted ? "#888" : "black",
                }}
              >
                <td>{t.date}</td>
                <td>{t.description}</td>
                <td>₹{t.amount}</td>
                <td>{t.type}</td>
                <td>₹{t.balanceAfter}</td>
                <td>
                  {!t.deleted && (
                    <>
                      <button onClick={() => handleEdit(i)}>✏️</button>
                      <button onClick={() => handleDelete(i)}>🗑️</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No transactions yet. Click "+ Transactions" to start.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editIndex !== null ? "Edit Transaction" : "Add Transaction"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
                {errors.date && <span className="error">{errors.date}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  id="description"
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
                {errors.description && <span className="error">{errors.description}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="amount">Amount (₹)</label>
                <input
                  id="amount"
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                />
                {errors.amount && <span className="error">{errors.amount}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="type">Category</label>
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  required
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                {errors.type && <span className="error">{errors.type}</span>}
              </div>
              {errors.duplicate && <span className="error">{errors.duplicate}</span>}
              <div className="modal-buttons">
                <button type="submit">Save</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowModal(false);
                    setEditIndex(null);
                    setForm({ date: "", description: "", amount: "", type: "income" });
                    setErrors({});
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
