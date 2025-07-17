// backend/api/stations.js
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

export default function handler(req, res) {
  // Configurer CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json(stations);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
