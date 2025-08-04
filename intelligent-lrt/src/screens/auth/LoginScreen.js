import React, { useCallback, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { googleSignIn } from '../../redux/slices/authSlice';
import { useGoogleAuth, getGoogleUserInfo } from '../../utils/googleAuth';
import { useTheme } from '../../context/ThemeContext';

const LoginScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);
  const { colors } = useTheme();
  
  // Use our custom Google auth hook - it returns an array, not an object
  const [request, response, promptAsync] = useGoogleAuth();
  
  // Handle Google sign-in prompt
  const handleGoogleSignIn = useCallback(async () => {
    try {
      if (!request) {
        console.log('Google Auth request not ready yet');
        Alert.alert('Authentication Error', 'Google Sign-In is not ready. Please try again in a moment.');
        return;
      }
      
      console.log('Starting Google Auth prompt...');
      // Launch the Google authentication flow - response will be handled in the useEffect
      await promptAsync();
    } catch (error) {
      console.error('Google authentication error:', error);
      Alert.alert('Authentication Error', 'There was a problem with Google Sign-In. Please try again.');
    }
  }, [request, promptAsync]);
  
  // Process authentication response when available
  React.useEffect(() => {
    if (response) {
      console.log('Google auth response received:', response.type);
      
      if (response.type === 'success') {
        getGoogleUserInfo(response)
          .then(userInfo => {
            console.log('Successfully processed user info:', userInfo.email);
            dispatch(googleSignIn(userInfo));
          })
          .catch(error => {
            console.error('Error processing Google auth response:', error);
            Alert.alert('Authentication Error', 'Could not complete Google Sign-In. Please try again.');
          });
      } else if (response.type === 'cancel') {
        console.log('Google Sign-In was cancelled by user');
      } else {
        console.log('Google Sign-In failed:', response.type);
        Alert.alert('Authentication Error', 'Google Sign-In failed. Please try again.');
      }
    }
  }, [response, dispatch]);

  // Handle direct login for different user types
  const handleDirectLogin = (role) => {
    let userData;
    
    switch (role) {
      case 'user':
        userData = {
          id: 'user-123',
          name: 'John Doe',
          email: 'user@lrt.com',
          role: 'user'
        };
        break;
      case 'admin':
        userData = {
          id: 'admin-123',
          name: 'Admin User',
          email: 'admin@lrt.com',
          role: 'admin'
        };
        break;
      case 'superadmin':
        userData = {
          id: 'superadmin-123',
          name: 'Super Admin',
          email: 'superadmin@lrt.com',
          role: 'superadmin'
        };
        break;
      default:
        return;
    }
    
    dispatch(googleSignIn(userData));
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo and Title Section */}
        <View style={styles.logoSection}>
          <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
            <Text style={[styles.logoText, { color: colors.textLight }]}>LRT</Text>
          </View>
          <Text style={[styles.appTitle, { color: colors.text }]}>
            Intelligent LRT
          </Text>
          <Text style={[styles.appSubtitle, { color: colors.text }]}>
            Smart Railway Management System
          </Text>
        </View>

        {/* Login Options Section */}
        <View style={styles.loginSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Choose Your Role
          </Text>
          
          {/* User Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.primary }]}
            onPress={() => handleDirectLogin('user')}
            disabled={isLoading}
          >
            <View style={styles.buttonContent}>
              <Text style={[styles.buttonText, { color: colors.textLight }]}>
                Login as User
              </Text>
              <Text style={[styles.buttonSubtext, { color: colors.textLight }]}>
                View schedules, notices, and track trains
              </Text>
            </View>
            <Text style={[styles.buttonIcon, { color: colors.textLight }]}>→</Text>
          </TouchableOpacity>

          {/* SuperAdmin Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.primaryDark }]}
            onPress={() => handleDirectLogin('superadmin')}
            disabled={isLoading}
          >
            <View style={styles.buttonContent}>
              <Text style={[styles.buttonText, { color: colors.textLight }]}>
                Login as SuperAdmin
              </Text>
              <Text style={[styles.buttonSubtext, { color: colors.textLight }]}>
                Manage schedules, notices, and system settings
              </Text>
            </View>
            <Text style={[styles.buttonIcon, { color: colors.textLight }]}>→</Text>
          </TouchableOpacity>

          {/* Admin Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.buttonBackground }]}
            onPress={() => handleDirectLogin('admin')}
            disabled={isLoading}
          >
            <View style={styles.buttonContent}>
              <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                Login as Admin
              </Text>
              <Text style={[styles.buttonSubtext, { color: colors.buttonText }]}>
                Monitor trains and manage operations
              </Text>
            </View>
            <Text style={[styles.buttonIcon, { color: colors.buttonText }]}>→</Text>
          </TouchableOpacity>

          {/* Google Sign-In Button */}
          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.text }]}>OR</Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>

          <TouchableOpacity
            style={[styles.googleButton, { backgroundColor: colors.card }]}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Text style={[styles.googleButtonText, { color: colors.text }]}>
              Continue with Google
            </Text>
          </TouchableOpacity>
        </View>

        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Signing in...
            </Text>
          </View>
        )}

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.text }]}>
            © 2024 Intelligent LRT System
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  loginSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonContent: {
    flex: 1,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  buttonSubtext: {
    fontSize: 14,
    opacity: 0.9,
  },
  buttonIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  googleButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    fontSize: 12,
    opacity: 0.6,
  },
});

export default LoginScreen;
