/**
 * Sri Lankan Train System Data
 */

// All stations on the complete route
export const stations = [
  'Ragama',
  'Pahala Karagahamuna',
  'Kadawatha',
  'Mahara',
  'Kiribathgoda',
  'Tyre Junction',
  'Pattiya Junction',
  'Paliyagoda',
  'Ingurukade Junction',
  'Armour Street Junction',
  'Maradana',
  'Pettah',
  'Slave Island',
  'Gangaramaya',
  'Kollupitiya',
  'Bambalapitiya',
  'Bauddhaloka Mawatha',
  'Thimbirigasyaya',
  'Havelock Town',
  'Kirulapona'
];

// Express train stations - only stops at these major stations
export const expressStations = [
  'Ragama',
  'Kadawatha',
  'Kiribathgoda',
  'Paliyagoda',
  'Maradana',
  'Pettah',
  'Bambalapitiya',
  'Kirulapona'
];

// Intercity train stations - only stops at these three stations
export const intercityStations = [
  'Ragama',
  'Pettah',
  'Kirulapona'
];

// Train types with descriptions
export const trainTypes = {
  I: {
    name: 'Intercity',
    description: 'Stops only at three stations: Ragama, Pettah, and Kirulapona. Operates during office hours.',
    price: 2.5  // 2.5x base price
  },
  E: {
    name: 'Express',
    description: 'Stops at key stations like Ragama, Kirulapona, and other major stations.'
  },
  S: {
    name: 'Slow',
    description: 'Stops at all stations along the route.'
  },

};



