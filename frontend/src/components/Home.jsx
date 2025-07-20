import { HiOutlineWifi, HiOutlineMap, HiOutlineChartBar, HiOutlineCog, HiOutlineDownload, HiOutlineViewGrid } from "react-icons/hi";
import { FiRadio, FiBarChart2 } from "react-icons/fi";
import { MdSatellite } from "react-icons/md";
import { useState } from "react";

const Home = ({ onStart }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900/80 text-gray-100 overflow-hidden relative">
      {/* Icônes flottantes technologiques */}
      <div className="absolute inset-0 overflow-hidden">
        <FiRadio className="absolute text-blue-400/20 text-6xl top-1/4 left-10 floating" />
        <MdSatellite className="absolute text-purple-400/20 text-8xl top-1/3 right-20 floating delay-1" />
        <FiBarChart2 className="absolute text-green-400/20 text-7xl bottom-1/4 left-1/3 floating delay-2" />
        <div className="absolute text-pink-400/20 text-9xl bottom-20 right-1/4 floating delay-3">⚡</div>
      </div>

      {/* Navbar */}
      <nav className="glass-effect fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <HiOutlineWifi className="text-blue-400 text-2xl" />
          <span className=" font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Mi-Surveillance
          </span>
        </div>
        
        {/* Menu Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#" className="hover:text-blue-300 transition">Accueil</a>
          <a href="#features" className="hover:text-blue-300 transition">Fonctionnalités</a>
          <button 
            onClick={onStart}
            className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-full hover:opacity-90 transition flex items-center justify-center"
          >
            Commencer
          </button>
        </div>
        
        {/* Menu Mobile */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-2xl focus:outline-none"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Menu Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/70 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute top-16 right-4 bg-gray-800/95 backdrop-blur-lg rounded-lg shadow-xl p-4 w-64"
            onClick={(e) => e.stopPropagation()}
          >
            <a 
              href="#" 
              className="block py-2 px-4 hover:bg-gray-700/50 rounded transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Accueil
            </a>
            <a 
              href="#features" 
              className="block py-2 px-4 hover:bg-gray-700/50 rounded transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Fonctionnalités
            </a>
            <button 
              onClick={() => {
                onStart();
                setMobileMenuOpen(false);
              }}
              className="w-full mt-2 bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-full hover:opacity-90 transition text-center"
            >
              Commencer
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                Surveillez vos réseaux mobiles
              </span><br />
              en temps réel
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-lg">
              Une visualisation claire et intuitive de la qualité du signal des réseaux mobiles autour de vous avec des indicateurs avancés et une carte interactive.
            </p>
            <div className="flex">
              <button 
                onClick={onStart}
                className="btn-glow w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-all"
              >
                Accéder à la carte
              </button>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="relative w-full h-64 md:h-96 bg-gray-800/50 rounded-2xl border border-gray-700/50 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="radio-wave w-32 h-32 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <div className="radio-wave w-32 h-32 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <HiOutlineWifi className="text-white text-2xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold text-center mb-16">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
            Fonctionnalités
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="feature-card bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
              <HiOutlineMap className="text-blue-400 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Visualisation Carte Temps Réel</h3>
            <p className="text-gray-300">
              Affichage interactif des stations réseaux sur une carte avec indicateurs de qualité de signal en temps réel.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="feature-card bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
              <HiOutlineChartBar className="text-purple-400 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Indicateurs Réseaux Dynamiques</h3>
            <p className="text-gray-300">
              Mesures précises du signal, interférences et autres paramètres critiques.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="feature-card bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
              <HiOutlineCog className="text-green-400 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Simulation Paramètres Réseau</h3>
            <p className="text-gray-300">
              Couverture réseau et qualité de signal selon différents paramètres.
            </p>
          </div>
          
          {/* Feature 4 */}
          
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-effect py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <HiOutlineWifi className="text-blue-400 text-xl" />
              <span className="font-bold text-lg">Mi-Surveillance</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-4 md:mb-0">
              <a href="#" className="hover:text-blue-300 transition">Accueil</a>
              <a href="#features" className="hover:text-blue-300 transition">Fonctionnalités</a>
              <a href="#" className="hover:text-blue-300 transition">Politique de confidentialité</a>
              <a href="#" className="hover:text-blue-300 transition">Mentions légales</a>
            </div>
          </div>
          <div className="text-center text-gray-400 text-sm mt-6">
            © 2025 RadioScanPro - Tous droits réservés. Surveillance Radio Web App.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;