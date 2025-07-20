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
  const { lat, lng } = req.query;
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  // Génère 10 stations espacées autour de la position reçue
  const stations = [];
  const rayonMin = 0.005; // ~500m
  const rayonMax = 0.012; // ~1200m

  for (let i = 0; i < 10; i++) {
    // Angle en radians pour répartir les stations autour du point
    const angle = (2 * Math.PI * i) / 10 + Math.random() * 0.2;
    // Distance aléatoire dans le rayon défini
    const rayon = rayonMin + Math.random() * (rayonMax - rayonMin);

    // Décalage latitude/longitude
    const offsetLat = Math.cos(angle) * rayon;
    const offsetLng = Math.sin(angle) * rayon;

    // Signal varié selon l'index (pour garantir la diversité)
    let signal;
    if (i < 2) signal = 90 + Math.floor(Math.random() * 10);         // Excellent
    else if (i < 5) signal = 65 + Math.floor(Math.random() * 15);     // Bon
    else if (i < 8) signal = 45 + Math.floor(Math.random() * 15);     // Moyen
    else signal = 20 + Math.floor(Math.random() * 20);                // Faible

    stations.push({
      id: i,
      nom: `Station ${String.fromCharCode(65 + i)}`,
      latitude: latitude + offsetLat,
      longitude: longitude + offsetLng,
      signal,
      rsrp: -60 - Math.floor(Math.random() * 40),
      rsrq: -3 - Math.floor(Math.random() * 10),
      sinr: 10 + Math.floor(Math.random() * 20),
      qualite: ["Excellente", "Bonne", "Moyenne", "Faible"][Math.floor(Math.random() * 4)]
    });
  }
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
