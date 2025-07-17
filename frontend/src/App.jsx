import { useState } from 'react'
import './App.css'
import MapStations from './components/MapStations';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center text-blue-800">Tableau de surveillance du réseau mobile</h1>
      <MapStations />
    </div>
  );
}

export default App;
