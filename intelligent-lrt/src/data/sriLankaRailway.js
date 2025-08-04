// Sri Lankan Railway Network Data for the LRT route with 20 stations
// Based on the specified stations list for intercity, express, and slow stations

// Station types defined based on trainData.js
export const stationTypes = {
  intercity: ['Ragama', 'Pettah', 'Kirulapona'], // Only stops at these three
  express: ['Ragama', 'Kadawatha', 'Kiribathgoda', 'Paliyagoda', 'Maradana', 'Pettah', 'Bambalapitiya', 'Kirulapona'], // Major stations
  slow: [ // All 20 stations
    'Ragama', 'Pahala Karagahamuna', 'Kadawatha', 'Mahara', 'Kiribathgoda',
    'Tyre Junction', 'Pattiya Junction', 'Paliyagoda', 'Ingurukade Junction', 'Armour Street Junction',
    'Maradana', 'Pettah', 'Slave Island', 'Gangaramaya', 'Kollupitiya',
    'Bambalapitiya', 'Bauddhaloka Mawatha', 'Thimbirigasyaya', 'Havelock Town', 'Kirulapona'
  ] 
};

// Define all stations on the route - exactly 20 stations as specified
export const stations = [
  {
    id: 'stn-001',
    name: 'Ragama',
    code: 'RGM',
    stationType: 'intercity', // Intercity station
    coordinates: {
      latitude: 7.0310,
      longitude: 79.9218
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: true,
      hasRestrooms: true
    }
  },
  {
    id: 'stn-002',
    name: 'Pahala Karagahamuna',
    code: 'PKG',
    stationType: 'slow',
    coordinates: {
      latitude: 7.0171,
      longitude: 79.9120
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: false,
      hasRestrooms: false
    }
  },
  {
    id: 'stn-003',
    name: 'Kadawatha',
    code: 'KDW',
    stationType: 'express',
    coordinates: {
      latitude: 7.0004,
      longitude: 79.9022
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: true,
      hasRestrooms: true
    }
  },
  {
    id: 'stn-004',
    name: 'Mahara',
    code: 'MHR',
    stationType: 'slow',
    coordinates: {
      latitude: 6.9923,
      longitude: 79.8964
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: false,
      hasRestrooms: false
    }
  },
  {
    id: 'stn-005',
    name: 'Kiribathgoda',
    code: 'KRB',
    stationType: 'express',
    coordinates: {
      latitude: 6.9764,
      longitude: 79.8921
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: true,
      hasRestrooms: true
    }
  },
  {
    id: 'stn-006',
    name: 'Tyre Junction',
    code: 'TYR',
    stationType: 'slow',
    coordinates: {
      latitude: 6.9682,
      longitude: 79.8868
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: false,
      hasRestrooms: false
    }
  },
  {
    id: 'stn-007',
    name: 'Pattiya Junction',
    code: 'PTJ',
    stationType: 'slow',
    coordinates: {
      latitude: 6.9612,
      longitude: 79.8820
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: false,
      hasRestrooms: false
    }
  },
  {
    id: 'stn-008',
    name: 'Paliyagoda',
    code: 'PLG',
    stationType: 'express',
    coordinates: {
      latitude: 6.9555,
      longitude: 79.8789
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: true,
      hasRestrooms: true
    }
  },
  {
    id: 'stn-009',
    name: 'Ingurukade Junction',
    code: 'IGJ',
    stationType: 'slow',
    coordinates: {
      latitude: 6.9490,
      longitude: 79.8722
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: false,
      hasRestrooms: false
    }
  },
  {
    id: 'stn-010',
    name: 'Armour Street Junction',
    code: 'ASJ',
    stationType: 'slow',
    coordinates: {
      latitude: 6.9429,
      longitude: 79.8656
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: false,
      hasRestrooms: false
    }
  },
  {
    id: 'stn-011',
    name: 'Maradana',
    code: 'MRD',
    stationType: 'express',
    coordinates: {
      latitude: 6.9284,
      longitude: 79.8635
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: true,
      hasRestrooms: true
    }
  },
  {
    id: 'stn-012',
    name: 'Pettah',
    code: 'PTH',
    stationType: 'intercity',
    coordinates: {
      latitude: 6.9368,
      longitude: 79.8584
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: true,
      hasRestrooms: true
    }
  },
  {
    id: 'stn-013',
    name: 'Slave Island',
    code: 'SLI',
    stationType: 'slow',
    coordinates: {
      latitude: 6.9261,
      longitude: 79.8478
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: false,
      hasRestrooms: false
    }
  },
  {
    id: 'stn-014',
    name: 'Gangaramaya',
    code: 'GRM',
    stationType: 'slow',
    coordinates: {
      latitude: 6.9181,
      longitude: 79.8513
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: false,
      hasRestrooms: false
    }
  },
  {
    id: 'stn-015',
    name: 'Kollupitiya',
    code: 'KLP',
    stationType: 'slow',
    coordinates: {
      latitude: 6.9118,
      longitude: 79.8500
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: true,
      hasRestrooms: true
    }
  },
  {
    id: 'stn-016',
    name: 'Bambalapitiya',
    code: 'BBL',
    stationType: 'express',
    coordinates: {
      latitude: 6.8993,
      longitude: 79.8512
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: true,
      hasRestrooms: true
    }
  },
  {
    id: 'stn-017',
    name: 'Bauddhaloka Mawatha',
    code: 'BDM',
    stationType: 'slow',
    coordinates: {
      latitude: 6.8892,
      longitude: 79.8587
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: false,
      hasRestrooms: false
    }
  },
  {
    id: 'stn-018',
    name: 'Thimbirigasyaya',
    code: 'TBG',
    stationType: 'slow',
    coordinates: {
      latitude: 6.8827,
      longitude: 79.8648
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: false,
      hasRestrooms: false
    }
  },
  {
    id: 'stn-019',
    name: 'Havelock Town',
    code: 'HVT',
    stationType: 'slow',
    coordinates: {
      latitude: 6.8748,
      longitude: 79.8703
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: false,
      hasRestrooms: false
    }
  },
  {
    id: 'stn-020',
    name: 'Kirulapona',
    code: 'KRP',
    stationType: 'intercity',
    coordinates: {
      latitude: 6.8681,
      longitude: 79.8792
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: true,
      hasRestrooms: true
    }
  }
];

