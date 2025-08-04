// Mock implementation of the crypto module for React Native
module.exports = {
  getRandomValues: (arr) => {
    // Simple implementation that uses Math.random
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  },
  randomBytes: (size) => {
    const arr = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  }
};
