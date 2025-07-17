// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());

// Exemple de données simulées (JSON)
const stations = [
  {
    id: "001",
    nom: "Station A",
    latitude: -18.8792,
    longitude: 47.5079,
    rsrp: -90,
    rsrq: -10,
    sinr: 15,
    qualite: "Moyenne"
  },
  {
    id: "002",
    nom: "Station B",
    latitude: -18.9100,
    longitude: 47.5250,
    rsrp: -75,
    rsrq: -6,
    sinr: 20,
    qualite: "Bonne"
  }
];

// Route API
app.get('/api/stations', (req, res) => {
  res.json(stations);
});

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});
