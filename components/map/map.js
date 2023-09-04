import React, { useRef, useEffect, useState, use } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import styles from "./map.module.css"

import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

const Map = ({ tripItinerary, currentItineraryItemIndex }) => {

  const initialLng = tripItinerary[currentItineraryItemIndex].longitude;
  const initialLat = tripItinerary[currentItineraryItemIndex].latitude;

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(initialLng);
  const [lat, setLat] = useState(initialLat);
  const [zoom, setZoom] = useState(15);

  useEffect(() => {
    const initialLng = tripItinerary[currentItineraryItemIndex].longitude;
    const initialLat = tripItinerary[currentItineraryItemIndex].latitude;
    setLng(initialLng);
    setLat(initialLat);
  }, [currentItineraryItemIndex, tripItinerary]);
   
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lat, lng],
      zoom: zoom
    });
  }), [];

  useEffect(() => {
    let locations = [];
    tripItinerary.forEach(location => {
      if (location.isLoading === false) {
        locations.push({longitude: location.longitude, latitude: location.latitude});
      }
    });
    // Loop through the locations array and add a marker for each object
    locations.forEach(obj => {
      // Create a new marker for the current object
      const marker = new mapboxgl.Marker({
        color: "#35977D",
      }).setLngLat([obj.latitude, obj.longitude])
        .addTo(map.current);
    });
  }, [tripItinerary]);    
   
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
    if (initialLat && initialLng) {
      map.current.flyTo({
        center: [initialLat, initialLng],
        zoom: map.current.getZoom(),
        speed: 1, // Adjust this value to control the animation speed
        curve: 1 // Adjust this value to control the animation curve
      });
    }
  }
  
  useEffect(() => {
    updateMapCenter();
  }, [initialLng, initialLat]);

  return (
    <div ref={mapContainer} className={styles.container} />
  );
};

export default Map;