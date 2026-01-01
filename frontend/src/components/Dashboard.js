import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import CommoditySelector from './CommoditySelector';
import TimeSeriesChart from './TimeSeriesChart';

/* ✅ Move constants OUTSIDE component */
const COLORS = ['#2563eb', '#dc2626', '#059669', '#7c3aed'];

const cardStyle = {
  background: '#ffffff',
  borderRadius: '14px',
  padding: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
};

const buttonStyle = {
  padding: '8px 14px',
  borderRadius: '6px',
  border: '1px solid #ddd',
  background: '#fff',
  cursor: 'pointer',
  fontSize: '0.85rem'
};

const Dashboard = () => {
  const [commodities, setCommodities] = useState(['XAU', 'WTIOIL-FUT']);
  const [latestRates, setLatestRates] = useState({});
  const [timeData, setTimeData] = useState({});
  const [datasets, setDatasets] = useState([]);
  const [startDate, setStartDate] = useState('2023-12-01');
  const [endDate, setEndDate] = useState('2023-12-31');
  const [loading, setLoading] = useState(false);

  const chartRef = useRef(null);

  /* Live prices */
  useEffect(() => {
    if (!commodities.length) return;

    axios
      .get(`http://localhost:5000/api/latest?symbols=${commodities.join(',')}`)
      .then(res => setLatestRates(res.data.rates || {}))
      .catch(console.error);
  }, [commodities]);

  /* Time series data */
  useEffect(() => {
    if (!commodities.length) return;

    setLoading(true);

    axios
      .get(`http://localhost:5000/api/timeseries`, {
        params: { symbols: commodities.join(','), startDate, endDate }
      })
      .then(res => {
        const raw = res.data.rates || {};
        const normalized = {};

        Object.entries(raw).forEach(([date, symbols]) => {
          Object.entries(symbols).forEach(([symbol, ohlc]) => {
            if (!normalized[symbol]) normalized[symbol] = {};
            normalized[symbol][date] = ohlc;
          });
        });

        setTimeData(normalized);
      })
      .finally(() => setLoading(false));
  }, [commodities, startDate, endDate]);

  /* Build chart datasets */
  useEffect(() => {
    const ds = Object.keys(timeData).map((symbol, index) => ({
      label: symbol,
      data: Object.entries(timeData[symbol]).map(([date, ohlc]) => ({
        x: date,
        y: ohlc?.close ?? null
      })),
      borderColor: COLORS[index % COLORS.length],
      backgroundColor: COLORS[index % COLORS.length],
      tension: 0.3,
      pointRadius: 2,
      spanGaps: true,
      yAxisID: symbol === 'XAU' ? 'yGold' : 'yOil'
    }));

    setDatasets(ds);
  }, [timeData]);

  const downloadChart = () => {
    if (!chartRef.current) return;

    const link = document.createElement('a');
    link.href = chartRef.current.toBase64Image();
    link.download = 'commodity-timeseries.png';
    link.click();
  };

  const exportCSV = () => {
    if (!Object.keys(timeData).length) return;

    const rows = [['Date', 'Commodity', 'Open', 'High', 'Low', 'Close']];

    Object.entries(timeData).forEach(([symbol, dates]) => {
      Object.entries(dates).forEach(([date, ohlc]) => {
        rows.push([date, symbol, ohlc.open, ohlc.high, ohlc.low, ohlc.close]);
      });
    });

    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'commodity-data.csv';
    link.click();
  };

  return (
    <div style={{
      padding: '30px',
      maxWidth: '1300px',
      margin: '0 auto',
      background: '#f4f6f8',
      minHeight: '100vh'
    }}>
      <h1 style={{ marginBottom: '25px' }}>Commodity Analytics Dashboard</h1>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={cardStyle}>
          <h3>Live Prices</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {Object.entries(latestRates).map(([symbol, price]) => (
              <div key={symbol} style={{ padding: '12px', border: '1px solid #eee', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>{symbol}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 600 }}>${price}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <h3>Settings</h3>
          <CommoditySelector selected={commodities} setSelected={setCommodities} />

          <div style={{ marginTop: '15px', display: 'flex', gap: '12px' }}>
            <div>
              <label>Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div>
              <label>End Date</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <h2>Historical Performance</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={buttonStyle} onClick={downloadChart}>Download Chart</button>
            <button style={buttonStyle} onClick={exportCSV}>Export CSV</button>
          </div>
        </div>

        {loading && <div>Updating chart...</div>}
        <TimeSeriesChart ref={chartRef} datasets={datasets} />
      </section>
    </div>
  );
};

export default Dashboard;
