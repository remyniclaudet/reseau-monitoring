import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { HiOutlineX } from "react-icons/hi";
import { IoListOutline, IoRadioOutline } from "react-icons/io5";

// Configuration des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// Fonctions utilitaires pour le signal
const getSignalColor = (signal = 0) => {
  if (signal > 80) return '#22c55e';
  if (signal > 60) return '#84cc16';
  if (signal > 40) return '#f59e42';
  return '#ef4444';
};

const getSignalLabel = (signal = 0) => {
  if (signal > 80) return "Excellent";
  if (signal > 60) return "Bon";
  if (signal > 40) return "Moyen";
  return "Faible";
};

const getSignalBadge = (signal = 0) => {
  if (signal > 80) return "bg-green-500";
  if (signal > 60) return "bg-lime-500";
  if (signal > 40) return "bg-orange-400";
  return "bg-red-500";
};

// Composant Legend
const Legend = ({ darkMode, toggleDarkMode }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;

    const legend = L.control({ position: 'topright' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'glass-effect p-3 rounded-lg shadow-lg');
      L.DomEvent.disableClickPropagation(div);
      div.innerHTML = `
        <div class="flex flex-col">
          <h4 class="font-bold text-white mb-2">Qualité du signal</h4>
          <div class="space-y-2 text-xs mb-4">
            <div class="flex items-center"><span class="w-3 h-3 rounded-full bg-green-500 mr-2"></span> Excellent (&gt; 80)</div>
            <div class="flex items-center"><span class="w-3 h-3 rounded-full bg-lime-500 mr-2"></span> Bon (&gt; 60)</div>
            <div class="flex items-center"><span class="w-3 h-3 rounded-full bg-orange-400 mr-2"></span> Moyen (&gt; 40)</div>
            <div class="flex items-center"><span class="w-3 h-3 rounded-full bg-red-500 mr-2"></span> Faible (&lt;= 40)</div>
          </div>
          <h4 class="font-bold text-white mb-2">Choisir le thème</h4>
          <div class="flex justify-center gap-3">
            <button id="light-theme" class="p-2 rounded-full ${!darkMode ? 'bg-blue-500' : 'bg-gray-600'} text-white">
              ☀️
            </button>
            <button id="dark-theme" class="p-2 rounded-full ${darkMode ? 'bg-blue-500' : 'bg-gray-600'} text-white">
              🌙
            </button>
          </div>
        </div>
      `;
      return div;
    };
    legend.addTo(map);

    setTimeout(() => {
      const lightBtn = document.getElementById('light-theme');
      const darkBtn = document.getElementById('dark-theme');
      if (lightBtn) lightBtn.addEventListener('click', () => !darkMode || toggleDarkMode());
      if (darkBtn) darkBtn.addEventListener('click', () => darkMode || toggleDarkMode());
    }, 50);

    return () => legend.remove();
  }, [map, darkMode, toggleDarkMode]);

  return null;
};

