const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/check', async (req, res) => {
  const { url } = req.query;

  try {
    const response = await axios.get(url);
    res.json({ status: 'online', statusCode: response.status });
  } catch (error) {
    res.json({ status: 'offline', statusCode: error.response ? error.response.status : 'unknown' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