// Define train routes - Single route from Ragama to Kirulapone
export const routes = [
  {
    id: 'route-001',
    name: 'Sri Lanka Railway Main Line',
    description: 'Ragama to Kirulapona via Pettah',
    stations: [
      { id: 'stn-001', stopOrder: 1, distanceFromStart: 0 },      // Ragama
      { id: 'stn-002', stopOrder: 2, distanceFromStart: 1.5 },     // Pahala Karagahamuna
      { id: 'stn-003', stopOrder: 3, distanceFromStart: 3.2 },     // Kadawatha
      { id: 'stn-004', stopOrder: 4, distanceFromStart: 4.7 },     // Mahara
      { id: 'stn-005', stopOrder: 5, distanceFromStart: 6.1 },     // Kiribathgoda
      { id: 'stn-006', stopOrder: 6, distanceFromStart: 7.4 },     // Tyre Junction
      { id: 'stn-007', stopOrder: 7, distanceFromStart: 8.6 },     // Pattiya Junction
      { id: 'stn-008', stopOrder: 8, distanceFromStart: 10.0 },    // Paliyagoda
      { id: 'stn-009', stopOrder: 9, distanceFromStart: 11.8 },    // Ingurukade Junction
      { id: 'stn-010', stopOrder: 10, distanceFromStart: 13.5 },   // Armour Street Junction
      { id: 'stn-011', stopOrder: 11, distanceFromStart: 15.2 },   // Maradana
      { id: 'stn-012', stopOrder: 12, distanceFromStart: 16.8 },   // Pettah
      { id: 'stn-013', stopOrder: 13, distanceFromStart: 18.4 },   // Slave Island
      { id: 'stn-014', stopOrder: 14, distanceFromStart: 20.1 },   // Gangaramaya
      { id: 'stn-015', stopOrder: 15, distanceFromStart: 21.6 },   // Kollupitiya
      { id: 'stn-016', stopOrder: 16, distanceFromStart: 23.2 },   // Bambalapitiya
      { id: 'stn-017', stopOrder: 17, distanceFromStart: 25.0 },   // Bauddhaloka Mawatha
      { id: 'stn-018', stopOrder: 18, distanceFromStart: 26.7 },   // Thimbirigasyaya
      { id: 'stn-019', stopOrder: 19, distanceFromStart: 28.4 },   // Havelock Town
      { id: 'stn-020', stopOrder: 20, distanceFromStart: 30.0 }    // Kirulapona
    ],
    totalDistance: 30.0
  }
];

