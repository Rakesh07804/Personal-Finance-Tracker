import React from 'react';

const Home = ({ transactions, goToAdd, goToReports }) => {
  const balance = transactions.reduce((acc, t) => t.type === 'Income' ? acc + t.amount : acc - t.amount, 0);

  return (
    <div>
      <h1>Balance: ₹{balance}</h1>
      <button onClick={goToAdd}>Add Transaction</button>
      <button onClick={goToReports} style={{ marginLeft: '10px' }}>View Reports</button>

      <h2>Transactions</h2>
      {transactions.length === 0 && <p>No transactions yet</p>}
      <ul>
        {transactions.map((t, i) => (
          <li key={i}>
            {t.type} | {t.category} | ₹{t.amount} | {new Date(t.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
