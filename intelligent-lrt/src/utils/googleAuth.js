import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { Platform } from 'react-native';

// Important: This tells Expo to handle the redirect
WebBrowser.maybeCompleteAuthSession();

// UPDATED CLIENT IDS - Make sure these are correct in Google Cloud Console
// Web client ID (mandatory for Expo Go)
const WEB_CLIENT_ID = '1012899577234-mkntpb2dq8b577rt66v0en9uea8a7ba8.apps.googleusercontent.com';
// Android client ID
const ANDROID_CLIENT_ID = '1012899577234-lg1aebchvnsv36tqre6oqa69p473uj2r.apps.googleusercontent.com';

// Log environment details - helpful for debugging
console.log('Environment:', { 
  platform: Platform.OS,
  expoVersion: require('expo/package.json').version,
});

/**
 * Hook for Google authentication with expo-auth-session
 * @returns {Array} Array containing request, response, and promptAsync function
 */
export const useGoogleAuth = () => {
  // FORCE the exact Expo proxy URL that's whitelisted in Google Cloud Console
  const redirectUri = 'https://auth.expo.io/@anonymous/intelligent-lrt-management';
  console.log('Hardcoded redirect URI:', redirectUri);

  // Log all auth configuration - helpful for debugging
  console.log('Auth configuration:', { 
    WEB_CLIENT_ID, 
    ANDROID_CLIENT_ID,
    redirectUri,
    platform: Platform.OS,
    useProxy: true,
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: WEB_CLIENT_ID,          // generic clientId field
    androidClientId: ANDROID_CLIENT_ID,
    scopes: ['profile', 'email'],
    redirectUri,
    useProxy: true,                  // <— critical for Expo Go
    responseType: 'token',           // we will receive access_token
  });
  
  useEffect(() => {
    if (response?.type === 'success') {
      console.log('Google auth successful, received token');
    } else if (response) {
      console.log('Google auth response type:', response.type);
    }
  }, [response]);

  return [request, response, promptAsync];
};

/**
 * Get user information from Google using the provided authentication response
 * @param {Object} response - The authentication response from Google
 * @returns {Promise<Object>} User data with determined role
 */
export const getGoogleUserInfo = async (response) => {
  try {
    // Log full response for debugging (but mask sensitive information)
    console.log('Google auth response received:', {
      type: response?.type,
      hasParams: response?.params ? 'yes' : 'no',
      hasToken: response?.params?.access_token ? 'yes' : 'no',
    });

    if (!response || response.type !== 'success') {
      throw new Error(`Authentication failed or cancelled: ${response?.type || 'No response'}`);
    }

    // Get the access token from the response params
    const { access_token } = response.params;
    if (!access_token) {
      throw new Error('No access token returned by Google');
    }

    // Log token length for debugging (don't log the actual token for security)
    console.log(`Access token received with length: ${access_token.length}`);

    // Fetch user profile using the token
    console.log('Fetching user profile from Google...');
    const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    
    // Handle potential API errors with more details
    if (!res.ok) {
      const txt = await res.text();
      console.error('Google API error response:', { status: res.status, body: txt });
      throw new Error(`Failed to fetch user info: ${res.status} ${txt}`);
    }
    
    const googleData = await res.json();
    console.log('Google user info received for:', googleData.email);

    // Build user object
    const userData = {
      id: googleData.id,
      email: googleData.email,
      name: googleData.name || googleData.email.split('@')[0],
      picture: googleData.picture,
      role: 'user',
    };
    
    // Set specific roles for known emails
    if (userData.email === 'jayanmihisara8@gmail.com') {
      userData.role = 'superadmin';
    } else if (userData.email === 'jayanperera0609@gmail.com') {
      userData.role = 'admin';
    }
    
    console.log(`Google auth successful - User ${userData.email} with role ${userData.role}`);
    return userData;
  } catch (error) {
    console.error('Error processing Google authentication:', error);
    throw error;
  }
};
