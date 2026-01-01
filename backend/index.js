const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = 'add-your-api-key'; // Replace with your API key
const BASE_URL = 'https://api.commoditypriceapi.com/v2';

// Get latest commodity rates
app.get('/api/latest', async (req, res) => {
    try {
        const symbols = req.query.symbols || 'XAU,WTIOIL-FUT,XAG,BRENTOIL-FUT,NG-FUT';
        const quote = req.query.quote || 'USD';

        const response = await axios.get(`${BASE_URL}/rates/latest`, {
            headers: { 'x-api-key': API_KEY },
            params: { symbols, quote },
        });
        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to fetch latest rates' });
    }
});

// Get timeseries data
app.get('/api/timeseries', async (req, res) => {
  try {
    const { symbols, startDate, endDate } = req.query;

    const response = await axios.get(`${BASE_URL}/rates/time-series`, {  // ✅ Correct
      headers: { 'x-api-key': API_KEY },
      params: { symbols, startDate, endDate },
    });

    res.json(response.data);
  } catch (err) {
    console.error('Timeseries API error:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data || 'Failed to fetch timeseries data' });
  }
});



const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

