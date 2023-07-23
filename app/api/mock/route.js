export async function POST(req) {
  const body = await req.json();

  console.log("body:", body);

  const responseText = 
    `[
      {
        "morning": {
          "location": "Buckingham Palace",
          "description": "Start your morning with a visit to Buckingham Palace, the official residence of the Queen. Marvel at the grandeur of the palace and watch the Changing of the Guard ceremony.",
          "longitude": -0.1416,
          "latitude": 51.5014
        },
        "afternoon": {
          "location": "British Museum",
          "description": "Spend your afternoon exploring the British Museum, home to a vast collection of art and artifacts from around the world. Discover ancient Egyptian mummies, Greek sculptures, and the iconic Rosetta Stone.",
          "longitude": -0.1269,
          "latitude": 51.5194
        },
        "evening": {
          "location": "Covent Garden",
          "description": "In the evening, head to Covent Garden, a vibrant district filled with shops, restaurants, and street performers. Enjoy a delicious dinner at one of the many eateries and catch a live performance at the Royal Opera House.",
          "longitude": -0.1226,
          "latitude": 51.5117
        }
      },
      {
        "morning": {
          "location": "Tower of London",
          "description": "Start your morning with a visit to the Tower of London, a historic castle that has served as a royal palace, prison, and treasury. Explore the Crown Jewels and learn about the tower's fascinating history.",
          "longitude": -0.0760,
          "latitude": 51.5081
        },
        "afternoon": {
          "location": "St. Paul's Cathedral",
          "description": "Afterwards, head to St. Paul's Cathedral, an iconic London landmark. Climb to the top of the dome for panoramic views of the city and explore the beautiful interior of the cathedral.",
          "longitude": -0.0986,
          "latitude": 51.5138
        },
        "evening": {
          "location": "The Shard",
          "description": "In the evening, visit The Shard, the tallest building in London. Take in breathtaking views of the city from the observation deck and enjoy a drink at one of the rooftop bars.",
          "longitude": -0.0857,
          "latitude": 51.5045
        }
      }
    ]`

  return new Response (responseText, {status: 200})

}