export const environment = {
  production: true,
  // Set explicit API URL if API is on different domain
  // Leave empty if using reverse proxy (same domain)
  apiUrl: '', // e.g., 'https://api.example.com' or '' for same domain
  features: {
    enableComponentShowcase: false, // Disable in production
  },
  websocket: {
    path: '/api/ws/',
    timeout: 20000,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
    forceSecure: true, // Force WSS in production
    transports: ['websocket', 'polling'],
    upgrade: true,
    autoConnect: false,
  },
};
