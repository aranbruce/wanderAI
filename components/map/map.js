import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import styles from "./map.module.css"

import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

const Map = ({ response, day, timeOfDay }) => {
  const initialLng = response[day][timeOfDay].longitude;
  const initialLat = response[day][timeOfDay].latitude;

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(initialLng);
  const [lat, setLat] = useState(initialLat);
  const [zoom, setZoom] = useState(15);
   
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });
    
    if (initialLng && initialLat) {
      const longitudesAndLatitudes = response.flatMap(day => {
        return [
          { longitude: day.morning.longitude, latitude: day.morning.latitude },
          { longitude: day.afternoon.longitude, latitude: day.afternoon.latitude },
          { longitude: day.evening.longitude, latitude: day.evening.latitude }
        ];
      });
      // Loop through the longitudesAndLatitudes array and add a marker for each object
        longitudesAndLatitudes.forEach(obj => {
          // Create a new marker for the current object
          const marker = new mapboxgl.Marker({
            color: "#35977D",
          }).setLngLat([obj.longitude, obj.latitude])
            .addTo(map.current);
        });
      
    }

 
  });
   
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
    setLng(map.current.getCenter().lng.toFixed(4));
    setLat(map.current.getCenter().lat.toFixed(4));
    setZoom(map.current.getZoom().toFixed(6));
    });
  });

  // Update the map center whenever initialLng or initialLat change
  function updateMapCenter() {
    map.current.flyTo({
      center: [initialLng, initialLat],
      zoom: map.current.getZoom(),
      speed: 1, // Adjust this value to control the animation speed
      curve: 1 // Adjust this value to control the animation curve
    });
  }
  
  useEffect(() => {
    updateMapCenter();
  }, [initialLng, initialLat]);

  return (
    <div ref={mapContainer} className={styles.container} />
  );
};

export default Map;