// Define train types
export const trainTypes = [
  {
    id: 'train-type-001',
    name: 'Intercity Express',
    description: 'Fast service that stops only at main stations',
    stopsAt: ['intercity'] // Only stops at intercity stations
  },
  {
    id: 'train-type-002',
    name: 'Express',
    description: 'Faster service that stops at main and express stations',
    stopsAt: ['intercity', 'express'] // Stops at intercity and express stations
  },
  {
    id: 'train-type-003',
    name: 'Slow',
    description: 'Regular service that stops at all stations',
    stopsAt: ['intercity', 'express', 'slow'] // Stops at all stations
  }
];

// Define mock trains - all using the single route from Ragama to Kirulapona
export const trains = [
  {
    id: 'train-001',
    trainNumber: 'IC-001',
    name: 'Ragama - Kirulapona Intercity',
    type: 'intercity',
    route: 'route-001',
    capacity: 250,
    status: 'On Time',
    delayMinutes: 0,
    currentLocation: {
      stationId: 'stn-001',
      coordinates: {
        latitude: 7.0310,
        longitude: 79.9218
      }
    }
  },
  {
    id: 'train-002',
    trainNumber: 'EXP-101',
    name: 'Express Service',
    type: 'express',
    route: 'route-001',
    capacity: 200,
    status: 'On Time',
    delayMinutes: 0,
    currentLocation: {
      stationId: 'stn-005',
      coordinates: {
        latitude: 6.9764,
        longitude: 79.8921
      }
    }
  },
  {
    id: 'train-003',
    trainNumber: 'SLW-205',
    name: 'All Stations Service',
    type: 'slow',
    route: 'route-001',
    capacity: 180,
    status: 'Delayed',
    delayMinutes: 10,
    currentLocation: {
      stationId: 'stn-010',
      coordinates: {
        latitude: 6.9500,
        longitude: 79.8800
      }
    }
  },
  {
    id: 'train-004',
    trainNumber: 'EXP-102',
    name: 'Express Service 2',
    type: 'express',
    route: 'route-001',
    capacity: 200,
    status: 'On Time',
    delayMinutes: 0,
    currentLocation: {
      stationId: 'stn-015',
      coordinates: {
        latitude: 6.9200,
        longitude: 79.8700
      }
    }
  }
];

// Function to get stations for a specific train type
export const getStationsForTrainType = (trainTypeId) => {
  const trainType = trainTypes.find(type => type.id === trainTypeId);
  if (!trainType) return [];
  
  return stations.filter(station => trainType.stopsAt.includes(station.stationType));
};

// Function to get stations for a specific route
export const getStationsForRoute = (routeId) => {
  const route = routes.find(r => r.id === routeId);
  if (!route) return [];
  
  return route.stations.map(routeStation => {
    const station = stations.find(s => s.id === routeStation.id);
    return {
      ...station,
      stopOrder: routeStation.stopOrder,
      distanceFromStart: routeStation.distanceFromStart
    };
  }).sort((a, b) => a.stopOrder - b.stopOrder);
};

// Function to get all stops for a train
export const getTrainStops = (trainId, trainTypeId) => {
  const train = trains.find(t => t.id === trainId);
  if (!train) {
    console.log('No train found with ID:', trainId);
    return [];
  }
  
  const route = routes.find(r => r.id === train.route);
  if (!route) {
    console.log('No route found for train:', train.id);
    return [];
  }
  
  // Direct mapping for string type names to trainType objects
  const trainTypeMap = {
    'intercity': trainTypes[0], // Intercity Express
    'express': trainTypes[1],   // Express
    'slow': trainTypes[2]        // Slow
  };
  
  // Find train type by id or by string type name
  const trainType = trainTypeId ? 
    trainTypes.find(type => type.id === trainTypeId) : 
    trainTypeMap[train.type];
  
  if (!trainType) {
    console.log('Train type not found for', train.type, 'using first available type');
    return route.stations
      .map(routeStation => {
        const station = stations.find(s => s.id === routeStation.id);
        return {
          ...station,
          stopOrder: routeStation.stopOrder,
          distanceFromStart: routeStation.distanceFromStart
        };
      })
      .sort((a, b) => a.stopOrder - b.stopOrder);
  }
  
  return route.stations
    .map(routeStation => {
      const station = stations.find(s => s.id === routeStation.id);
      if (!station) return null;
      
      // Check if this station type is in the trainType's stopsAt array
      const shouldStop = trainType.stopsAt.includes(station.stationType);
      if (!shouldStop) return null;
      
      return {
        ...station,
        stopOrder: routeStation.stopOrder,
        distanceFromStart: routeStation.distanceFromStart
      };
    })
    .filter(station => station !== null)
    .sort((a, b) => a.stopOrder - b.stopOrder);
};
