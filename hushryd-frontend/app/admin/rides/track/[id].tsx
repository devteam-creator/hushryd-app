import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { BorderRadius, FontSizes, Spacing } from '../../../../constants/Design';

export default function RideTrackingPage() {
  return (
    <AdminLayout title="Ride Tracking" currentPage="rides">
      <View style={styles.container}>
        <View style={styles.trackingCard}>
          <Text style={styles.title}>Live Ride Tracking</Text>
          <Text style={styles.subtitle}>Real-time location and status updates</Text>
          
          <View style={styles.statusSection}>
            <Text style={styles.statusTitle}>Current Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>In Progress</Text>
            </View>
            <Text style={styles.statusDescription}>
              Ride is currently in progress from Hyderabad to Chennai
            </Text>
          </View>

          <View style={styles.locationSection}>
            <Text style={styles.sectionTitle}>Current Location</Text>
            <Text style={styles.locationText}>📍 Near Kurnool, Andhra Pradesh</Text>
            <Text style={styles.coordinatesText}>Lat: 15.8309°N, Lng: 78.0423°E</Text>
            <Text style={styles.timeText}>Last Updated: 2:15 PM</Text>
          </View>

          <View style={styles.progressSection}>
            <Text style={styles.sectionTitle}>Journey Progress</Text>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.progressText}>65% Complete</Text>
            <Text style={styles.distanceText}>Distance Covered: 406 km / 625 km</Text>
          </View>

          <View style={styles.timelineSection}>
            <Text style={styles.sectionTitle}>Timeline</Text>
            <View style={styles.timelineItem}>
              <Text style={styles.timelineTime}>10:30 AM</Text>
              <Text style={styles.timelineEvent}>Ride Started - Hyderabad</Text>
            </View>
            <View style={styles.timelineItem}>
              <Text style={styles.timelineTime}>12:45 PM</Text>
              <Text style={styles.timelineEvent}>Break Stop - Kurnool</Text>
            </View>
            <View style={styles.timelineItem}>
              <Text style={styles.timelineTime}>2:15 PM</Text>
              <Text style={styles.timelineEvent}>Currently - Near Kurnool</Text>
            </View>
            <View style={styles.timelineItem}>
              <Text style={styles.timelineTime}>6:45 PM</Text>
              <Text style={styles.timelineEvent}>Expected Arrival - Chennai</Text>
            </View>
          </View>

          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
            <Text style={styles.contactText}>Driver: John Doe (+91-9876543210)</Text>
            <Text style={styles.contactText}>Support: +91-8001234567</Text>
            <Text style={styles.contactText}>Emergency: 100</Text>
          </View>
        </View>
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
  trackingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: '#6B7280',
    marginBottom: Spacing.lg,
  },
  statusSection: {
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statusTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: '#111827',
    marginBottom: Spacing.sm,
  },
  statusBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },
  statusText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusDescription: {
    fontSize: FontSizes.md,
    color: '#6B7280',
    lineHeight: 22,
  },
  locationSection: {
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: '#111827',
    marginBottom: Spacing.md,
  },
  locationText: {
    fontSize: FontSizes.md,
    color: '#374151',
    marginBottom: Spacing.xs,
  },
  coordinatesText: {
    fontSize: FontSizes.sm,
    color: '#6B7280',
    marginBottom: Spacing.xs,
  },
  timeText: {
    fontSize: FontSizes.sm,
    color: '#9CA3AF',
  },
  progressSection: {
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    width: '65%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#111827',
    marginBottom: Spacing.xs,
  },
  distanceText: {
    fontSize: FontSizes.sm,
    color: '#6B7280',
  },
  timelineSection: {
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  timelineTime: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: '#3B82F6',
    width: 80,
  },
  timelineEvent: {
    fontSize: FontSizes.sm,
    color: '#374151',
    flex: 1,
  },
  contactSection: {
    marginBottom: Spacing.lg,
  },
  contactText: {
    fontSize: FontSizes.md,
    color: '#374151',
    marginBottom: Spacing.sm,
    lineHeight: 22,
  },
});
