import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

import { LocationProps } from "@/components/trip-content";
import Button from "./button";
import SearchIcon from "@/images/icons/search-icon";

interface MapProps {
  destination: any;
  duration: number;
  preferences: string[];
  tripItinerary: LocationProps[];
  currentItineraryItemIndex: number;
}

export default function Map({
  destination,
  duration,
  preferences,
  tripItinerary,
  currentItineraryItemIndex,
}: MapProps) {
  const initialLng =
    tripItinerary[currentItineraryItemIndex]?.coordinates?.longitude ?? null;
  const initialLat =
    tripItinerary[currentItineraryItemIndex]?.coordinates?.latitude || null;

  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [lng, setLng] = useState(initialLng);
  const [lat, setLat] = useState(initialLat);
  const [zoom, setZoom] = useState(3);

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
    if (!Array.isArray(tripItinerary)) {
      console.error("tripItinerary is not an array");
      return; // ensure tripItinerary is an array
    }

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
  }, [tripItinerary, currentItineraryItemIndex]);

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
        zoom: 15,
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
      if (
        !location?.coordinates?.longitude ||
        !location?.coordinates?.latitude
      ) {
        return;
      }
      const marker = new mapboxgl.Marker({
        color: markerColor,
      })
        .setLngLat([
          location?.coordinates?.longitude,
          location?.coordinates?.latitude,
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
    <div className="relative ml-auto h-[calc(100%-300px)] w-full md:absolute md:right-0 md:h-screen md:w-[calc(100%-384px)] lg:w-[calc(100%-420px)]">
      <div className="margin-x-auto absolute left-0 right-0 top-2 flex w-full flex-col items-center">
        <div
          onClick={() => {
            console.log("Book trip");
          }}
          className="z-50 flex min-w-48 cursor-pointer flex-row items-center justify-between gap-2 rounded-full border border-gray-300 bg-white py-1 pl-3 pr-1 text-sm font-medium shadow-medium"
        >
          <div>{destination?.name}</div>
          <div className="h-5 w-[1px] min-w-[1px] border-l border-gray-300"></div>
          <div>
            {duration} {duration === 1 ? "day" : "days"}
          </div>
          <div className="h-5 w-[1px] min-w-[1px] border-r border-gray-300"></div>

          <div>
            {preferences?.length}{" "}
            {preferences?.length > 1 ? "preferences" : "preference"}
          </div>
          <Button
            isCircular
            size="small"
            onClick={() => {
              console.log("Book trip");
            }}
          >
            <SearchIcon height="24" width="24" />
          </Button>
        </div>
      </div>
      <div ref={mapContainer} className={`h-full w-full`} />
    </div>
  );
}
