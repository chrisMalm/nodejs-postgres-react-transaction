const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Enable JSON parsing

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the backend!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
