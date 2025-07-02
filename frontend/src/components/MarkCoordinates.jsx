import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const MarkCoordinates = () => {
  const [locationName, setLocationName] = useState('');
  const [clickedCoordinates, setClickedCoordinates] = useState(null);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const mapContainerRef = useRef(null); // Ref for map container
  const mapRef = useRef(null); // Ref for Leaflet map instance

  useEffect(() => {
    if (!mapContainerRef.current) {
      console.error("Map container not available.");
      return;
    }

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [51.505, -0.09],
        zoom: 13,
        layers: [
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
          }),
        ],
      });

      mapRef.current.whenReady(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              mapRef.current.setView([latitude, longitude], 13);
            },
            (error) => {
              console.error('Error getting location:', error);
            }
          );
        }
      });

      mapRef.current.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setClickedCoordinates({ lat, lng });
        setIsInputVisible(true);
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  const saveCoordinate = () => {
    if (!locationName || !clickedCoordinates) {
      alert('Please provide a location name and ensure your coordinates are set.');
      return;
    }

    const { lat, lng } = clickedCoordinates;

    // Sending data to the backend
    axios
      .post('http://localhost:5000/api/location/addcoordinate', {
        latitude: lat,
        longitude: lng,
        name: locationName,
      })
      .then((response) => {
        console.log('Coordinate saved:', response.data);
        setLocationName('');
        setIsInputVisible(false);
        setClickedCoordinates(null);
      })
      .catch((error) => {
        console.error('Error saving coordinate:', error);
      });
  };

  return (
    <div>
      <h2>Mark Your Location</h2>
      <div
        ref={mapContainerRef}
        style={{ height: '400px', width: '100%', position: 'relative' }}
      ></div>

      {isInputVisible && clickedCoordinates && (
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter a name for this location"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
          />
          <button onClick={saveCoordinate}>Save Location</button>
        </div>
      )}
    </div>
  );
};

export default MarkCoordinates;