// Complete train schedule with up and down trains
export const trainSchedule = [
  // Intercity Trains - Morning Office Hours
  {
    trainCode: 'I1',
    trainType: 'I',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '07:30 AM',
    stops: intercityStations,
    returnTrainCode: 'I1-1',
    returnDepartureTime: '08:45 AM',
    period: 'Morning Office Hours'
  },
  {
    trainCode: 'I2',
    trainType: 'I',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '08:30 AM',
    stops: intercityStations,
    returnTrainCode: 'I2-1',
    returnDepartureTime: '09:45 AM',
    period: 'Morning Office Hours'
  },
  // Return Intercity Trains
  {
    trainCode: 'I1-1',
    trainType: 'I',
    from: 'Kirulapona',
    to: 'Ragama',
    departureTime: '08:45 AM',
    stops: intercityStations.slice().reverse(),
    period: 'Morning Office Hours'
  },
  {
    trainCode: 'I2-1',
    trainType: 'I',
    from: 'Kirulapona',
    to: 'Ragama',
    departureTime: '09:45 AM',
    stops: intercityStations.slice().reverse(),
    period: 'Morning Office Hours'
  },

  // Morning Office Hours (6:00 AM - 9:00 AM) - UP TRAINS
  {
    trainCode: 'E1',
    trainType: 'E',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '06:00 AM',
    stops: expressStations,
    returnTrainCode: 'E1-1',
    returnDepartureTime: '07:15 AM',
    period: 'Morning Office Hours'
  },
  {
    trainCode: 'E2',
    trainType: 'E',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '07:00 AM',
    stops: expressStations,
    returnTrainCode: 'E2-1',
    returnDepartureTime: '08:15 AM',
    period: 'Morning Office Hours'
  },
  {
    trainCode: 'E3',
    trainType: 'E',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '08:00 AM',
    stops: expressStations,
    returnTrainCode: 'E3-1',
    returnDepartureTime: '09:15 AM',
    period: 'Morning Office Hours'
  },
  {
    trainCode: 'S1',
    trainType: 'S',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '06:15 AM',
    stops: stations,
    returnTrainCode: 'S1-1',
    returnDepartureTime: '07:45 AM',
    period: 'Morning Office Hours'
  },
  {
    trainCode: 'S2',
    trainType: 'S',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '06:45 AM',
    stops: stations,
    returnTrainCode: 'S2-1',
    returnDepartureTime: '08:15 AM',
    period: 'Morning Office Hours'
  },
  {
    trainCode: 'S3',
    trainType: 'S',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '07:45 AM',
    stops: stations,
    returnTrainCode: 'S3-1',
    returnDepartureTime: '09:15 AM',
    period: 'Morning Office Hours'
  },
  {
    trainCode: 'S4',
    trainType: 'S',
    from: 'Ragama',
    to: 'Pettah',
    departureTime: '06:15 AM',
    stops: stations.slice(0, stations.indexOf('Pettah') + 1),
    returnTrainCode: 'S4-1',
    returnDepartureTime: '07:30 AM',
    period: 'Morning Office Hours'
  },
  {
    trainCode: 'S5',
    trainType: 'S',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '06:45 AM',
    stops: stations,
    returnTrainCode: 'S5-1',
    returnDepartureTime: '08:15 AM',
    period: 'Morning Office Hours'
  },
  {
    trainCode: 'S6',
    trainType: 'S',
    from: 'Ragama',
    to: 'Pettah',
    departureTime: '07:45 AM',
    stops: stations.slice(0, stations.indexOf('Pettah') + 1),
    returnTrainCode: 'S6-1',
    returnDepartureTime: '09:00 AM',
    period: 'Morning Office Hours'
  },
  {
    trainCode: 'I1',
    trainType: 'I',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '07:00 AM',
    stops: intercityStations,
    returnTrainCode: 'I1-1',
    returnDepartureTime: '08:30 AM',
    period: 'Morning Office Hours'
  },
  {
    trainCode: 'S1',
    trainType: 'S',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '06:30 AM',
    stops: stations, // Slow train stops at all stations
    returnTrainCode: 'S1-1',
    returnDepartureTime: '07:45 AM',
    period: 'Morning Office Hours'
  },
  {
    trainCode: 'E2',
    trainType: 'E',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '07:00 AM',
    stops: expressStations,
    returnTrainCode: 'E2-1',
    returnDepartureTime: '08:15 AM',
    period: 'Morning Office Hours'
  },
  {
    trainCode: 'E3',
    trainType: 'E',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '08:00 AM',
    stops: expressStations,
    returnTrainCode: 'E3-1',
    returnDepartureTime: '09:15 AM',
    period: 'Morning Office Hours'
  },
  {
    trainCode: 'S2',
    trainType: 'S',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '08:30 AM',
    stops: stations, // Slow train stops at all stations
    returnTrainCode: 'S2-1',
    returnDepartureTime: '09:45 AM',
    period: 'Morning Office Hours'
  },

  {
    trainCode: 'I1',
    trainType: 'I',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '07:00 AM',
    stops: intercityStations,
    returnTrainCode: 'I1-1',
    returnDepartureTime: '08:30 AM',
    period: 'Morning Office Hours'
  },
  
    // Evening Office Hours (4:00 PM - 7:00 PM) - UP TRAINS
  {
    trainCode: 'E4',
    trainType: 'E',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '04:00 PM',
    stops: expressStations,
    returnTrainCode: 'E4-1',
    returnDepartureTime: '05:15 PM',
    period: 'Evening Office Hours'
  },
  {
    trainCode: 'E5',
    trainType: 'E',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '05:00 PM',
    stops: expressStations,
    returnTrainCode: 'E5-1',
    returnDepartureTime: '06:15 PM',
    period: 'Evening Office Hours'
  },
  {
    trainCode: 'E6',
    trainType: 'E',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '06:00 PM',
    stops: expressStations,
    returnTrainCode: 'E6-1',
    returnDepartureTime: '07:15 PM',
    period: 'Evening Office Hours'
  },
  {
    trainCode: 'S7',
    trainType: 'S',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '04:15 PM',
    stops: stations,
    returnTrainCode: 'S7-1',
    returnDepartureTime: '05:45 PM',
    period: 'Evening Office Hours'
  },
  {
    trainCode: 'S8',
    trainType: 'S',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '04:45 PM',
    stops: stations,
    returnTrainCode: 'S8-1',
    returnDepartureTime: '06:15 PM',
    period: 'Evening Office Hours'
  },
  {
    trainCode: 'S9',
    trainType: 'S',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '05:45 PM',
    stops: stations,
    returnTrainCode: 'S9-1',
    returnDepartureTime: '07:15 PM',
    period: 'Evening Office Hours'
  },
  {
    trainCode: 'S10',
    trainType: 'S',
    from: 'Ragama',
    to: 'Pettah',
    departureTime: '04:15 PM',
    stops: stations.slice(0, stations.indexOf('Pettah') + 1),
    returnTrainCode: 'S10-1',
    returnDepartureTime: '05:30 PM',
    period: 'Evening Office Hours'
  },
  {
    trainCode: 'S11',
    trainType: 'S',
    from: 'Ragama',
    to: 'Pettah',
    departureTime: '05:45 PM',
    stops: stations.slice(0, stations.indexOf('Pettah') + 1),
    returnTrainCode: 'S11-1',
    returnDepartureTime: '07:00 PM',
    period: 'Evening Office Hours'
  },
  
  // Non-Office Hours (10:00 AM - 4:00 PM & 7:00 PM onwards) - UP TRAINS
  {
    trainCode: 'E1',
    trainType: 'E',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '10:00 AM',
    stops: expressStations,
    returnTrainCode: 'E1-1',
    returnDepartureTime: '11:15 AM',
    period: 'Non-Office Hours'
  },
  {
    trainCode: 'E2',
    trainType: 'E',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '12:00 PM',
    stops: expressStations,
    returnTrainCode: 'E2-1',
    returnDepartureTime: '01:15 PM',
    period: 'Non-Office Hours'
  },
  {
    trainCode: 'E3',
    trainType: 'E',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '02:00 PM',
    stops: expressStations,
    returnTrainCode: 'E3-1',
    returnDepartureTime: '03:15 PM',
    period: 'Non-Office Hours'
  },
  {
    trainCode: 'S12',
    trainType: 'S',
    from: 'Ragama',
    to: 'Pettah',
    departureTime: '10:15 AM',
    stops: stations.slice(0, stations.indexOf('Pettah') + 1),
    returnTrainCode: 'S12-1',
    returnDepartureTime: '11:30 AM',
    period: 'Non-Office Hours'
  },
  {
    trainCode: 'S13',
    trainType: 'S',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '10:45 AM',
    stops: stations,
    returnTrainCode: 'S13-1',
    returnDepartureTime: '12:15 PM',
    period: 'Non-Office Hours'
  },
  {
    trainCode: 'S14',
    trainType: 'S',
    from: 'Ragama',
    to: 'Pettah',
    departureTime: '11:15 AM',
    stops: stations.slice(0, stations.indexOf('Pettah') + 1),
    returnTrainCode: 'S14-1',
    returnDepartureTime: '12:30 PM',
    period: 'Non-Office Hours'
  },
  {
    trainCode: 'S15',
    trainType: 'S',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '11:45 AM',
    stops: stations,
    returnTrainCode: 'S15-1',
    returnDepartureTime: '01:15 PM',
    period: 'Non-Office Hours'
  },
  {
    trainCode: 'S16',
    trainType: 'S',
    from: 'Ragama',
    to: 'Pettah',
    departureTime: '12:15 PM',
    stops: stations.slice(0, stations.indexOf('Pettah') + 1),
    returnTrainCode: 'S16-1',
    returnDepartureTime: '01:30 PM',
    period: 'Non-Office Hours'
  },

  // DOWN TRAINS (Return journeys)
  // Morning Office Hours
  {
    trainCode: 'E1-1',
    trainType: 'E',
    from: 'Kirulapona',
    to: 'Ragama',
    departureTime: '07:15 AM',
    stops: expressStations.slice().reverse(),
    period: 'Morning Office Hours'
  },
  {
    trainCode: 'E2-1',
    trainType: 'E',
    from: 'Kirulapona',
    to: 'Ragama',
    departureTime: '08:15 AM',
    stops: expressStations.slice().reverse(),
    period: 'Morning Office Hours'
  },
  {
    trainCode: 'S1-1',
    trainType: 'S',
    from: 'Kirulapona',
    to: 'Ragama',
    departureTime: '07:45 AM',
    stops: stations.slice().reverse(),
    period: 'Morning Office Hours'
  },
  {
    trainCode: 'I1-1',
    trainType: 'I',
    from: 'Kirulapona',
    to: 'Ragama',
    departureTime: '08:30 AM',
    stops: intercityStations.slice().reverse(),
    period: 'Morning Office Hours'
  },

  // Evening Office Hours - Down
  {
    trainCode: 'E4-1',
    trainType: 'E',
    from: 'Kirulapona',
    to: 'Ragama',
    departureTime: '05:15 PM',
    stops: expressStations.slice().reverse(),
    period: 'Evening Office Hours'
  },
  {
    trainCode: 'S7-1',
    trainType: 'S',
    from: 'Kirulapona',
    to: 'Ragama',
    departureTime: '05:45 PM',
    stops: stations.slice().reverse(),
    period: 'Evening Office Hours'
  },

  // Non-Office Hours - Down
  {
    trainCode: 'E1-1',
    trainType: 'E',
    from: 'Kirulapona',
    to: 'Ragama',
    departureTime: '11:15 AM',
    stops: expressStations.slice().reverse(),
    period: 'Non-Office Hours'
  },
  {
    trainCode: 'S13-1',
    trainType: 'S',
    from: 'Kirulapona',
    to: 'Ragama',
    departureTime: '12:15 PM',
    stops: stations.slice().reverse(),
    period: 'Non-Office Hours'
  }
];

