import { useState } from "react";
import Home from "./components/Home";
import MapStations from "./components/MapStations";
import "./App.css";

function App() {
  const [showMap, setShowMap] = useState(false);

  return showMap ? (
    <div className="relative w-full h-full bg-gray-900">
      <MapStations onBack={() => setShowMap(false)} />
    </div>
  ) : (
    <Home onStart={() => setShowMap(true)} />
  );
}

export default App;