// Composant principal
const MapStations = ({ onBack }) => {
  const [userPosition, setUserPosition] = useState(null);
  const [stations, setStations] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchStations = async (lat, lng) => {
      try {
        const res = await axios.get('https://reseau-monitoring-backend.onrender.com/api/stations', { params: { lat, lng } });
        setStations(res.data);
      } catch {
        setStations([]);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude: lat, longitude: lng } = pos.coords;
          setUserPosition({ lat, lng });
          fetchStations(lat, lng);
        },
        () => {
          const fallback = { lat: -18.8792, lng: 47.5079 };
          setUserPosition(fallback);
          fetchStations(fallback.lat, fallback.lng);
        }
      );
    }
  }, []);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  if (!userPosition) {
    return (
      <div className="flex items-center justify-center h-[90vh] bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-lg font-semibold text-gray-300">Chargement de la carte...</span>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-gray-900 overflow-hidden flex flex-col md:flex-row">
      {/* Sidebar desktop */}
      <aside className="hidden md:block w-80 h-full bg-gray-800/80 backdrop-blur border-r border-gray-700 p-4 overflow-y-auto">
        <div className="flex items-center gap-2 mb-6">
          <IoRadioOutline className="text-blue-400 text-2xl" />
          <h2 className="text-2xl font-bold text-white">Stations proches</h2>
        </div>
        <ul className="space-y-3">
          {stations.map((station, idx) => (
            <li key={station.id ?? idx} className="rounded-lg p-4 bg-gray-700/50 hover:bg-gray-700 transition border border-gray-600">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-white">#{idx + 1} {station.nom || `Station ${idx + 1}`}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${getSignalBadge(station.signal ?? 0)}`}>
                  {getSignalLabel(station.signal ?? 0)}
                </span>
              </div>
              <div className="text-xs text-gray-400 mb-1">
                Lat: {station.lat?.toFixed(5) ?? station.latitude?.toFixed(5) ?? '—'},
                Lng: {station.lng?.toFixed(5) ?? station.longitude?.toFixed(5) ?? '—'}
              </div>
              <div className="grid grid-cols-3 gap-1 text-xs">
                <div className="bg-gray-800/50 p-1 rounded text-center">
                  <div className="text-gray-400">Signal</div>
                  <div className="font-bold">{station.signal ?? '-'}%</div>
                </div>
                <div className="bg-gray-800/50 p-1 rounded text-center">
                  <div className="text-gray-400">RSRP</div>
                  <div className="font-bold">{station.rsrp ?? '-'}</div>
                </div>
                <div className="bg-gray-800/50 p-1 rounded text-center">
                  <div className="text-gray-400">RSRQ</div>
                  <div className="font-bold">{station.rsrq ?? '-'}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Drawer mobile */}
      {isMobile && (
        <>
          <div
            className={`fixed inset-0 z-30 bg-black/60 transition-opacity ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setDrawerOpen(false)}
          />
          <aside className={`fixed left-0 top-0 bottom-0 z-40 w-4/5 max-w-sm bg-gray-800 border-r border-gray-700 shadow-2xl transition-transform ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <IoRadioOutline className="text-blue-400 text-xl" />
                <h2 className="text-xl font-bold text-white">Stations</h2>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="text-gray-400 hover:text-white">
                <HiOutlineX className="text-xl" />
              </button>
            </div>
            <div className="overflow-y-auto h-[calc(100%-60px)] p-4">
              {stations.map((station, idx) => (
                <div key={station.id ?? idx} className="mb-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-white">#{idx + 1} {station.nom || `Station ${idx + 1}`}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getSignalBadge(station.signal ?? 0)}`}>
                      {getSignalLabel(station.signal ?? 0)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-gray-400">Coordonnées</div>
                      <div className="text-white">
                        {station.lat?.toFixed(5) ?? station.latitude?.toFixed(5) ?? '—'}, {station.lng?.toFixed(5) ?? station.longitude?.toFixed(5) ?? '—'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Signal</div>
                      <div className="text-white">{station.signal ?? '-'}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </>
      )}

      {/* Carte */}
      <div className="flex-1 h-full w-full relative">
        {/* Bouton Retour - caché quand drawer est ouvert */}
        {!drawerOpen && (
          <button
            onClick={onBack}
            className="absolute top-4 left-4 z-[1000] bg-blue-600/80 backdrop-blur text-white font-semibold px-4 py-2 rounded-full shadow-lg transition hover:scale-105"
          >
            ← Retour
          </button>
        )}

        {/* Bouton Stations (mobile seulement) - caché quand drawer est ouvert */}
        {isMobile && !drawerOpen && (
          <button
            onClick={() => setDrawerOpen(true)}
            className="fixed z-[1001] bottom-6 right-6 bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            <IoListOutline className="text-xl" />
            <span>Stations</span>
          </button>
        )}

        <MapContainer
          center={[userPosition.lat, userPosition.lng]}
          zoom={15}
          className="h-full w-full z-0"
          style={{ 
            backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
            zIndex: 0
          }}
        >
          <TileLayer
            url={darkMode
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
            attribution='&copy; OpenStreetMap contributors'
          />

          {/* Légende - cachée quand drawer est ouvert */}
          {!drawerOpen && <Legend darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}

          <Marker position={[userPosition.lat, userPosition.lng]}>
            <Popup className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg p-3 shadow-lg`}>
              <div className={`font-bold ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>Votre position</div>
            </Popup>
          </Marker>

          {stations.map((station, idx) => {
            const signal = station.signal ?? 0;
            const lat = station.lat ?? station.latitude;
            const lng = station.lng ?? station.longitude;

            if (!lat || !lng) return null;

            return (
              <Circle
                key={station.id ?? idx}
                center={[lat, lng]}
                radius={40}
                pathOptions={{
                  color: getSignalColor(signal),
                  fillColor: getSignalColor(signal),
                  fillOpacity: 0.7,
                }}
              >
                <Popup className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg p-3 shadow-lg`}>
                  <div className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {station.nom || `Station #${idx + 1}`}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getSignalBadge(signal)} ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {getSignalLabel(signal)}
                    </span>
                    <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Signal: <b>{signal}%</b>
                    </span>
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div>RSRP: <b>{station.rsrp ?? '-'}</b></div>
                    <div>RSRQ: <b>{station.rsrq ?? '-'}</b></div>
                  </div>
                </Popup>
              </Circle>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapStations;