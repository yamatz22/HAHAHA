const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dataFile = path.join(__dirname, 'data.json');

app.post('/save-footprint', (req, res) => {
  const { totalCO2, trees } = req.body;
  if (!totalCO2 || !trees) return res.status(400).json({ message: 'Missing data' });

  const history = fs.existsSync(dataFile)
    ? JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
    : [];

  history.push({
    co2: totalCO2,
    trees,
    date: new Date().toLocaleString(),
  });

  fs.writeFileSync(dataFile, JSON.stringify(history, null, 2));
  res.json({ message: 'Saved successfully' });
});

app.get('/api/history', (req, res) => {
  const history = fs.existsSync(dataFile)
    ? JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
    : [];
  res.json(history);
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
