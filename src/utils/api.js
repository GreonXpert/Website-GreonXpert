// API base for the GreonXpert public site.
//
// After the website-admin migration this points at the unified Work Manager
// backend (which serves the old /api/<name> routes as aliases). Override for
// local dev with REACT_APP_API_BASE in .env.local (e.g. http://localhost:5001).
export const API_BASE =
  process.env.REACT_APP_API_BASE || 'https://api.manage.greonxpert.com';

// Socket.IO connections use the unauthenticated `/public` namespace — the
// merged backend's default namespace requires a JWT.
export const SOCKET_URL = `${API_BASE}/public`;
