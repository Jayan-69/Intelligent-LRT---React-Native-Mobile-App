import { trainTypes } from '../data/sriLankaRailway';

// Map string type names to train type IDs
export const trainTypeMap = {
  'intercity': 'train-type-001', // Intercity Express
  'express': 'train-type-002',   // Express
  'slow': 'train-type-003'       // Slow
};

// Get train type ID from string name
export const getTrainTypeId = (typeName) => {
  if (!typeName) return null;
  
  // If it's already an ID, return it
  if (typeName.startsWith('train-type-')) {
    return typeName;
  }
  
  // Get ID from map or return the first train type as fallback
  const typeId = trainTypeMap[typeName.toLowerCase()];
  if (!typeId) {
    console.warn(`Train type not found for ${typeName}, using default`);
    return trainTypes[0]?.id || null;
  }
  
  return typeId;
};

// Get train type name from ID
export const getTrainTypeName = (typeId) => {
  if (!typeId) return 'Unknown';
  
  const trainType = trainTypes.find(type => type.id === typeId);
  return trainType ? trainType.name : 'Unknown';
};

// Get train type object from ID or string name
export const getTrainType = (typeIdOrName) => {
  if (!typeIdOrName) return null;
  
  // Convert string name to ID if needed
  const typeId = getTrainTypeId(typeIdOrName);
  
  return trainTypes.find(type => type.id === typeId) || null;
};
