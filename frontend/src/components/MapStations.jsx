// src/components/MapStations.jsx
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Fix de l'icône Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// Couleurs selon qualité de signal
const getSignalColor = (signal) => {
  if (signal > 80) return 'green';
  if (signal > 60) return 'lime';
  if (signal > 40) return 'orange';
  return 'red';
};

// Légende à afficher sur la carte
const Legend = () => {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: 'topleft' });

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend bg-white p-2 rounded shadow');
      div.innerHTML = `
        <h4 class="text-sm font-bold">Qualité du signal</h4>
        <i style="background: green; width: 12px; height: 12px; display: inline-block;"></i> Excellent (&gt; 80)<br/>
        <i style="background: lime; width: 12px; height: 12px; display: inline-block;"></i> Bon (&gt; 60)<br/>
        <i style="background: orange; width: 12px; height: 12px; display: inline-block;"></i> Moyen (&gt; 40)<br/>
        <i style="background: red; width: 12px; height: 12px; display: inline-block;"></i> Faible (&lt;= 40)
      `;
      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, []);

  return null;
};

// Génère aléatoirement 10 stations autour d'une position
const generateStations = (lat, lng) => {
  const stations = [];

  for (let i = 0; i < 10; i++) {
    const offsetLat = (Math.random() - 0.5) * 0.01;
    const offsetLng = (Math.random() - 0.5) * 0.01;
    const signalStrength = Math.floor(Math.random() * 100);

    stations.push({
      id: i,
      lat: lat + offsetLat,
      lng: lng + offsetLng,
      signal: signalStrength,
    });
  }

  return stations;
};

const MapStations = () => {
  const [userPosition, setUserPosition] = useState(null);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    // Géolocalisation navigateur
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserPosition({ lat: latitude, lng: longitude });
          setStations(generateStations(latitude, longitude));
        },
        (err) => {
          console.error('Erreur géolocalisation :', err);
          // Fallback si refusé
          const fallback = { lat: -18.8792, lng: 47.5079 }; // Antananarivo
          setUserPosition(fallback);
          setStations(generateStations(fallback.lat, fallback.lng));
        }
      );
    } else {
      console.log("Géolocalisation non supportée");
    }
  }, []);

  if (!userPosition) return <div className="text-center p-4">Chargement de la carte...</div>;

  return (
    <div className="w-full h-[90vh] rounded-lg shadow-md overflow-hidden">
      <MapContainer center={[userPosition.lat, userPosition.lng]} zoom={15} className="h-full w-full z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Légende */}
        <Legend />

        {/* Marqueur position utilisateur */}
        <Marker position={[userPosition.lat, userPosition.lng]}>
          <Popup>Votre position actuelle</Popup>
        </Marker>

        {/* Stations avec couleur par signal */}
        {stations.map((station) => (
          <Circle
            key={station.id}
            center={[station.lat, station.lng]}
            radius={25}
            pathOptions={{ color: getSignalColor(station.signal), fillColor: getSignalColor(station.signal), fillOpacity: 0.8 }}
          >
            <Popup>
              <strong>Station #{station.id + 1}</strong>
              <br />
              Signal : {station.signal}%
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapStations;
