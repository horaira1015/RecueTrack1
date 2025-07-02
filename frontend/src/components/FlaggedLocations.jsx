import React from 'react';

const FlaggedLocations = ({ locations, onDelete, onSelect }) => {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      marginTop: '20px'
    }}>
      <h2 style={{ marginBottom: '20px' }}>Flagged Locations</h2>
      {locations.length === 0 ? (
        <p>No locations have been flagged yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '10px' }}>
          {locations.map((location) => (
            <div
              key={location.id}
              style={{
                backgroundColor: 'white',
                padding: '15px',
                borderRadius: '4px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onClick={() => onSelect(location)}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <div>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>{location.text}</p>
                <p style={{ margin: '0', color: '#666' }}>
                  Coordinates: {location.position[0].toFixed(4)}, {location.position[1].toFixed(4)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the parent onClick
                  onDelete(location.id);
                }}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlaggedLocations; 