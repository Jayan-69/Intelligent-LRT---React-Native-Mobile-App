/**
 * Mongoose polyfill for React Native/Expo environment
 * This provides a compatible interface for using MongoDB in React Native
 */

// Create an ObjectId class that simulates MongoDB ObjectIds but works with strings
class ObjectId {
  constructor(id) {
    this.id = id || 'mock_id_' + Math.random().toString(36).substr(2, 9);
  }
  toString() {
    return this.id;
  }
}

// Create a mock Schema class that mimics mongoose Schema behavior
class Schema {
  constructor(definition, options) {
    this.definition = definition;
    this.options = options || {};
    // Create a static Types property that contains ObjectId
    this.Types = {
      ObjectId: ObjectId
    };
  }
  // Add any schema methods that might be used
  pre() { return this; }
  post() { return this; }
  virtual() { return { get: () => this }; }
}

// Add the Types property to Schema constructor as it's used statically
Schema.Types = {
  ObjectId: ObjectId
};

// Create a mock mongoose for React Native that will safely work with our schemas
const mockMongoose = {
  Schema: Schema,
  model: function(name, schema) {
    // Return a minimal model implementation for schema validation
    return {
      name: name,
      schema: schema,
      find: () => ({ lean: () => Promise.resolve([]) }),
      findById: () => ({ 
        lean: () => Promise.resolve(null), 
        populate: () => ({ 
          lean: () => Promise.resolve(null) 
        }) 
      }),
      findOne: () => ({ lean: () => Promise.resolve(null) }),
      create: (data) => Promise.resolve({...data, _id: new ObjectId()}),
      findByIdAndDelete: () => Promise.resolve(null),
      findByIdAndUpdate: () => Promise.resolve(null)
    };
  },
  connect: () => Promise.resolve({ connection: { host: 'mock-connection' }}),
  Types: {
    ObjectId: ObjectId
  }
};

// Log that we're using the mock implementation
console.log('Using mock MongoDB integration for React Native - Actual MongoDB connections will be simulated');

// Export the mock mongoose
module.exports = mockMongoose;
module.exports.default = mockMongoose;
