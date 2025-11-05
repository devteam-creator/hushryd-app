import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../../constants/Design';

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'passenger' as 'driver' | 'customer' | 'passenger',
    licenseNumber: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    const { name, email, phone, password, confirmPassword, role, licenseNumber } = formData;

    // Validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if ((role === 'driver' || role === 'customer') && !licenseNumber) {
      Alert.alert('Error', 'License number is required for drivers and customers');
      return;
    }

    setLoading(true);
    
    // Simulate registration process
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Registration Successful!',
        `Welcome to HushRyd, ${name}!`,
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    }, 2000);
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section with Gradient */}
        <LinearGradient
          colors={[colors.gradientStart, colors.primary, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🚗</Text>
            <Text style={styles.logoText}>HushRyd</Text>
            <Text style={styles.logoSubtext}>Join thousands of happy travelers</Text>
          </View>
        </LinearGradient>

        {/* Registration Form */}
        <View style={styles.formContainer}>
          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.large]}>
            <Text style={[styles.formTitle, { color: colors.text }]}>Create Account</Text>
            <Text style={[styles.formSubtitle, { color: colors.textSecondary }]}>
              Join the HushRyd community today
            </Text>

            <View style={styles.inputContainer}>
              {/* Role Selection */}
              <Text style={[styles.sectionLabel, { color: colors.text }]}>I want to:</Text>
              <View style={styles.roleContainer}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    { 
                      backgroundColor: formData.role === 'passenger' ? colors.primary : colors.lightGray,
                      borderColor: formData.role === 'passenger' ? colors.primary : colors.border,
                    }
                  ]}
                  onPress={() => handleInputChange('role', 'passenger')}
                >
                  <Text style={styles.roleIcon}>🎫</Text>
                  <Text style={[
                    styles.roleText, 
                    { color: formData.role === 'passenger' ? '#fff' : colors.text }
                  ]}>
                    Book Rides
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    { 
                      backgroundColor: formData.role === 'driver' ? colors.primary : colors.lightGray,
                      borderColor: formData.role === 'driver' ? colors.primary : colors.border,
                    }
                  ]}
                  onPress={() => handleInputChange('role', 'driver')}
                >
                  <Text style={styles.roleIcon}>🚗</Text>
                  <Text style={[
                    styles.roleText, 
                    { color: formData.role === 'driver' ? '#fff' : colors.text }
                  ]}>
                    Offer Rides
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    { 
                      backgroundColor: formData.role === 'customer' ? colors.primary : colors.lightGray,
                      borderColor: formData.role === 'customer' ? colors.primary : colors.border,
                    }
                  ]}
                  onPress={() => handleInputChange('role', 'customer')}
                >
                  <Text style={styles.roleIcon}>🚙</Text>
                  <Text style={[
                    styles.roleText, 
                    { color: formData.role === 'customer' ? '#fff' : colors.text }
                  ]}>
                    Private Rides
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Basic Information */}
              <Input
                label="Full Name *"
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                icon={<Text style={styles.inputIcon}>👤</Text>}
              />

              <Input
                label="Email Address *"
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                icon={<Text style={styles.inputIcon}>📧</Text>}
              />

              <Input
                label="Phone Number *"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                keyboardType="phone-pad"
                icon={<Text style={styles.inputIcon}>📱</Text>}
              />

              {/* License Number for Drivers/Customers */}
              {(formData.role === 'driver' || formData.role === 'customer') && (
                <Input
                  label="Driving License Number *"
                  placeholder="Enter your license number"
                  value={formData.licenseNumber}
                  onChangeText={(value) => handleInputChange('licenseNumber', value)}
                  icon={<Text style={styles.inputIcon}>🆔</Text>}
                />
              )}

              {/* Password Fields */}
              <Input
                label="Password *"
                placeholder="Create a password"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry
                icon={<Text style={styles.inputIcon}>🔒</Text>}
              />

              <Input
                label="Confirm Password *"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry
                icon={<Text style={styles.inputIcon}>🔒</Text>}
              />

              <Button
                title="Create Account"
                onPress={handleRegister}
                loading={loading}
                size="large"
                fullWidth
                style={styles.registerButton}
              />
            </View>

            {/* Terms and Conditions */}
            <View style={styles.termsContainer}>
              <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                By creating an account, you agree to our{' '}
              </Text>
              <TouchableOpacity>
                <Text style={[styles.termsLink, { color: colors.primary }]}>Terms of Service</Text>
              </TouchableOpacity>
              <Text style={[styles.termsText, { color: colors.textSecondary }]}> and </Text>
              <TouchableOpacity>
                <Text style={[styles.termsLink, { color: colors.primary }]}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, { color: colors.textSecondary }]}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text style={[styles.loginLink, { color: colors.primary }]}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsContainer}>
          <Text style={[styles.benefitsTitle, { color: colors.text }]}>Join HushRyd Today</Text>
          <View style={styles.benefitsGrid}>
            <BenefitItem
              icon="💰"
              title="Save Money"
              description="Up to 60% cheaper than traditional transport"
            />
            <BenefitItem
              icon="🌍"
              title="Go Anywhere"
              description="Travel across AP & Telangana"
            />
            <BenefitItem
              icon="🤝"
              title="Meet People"
              description="Connect with fellow travelers"
            />
            <BenefitItem
              icon="🛡️"
              title="Safe & Secure"
              description="Verified profiles and secure payments"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface BenefitItemProps {
  icon: string;
  title: string;
  description: string;
}

