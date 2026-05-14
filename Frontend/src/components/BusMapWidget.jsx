import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import { Navigation, Clock, Home } from 'lucide-react';

// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom CSS for the glowing tooltips matching the dark theme
const mapStyles = `
  .custom-dark-tooltip {
    background: rgba(15, 23, 42, 0.85) !important;
    border: 1px solid rgba(59, 130, 246, 0.5) !important;
    color: #60a5fa !important;
    border-radius: 20px !important;
    padding: 6px 12px !important;
    font-weight: 700 !important;
    font-size: 11px !important;
    font-family: 'Inter', sans-serif !important;
    backdrop-filter: blur(4px) !important;
    box-shadow: 0 0 12px rgba(59, 130, 246, 0.4) !important;
    letter-spacing: 0.02em;
  }
  .custom-dark-tooltip::before {
    display: none !important; /* Hide default leaflet arrow */
  }
  
  .home-tooltip {
    background: rgba(15, 23, 42, 0.85) !important;
    border: 1px solid rgba(245, 158, 11, 0.5) !important;
    color: #fbbf24 !important;
    box-shadow: 0 0 12px rgba(245, 158, 11, 0.4) !important;
  }
  
  .leaflet-container {
    background: #0f172a; /* Dark background matching tiles */
  }
`;

