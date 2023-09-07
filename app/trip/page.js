'use client'

import React, { use, useEffect, useState }  from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import Map from '@/components/map/map'
import Loading from '@/components/loading/loading'
import SignUpModal from '@/components/signUpModal/signUpModal'
import LocationCard from '@/components/locationCard/locationCard'
import { AnimatePresence } from "framer-motion"


const Itinerary = () => {
  const [tripItinerary, setTripItinerary] = useState([]);
  const [currentItineraryItemIndex, setCurrentItineraryItemIndex] = useState(0);
  const [haveLocations, setHaveLocations] = useState(false);
  const [isFinishedAPICall, setIsFinishedAPICall] = useState(false);
  const[isLoading, setIsLoading] = useState(true);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    checkIfSearchParamsHaveChanged();
    console.log("Checking search params")
  }, [searchParams]);

  useEffect(() => {
    if (isFinishedAPICall) {
      console.log("Updating local storage")
      updateLocalStorage();
    }
  }, [isFinishedAPICall]);

  useEffect(() => {
    if (haveLocations) {
      console.log("Getting the tripItinerary item details")
      fetchItineraryDetails();
    }
  }, [haveLocations]);

  const getNewSearchParams = () => {
    const destination = searchParams.get("destination");
    const duration = searchParams.get("duration");
    const preferences = searchParams.getAll("preferences");
    return {destination, duration, preferences};
  };

  const getPreviousSearchParams = () => {
    const previousDestination = localStorage?.getItem('destination') ?? null;
    const previousDuration = localStorage?.getItem('duration') ?? null;
    const previousPreferences = JSON.parse(localStorage?.getItem('preferences')) ?? null;
    return {previousDestination, previousDuration, previousPreferences};
  }

  const checkIfSearchParamsHaveChanged = () => {
    const previousTripItinerary = JSON.parse(localStorage.getItem('tripItinerary')) ?? [];
    console.log("previousTripItinerary: ", previousTripItinerary);
    const {destination, duration, preferences} = getNewSearchParams();
    const sortedPreferences = preferences.slice().sort();

    const {previousDestination, previousDuration, previousPreferences} = getPreviousSearchParams();
    const sortedPreviousPreferences = previousPreferences ? previousPreferences.slice().sort() : [];

    if (previousTripItinerary.length < 1 || destination !== previousDestination || duration !== previousDuration || JSON.stringify(sortedPreferences) !== JSON.stringify(sortedPreviousPreferences)) {
      console.log("Search params have changed");
      createLocations({});
    } else {
      console.log("Search params have not changed");
      setTripItinerary(previousTripItinerary);
      setIsFinishedAPICall(true);
      setIsLoading(false);
    }
  };

  const {destination, duration, preferences} = getNewSearchParams();

  const timesOfDay = ["morning", "lunch", "afternoon", "evening"];

  const createLocations = () => {
    console.log("Creating locations");
    setTripItinerary([]);
    // add object to the array for each tripItinerary item
    for (let i = 0; i < duration; i++) {
      for (let j = 0; j < timesOfDay.length; j++) {
        setTripItinerary(prevState => [...prevState, {
          "id": i * timesOfDay.length + j,
          "isLoading": true,
          "day": i+1,
          "timeOfDay": timesOfDay[j],
        }]);
      }
    }
    setHaveLocations(true);
  }

  const fetchItineraryDetails = async () => {
    // Fetch google places data
    console.log("Getting places from Google Places...");
    const googlePlacesResponse = await fetch('/api/places', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "destination": destination,
        "preferences": preferences,
      }),
    });
    const googlePlacesResponseString = await googlePlacesResponse.text();

    const messages = [
      {
        role: 'system',
        content: 
        `Plan a trip to ${destination} for ${duration} days. Include a variety of locations that match the following preferences: ${preferences.join(', ')}
        Select appropriate locations by matching the types to the preferences.
        You can use some of the following locations from Google: ${googlePlacesResponseString}
        Use the id from Google for each location.
        Describe each location in detail using 2 sentences.
        Do not include the rating in the desciption.
        Do not include the location in the desciption.
        Group locations that are located closely together on the same day.
        Provide the itinerary in the following format as valid JSON:
        """
        {
          "id": "id from Google",
          "location": "Location Name",
          "description": "Description of the location",
        }
        """`
      }
    ];

    for (let i = 0; i < tripItinerary.length; i++) {
      const itineraryItem = tripItinerary[i];
      const userMessage = {
        role: 'user',
        content: `Provide me a location and description for the ${itineraryItem.timeOfDay} of day ${itineraryItem.day} as valid JSON matching the previously described format.`
      };

      messages.push(userMessage);
      const chatGPTResponse = await fetch("/api/trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages,
        }),
      });
      const chatGPTResponseText = await chatGPTResponse.text();
      const chatGPTResponseJson = await JSON.parse(chatGPTResponseText);
      const location = chatGPTResponseJson.location;
      const description = chatGPTResponseJson.description;
      const id = chatGPTResponseJson.id;

      const assistantMessage = {
        role: 'assistant',
        content: `${JSON.stringify(chatGPTResponseJson)}`
      };
      
      // Fetch place details from Google
      console.log("Getting details from Google Places...");
      const placeDetailsResponse = await fetch("/api/place-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });

      const placeDetailsResponseText = await placeDetailsResponse.text();
      const placeDetailsResponseJson = await JSON.parse(placeDetailsResponseText);

      const longitude = placeDetailsResponseJson.result.geometry.location.lng;
      const latitude = placeDetailsResponseJson.result.geometry.location.lat;
      const rating = placeDetailsResponseJson.result.rating;
      const photos = placeDetailsResponseJson.result.photos;
      const photoReferences = photos.map(photo => photo.photo_reference);

      // Update the location value of the current itineraryItem
      const updatedItinerary = [...tripItinerary];
      updatedItinerary[i].location = location;
      updatedItinerary[i].description = description;
      updatedItinerary[i].longitude = longitude;
      updatedItinerary[i].latitude = latitude;
      updatedItinerary[i].rating = rating;
      updatedItinerary[i].photoReferences = photoReferences;
      updatedItinerary[i].isLoading = false;

      // console.log("updatedItinerary: ", updatedItinerary);

      messages.push(assistantMessage);
      setTripItinerary(updatedItinerary);
      
      if (i > 0) {
        setIsLoading(false);
      }
    }
    
    // Update the trip itinerary with the new itinerary
    setIsFinishedAPICall(true);
  }

  const increaseTimeOfDay = () => {
    if (currentItineraryItemIndex === tripItinerary.length - 1) {
      setIsSignUpModalOpen(true);
    }
    else {
      setCurrentItineraryItemIndex(currentItineraryItemIndex + 1);
    }
  } 

  const decreaseTimeOfDay = () => {
    if (currentItineraryItemIndex === 0) {
      router.push('/')
    } else {
      setCurrentItineraryItemIndex(currentItineraryItemIndex - 1);
    }
  }

  const updateLocalStorage = () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('destination', destination);
      localStorage.setItem('duration', duration);
      localStorage.setItem('preferences', JSON.stringify(preferences));
      localStorage.setItem('tripItinerary', JSON.stringify(tripItinerary));
    };
  };

  return (
    <>
      {!isLoading ?
          <>
            <Map
              tripItinerary={tripItinerary}
              currentItineraryItemIndex={currentItineraryItemIndex}
            />
            <LocationCard
              location={tripItinerary[currentItineraryItemIndex].location}
              day={tripItinerary[currentItineraryItemIndex].day}
              timeOfDay={tripItinerary[currentItineraryItemIndex].timeOfDay}
              description={tripItinerary[currentItineraryItemIndex].description}
              rating={tripItinerary[currentItineraryItemIndex].rating}
              photoReferences={tripItinerary[currentItineraryItemIndex].photoReferences}
              isLoading={tripItinerary[currentItineraryItemIndex].isLoading}
              increaseTimeOfDay={increaseTimeOfDay}
              decreaseTimeOfDay={decreaseTimeOfDay}
            />
          </>
        :
        <Loading/>    
      }
    <AnimatePresence>
    {isSignUpModalOpen && 
      <SignUpModal setIsSignUpModalOpen={setIsSignUpModalOpen} isSignUpModalOpen={isSignUpModalOpen} />
    }
    </AnimatePresence>
          
    </>
  );
}



export default Itinerary