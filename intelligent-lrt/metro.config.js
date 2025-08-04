// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Use our polyfilled entry point instead of the default one
  // This ensures all polyfills are loaded before the app
  entryPoint: './index.polyfilled.js',
});

// Fix for the source-map module resolution issue
config.resolver = {
  ...config.resolver,
  // Add support for all extensions
  sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json', 'cjs', 'mjs'],
  extraNodeModules: {
    // This ensures metro can find the source-map module properly
    'source-map': require.resolve('source-map'),
    // Handle nanoid/non-secure module resolution
    'nanoid/non-secure': path.resolve(__dirname, 'node_modules/nanoid'),
  },
  // Prevents newer versions of nanoid from trying to resolve node built-ins
  blockList: [/\/node_modules\/nanoid\/.*\.cjs/],
};

// Fix for the websocket reconnection issue with Expo Go
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Add CORS headers for better device connectivity
      res.setHeader('Access-Control-Allow-Origin', '*');
      return middleware(req, res, next);
    };
  },
};

// For better local development experience
config.watchFolders = [
  path.resolve(__dirname, './node_modules'),
  path.resolve(__dirname),
];

module.exports = config;