// Helper to create glowing dot icons
const createGlowingIcon = (coreColor, glowColor) => {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
    <!-- Outer ambient glow -->
    <circle cx="20" cy="20" r="16" fill="${glowColor}" opacity="0.15" />
    <!-- Medium glow -->
    <circle cx="20" cy="20" r="10" fill="${glowColor}" opacity="0.4" />
    <!-- Core dot -->
    <circle cx="20" cy="20" r="5" fill="${coreColor}" stroke="#ffffff" stroke-width="1.5" />
    <!-- Pulsing ring animation -->
    <circle cx="20" cy="20" r="16" fill="none" stroke="${glowColor}" stroke-width="1" opacity="0.5">
      <animate attributeName="r" values="8;18" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.6;0" dur="2s" repeatCount="indefinite" />
    </circle>
  </svg>`;
  return new L.Icon({
    iconUrl: "data:image/svg+xml;base64," + btoa(svg),
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
};

const busIcon = createGlowingIcon('#60a5fa', '#3b82f6'); // Blue glowing dot
const homeIcon = createGlowingIcon('#fcd34d', '#f59e0b'); // Yellow/Orange glowing dot

// Route coordinates (East to West across Bangalore)
const routeCoordinates = [
  [12.9755, 77.6065],
  [12.9750, 77.6020],
  [12.9745, 77.5980],
  [12.9740, 77.5930],
  [12.9745, 77.5880],
  [12.9760, 77.5800],
];

const toTurfCoords = (coords) => coords.map(c => [c[1], c[0]]);
const toLeafletCoord = (coord) => [coord[1], coord[0]];

const BusMapWidget = () => {
  const routeLine = turf.lineString(toTurfCoords(routeCoordinates));
  const routeLength = turf.length(routeLine, { units: 'kilometers' });

  // 3 Buses scattered along the route with dynamic ETA simulation
  const [buses, setBuses] = useState([
    { id: '1', speed: 45, currentDist: 0.5, pos: routeCoordinates[0], eta: 25 },
    { id: '2', speed: 38, currentDist: 2.1, pos: routeCoordinates[0], eta: 12 },
    { id: '3', speed: 52, currentDist: 3.8, pos: routeCoordinates[0], eta: 7 },
  ]);

  const [isTracking, setIsTracking] = useState(true);
  const requestRef = useRef();
  const lastTimeRef = useRef();

  const animateBuses = (time) => {
    if (lastTimeRef.current !== undefined && isTracking) {
      const deltaTime = (time - lastTimeRef.current) / 1000;

      setBuses((prevBuses) => prevBuses.map(bus => {
        const speedKmS = bus.speed / 3600;
        let newDist = bus.currentDist + (speedKmS * deltaTime);
        
        // Loop back to start
        if (newDist >= routeLength) {
          newDist = 0;
        }

        const point = turf.along(routeLine, newDist, { units: 'kilometers' });
        
        // Simulate ETA decreasing based on distance
        const remainingDist = routeLength - newDist;
        const eta = Math.max(1, Math.round((remainingDist / (bus.speed || 40)) * 60));

        return { ...bus, currentDist: newDist, pos: toLeafletCoord(point.geometry.coordinates), eta };
      }));
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animateBuses);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animateBuses);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isTracking]);

  return (
    <div style={{
      width: '100%',
      marginTop: '2rem',
      background: '#ffffff', // Light container to fit website UI
      borderRadius: '20px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
      overflow: 'hidden',
      color: '#1e293b',
      fontFamily: 'Inter, sans-serif'
    }}>
      <style>{mapStyles}</style>

      {/* Widget Header - Light Theme to match dashboard */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid #e2e8f0',
        background: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: '#eff6ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#3b82f6'
          }}>
            <Navigation size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
              Advanced Fleet Radar
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span style={{
                display: 'inline-block', width: '6px', height: '6px',
                borderRadius: '50%', background: '#10b981',
                boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)'
              }}></span>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                Live GPS Sync Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container - Dark Mode Embedded Radar */}
      <div style={{ position: 'relative', width: '100%', height: '400px', zIndex: 0, background: '#0f172a' }}>
        <MapContainer 
          center={[12.9750, 77.5930]} 
          zoom={14} 
          style={{ width: '100%', height: '100%' }}
          zoomControl={true}
          scrollWheelZoom={false}
        >
          {/* Dark Theme Map Tiles (CartoDB Dark Matter) */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          {/* Glowing Orange Route Lines */}
          {/* Outer glow layer */}
          <Polyline 
            positions={routeCoordinates} 
            pathOptions={{ color: '#ea580c', weight: 8, opacity: 0.3 }} 
          />
          {/* Inner core layer */}
          <Polyline 
            positions={routeCoordinates} 
            pathOptions={{ color: '#fb923c', weight: 3, opacity: 1 }} 
          />

          {/* End Destination Marker (Home) */}
          <Marker position={routeCoordinates[routeCoordinates.length - 1]} icon={homeIcon}>
             <Tooltip permanent direction="top" className="custom-dark-tooltip home-tooltip" offset={[0, -15]}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Home size={12} color="#fbbf24" /> School
                </div>
              </Tooltip>
          </Marker>

          {/* Animated Buses with Blue ETA Badges */}
          {buses.map((bus) => (
            <Marker key={bus.id} position={bus.pos} icon={busIcon}>
              <Tooltip permanent direction="right" className="custom-dark-tooltip" offset={[15, 0]}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={12} color="#60a5fa" /> {bus.eta} min
                </div>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
        
        {/* Promotional Overlay (Sleek Dark Theme Version) */}
        <div style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          zIndex: 400,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(12px)',
          padding: '12px 20px',
          borderRadius: '30px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ 
            width: '8px', height: '8px', 
            background: '#60a5fa', borderRadius: '50%',
            animation: 'pulse 2s infinite',
            boxShadow: '0 0 10px #60a5fa'
          }}></div>
          <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.85rem', letterSpacing: '0.02em' }}>
            Track your fleet anytime, everywhere.
          </span>
        </div>

        {/* Quote Overlay (Top Left, padded to avoid zoom controls) */}
        <div style={{
          position: 'absolute',
          top: '24px',
          left: '70px',
          zIndex: 400,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(12px)',
          padding: '12px 20px',
          borderRadius: '16px',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          maxWidth: '300px'
        }}>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', lineHeight: '1.4' }}>
            "We are here to manage your buses and update live locations instantly."
          </div>
        </div>

      </div>
    </div>
  );
};

export default BusMapWidget;
