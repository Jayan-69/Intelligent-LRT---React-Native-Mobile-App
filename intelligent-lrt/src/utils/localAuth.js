/**
 * Local authentication utility for testing when Google auth is not working
 * This allows testing the app functionality while Google OAuth issues are being resolved
 *
 * ⚠️ DEVELOPMENT USE ONLY ⚠️
 * This module should be removed before production deployment
 * It is intended only to help bypass Google Auth issues during development
 */

/**
 * Mock authentication for development/testing
 * @param {string} role - The role to authenticate as ('user', 'admin', or 'superadmin')
 * @returns {Object} User data with the specified role
 */
export const authenticateWithRole = (role = 'user') => {
  // Validate role
  const validRole = ['user', 'admin', 'superadmin'].includes(role) ? role : 'user';
  
  // Create mock user data
  const mockUserData = {
    id: `local-${validRole}-${Date.now()}`,
    email: `test-${validRole}@example.com`,
        name: 'User',
    picture: 'https://via.placeholder.com/150',
    role: validRole,
    authProvider: 'local',
  };
  
  console.log(`[LOCAL AUTH] Authenticated as ${validRole} for testing`);
  return mockUserData;
};

/**
 * Helper function to create a mock auth response similar to Google Auth
 * @param {string} role - The role to authenticate as
 * @returns {Object} Mock response object
 */
export const createMockAuthResponse = (role = 'user') => {
  return {
    type: 'success',
    params: {
      access_token: `mock-token-${Date.now()}`,
      token_type: 'bearer',
    },
    authentication: null,
    user: authenticateWithRole(role),
  };
};
