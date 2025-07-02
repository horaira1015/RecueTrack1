import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component to handle map center changes
const MapController = ({ center, zoom }) => {
  const map = useMap();
  
  React.useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

const MapComponent = ({ 
  onLocationAdd, 
  existingMarkers = [], 
  center = [51.505, -0.09], // Default center (London)
  zoom = 13, // Default zoom level
  selectedLocation = null // New prop for selected location
}) => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [inputText, setInputText] = useState('');
  const mapRef = useRef(null);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setSelectedPoint({ lat, lng });
  };

  const handleAddMarker = () => {
    if (selectedPoint && inputText) {
      const newMarker = {
        position: [selectedPoint.lat, selectedPoint.lng],
        text: inputText,
      };
      onLocationAdd(newMarker);
      setSelectedPoint(null);
      setInputText('');
    }
  };

  return (
    <div style={{ height: '500px', width: '100%', position: 'relative' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        onClick={handleMapClick}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {existingMarkers.map((marker) => (
          <Marker key={marker.id} position={marker.position}>
            <Popup>{marker.text}</Popup>
          </Marker>
        ))}
        <MapController center={selectedLocation || center} zoom={zoom} />
      </MapContainer>
      
      {selectedPoint && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter location description"
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <button
            onClick={handleAddMarker}
            style={{
              padding: '5px 10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add Marker
          </button>
        </div>
      )}
    </div>
  );
};

export default MapComponent; 