/**
 * Fare calculation for different routes and train types
 * Prices are in LKR (Sri Lankan Rupees)
 */
export const fareMatrix = {
  'Ragama-Pettah': {
    'E': 150,
    'S': 125,
    'I': 200
  },
  'Pettah-Kirulapona': {
    'E': 150,
    'S': 125,
    'I': 200
  },
  'Ragama-Kirulapona': {
    'E': 200,
    'S': 175,
    'I': 400
  }
};

// Base fares by distance (station count)
const baseFares = {
  'E': { // Express
    short: 125,  // 1-5 stations
    medium: 175, // 6-10 stations
    long: 200    // 11+ stations
  },
  'S': { // Slow
    short: 100,
    medium: 125,
    long: 175
  },
  'I': { // Intercity
    short: 200,
    medium: 300,
    long: 400
  }
};

/**
 * Calculate fare between two stations
 */
export const calculateFare = (fromStation, toStation, trainType) => {
  // Check for direct route pricing
  const routeKey = `${fromStation}-${toStation}`;
  const reverseRouteKey = `${toStation}-${fromStation}`;
  
  if (fareMatrix[routeKey] && fareMatrix[routeKey][trainType]) {
    return fareMatrix[routeKey][trainType];
  }
  
  if (fareMatrix[reverseRouteKey] && fareMatrix[reverseRouteKey][trainType]) {
    return fareMatrix[reverseRouteKey][trainType];
  }
  
  // Calculate based on distance
  const fromIndex = stations.indexOf(fromStation);
  const toIndex = stations.indexOf(toStation);
  
  if (fromIndex === -1 || toIndex === -1) {
    return 0; // Invalid stations
  }
  
  const stationCount = Math.abs(fromIndex - toIndex);
  
  // Determine distance category
  let distanceCategory;
  if (stationCount <= 5) {
    distanceCategory = 'short';
  } else if (stationCount <= 10) {
    distanceCategory = 'medium';
  } else {
    distanceCategory = 'long';
  }
  
  return baseFares[trainType][distanceCategory];
};

/**
 * Find all available trains between two stations
 * @param {string} fromStation - Starting station
 * @param {string} toStation - Destination station
 * @returns {Array} Array of matching trains
 */
export const findAvailableTrains = (fromStation, toStation) => {
  if (!fromStation || !toStation || fromStation === toStation) {
    return [];
  }

  // A more robust way to find trains, checking the stops array
  const matchingTrains = trainSchedule.filter(train => {
    const fromIndex = train.stops.indexOf(fromStation);
    const toIndex = train.stops.indexOf(toStation);
    
    // The train is available if both stations are in its stop list
    // and the departure station comes before the arrival station.
    return fromIndex > -1 && toIndex > -1 && fromIndex < toIndex;
  });

  return matchingTrains;
};

// Helper function to format LKR price
export const formatPrice = (price) => {
  return `LKR ${price}`;
};
