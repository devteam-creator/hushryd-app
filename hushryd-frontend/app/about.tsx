import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from '../components/useColorScheme';
import Colors from '../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../constants/Design';

export default function AboutUsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <>
      <Stack.Screen
        options={{
          title: 'About Us',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }}
      />
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['#32CD32', '#228B22', '#1E7A1E']}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.heroIcon}>🚗</Text>
            <Text style={styles.heroTitle}>About HushRyd</Text>
            <Text style={styles.heroSubtitle}>
              Revolutionizing inter-city travel in India
            </Text>
          </LinearGradient>
        </View>

        {/* Mission Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Mission</Text>
          <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
            To revolutionize inter-city travel in India by providing affordable, safe, and convenient ride-sharing solutions that connect communities and reduce transportation costs for everyone.
          </Text>
        </View>

        {/* Vision Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Vision</Text>
          <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
            To become India's most trusted and preferred inter-city ride-sharing platform, connecting millions of travelers while promoting sustainable transportation and building stronger communities.
          </Text>
        </View>

        {/* Values Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Values</Text>
          <View style={styles.valuesList}>
            <View style={styles.valueItem}>
              <Text style={styles.valueIcon}>🛡️</Text>
              <View style={styles.valueContent}>
                <Text style={[styles.valueTitle, { color: colors.text }]}>Safety First</Text>
                <Text style={[styles.valueText, { color: colors.textSecondary }]}>
                  We prioritize the safety and security of all our users with verified drivers and real-time tracking.
                </Text>
              </View>
            </View>
            
            <View style={styles.valueItem}>
              <Text style={styles.valueIcon}>💰</Text>
              <View style={styles.valueContent}>
                <Text style={[styles.valueTitle, { color: colors.text }]}>Affordable Travel</Text>
                <Text style={[styles.valueText, { color: colors.textSecondary }]}>
                  We believe everyone deserves access to affordable transportation options.
                </Text>
              </View>
            </View>
            
            <View style={styles.valueItem}>
              <Text style={styles.valueIcon}>🤝</Text>
              <View style={styles.valueContent}>
                <Text style={[styles.valueTitle, { color: colors.text }]}>Community Building</Text>
                <Text style={[styles.valueText, { color: colors.textSecondary }]}>
                  We foster connections between people and build stronger communities through shared travel experiences.
                </Text>
              </View>
            </View>
            
            <View style={styles.valueItem}>
              <Text style={styles.valueIcon}>🌱</Text>
              <View style={styles.valueContent}>
                <Text style={[styles.valueTitle, { color: colors.text }]}>Environmental Responsibility</Text>
                <Text style={[styles.valueText, { color: colors.textSecondary }]}>
                  We promote sustainable transportation by reducing the number of vehicles on the road.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Story Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Story</Text>
          <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
            HushRyd was born out of a simple observation: inter-city travel in India was expensive, inconvenient, and often unsafe. Our founders, having experienced these challenges firsthand, set out to create a solution that would make travel accessible to everyone.
          </Text>
          <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
            Starting as a small platform connecting travelers between Hyderabad and Vijayawada, we have grown to serve multiple cities across Andhra Pradesh and Telangana. Today, we're proud to have facilitated thousands of safe, affordable journeys.
          </Text>
        </View>

        {/* Stats Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Impact</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>10K+</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Happy Users</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>500+</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Cities Connected</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>50K+</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rides Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>₹2M+</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Saved on Travel</Text>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Get in Touch</Text>
          <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
            Have questions, feedback, or suggestions? We'd love to hear from you!
          </Text>
          
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>📧</Text>
              <Text style={[styles.contactText, { color: colors.text }]}>support@hushryd.com</Text>
            </View>
            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>📞</Text>
              <Text style={[styles.contactText, { color: colors.text }]}>+91-9876543210</Text>
            </View>
            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>📍</Text>
              <Text style={[styles.contactText, { color: colors.text }]}>Hyderabad, Telangana</Text>
            </View>
          </View>
        </View>

        {/* Join Us Section */}
        <View style={styles.joinSection}>
          <LinearGradient
            colors={['#1DA1F2', '#1976D2', '#1565C0']}
            style={styles.joinGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.joinTitle}>Join the HushRyd Family</Text>
            <Text style={styles.joinSubtitle}>
              Be part of India's growing ride-sharing community
            </Text>
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => router.push('/auth/register')}
            >
              <Text style={styles.joinButtonText}>Get Started Today</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    marginBottom: Spacing.xl,
  },
  heroGradient: {
    padding: Spacing.xxxl,
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadows.large,
  },
  heroIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  heroTitle: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: Spacing.sm,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  heroSubtitle: {
    fontSize: FontSizes.lg,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
  },
  sectionTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  sectionText: {
    fontSize: FontSizes.md,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  valuesList: {
    marginTop: Spacing.md,
  },
  valueItem: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  valueIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
    marginTop: Spacing.xs,
  },
  valueContent: {
    flex: 1,
  },
  valueTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  valueText: {
    fontSize: FontSizes.md,
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  statNumber: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    textAlign: 'center',
    fontWeight: '500',
  },
  contactInfo: {
    marginTop: Spacing.md,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  contactIcon: {
    fontSize: 20,
    marginRight: Spacing.md,
  },
  contactText: {
    fontSize: FontSizes.md,
    fontWeight: '500',
  },
  joinSection: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.large,
  },
  joinGradient: {
    padding: Spacing.xxxl,
    alignItems: 'center',
  },
  joinTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  joinSubtitle: {
    fontSize: FontSizes.lg,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  joinButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.medium,
  },
  joinButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: '#1DA1F2',
  },
  bottomPadding: {
    height: Spacing.xxxl,
  },
});
