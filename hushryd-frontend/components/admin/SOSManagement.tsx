import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { EmergencyService, SOSAlert } from '../../../types/sos';
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../../constants/Design';

interface SOSManagementProps {
  // Props for admin dashboard integration
}

export default function SOSManagement({}: SOSManagementProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);
  const [emergencyServices, setEmergencyServices] = useState<EmergencyService[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<SOSAlert | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadSOSAlerts();
    loadEmergencyServices();
  }, []);

  const loadSOSAlerts = () => {
    // Mock data - in real app, fetch from API
    const mockAlerts: SOSAlert[] = [
      {
        id: '1',
        userId: 'user1',
        userName: 'John Doe',
        userPhone: '+91-9876543210',
        rideId: 'ride1',
        location: {
          latitude: 17.3850,
          longitude: 78.4867,
          address: 'Hyderabad, Telangana, India'
        },
        timestamp: new Date().toISOString(),
        status: 'active',
        emergencyType: 'safety',
        description: 'User reported feeling unsafe during ride',
        priority: 'high'
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Jane Smith',
        userPhone: '+91-9876543211',
        location: {
          latitude: 17.4065,
          longitude: 78.4772,
          address: 'Secunderabad, Telangana, India'
        },
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'resolved',
        emergencyType: 'medical',
        description: 'Medical emergency during ride',
        priority: 'critical',
        resolvedBy: 'admin1',
        resolvedAt: new Date().toISOString()
      }
    ];
    setSosAlerts(mockAlerts);
  };

  const loadEmergencyServices = () => {
    const mockServices: EmergencyService[] = [
      { id: '1', name: 'Hyderabad Police', phone: '100', type: 'police', area: 'Hyderabad', isActive: true },
      { id: '2', name: 'Emergency Ambulance', phone: '108', type: 'ambulance', area: 'Hyderabad', isActive: true },
      { id: '3', name: 'Fire Service', phone: '101', type: 'fire', area: 'Hyderabad', isActive: true },
      { id: '4', name: 'Roadside Assistance', phone: '+91-9876543210', type: 'roadside', area: 'Hyderabad', isActive: true },
    ];
    setEmergencyServices(mockServices);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#EF4444';
      case 'resolved': return '#10B981';
      case 'false_alarm': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#DC2626';
      case 'high': return '#F97316';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getEmergencyTypeIcon = (type: string) => {
    switch (type) {
      case 'medical': return '🏥';
      case 'safety': return '🛡️';
      case 'vehicle': return '🚗';
      case 'other': return '⚠️';
      default: return '🚨';
    }
  };

  const handleResolveAlert = (alertId: string) => {
    Alert.alert(
      'Resolve Alert',
      'Are you sure you want to mark this alert as resolved?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Resolve',
          onPress: () => {
            setSosAlerts(prev => prev.map(alert => 
              alert.id === alertId 
                ? { ...alert, status: 'resolved' as const, resolvedAt: new Date().toISOString() }
                : alert
            ));
            setShowAlertModal(false);
          }
        }
      ]
    );
  };

  const handleAddNotes = () => {
    if (selectedAlert && adminNotes.trim()) {
      setSosAlerts(prev => prev.map(alert => 
        alert.id === selectedAlert.id 
          ? { ...alert, adminNotes: adminNotes.trim() }
          : alert
      ));
      setAdminNotes('');
      setShowAlertModal(false);
    }
  };

  const renderSOSAlert = ({ item }: { item: SOSAlert }) => (
    <TouchableOpacity
      style={[styles.alertCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => {
        setSelectedAlert(item);
        setShowAlertModal(true);
      }}
    >
      <View style={styles.alertHeader}>
        <View style={styles.alertInfo}>
          <Text style={[styles.alertUser, { color: colors.text }]}>{item.userName}</Text>
          <Text style={[styles.alertPhone, { color: colors.textSecondary }]}>{item.userPhone}</Text>
        </View>
        <View style={styles.alertStatus}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
            <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.alertDetails}>
        <Text style={styles.emergencyIcon}>{getEmergencyTypeIcon(item.emergencyType)}</Text>
        <View style={styles.alertContent}>
          <Text style={[styles.alertType, { color: colors.text }]}>
            {item.emergencyType.charAt(0).toUpperCase() + item.emergencyType.slice(1)} Emergency
          </Text>
          <Text style={[styles.alertLocation, { color: colors.textSecondary }]}>
            📍 {item.location.address}
          </Text>
          <Text style={[styles.alertTime, { color: colors.textSecondary }]}>
            🕐 {new Date(item.timestamp).toLocaleString()}
          </Text>
        </View>
      </View>
      
      {item.description && (
        <Text style={[styles.alertDescription, { color: colors.textSecondary }]}>
          {item.description}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderEmergencyService = ({ item }: { item: EmergencyService }) => (
    <View style={[styles.serviceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.serviceHeader}>
        <Text style={[styles.serviceName, { color: colors.text }]}>{item.name}</Text>
        <View style={[styles.activeBadge, { backgroundColor: item.isActive ? colors.success : colors.darkGray }]}>
          <Text style={styles.activeText}>{item.isActive ? 'ACTIVE' : 'INACTIVE'}</Text>
        </View>
      </View>
      <Text style={[styles.servicePhone, { color: colors.textSecondary }]}>📞 {item.phone}</Text>
      <Text style={[styles.serviceArea, { color: colors.textSecondary }]}>📍 {item.area}</Text>
      <Text style={[styles.serviceType, { color: colors.textSecondary }]}>
        Type: {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>SOS Emergency Management</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Monitor and manage emergency alerts
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statNumber, { color: colors.error }]}>
            {sosAlerts.filter(alert => alert.status === 'active').length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Alerts</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statNumber, { color: colors.success }]}>
            {sosAlerts.filter(alert => alert.status === 'resolved').length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Resolved</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {emergencyServices.filter(service => service.isActive).length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Services</Text>
        </View>
      </View>

      {/* SOS Alerts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent SOS Alerts</Text>
          <TouchableOpacity style={styles.refreshButton}>
            <Text style={[styles.refreshText, { color: colors.primary }]}>Refresh</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={sosAlerts}
          renderItem={renderSOSAlert}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Emergency Services */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Emergency Services</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowServiceModal(true)}
          >
            <Text style={[styles.addButtonText, { color: colors.primary }]}>+ Add Service</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={emergencyServices}
          renderItem={renderEmergencyService}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Alert Detail Modal */}
      <Modal
        visible={showAlertModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: '#0F172A' }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: '#FFFFFF' }]}>Alert Details</Text>
            <TouchableOpacity onPress={() => setShowAlertModal(false)}>
              <Text style={[styles.closeButton, { color: '#3B82F6' }]}>Close</Text>
            </TouchableOpacity>
          </View>
          
          {selectedAlert && (
            <ScrollView style={styles.modalContent}>
              <View style={[styles.detailCard, { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }]}>
                <Text style={[styles.detailTitle, { color: '#FFFFFF' }]}>User Information</Text>
                <Text style={[styles.detailText, { color: 'rgba(255, 255, 255, 0.7)' }]}>
                  Name: {selectedAlert.userName}
                </Text>
                <Text style={[styles.detailText, { color: 'rgba(255, 255, 255, 0.7)' }]}>
                  Phone: {selectedAlert.userPhone}
                </Text>
                <Text style={[styles.detailText, { color: 'rgba(255, 255, 255, 0.7)' }]}>
                  Ride ID: {selectedAlert.rideId || 'N/A'}
                </Text>
              </View>
              
              <View style={[styles.detailCard, { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }]}>
                <Text style={[styles.detailTitle, { color: '#FFFFFF' }]}>Emergency Details</Text>
                <Text style={[styles.detailText, { color: 'rgba(255, 255, 255, 0.7)' }]}>
                  Type: {selectedAlert.emergencyType}
                </Text>
                <Text style={[styles.detailText, { color: 'rgba(255, 255, 255, 0.7)' }]}>
                  Priority: {selectedAlert.priority}
                </Text>
                <Text style={[styles.detailText, { color: 'rgba(255, 255, 255, 0.7)' }]}>
                  Time: {new Date(selectedAlert.timestamp).toLocaleString()}
                </Text>
                <Text style={[styles.detailText, { color: 'rgba(255, 255, 255, 0.7)' }]}>
                  Location: {selectedAlert.location.address}
                </Text>
                {selectedAlert.description && (
                  <Text style={[styles.detailText, { color: 'rgba(255, 255, 255, 0.7)' }]}>
                    Description: {selectedAlert.description}
                  </Text>
                )}
              </View>
              
              <View style={[styles.detailCard, { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }]}>
                <Text style={[styles.detailTitle, { color: '#FFFFFF' }]}>Admin Notes</Text>
                <TextInput
                  style={[styles.notesInput, { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.2)' }]}
                  placeholder="Add admin notes..."
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={adminNotes}
                  onChangeText={setAdminNotes}
                  multiline
                  numberOfLines={4}
                />
                <TouchableOpacity style={styles.addNotesButton} onPress={handleAddNotes}>
                  <Text style={styles.addNotesText}>Add Notes</Text>
                </TouchableOpacity>
              </View>
              
              {selectedAlert.status === 'active' && (
                <TouchableOpacity 
                  style={styles.resolveButton}
                  onPress={() => handleResolveAlert(selectedAlert.id)}
                >
                  <Text style={styles.resolveButtonText}>Mark as Resolved</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  headerSubtitle: {
    fontSize: FontSizes.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
    ...Shadows.small,
  },
  statNumber: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    textAlign: 'center',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: Spacing.sm,
  },
  refreshText: {
    fontSize: FontSizes.md,
    fontWeight: '500',
  },
  addButton: {
    padding: Spacing.sm,
  },
  addButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '500',
  },
  alertCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  alertInfo: {
    flex: 1,
  },
  alertUser: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  alertPhone: {
    fontSize: FontSizes.md,
  },
  alertStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  priorityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  priorityText: {
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  alertDetails: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  emergencyIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  alertContent: {
    flex: 1,
  },
  alertType: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  alertLocation: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
  },
  alertTime: {
    fontSize: FontSizes.sm,
  },
  alertDescription: {
    fontSize: FontSizes.sm,
    fontStyle: 'italic',
    marginTop: Spacing.sm,
  },
  serviceCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  serviceName: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    flex: 1,
  },
  activeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  activeText: {
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  servicePhone: {
    fontSize: FontSizes.md,
    marginBottom: Spacing.xs,
  },
  serviceArea: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
  },
  serviceType: {
    fontSize: FontSizes.sm,
  },
  modalContainer: {
    flex: 1,
    padding: Spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: FontSizes.md,
    fontWeight: '500',
  },
  modalContent: {
    flex: 1,
  },
  detailCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    ...Shadows.small,
  },
  detailTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  detailText: {
    fontSize: FontSizes.md,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    marginBottom: Spacing.md,
    textAlignVertical: 'top',
  },
  addNotesButton: {
    backgroundColor: '#3B82F6',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  addNotesText: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resolveButton: {
    backgroundColor: '#10B981',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  resolveButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
