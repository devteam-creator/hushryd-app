import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import AdminLayout from '../../components/admin/AdminLayout';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../../constants/Design';

const { width } = Dimensions.get('window');

export default function AdminAnalyticsPage() {
  const getAnalyticsData = () => [
    {
      title: 'Total Revenue',
      value: 'Rs 12.5L',
      change: '+12.5%',
      changeType: 'positive',
      icon: '💰',
    },
    {
      title: 'Active Users',
      value: '2456',
      change: '+8.2%',
      changeType: 'positive',
      icon: '👥',
    },
    {
      title: 'Ride Completion',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'positive',
      icon: '✅',
    },
    {
      title: 'Avg. Rating',
      value: '4.8',
      change: '+0.3',
      changeType: 'positive',
      icon: '⭐',
    },
  ];

  const getTopRoutes = () => [
    { route: 'Hyderabad → Chennai', rides: 156, revenue: 'Rs 3.9L' },
    { route: 'Bangalore → Mumbai', rides: 134, revenue: 'Rs 5.6L' },
    { route: 'Delhi → Pune', rides: 98, revenue: 'Rs 3.7L' },
    { route: 'Kolkata → Hyderabad', rides: 87, revenue: 'Rs 1.8L' },
  ];

  const getRecentTrends = () => [
    { period: 'Last 7 days', rides: 234, revenue: 'Rs 5.8L', growth: '+15%' },
    { period: 'Last 30 days', rides: 1456, revenue: 'Rs 36.2L', growth: '+8%' },
    { period: 'Last 90 days', rides: 4234, revenue: 'Rs 105.6L', growth: '+22%' },
  ];

  return (
    <AdminLayout title="Analytics Dashboard" currentPage="analytics">
      {/* Key Metrics */}
      <View style={styles.metricsSection}>
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.metricsGrid}>
          {getAnalyticsData().map((metric, index) => (
            <View key={index} style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricIcon}>{metric.icon}</Text>
                <Text style={[
                  styles.metricChange,
                  { color: metric.changeType === 'positive' ? '#10B981' : '#EF4444' }
                ]}>
                  {metric.change}
                </Text>
              </View>
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={styles.metricTitle}>{metric.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Top Routes */}
      <View style={styles.routesSection}>
        <Text style={styles.sectionTitle}>Top Routes</Text>
        <View style={styles.routesList}>
          {getTopRoutes().map((route, index) => (
            <View key={index} style={styles.routeItem}>
              <View style={styles.routeInfo}>
                <Text style={styles.routeName}>{route.route}</Text>
                <Text style={styles.routeStats}>{route.rides} rides • {route.revenue}</Text>
              </View>
              <View style={styles.routeRank}>
                <Text style={styles.rankNumber}>#{index + 1}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Trends */}
      <View style={styles.trendsSection}>
        <Text style={styles.sectionTitle}>Recent Trends</Text>
        <View style={styles.trendsList}>
          {getRecentTrends().map((trend, index) => (
            <View key={index} style={styles.trendItem}>
              <View style={styles.trendPeriod}>
                <Text style={styles.trendPeriodText}>{trend.period}</Text>
              </View>
              <View style={styles.trendStats}>
                <View style={styles.trendStat}>
                  <Text style={styles.trendStatLabel}>Rides</Text>
                  <Text style={styles.trendStatValue}>{trend.rides}</Text>
                </View>
                <View style={styles.trendStat}>
                  <Text style={styles.trendStatLabel}>Revenue</Text>
                  <Text style={styles.trendStatValue}>{trend.revenue}</Text>
                </View>
                <View style={styles.trendStat}>
                  <Text style={styles.trendStatLabel}>Growth</Text>
                  <Text style={[styles.trendStatValue, { color: '#10B981' }]}>{trend.growth}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  metricsSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: Spacing.lg,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    marginHorizontal: Spacing.xs,
    ...Shadows.small,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  metricIcon: {
    fontSize: 20,
  },
  metricChange: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: Spacing.xs,
  },
  metricTitle: {
    fontSize: FontSizes.sm,
    color: '#6B7280',
  },
  routesSection: {
    marginBottom: Spacing.xl,
  },
  routesList: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.small,
  },
  routeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#111827',
    marginBottom: Spacing.xs,
  },
  routeStats: {
    fontSize: FontSizes.sm,
    color: '#6B7280',
  },
  routeRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  trendsSection: {
    marginBottom: Spacing.xl,
  },
  trendsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.small,
  },
  trendItem: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  trendPeriod: {
    marginBottom: Spacing.sm,
  },
  trendPeriodText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#111827',
  },
  trendStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trendStat: {
    flex: 1,
    alignItems: 'center',
  },
  trendStatLabel: {
    fontSize: FontSizes.sm,
    color: '#6B7280',
    marginBottom: Spacing.xs,
  },
  trendStatValue: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: '#111827',
  },
});