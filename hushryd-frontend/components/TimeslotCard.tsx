import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors, { CURRENCY_SYMBOL } from '../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../constants/Design';
import { useColorScheme } from './useColorScheme';

interface TimeslotCardProps {
  time: string;
  from: string;
  to: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  driverName: string;
  vehicleType: string;
  onPress: () => void;
  cardIndex?: number;
  compact?: boolean;
}

export default function TimeslotCard({
  time,
  from,
  to,
  price,
  availableSeats,
  totalSeats,
  driverName,
  vehicleType,
  onPress,
  cardIndex = 0,
  compact = false,
}: TimeslotCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getVehicleIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'carpool':
        return '🚗';
      case 'bus':
        return '🚌';
      case 'private':
        return '🚙';
      default:
        return '🚗';
    }
  };

  const getSeatStatusColor = () => {
    if (availableSeats <= 1) return '#ef4444'; // Red - Almost full
    if (availableSeats <= 3) return '#f59e0b'; // Orange - Few seats
    return '#10b981'; // Green - Good availability
  };

  const getCardGradient = (index: number) => {
    const gradients = [
      ['#FFFFFF', '#F8F9FA', '#F1F3F4'], // Light gradient
      ['#E3F2FD', '#BBDEFB', '#90CAF9'], // Blue gradient
      ['#F3E5F5', '#E1BEE7', '#CE93D8'], // Purple gradient
      ['#E8F5E8', '#C8E6C9', '#A5D6A7'], // Green gradient
    ];
    return gradients[index % gradients.length];
  };

  const getTimeIcon = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 4 && hour < 7) return '🌅'; // Early morning
    if (hour >= 7 && hour < 12) return '🌞'; // Morning
    if (hour >= 12 && hour < 17) return '☀️'; // Afternoon
    if (hour >= 17 && hour < 20) return '🌆'; // Evening
    return '🌙'; // Night
  };

  if (compact) {
    return (
      <TouchableOpacity
        style={styles.compactCardContainer}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={getCardGradient(cardIndex)}
          style={styles.compactCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Compact Header */}
          <View style={styles.compactHeader}>
            <Text style={styles.compactTimeIcon}>{getTimeIcon(time)}</Text>
            <Text style={styles.compactTime}>{time}</Text>
            <Text style={styles.compactPrice}>{CURRENCY_SYMBOL}{price}</Text>
          </View>

          {/* Compact Route */}
          <View style={styles.compactRoute}>
            <Text style={styles.compactFrom}>{from}</Text>
            <Text style={styles.compactArrow}>→</Text>
            <Text style={styles.compactTo}>{to}</Text>
          </View>

          {/* Compact Info */}
          <View style={styles.compactInfo}>
            <Text style={styles.compactVehicle}>
              {getVehicleIcon(vehicleType)} {vehicleType}
            </Text>
            <View style={[styles.compactSeatStatus, { backgroundColor: getSeatStatusColor() + '20' }]}>
              <Text style={[styles.compactSeatText, { color: getSeatStatusColor() }]}>
                {availableSeats}/{totalSeats}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getCardGradient(cardIndex)}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header with Time and Vehicle Info */}
        <View style={styles.header}>
          <View style={styles.timeSection}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeIcon}>{getTimeIcon(time)}</Text>
              <View style={styles.timeInfo}>
                <Text style={styles.time}>{time}</Text>
                <Text style={styles.vehicleType}>
                  {getVehicleIcon(vehicleType)} {vehicleType}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.priceSection}>
            <Text style={styles.price}>{CURRENCY_SYMBOL}{price}</Text>
            <Text style={styles.priceLabel}>per seat</Text>
          </View>
        </View>

        {/* Route Information */}
        <View style={styles.routeSection}>
          <View style={styles.routeContainer}>
            <Text style={styles.from}>{from}</Text>
            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>→</Text>
            </View>
            <Text style={styles.to}>{to}</Text>
          </View>
          <Text style={styles.driverName}>Driver: {driverName}</Text>
        </View>

        {/* Seat Availability */}
        <View style={styles.seatSection}>
          <View style={[styles.seatStatus, { backgroundColor: getSeatStatusColor() + '20' }]}>
            <Text style={[styles.seatText, { color: getSeatStatusColor() }]}>
              {availableSeats} of {totalSeats} seats available
            </Text>
          </View>
          {availableSeats <= 2 && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>⚠️ Almost full</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Regular card styles
  cardContainer: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  // Compact card styles
  compactCardContainer: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.small,
  },
  compactCard: {
    padding: Spacing.md,
    minHeight: 120,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  compactTimeIcon: {
    fontSize: 18,
  },
  compactTime: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginLeft: Spacing.xs,
  },
  compactPrice: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: '#32CD32',
  },
  compactRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  compactFrom: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  compactArrow: {
    fontSize: FontSizes.sm,
    color: '#666',
    marginHorizontal: Spacing.xs,
  },
  compactTo: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  compactInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactVehicle: {
    fontSize: FontSizes.xs,
    color: '#666',
    flex: 1,
  },
  compactSeatStatus: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  compactSeatText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  card: {
    padding: Spacing.lg,
    minHeight: 160,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  timeSection: {
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  timeInfo: {
    flex: 1,
  },
  time: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: Spacing.xs,
  },
  vehicleType: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: '#666',
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: '#32CD32',
    marginBottom: Spacing.xs,
  },
  priceLabel: {
    fontSize: FontSizes.xs,
    color: '#666',
  },
  routeSection: {
    marginBottom: Spacing.md,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  from: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  arrowContainer: {
    marginHorizontal: Spacing.sm,
  },
  arrow: {
    fontSize: FontSizes.md,
    color: '#666',
    fontWeight: 'bold',
  },
  to: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  driverName: {
    fontSize: FontSizes.sm,
    color: '#666',
  },
  seatSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seatStatus: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    flex: 1,
    marginRight: Spacing.sm,
  },
  seatText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  urgentBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  urgentText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: '#DC2626',
  },
});
