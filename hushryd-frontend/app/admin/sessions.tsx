import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../../components/admin/AdminLayout';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../../constants/Design';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/apiService';

const { width } = Dimensions.get('window');

interface Session {
  id: string;
  user_id: string;
  user_type: string;
  ip_address: string;
  user_agent: string;
  device_type: string;
  device_name: string;
  location: string | null;
  login_at: string;
  logout_at: string | null;
  last_activity: string;
  is_active: boolean;
  expires_at: string;
  created_at: string;
  user_email?: string;
  first_name?: string;
  last_name?: string;
}

export default function AdminSessionsPage() {
  const { admin } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_sessions: 0,
    active_sessions: 0,
    user_sessions: 0,
    admin_sessions: 0,
    today_logins: 0,
    week_logins: 0,
    month_logins: 0
  });
  const [filters, setFilters] = useState({
    userType: '',
    page: 1,
    limit: 50
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 1
  });

  // Load sessions data from API
  const loadSessions = async () => {
    try {
      setLoading(true);
      
      if (!admin) {
        Alert.alert('Error', 'Please log in to view sessions');
        return;
      }

      const token = await apiService.getToken();
      
      if (!token) {
        Alert.alert('Error', 'Authentication required. Please log in again.');
        return;
      }

      // Load stats
      const statsResponse = await apiService.getSessionStats(token);
      if (statsResponse.success) {
        setStats(statsResponse.data.stats || stats);
      }

      // Load sessions
      const sessionsResponse = await apiService.getAllSessions(token, {
        userType: filters.userType || undefined,
        page: filters.page,
        limit: filters.limit
      });

      if (sessionsResponse.success) {
        setSessions(sessionsResponse.data.sessions || []);
        setPagination(sessionsResponse.data.pagination || pagination);
      } else {
        console.error('Failed to load sessions:', sessionsResponse.message);
        setSessions([]);
      }

    } catch (error) {
      console.error('Error loading sessions:', error);
      Alert.alert('Error', 'Failed to load sessions data');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [filters.userType, filters.page]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatDuration = (loginAt: string, logoutAt: string | null) => {
    if (!logoutAt) return 'Active';
    const start = new Date(loginAt).getTime();
    const end = new Date(logoutAt).getTime();
    const diff = Math.floor((end - start) / 1000); // seconds
    
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`;
    return `${Math.floor(diff / 86400)}d ${Math.floor((diff % 86400) / 3600)}h`;
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? '#10B981' : '#6B7280';
  };

  const getUserTypeColor = (userType: string) => {
    return userType === 'admin' ? '#3B82F6' : '#8B5CF6';
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile': return '📱';
      case 'tablet': return '📱';
      case 'desktop': return '💻';
      default: return '🖥️';
    }
  };

  const handleEndSession = async (sessionId: string) => {
    try {
      const token = await apiService.getToken();
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      const response = await apiService.endSession(token, sessionId);
      if (response.success) {
        Alert.alert('Success', 'Session ended successfully');
        loadSessions();
      } else {
        Alert.alert('Error', response.message || 'Failed to end session');
      }
    } catch (error) {
      console.error('Error ending session:', error);
      Alert.alert('Error', 'Failed to end session');
    }
  };

  const handleFilterChange = (userType: string) => {
    setFilters({ ...filters, userType, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  return (
    <ProtectedRoute pageId="sessions">
      <AdminLayout title="User Session History" currentPage="sessions">
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Stats Section */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Session Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.total_sessions}</Text>
                <Text style={styles.statLabel}>Total Sessions</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statNumber, { color: '#10B981' }]}>{stats.active_sessions}</Text>
                <Text style={styles.statLabel}>Active Now</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.today_logins}</Text>
                <Text style={styles.statLabel}>Today's Logins</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.week_logins}</Text>
                <Text style={styles.statLabel}>This Week</Text>
              </View>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={[styles.statNumber, { color: '#8B5CF6' }]}>{stats.user_sessions}</Text>
                <Text style={styles.statLabel}>User Sessions</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statNumber, { color: '#3B82F6' }]}>{stats.admin_sessions}</Text>
                <Text style={styles.statLabel}>Admin Sessions</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.month_logins}</Text>
                <Text style={styles.statLabel}>This Month</Text>
              </View>
            </View>
          </View>

          {/* Filters */}
          <View style={styles.filtersSection}>
            <Text style={styles.sectionTitle}>Filters</Text>
            <View style={styles.filterButtons}>
              <TouchableOpacity
                style={[styles.filterButton, filters.userType === '' && styles.filterButtonActive]}
                onPress={() => handleFilterChange('')}
              >
                <Text style={[styles.filterButtonText, filters.userType === '' && styles.filterButtonTextActive]}>
                  All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, filters.userType === 'user' && styles.filterButtonActive]}
                onPress={() => handleFilterChange('user')}
              >
                <Text style={[styles.filterButtonText, filters.userType === 'user' && styles.filterButtonTextActive]}>
                  Users
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, filters.userType === 'admin' && styles.filterButtonActive]}
                onPress={() => handleFilterChange('admin')}
              >
                <Text style={[styles.filterButtonText, filters.userType === 'admin' && styles.filterButtonTextActive]}>
                  Admins
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sessions List */}
          <View style={styles.sessionsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Session History</Text>
              <TouchableOpacity style={styles.refreshButton} onPress={loadSessions}>
                <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
              </TouchableOpacity>
            </View>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.loadingText}>Loading sessions...</Text>
              </View>
            ) : (
              <View style={styles.sessionsList}>
                {sessions.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No sessions found</Text>
                    <Text style={styles.emptyStateSubtext}>Session history will appear here</Text>
                  </View>
                ) : (
                  sessions.map((session) => (
                    <View key={session.id} style={styles.sessionCard}>
                      <View style={styles.sessionHeader}>
                        <View style={styles.sessionHeaderLeft}>
                          <Text style={styles.deviceIcon}>{getDeviceIcon(session.device_type)}</Text>
                          <View>
                            <Text style={styles.sessionUser}>
                              {session.user_email || `${session.first_name || ''} ${session.last_name || ''}`.trim() || 'Unknown User'}
                            </Text>
                            <Text style={styles.sessionDevice}>
                              {session.device_name} • {session.device_type}
                            </Text>
                          </View>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(session.is_active) }]}>
                          <Text style={styles.statusText}>
                            {session.is_active ? 'Active' : 'Ended'}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.sessionDetails}>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Type:</Text>
                          <View style={[styles.typeBadge, { backgroundColor: getUserTypeColor(session.user_type) }]}>
                            <Text style={styles.typeText}>
                              {session.user_type === 'admin' ? 'Admin' : 'User'}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>IP Address:</Text>
                          <Text style={styles.detailValue}>{session.ip_address || 'Unknown'}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Login:</Text>
                          <Text style={styles.detailValue}>{formatDate(session.login_at)}</Text>
                        </View>
                        {session.logout_at && (
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Logout:</Text>
                            <Text style={styles.detailValue}>{formatDate(session.logout_at)}</Text>
                          </View>
                        )}
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Duration:</Text>
                          <Text style={styles.detailValue}>{formatDuration(session.login_at, session.logout_at)}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Last Activity:</Text>
                          <Text style={styles.detailValue}>{formatDate(session.last_activity)}</Text>
                        </View>
                      </View>

                      {session.is_active && (
                        <TouchableOpacity
                          style={styles.endSessionButton}
                          onPress={() => handleEndSession(session.id)}
                        >
                          <Text style={styles.endSessionButtonText}>End Session</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))
                )}
              </View>
            )}

            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
              <View style={styles.pagination}>
                <TouchableOpacity
                  style={[styles.paginationButton, filters.page === 1 && styles.paginationButtonDisabled]}
                  onPress={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                >
                  <Text style={[styles.paginationButtonText, filters.page === 1 && styles.paginationButtonTextDisabled]}>
                    Previous
                  </Text>
                </TouchableOpacity>
                <Text style={styles.paginationInfo}>
                  Page {pagination.page} of {pagination.totalPages}
                </Text>
                <TouchableOpacity
                  style={[styles.paginationButton, filters.page === pagination.totalPages && styles.paginationButtonDisabled]}
                  onPress={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === pagination.totalPages}
                >
                  <Text style={[styles.paginationButtonText, filters.page === pagination.totalPages && styles.paginationButtonTextDisabled]}>
                    Next
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </AdminLayout>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
    marginBottom: Spacing.sm,
    ...Shadows.small,
  },
  statNumber: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: '#6B7280',
    textAlign: 'center',
  },
  filtersSection: {
    marginBottom: Spacing.xl,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  filterButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: '#374151',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  sessionsSection: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  refreshButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  refreshButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: '#374151',
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  loadingText: {
    fontSize: FontSizes.md,
    color: '#6B7280',
    marginTop: Spacing.md,
  },
  sessionsList: {
    gap: Spacing.md,
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.small,
    marginBottom: Spacing.md,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sessionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  sessionUser: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#111827',
    marginBottom: Spacing.xs,
  },
  sessionDevice: {
    fontSize: FontSizes.sm,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sessionDetails: {
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: '#6B7280',
  },
  detailValue: {
    fontSize: FontSizes.sm,
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  typeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  typeText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  endSessionButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: '#EF4444',
    alignItems: 'center',
  },
  endSessionButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  emptyStateText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: '#374151',
    marginBottom: Spacing.sm,
  },
  emptyStateSubtext: {
    fontSize: FontSizes.md,
    color: '#6B7280',
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  paginationButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: '#3B82F6',
  },
  paginationButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  paginationButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  paginationButtonTextDisabled: {
    color: '#9CA3AF',
  },
  paginationInfo: {
    fontSize: FontSizes.sm,
    color: '#6B7280',
  },
});

