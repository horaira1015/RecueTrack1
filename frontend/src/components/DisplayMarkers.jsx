import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import axios from 'axios';

const DisplayMarkers = () => {
  const [coordinates, setCoordinates] = useState([]);

  // Fetch the saved coordinates from the backend
  useEffect(() => {
    axios
      .get('http://localhost:5000/coordinates')
      .then((response) => {
        setCoordinates(response.data);
        // Initialize the map and add saved markers
        const map = L.map('map').setView([51.505, -0.09], 13);

        // Tile Layer from OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Add saved coordinates as markers on the map
        response.data.forEach((coordinate) => {
          L.marker([coordinate.latitude, coordinate.longitude])
            .addTo(map)
            .bindPopup(`<b>${coordinate.name}</b><br/>Latitude: ${coordinate.latitude}<br/>Longitude: ${coordinate.longitude}`);
        });
      })
      .catch((error) => {
        console.error('Error fetching the coordinates:', error);
      });
  }, []);

  return (
    <div>
      <h2>Saved Locations</h2>
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
    </div>
  );
};

export default DisplayMarkers;