function BenefitItem({ icon, title, description }: BenefitItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.benefitItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={styles.benefitIcon}>{icon}</Text>
      <Text style={[styles.benefitTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.benefitDescription, { color: colors.textSecondary }]}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: Spacing.extraLarge * 2,
    paddingBottom: Spacing.extraLarge * 1.5,
    paddingHorizontal: Spacing.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: FontSizes.extraLarge * 2,
    marginBottom: Spacing.medium,
  },
  logoText: {
    fontSize: FontSizes.extraLarge * 1.5,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: Spacing.tiny,
  },
  logoSubtext: {
    fontSize: FontSizes.medium,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: Spacing.large,
    marginTop: -Spacing.extraLarge,
    zIndex: 1,
  },
  formCard: {
    borderRadius: BorderRadius.large,
    padding: Spacing.extraLarge,
    borderWidth: 1,
    marginBottom: Spacing.large,
  },
  formTitle: {
    fontSize: FontSizes.extraLarge,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.tiny,
  },
  formSubtitle: {
    fontSize: FontSizes.medium,
    textAlign: 'center',
    marginBottom: Spacing.extraLarge,
    lineHeight: FontSizes.medium * 1.4,
  },
  inputContainer: {
    marginBottom: Spacing.large,
  },
  sectionLabel: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    marginBottom: Spacing.medium,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: Spacing.small,
    marginBottom: Spacing.large,
  },
  roleButton: {
    flex: 1,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.small,
    borderRadius: BorderRadius.medium,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleIcon: {
    fontSize: FontSizes.large,
    marginBottom: Spacing.tiny,
  },
  roleText: {
    fontSize: FontSizes.tiny,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputIcon: {
    fontSize: FontSizes.large,
  },
  registerButton: {
    marginTop: Spacing.medium,
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.large,
  },
  termsText: {
    fontSize: FontSizes.tiny,
  },
  termsLink: {
    fontSize: FontSizes.tiny,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: FontSizes.medium,
  },
  loginLink: {
    fontSize: FontSizes.medium,
    fontWeight: '700',
  },
  benefitsContainer: {
    paddingHorizontal: Spacing.large,
    paddingBottom: Spacing.extraLarge,
  },
  benefitsTitle: {
    fontSize: FontSizes.large,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.large,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.medium,
  },
  benefitItem: {
    width: '48%',
    padding: Spacing.medium,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    alignItems: 'center',
  },
  benefitIcon: {
    fontSize: FontSizes.extraLarge,
    marginBottom: Spacing.small,
  },
  benefitTitle: {
    fontSize: FontSizes.small,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.tiny,
  },
  benefitDescription: {
    fontSize: FontSizes.tiny,
    textAlign: 'center',
    lineHeight: FontSizes.tiny * 1.4,
  },
});