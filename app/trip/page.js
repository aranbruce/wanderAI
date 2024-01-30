import React, { Suspense } from 'react';
import Itinerary from '@/components/itinerary/itinerary';


const TripConent =  () => {
  return (
    <Suspense>
      <Itinerary/>
    </Suspense>
  )
}

export default TripConent;
