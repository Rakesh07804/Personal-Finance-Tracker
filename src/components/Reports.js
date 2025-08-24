import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import Papa from 'papaparse';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

// Register required elements:
Chart.register(ArcElement, Tooltip, Legend);

const Reports = ({ transactions = [] }) => {
  const expenses = Array.isArray(transactions)
    ? transactions.filter(t => t.type === 'expense' && !t.deleted)
    : [];
  const categories = [...new Set(expenses.map(t => t.description || 'Other'))];

  const data = {
    labels: categories,
    datasets: [{
      data: categories.map(cat =>
        expenses.filter(t => (t.description || 'Other') === cat)
          .reduce((a, b) => a + b.amount, 0)
      ),
      backgroundColor: ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40'],
    }]
  };

  // Calculate savings
  const totalIncome = Array.isArray(transactions)
    ? transactions.filter(t => t.type === 'income' && !t.deleted)
      .reduce((sum, t) => sum + t.amount, 0)
    : 0;
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const savings = totalIncome - totalExpenses;

  // Savings target state
  const [target, setTarget] = useState("");
  const [savedTarget, setSavedTarget] = useState(null);

  const remaining = savedTarget ? Math.max(savedTarget - savings, 0) : null;

  const exportCSV = () => {
    if (expenses.length === 0) { alert('No transactions to export'); return; }
    const csv = Papa.unparse(expenses);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.setAttribute("download", "transactions.csv"); link.click();
  };

  return (
    <div className="reports-container" style={{
      background: "#fff8f0",
      borderRadius: "16px",
      boxShadow: "0 4px 24px rgba(160, 160, 160, 0.12)",
      padding: "32px",
      marginLeft: "200px",
      maxWidth: "800px"
    }}>
      <h2 style={{
        fontFamily: "'Edu NSW ACT Foundation', cursive",
        color: "#a084ca",
        marginBottom: "24px"
      }}>Spending & Savings Overview</h2>
      <div style={{
        display: "flex",
        gap: "32px",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "wrap"
      }}>
        {/* Pie Chart */}
        <div style={{ width: "260px", minWidth: "220px", flex: "0 0 260px" }}>
          <h3 style={{
            color: "#6c4ab6",
            fontFamily: "'Edu NSW ACT Foundation', cursive",
            textAlign: "center",
            marginBottom: "12px"
          }}>
            Category-wise Spending
          </h3>
          {expenses.length === 0
            ? <p style={{ textAlign: "center" }}>No expense data yet</p>
            : <Pie data={data} width={260} height={260} />}
        </div>
        {/* Savings Target Progress */}
        <div style={{
          flex: "1",
          minWidth: "220px",
          maxWidth: "320px"
        }}>
          <h3 style={{
            color: "#6c4ab6",
            fontFamily: "'Edu NSW ACT Foundation', cursive",
            textAlign: "center",
            marginBottom: "12px"
          }}>
            Savings Target Progress
          </h3>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (target && !isNaN(target) && Number(target) > 0) {
                setSavedTarget(Number(target));
              }
            }}
            style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px", justifyContent: "center" }}
          >
            <input
              type="number"
              min="1"
              placeholder="Enter target amount"
              value={target}
              onChange={e => setTarget(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #a084ca",
                fontFamily: "'Edu NSW ACT Foundation', cursive",
                width: "120px"
              }}
            />
            <button
              type="submit"
              style={{
                background: "linear-gradient(90deg, #a084ca 0%, #f3e8ff 100%)",
                color: "#fff",
                border: "1px solid #a084ca",
                borderRadius: "6px",
                padding: "7px 14px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Set Target
            </button>
          </form>
          {savedTarget && (
            <div style={{
              background: "#e0c3fc",
              borderRadius: "10px",
              padding: "16px",
              textAlign: "center",
              color: "#4b3f72",
              fontFamily: "'Edu NSW ACT Foundation', cursive"
            }}>
              <div style={{ marginBottom: "10px" }}>
                <strong>Target Amount:</strong> ₹{savedTarget}
              </div>
              <div style={{ marginBottom: "10px" }}>
                <strong>Current Savings:</strong> ₹{savings}
              </div>
              <div style={{ marginBottom: "18px" }}>
                <strong>Amount Needed:</strong> ₹{remaining}
              </div>
              {/* Progress Bar */}
              <div style={{
                background: "#f3e8ff",
                borderRadius: "8px",
                height: "24px",
                width: "100%",
                margin: "0 auto",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(160, 132, 202, 0.08)"
              }}>
                <div style={{
                  background: "linear-gradient(90deg, #a084ca 0%, #f3e8ff 100%)",
                  height: "100%",
                  width: `${Math.min((savings / savedTarget) * 100, 100)}%`,
                  borderRadius: "8px",
                  transition: "width 0.5s"
                }}></div>
                <span style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "#6c4ab6",
                  fontWeight: "bold",
                  fontSize: "1rem"
                }}>
                  {Math.min(((savings / savedTarget) * 100), 100).toFixed(1)}%
                </span>
              </div>
              {remaining === 0 && (
                <div style={{ color: "#27ae60", marginTop: "12px" }}>
                  🎉 Congratulations! You've reached your savings target!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
