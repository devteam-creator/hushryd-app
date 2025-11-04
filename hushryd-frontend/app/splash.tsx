import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import HushRydLogoImage from '../components/HushRydLogoImage';
import { FontSizes, Spacing } from '../constants/Design';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to main app after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)/');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#32CD32', '#228B22', '#006400']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Animated Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim },
            ],
          },
        ]}
      >
        {/* Logo Container */}
        <View style={styles.logoContainer}>
          <HushRydLogoImage
            size="large"
            showBackground={false}
            shadow={true}
          />
        </View>

        {/* App Title */}
        <Text style={styles.appTitle}>HushRyd</Text>
        <Text style={styles.appSubtitle}>Your Ride, Your Way</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>
          Travel across AP, Telangana & Karnataka{'\n'}with shared & private rides
        </Text>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDots}>
            <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
            <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
            <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
          </View>
        </View>
      </Animated.View>

      {/* Bottom Decoration */}
      <View style={styles.bottomDecoration}>
        <View style={styles.decorativeLine} />
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.large,
  },
  logoContainer: {
    marginBottom: Spacing.large,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: FontSizes.extraLarge * 1.5,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: Spacing.small,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 2,
  },
  appSubtitle: {
    fontSize: FontSizes.large,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: Spacing.large,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tagline: {
    fontSize: FontSizes.medium,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.extraLarge * 2,
    paddingHorizontal: Spacing.medium,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: Spacing.extraLarge,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  bottomDecoration: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  decorativeLine: {
    width: 60,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginBottom: Spacing.small,
  },
  versionText: {
    fontSize: FontSizes.tiny,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
});
