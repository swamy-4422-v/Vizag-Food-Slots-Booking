import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';

// Fix for missing marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const stallIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map view and resize
const MapController = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center && (center.lat || center.lng)) {
      map.setView([center.lat, center.lng], 14);
    }
    
    // Fix for grey tiles issue
    setTimeout(() => {
      map.invalidateSize();
    }, 400);
  }, [center, map]);
  
  return null;
};

const MapComponent = ({ stalls = [], userLoc }) => {
  // Vizag default center
  const defaultCenter = { lat: 17.6868, lng: 83.2185 };
  const center = userLoc || defaultCenter;

  // Validate coordinates
  const isValidCoord = (lat, lng) => {
    return lat && lng && !isNaN(lat) && !isNaN(lng) && 
           Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
  };

  return (
    <div className="h-full w-full relative z-0 border-4 border-white shadow-2xl rounded-[2.5rem] overflow-hidden">
      <MapContainer 
        center={[center.lat, center.lng]} 
        zoom={13} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController center={center} />

        {/* User Marker */}
        {userLoc && isValidCoord(userLoc.lat, userLoc.lng) && (
          <Marker 
            position={[userLoc.lat, userLoc.lng]} 
            icon={userIcon}
          >
            <Popup>
              <div className="text-center font-bold text-blue-600">
                📍 You're here in Vizag
              </div>
            </Popup>
          </Marker>
        )}

        {/* Food Stall Markers */}
        {stalls?.map(stall => {
          // MongoDB GeoJSON stores as [longitude, latitude]
          const coordinates = stall.location?.coordinates;
          
          if (!coordinates || coordinates.length !== 2) {
            console.warn('Stall missing coordinates:', stall.name);
            return null;
          }

          const position = [coordinates[1], coordinates[0]]; // [lat, lon]
          
          if (!isValidCoord(position[0], position[1])) {
            console.warn('Invalid coordinates for stall:', stall.name, position);
            return null;
          }

          const distance = stall.distance ? 
            `${stall.distance.toFixed(1)} km` : 
            (stall.distance === 0 ? 'Near you' : null);

          return (
            <Marker 
              key={stall._id} 
              position={position}
              icon={stallIcon}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[180px]">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-black text-gray-900 text-sm leading-tight uppercase">
                      {stall.name}
                    </h4>
                  </div>
                  
                  <p className="text-gray-500 text-[10px] mb-3 italic">
                    {stall.address}
                  </p>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      {distance && (
                        <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                          {distance}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                        {stall.category || 'Street Food'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-[10px]">
                      <span>⭐ {stall.rating?.toFixed(1) || '4.5'}</span>
                      <span>🕒 {stall.openingTime}-{stall.closingTime}</span>
                    </div>
                    
                    <Link 
                      to={`/book/${stall._id}`} 
                      className="block text-center bg-gray-900 text-white py-2 rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all no-underline mt-2"
                    >
                      Reserve Slot
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;