import React, { useState } from 'react';
import MapComponent from './MapComponent';
import FlaggedLocations from './FlaggedLocations';

const LocationManager = () => {
  // Predefined locations in Dhaka, Bangladesh
  const initialLocations = [
    {
      id: '1',
      text: 'National Parliament House',
      position: [23.7615, 90.3788]
    },
    {
      id: '2',
      text: 'Dhaka University',
      position: [23.7356, 90.3925]
    },
    {
      id: '3',
      text: 'Lalbagh Fort',
      position: [23.7189, 90.3885]
    }
  ];

  const [flaggedLocations, setFlaggedLocations] = useState(initialLocations);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleLocationAdd = (newLocation) => {
    const locationWithId = {
      ...newLocation,
      id: Date.now().toString()
    };
    setFlaggedLocations([...flaggedLocations, locationWithId]);
  };

  const handleDeleteLocation = (id) => {
    setFlaggedLocations(flaggedLocations.filter(loc => loc.id !== id));
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location.position);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Disaster Information Map - Bangladesh</h1>
      <MapComponent 
        onLocationAdd={handleLocationAdd} 
        existingMarkers={flaggedLocations}
        center={[23.7500, 90.3900]} // Center map on Dhaka
        zoom={12} // Zoom level suitable for city view
        selectedLocation={selectedLocation}
      />
      <FlaggedLocations 
        locations={flaggedLocations} 
        onDelete={handleDeleteLocation}
        onSelect={handleLocationSelect}
      />
    </div>
  );
};

export default LocationManager;
