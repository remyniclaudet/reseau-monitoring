const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Autorise les requêtes cross-origin (utile pour le développement)
app.use(cors());

// Sert les fichiers statiques générés par Vite (frontend compilé)
app.use(express.static(path.join(__dirname, 'client')));

// Route API simulée pour les stations (à remplacer plus tard avec une vraie API si nécessaire)
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

// API GET: /api/stations
app.get('/api/stations', (req, res) => {
  res.json(stations);
});

// Catch-all: redirige les routes front (React) vers index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
});

// Démarre le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});
