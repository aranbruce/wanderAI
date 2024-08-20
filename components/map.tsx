import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

import { LocationProps } from "@/components/trip-content";

interface MapProps {
  tripItinerary: LocationProps[];
  currentItineraryItemIndex: number;
  isLoading: boolean;
}

const Map = ({
  tripItinerary,
  currentItineraryItemIndex,
  isLoading,
}: MapProps) => {
  const initialLng =
    tripItinerary[currentItineraryItemIndex]?.coordinates?.longitude ??
    -122.4194;
  const initialLat =
    tripItinerary[currentItineraryItemIndex]?.coordinates?.latitude || 37.7749;

  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [lng, setLng] = useState(initialLng);
  const [lat, setLat] = useState(initialLat);
  const [zoom, setZoom] = useState(15);

  useEffect(() => {
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
    if (isLoading || !Array.isArray(tripItinerary)) return; // wait for the tripItinerary to load and ensure it's an array

    const locations = tripItinerary
      .filter(
        (location) =>
          location.coordinates?.longitude && location.coordinates?.latitude,
      )
      .map((location) => ({
        longitude: location.coordinates.longitude,
        latitude: location.coordinates.latitude,
      }));

    const locationSet = new Set(
      locations.map((loc) => `${loc.longitude},${loc.latitude}`),
    );

    // Remove markers that are no longer in the tripItinerary
    markersRef.current.forEach((marker, index) => {
      const markerLngLat = marker.getLngLat();
      const markerKey = `${markerLngLat.lng},${markerLngLat.lat}`;
      if (!locationSet.has(markerKey)) {
        marker.remove();
        markersRef.current.splice(index, 1); // Remove from the array
      }
    });

    // Get the coordinates of the current itinerary item
    const currentItineraryItem = tripItinerary[currentItineraryItemIndex];
    const currentLongitude = currentItineraryItem?.coordinates?.longitude;
    const currentLatitude = currentItineraryItem?.coordinates?.latitude;

    // Add new markers for locations in the tripItinerary
    locations.forEach((obj) => {
      const markerExists = markersRef.current.some((marker) => {
        const markerLngLat = marker.getLngLat();
        return (
          markerLngLat.lng === obj.longitude &&
          markerLngLat.lat === obj.latitude
        );
      });

      if (!markerExists) {
        const isCurrentItem =
          obj.longitude === currentLongitude &&
          obj.latitude === currentLatitude;
        const markerColor = isCurrentItem ? "#347463" : "#55C4A7"; // Red for current item, green for others
        const marker = new mapboxgl.Marker({
          color: markerColor,
        })
          .setLngLat([obj.longitude, obj.latitude])
          .addTo(map.current);

        markersRef.current.push(marker);
      }
    });
  }, [isLoading, tripItinerary, currentItineraryItemIndex]);

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

  function updateMarkerColor() {
    // Remove all markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Re-add markers
    tripItinerary.forEach((location, index) => {
      const isCurrentItem = index === currentItineraryItemIndex;
      const markerColor = isCurrentItem ? "#347463" : "#55C4A7"; // Red for current item, green for others
      const marker = new mapboxgl.Marker({
        color: markerColor,
      })
        .setLngLat([
          location.coordinates.longitude,
          location.coordinates.latitude,
        ])
        .addTo(map.current);

      markersRef.current.push(marker);
    });
  }

  useEffect(() => {
    updateMapCenter();
  }, [initialLng, initialLat]);

  useEffect(() => {
    updateMarkerColor();
  }, [currentItineraryItemIndex]);

  return (
    <div
      ref={mapContainer}
      className={`ml-auto w-full md:absolute md:right-0 md:h-screen md:w-[calc(100%-384px)] lg:w-[calc(100%-420px)] ${isLoading && "animate-pulse"} `}
    />
  );
};

export default Map;
