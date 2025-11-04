import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';
import Images from '../assets/images';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../constants/Design';

interface HeroBannerProps {
  // No props needed for the enhanced banner
}

const { width } = Dimensions.get('window');

export default function HeroBanner({}: HeroBannerProps) {
  return (
    <View style={styles.container}>
      {/* Main Hero Section */}
      <View style={styles.heroSection}>
        <ImageBackground
          source={Images.banner}
          style={styles.heroBackground}
          imageStyle={styles.backgroundImage}
          resizeMode="cover"
        >
          {/* Overlay for better text readability */}
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.4)']}
            style={styles.overlay}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          
          {/* Decorative Elements */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
          <View style={styles.decorativeCircle3} />
          
          {/* Main Content */}
          <View style={styles.heroContent}>
            {/* Welcome Text */}
            <View style={styles.textSection}>
              <Text style={styles.welcomeText}>Welcome to</Text>
              <Text style={styles.brandText}>HushRyd</Text>
              <Text style={styles.taglineText}>Your Premium Ride Experience</Text>
            </View>
            
            {/* Feature Icons */}
            <View style={styles.featuresSection}>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureEmoji}>🚗</Text>
                </View>
                <Text style={styles.featureText}>Premium Cars</Text>
              </View>
              
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureEmoji}>⭐</Text>
                </View>
                <Text style={styles.featureText}>5-Star Service</Text>
              </View>
              
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureEmoji}>🛡️</Text>
                </View>
                <Text style={styles.featureText}>Safe & Secure</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
  },
  heroSection: {
    height: 320,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
    ...Shadows.large,
  },
  heroBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    borderRadius: BorderRadius.xl,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BorderRadius.xl,
  },
  // Decorative circles for visual appeal
  decorativeCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  decorativeCircle3: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  heroContent: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    position: 'relative',
    zIndex: 1,
    justifyContent: 'space-between',
  },
  textSection: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
    flex: 1,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: FontSizes.lg,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '500',
    marginBottom: Spacing.sm,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  brandText: {
    fontSize: FontSizes.xxxl,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: Spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    textAlign: 'center',
  },
  taglineText: {
    fontSize: FontSizes.md,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  featuresSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    ...Shadows.small,
  },
  featureEmoji: {
    fontSize: 20,
  },
  featureText: {
    fontSize: FontSizes.xs,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
