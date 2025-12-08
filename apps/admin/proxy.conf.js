const { loadEnvConfig } = require('../web/proxy-env-loader');

// Load environment variables
const env = loadEnvConfig();

const API_PORT = env.API_PORT || 3333;
const API_URL = env.API_URL || `http://localhost:${API_PORT}`;

console.log(`🔗 Angular Admin Proxy Configuration:`);
console.log(`   API Target: ${API_URL}`);
console.log(`   API Port: ${API_PORT}`);

// WebSocket URL uses ws:// protocol
const WS_URL = API_URL.replace('http://', 'ws://').replace(
  'https://',
  'wss://',
);

console.log(`   WebSocket Target: ${WS_URL}`);

module.exports = {
  // WebSocket MUST be before /api (more specific path first)
  '/api/ws': {
    target: WS_URL,
    secure: false,
    changeOrigin: true,
    ws: true,
    logLevel: 'debug',
  },
  '/api': {
    target: API_URL,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    headers: {
      'X-Proxy-Target': API_URL,
    },
  },
};
