import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

import { LocationProps } from "@/components/trip-content";

interface MapProps {
  tripItinerary: LocationProps[];
  currentItineraryItemIndex: number;
}

const Map = ({ tripItinerary, currentItineraryItemIndex }: MapProps) => {
  const initialLng =
    tripItinerary[currentItineraryItemIndex].coordinates.longitude;
  const initialLat =
    tripItinerary[currentItineraryItemIndex].coordinates.latitude;

  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [lng, setLng] = useState(initialLng);
  const [lat, setLat] = useState(initialLat);
  const [zoom, setZoom] = useState(15);

  useEffect(() => {
    const initialLng =
      tripItinerary[currentItineraryItemIndex].coordinates.longitude;
    const initialLat =
      tripItinerary[currentItineraryItemIndex].coordinates.latitude;
    setLng(initialLng);
    setLat(initialLat);
  }, [currentItineraryItemIndex, tripItinerary]);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
  }, []);

  useEffect(() => {
    let locations = [];
    tripItinerary.forEach((location) => {
      if (location.coordinates?.longitude && location.coordinates?.latitude) {
        locations.push({
          longitude: location.coordinates.longitude,
          latitude: location.coordinates.latitude,
        });
      }
    });

    // Remove markers that are no longer in the tripItinerary
    markersRef.current.forEach((marker) => {
      const markerLngLat = marker.getLngLat();
      const isInTripItinerary = locations.some(
        (loc) =>
          loc.longitude === markerLngLat.lng &&
          loc.latitude === markerLngLat.lat,
      );
      if (!isInTripItinerary) {
        marker.remove();
      }
    });

    // Filter out the markers that are still in the tripItinerary
    markersRef.current = markersRef.current.filter((marker) => {
      const markerLngLat = marker.getLngLat();
      return locations.some(
        (loc) =>
          loc.longitude === markerLngLat.lng &&
          loc.latitude === markerLngLat.lat,
      );
    });

    // Add new markers for locations in the tripItinerary
    locations.forEach((obj) => {
      const isMarkerExists = markersRef.current.some((marker) => {
        const markerLngLat = marker.getLngLat();
        return (
          markerLngLat.lng === obj.longitude &&
          markerLngLat.lat === obj.latitude
        );
      });

      if (!isMarkerExists) {
        const marker = new mapboxgl.Marker({
          color: "#35977D",
        })
          .setLngLat([obj.longitude, obj.latitude])
          .addTo(map.current);

        markersRef.current.push(marker);
      }
    });
  }, [tripItinerary]);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(6));
    });
  });

  // Update the map center whenever initialLng or initialLat change
  function updateMapCenter() {
    if (initialLat && initialLng) {
      map.current.flyTo({
        center: [initialLng, initialLat],
        zoom: map.current.getZoom(),
        speed: 1, // Adjust this value to control the animation speed
        curve: 1, // Adjust this value to control the animation curve
      });
    }
  }

  useEffect(() => {
    updateMapCenter();
  }, [initialLng, initialLat]);

  return (
    <div
      ref={mapContainer}
      className="ml-auto h-[calc(100vh-320px)] w-full md:h-screen md:w-[calc(100%-384px)] lg:w-[calc(100%-420px)]"
    />
  );
};

export default Map;
