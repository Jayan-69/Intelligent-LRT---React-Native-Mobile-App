require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
// CORS configuration - simplified to allow all connections
// This is a more reliable approach for mobile development
app.use(cors());

// Add headers to all responses for better CORS handling
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    return res.status(200).json({});
  }
  next();
});

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

// DB Connection
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    
    const PORT = process.env.PORT || 5001;

    // Get local IP addresses for better connectivity information
    const { networkInterfaces } = require('os');
    const getLocalIpAddresses = () => {
      const nets = networkInterfaces();
      const results = {};

      for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
          // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
          if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
              results[name] = [];
            }
            results[name].push(net.address);
          }
        }
      }
      return results;
    };

    // Start server with explicit IP logging
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n=== SERVER STARTED SUCCESSFULLY ===`);
      console.log(`Server is running on port ${PORT}`);
      console.log('Listening on all network interfaces (0.0.0.0)');
      
      // Log all available IP addresses
      console.log('\nAVAILABLE IP ADDRESSES:');
      const ipAddresses = getLocalIpAddresses();
      Object.keys(ipAddresses).forEach(interfaceName => {
        ipAddresses[interfaceName].forEach(ip => {
          console.log(`- Interface ${interfaceName}: http://${ip}:${PORT}/test`);
        });
      });
      
      console.log('\nTo test locally, visit: http://localhost:5001/test');
      console.log('For your mobile device, use one of the IP addresses listed above.');
      console.log('=== SERVER CONFIGURATION COMPLETE ===\n');
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

// Start the server
startServer();

// Enhanced test endpoint for checking server connectivity
app.get('/test', (req, res) => {
  // Get client IP and connection info
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];
  
  // Return detailed connectivity information
  res.json({ 
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    server: {
      hostname: require('os').hostname(),
      platform: process.platform,
      nodeVersion: process.version,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage()
    },
    client: {
      ip: clientIp,
      userAgent: userAgent,
      protocol: req.protocol
    },
    database: {
      connected: mongoose.connection.readyState === 1,
      name: mongoose.connection.name || 'Unknown'
    }
  });
});

// API Routes
const trainRoutes = require('./routes/trainRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const trainNoticeRoutes = require('./routes/trainNoticeRoutes');
const routeRoutes = require('./routes/routeRoutes');

app.use('/api/trains', trainRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/notices', trainNoticeRoutes); // New routes for train notices and quick messages
app.use('/api/routes', routeRoutes); // New routes for schedule management

// Server is started in the startServer function after MongoDB connection is established
