const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Function to get local IP addresses
function getLocalIPAddresses() {
  return new Promise((resolve, reject) => {
    exec('ipconfig', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Error getting IP addresses:', error);
        reject(error);
        return;
      }
      
      const lines = stdout.split('\n');
      const ips = [];
      
      for (const line of lines) {
        // Look for IPv4 addresses
        const match = line.match(/IPv4 Address[^:]*:\s*(\d+\.\d+\.\d+\.\d+)/);
        if (match) {
          const ip = match[1];
          // Filter out localhost and private IPs that might work
          if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
            ips.push(ip);
          }
        }
      }
      
      resolve(ips);
    });
  });
}

// Function to test if an IP is reachable
async function testIP(ip, port = 5001) {
  return new Promise((resolve) => {
    const http = require('http');
    const req = http.request({
      hostname: ip,
      port: port,
      path: '/test',
      method: 'GET',
      timeout: 2000
    }, (res) => {
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

// Main function to update server IP
async function updateServerIP() {
  try {
    console.log('🔍 Detecting local IP addresses...');
    const ips = await getLocalIPAddresses();
    
    if (ips.length === 0) {
      console.log('❌ No suitable IP addresses found');
      return;
    }
    
    console.log('📋 Found IP addresses:', ips);
    
    // Test each IP
    for (const ip of ips) {
      console.log(`🧪 Testing IP: ${ip}`);
      const isReachable = await testIP(ip);
      
      if (isReachable) {
        console.log(`✅ IP ${ip} is reachable!`);
        
        // Update the API config file
        const apiConfigPath = path.join(__dirname, 'src', 'config', 'apiConfig.js');
        
        if (fs.existsSync(apiConfigPath)) {
          let content = fs.readFileSync(apiConfigPath, 'utf8');
          
          // Update the IP addresses array to prioritize the working IP
          const newIPs = [
            ip,
            '192.168.153.49',  // Current main network IP
            '192.168.56.1',    // VirtualBox network IP
            '192.168.86.1',  // Local database IP
            '10.0.2.2',  // Android emulator
            'localhost',
            '127.0.0.1',
            ...ips.filter(testIP => testIP !== ip)
          ];
          
          // Create the new IP array string
          const ipArrayString = `[\n  // Platform-specific IPs\n  ...(Platform.OS === 'android' ? ['10.0.2.2'] : []),\n  ...(Platform.OS === 'ios' ? ['localhost'] : []),\n  \n  // Common development IPs\n  '${newIPs.join("',\n  '")}',\n  \n  // Localhost variants\n  'localhost',\n  '127.0.0.1',\n  \n  // Genymotion and other emulator IPs\n  '10.0.3.2',\n  '10.0.2.2'\n]`;
          
          // Replace the IP_ADDRESSES_TO_TRY array
          content = content.replace(
            /const IP_ADDRESSES_TO_TRY = \[[\s\S]*?\];/,
            `const IP_ADDRESSES_TO_TRY = ${ipArrayString};`
          );
          
          fs.writeFileSync(apiConfigPath, content, 'utf8');
          console.log(`✅ Updated API config with working IP: ${ip}`);
          console.log(`📱 Your mobile app should now connect to: http://${ip}:5001`);
        } else {
          console.log('❌ API config file not found');
        }
        
        return;
      } else {
        console.log(`❌ IP ${ip} is not reachable`);
      }
    }
    
    console.log('❌ No reachable IP addresses found');
    console.log('💡 Make sure your backend server is running on port 5001');
    
  } catch (error) {
    console.error('❌ Error updating server IP:', error.message);
  }
}

// Run the update
updateServerIP(); 