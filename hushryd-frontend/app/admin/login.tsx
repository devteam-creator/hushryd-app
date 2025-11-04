import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../../constants/Design';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLoginScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!formData.email.trim() || !formData.password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    console.log('=== LOGIN DEBUG START ===');
    console.log('Form data:', { email: formData.email, password: '***' });
    console.log('useAuth hook:', { login: typeof login });
    
    setIsLoading(true);
    try {
      console.log('Calling login function...');
      const result = await login(formData.email, formData.password);
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Login successful, navigating to dashboard...');
        // Try push instead of replace
        router.push('/admin/dashboard' as any);
      } else {
        console.log('Login failed:', result.message);
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Login error in component:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
      console.log('=== LOGIN DEBUG END ===');
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Please contact your system administrator to reset your password.',
      [{ text: 'OK' }]
    );
  };

  const handleBackToHome = () => {
    router.replace('/(tabs)/' as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with Back Button */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToHome}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={[styles.backText, { color: colors.text }]}>Back to Home</Text>
        </TouchableOpacity>
      </View>

      {/* Centered Login Card */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.loginCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.large]}>
            {/* Logo Section */}
            <View style={styles.logoSection}>
              <Text style={styles.logoIcon}>🚗</Text>
              <Text style={[styles.logoTitle, { color: colors.text }]}>HushRyd</Text>
              <Text style={[styles.logoSubtitle, { color: colors.textSecondary }]}>Admin Portal</Text>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              <View style={styles.formHeader}>
                <Text style={[styles.formTitle, { color: colors.text }]}>Welcome Back</Text>
                <Text style={[styles.formSubtitle, { color: colors.textSecondary }]}>
                  Sign in to access the admin dashboard
                </Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Email Address</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                    placeholder="admin@hushryd.com"
                    placeholderTextColor={colors.textSecondary}
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Password</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.textSecondary}
                    value={formData.password}
                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
                  <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.loginButton, { backgroundColor: colors.primary }, isLoading && styles.loginButtonDisabled]}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <Text style={styles.loginButtonText}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Demo Credentials Section */}
            <View style={styles.demoSection}>
              <Text style={[styles.demoTitle, { color: colors.textSecondary }]}>Demo Credentials</Text>
              <View style={styles.credentialsGrid}>
                <View style={[styles.credentialCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.credentialLabel, { color: colors.textSecondary }]}>Super Admin</Text>
                  <Text style={[styles.credentialText, { color: colors.text }]}>admin@hushryd.com</Text>
                  <Text style={[styles.credentialText, { color: colors.text }]}>admin123</Text>
                </View>
                <View style={[styles.credentialCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.credentialLabel, { color: colors.textSecondary }]}>Support Agent</Text>
                  <Text style={[styles.credentialText, { color: colors.text }]}>support@hushryd.com</Text>
                  <Text style={[styles.credentialText, { color: colors.text }]}>support123</Text>
                </View>
                <View style={[styles.credentialCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.credentialLabel, { color: colors.textSecondary }]}>Manager</Text>
                  <Text style={[styles.credentialText, { color: colors.text }]}>manager@hushryd.com</Text>
                  <Text style={[styles.credentialText, { color: colors.text }]}>manager123</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: Spacing.large,
    paddingBottom: Spacing.medium,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: FontSizes.large,
    marginRight: Spacing.small,
  },
  backText: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.xl,
  },
  loginCard: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.xl,
    ...Shadows.large,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoIcon: {
    fontSize: FontSizes.xxxl * 1.5,
    marginBottom: Spacing.small,
  },
  logoTitle: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    marginBottom: Spacing.tiny,
  },
  logoSubtitle: {
    fontSize: FontSizes.large,
  },
  formSection: {
    marginBottom: Spacing.xl,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  formTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    marginBottom: Spacing.small,
  },
  formSubtitle: {
    fontSize: FontSizes.medium,
    textAlign: 'center',
  },
  form: {
    marginBottom: Spacing.large,
  },
  inputGroup: {
    marginBottom: Spacing.large,
  },
  inputLabel: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    marginBottom: Spacing.small,
  },
  input: {
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.large,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    fontSize: FontSizes.medium,
    ...Shadows.small,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.xl,
  },
  forgotPasswordText: {
    fontSize: FontSizes.small,
    fontWeight: '600',
  },
  loginButton: {
    paddingVertical: Spacing.large,
    borderRadius: BorderRadius.large,
    alignItems: 'center',
    ...Shadows.medium,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.large,
    fontWeight: 'bold',
  },
  demoSection: {
    marginTop: Spacing.large,
  },
  demoTitle: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    marginBottom: Spacing.medium,
    textAlign: 'center',
  },
  credentialsGrid: {
    gap: Spacing.small,
  },
  credentialCard: {
    padding: Spacing.medium,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    ...Shadows.small,
  },
  credentialLabel: {
    fontSize: FontSizes.small,
    fontWeight: '600',
    marginBottom: Spacing.tiny,
  },
  credentialText: {
    fontSize: FontSizes.small,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 2,
  },
});