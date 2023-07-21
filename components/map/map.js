import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import styles from "./map.module.css"

mapboxgl.accessToken = "pk.eyJ1IjoiYXJhbmJjIiwiYSI6ImNsa2NxYzh6MzB3a3UzZG13bjNnbGV6cTQifQ.o6EDhOAUXa278ksCZAdr7A";

const Map = ({ initialLng, initialLat }) => {
  console.log("initialLng:", initialLng);
  console.log("initialLat:", initialLat);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(initialLng);
  const [lat, setLat] = useState(initialLat);
  const [zoom, setZoom] = useState(13);
   
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
    container: mapContainer.current,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [lng, lat],
    zoom: zoom
    });
  });
   
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
    setLng(map.current.getCenter().lng.toFixed(4));
    setLat(map.current.getCenter().lat.toFixed(4));
    setZoom(map.current.getZoom().toFixed(2));
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