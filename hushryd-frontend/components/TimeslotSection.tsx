import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../constants/Design';
import TimeslotCard from './TimeslotCard';
import { useColorScheme } from './useColorScheme';

interface TimeslotData {
  id: string;
  time: string;
  from: string;
  to: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  driverName: string;
  vehicleType: string;
}

interface TimeslotSectionProps {
  title: string;
  subtitle: string;
  timeslots: TimeslotData[];
  onTimeslotPress: (timeslot: TimeslotData) => void;
  onViewAllPress?: () => void;
}

export default function TimeslotSection({
  title,
  subtitle,
  timeslots,
  onTimeslotPress,
  onViewAllPress,
}: TimeslotSectionProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getTimeGradient = (title: string) => {
    if (title.toLowerCase().includes('early morning')) {
      return ['#FFD700', '#FFA500', '#FF8C00']; // Golden sunrise
    } else if (title.toLowerCase().includes('morning')) {
      return ['#87CEEB', '#4682B4', '#1E90FF']; // Morning blue
    } else if (title.toLowerCase().includes('afternoon')) {
      return ['#FF8C00', '#FF6347', '#FF4500']; // Afternoon orange
    } else if (title.toLowerCase().includes('evening')) {
      return ['#8A2BE2', '#7B1FA2', '#6A1B9A']; // Evening purple
    } else if (title.toLowerCase().includes('night')) {
      return ['#2F4F4F', '#1C1C1C', '#000000']; // Night dark
    } else {
      return ['#32CD32', '#228B22', '#1E7A1E']; // Default green
    }
  };

  const getTimeIcon = (title: string) => {
    if (title.toLowerCase().includes('early morning')) return '🌅';
    if (title.toLowerCase().includes('morning')) return '🌞';
    if (title.toLowerCase().includes('afternoon')) return '☀️';
    if (title.toLowerCase().includes('evening')) return '🌆';
    if (title.toLowerCase().includes('night')) return '🌙';
    return '🚗';
  };

  return (
    <View style={styles.container}>
      {/* Enhanced Section Header */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={getTimeGradient(title)}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.titleSection}>
              <View style={styles.titleRow}>
                <View style={styles.iconContainer}>
                  <Text style={styles.timeIcon}>{getTimeIcon(title)}</Text>
                </View>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{title}</Text>
                  <Text style={styles.subtitle}>{subtitle}</Text>
                </View>
              </View>
              {onViewAllPress && (
                <TouchableOpacity 
                  style={styles.viewAllButton}
                  onPress={onViewAllPress} 
                  activeOpacity={0.8}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Timeslots Grid */}
      <View style={styles.timeslotsContainer}>
        <View style={styles.timeslotsGrid}>
          {timeslots.map((timeslot, index) => (
            <View key={timeslot.id} style={styles.timeslotItem}>
              <TimeslotCard
                time={timeslot.time}
                from={timeslot.from}
                to={timeslot.to}
                price={timeslot.price}
                availableSeats={timeslot.availableSeats}
                totalSeats={timeslot.totalSeats}
                driverName={timeslot.driverName}
                vehicleType={timeslot.vehicleType}
                onPress={() => onTimeslotPress(timeslot)}
                cardIndex={index}
                compact={true}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Enhanced Empty State */}
      {timeslots.length === 0 && (
        <View style={styles.emptyStateContainer}>
          <LinearGradient
            colors={['#F8F9FA', '#E9ECEF', '#DEE2E6']}
            style={styles.emptyState}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.emptyIcon}>🚗</Text>
            <Text style={styles.emptyTitle}>No rides available</Text>
            <Text style={styles.emptyText}>
              Try searching for a different time or route
            </Text>
          </LinearGradient>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  headerContainer: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  headerGradient: {
    padding: Spacing.lg,
  },
  headerContent: {
    flex: 1,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  timeIcon: {
    fontSize: 24,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: Spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  viewAllButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
  },
  viewAllText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#333',
  },
  timeslotsContainer: {
    paddingHorizontal: Spacing.lg,
  },
  timeslotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  timeslotItem: {
    width: '48%',
    marginBottom: Spacing.md,
  },
  emptyStateContainer: {
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  emptyState: {
    padding: Spacing.xxxl,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: '#333',
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
