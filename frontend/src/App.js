import React from 'react';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Commodity Time Series Dashboard</h1>
      <p>View latest prices and historical charts for commodities.</p>
      <Dashboard />
    </div>
  );
}

export default App;
