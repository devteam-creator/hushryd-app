import NotificationSettings from '@/components/NotificationSettings';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '@/constants/Design';
import { apiService } from '@/services/apiService';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
  avatar?: string;
  bio?: string;
}

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [bookingCount, setBookingCount] = useState(0);
  const [complaintCount, setComplaintCount] = useState(0);
  
  // Profile edit form state
  const [isEditing, setIsEditing] = useState(false);
  const [editingFields, setEditingFields] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    emergencyContact: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    bio: '',
  });
  
  useEffect(() => {
    loadUserProfile();
    loadBookingCount();
    loadComplaintCount();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      console.log('Loading user profile...');
      
      const token = await apiService.getToken();
      console.log('Token retrieved:', token ? `${token.substring(0, 20)}...` : 'null');
      
      if (!token) {
        console.error('No token found - redirecting to login');
        Alert.alert('Error', 'Please login to view your profile');
        router.push('/login');
        return;
      }

      const response = await apiService.getUserProfile(token);
      console.log('User profile API response:', response);
      
      if (response.success && response.data) {
        const user = response.data.user;
        console.log('User profile loaded:', user);
        setUserProfile(user);
        
        // Initialize editing fields
        setEditingFields({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          emergencyContact: user.emergencyContact || '',
          address: user.address || '',
          city: user.city || '',
          state: user.state || '',
          pincode: user.pincode || '',
          bio: user.bio || '',
        });
      } else {
        console.error('Failed to load user profile:', response.message);
        Alert.alert('Error', response.message || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const token = await apiService.getToken();
      if (!token) {
        Alert.alert('Error', 'Please login to save your profile');
        return;
      }

      const response = await apiService.updateUserProfile(editingFields, token);
      if (response.success && response.data) {
        setUserProfile(response.data.user);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        Alert.alert('Error', response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleStartEditing = () => {
    setIsEditing(true);
  };
  
  const handleCancelEditing = () => {
    setIsEditing(false);
    // Reset fields to original values
    if (userProfile) {
      setEditingFields({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        emergencyContact: (userProfile as any).emergencyContact || '',
        address: (userProfile as any).address || '',
        city: (userProfile as any).city || '',
        state: (userProfile as any).state || '',
        pincode: (userProfile as any).pincode || '',
        bio: userProfile.bio || '',
      });
    }
  };

  const loadBookingCount = async () => {
    try {
      const token = await apiService.getToken();
      if (token) {
        const response = await apiService.getUserBookings(token);
        if (response.success && response.data) {
          setBookingCount(response.data.bookings?.length || 0);
        }
      }
    } catch (error) {
      console.error('Error loading booking count:', error);
    }
  };

  const loadComplaintCount = async () => {
    try {
      const token = await apiService.getToken();
      if (token) {
        const response = await apiService.getUserComplaints(token);
        if (response.success && response.data) {
          setComplaintCount(response.data.complaints?.length || 0);
        }
      }
    } catch (error) {
      console.error('Error loading complaint count:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading profile...</Text>
      </View>
    );
  }

  if (!userProfile && !loading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Unable to load profile</Text>
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>
          Please check your internet connection and try again.
        </Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={loadUserProfile}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!userProfile) return null;

  const fullName = `${userProfile.firstName} ${userProfile.lastName}`;

  const menuOptions = [
    {
      id: 'profile',
      icon: '👤',
      title: 'My Profile',
      subtitle: 'View and edit your profile',
      route: '/profile/edit',
      badge: null
    },
    {
      id: 'bookings',
      icon: '📋',
      title: 'My Bookings',
      subtitle: `View all your bookings`,
      route: '/user/bookings',
      badge: bookingCount > 0 ? bookingCount : null
    },
    {
      id: 'complaints',
      icon: '⚠️',
      title: 'My Complaints',
      subtitle: 'Track your complaints',
      route: '/user/complaints',
      badge: complaintCount > 0 ? complaintCount : null
    },
    {
      id: 'help',
      icon: '❓',
      title: 'Help & Support',
      subtitle: 'Get help and assistance',
      route: '/help',
      badge: null
    },
    {
      id: 'refer',
      icon: '🎁',
      title: 'Refer and Earn',
      subtitle: 'Refer friends and earn rewards',
      route: '/refer',
      badge: null
    },
    {
      id: 'notifications',
      icon: '🔔',
      title: 'Notifications',
      subtitle: 'Manage notification settings',
      route: null,
      badge: null,
      onPress: () => setShowNotificationSettings(true)
    },
    {
      id: 'settings',
      icon: '⚙️',
      title: 'Settings',
      subtitle: 'App preferences and settings',
      route: '/settings',
      badge: null
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Profile Header with Gradient */}
      <LinearGradient colors={['#00D4FF', '#00AFF5', '#0090D9']} style={styles.header}>
        <Text style={styles.avatar}>{userProfile.avatar || '👤'}</Text>
        <Text style={styles.name}>{fullName}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>
            {userProfile.role === 'driver' ? '🚗 Driver' : userProfile.role === 'customer' ? '🚙 Customer' : '🎫 Passenger'}
          </Text>
        </View>
        {userProfile.isVerified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓ Verified</Text>
          </View>
        )}
      </LinearGradient>

      {/* Stats Card */}
      <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            📋 {bookingCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Bookings</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.primary }]}>{complaintCount}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Complaints</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {userProfile.isVerified ? '✓' : '○'}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Status</Text>
        </View>
      </View>

      {/* Profile Information Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile Information</Text>
          {!isEditing && (
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: colors.primary }]}
              onPress={handleStartEditing}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {isEditing ? (
          <View style={[styles.editForm, { backgroundColor: colors.card }]}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>First Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              value={editingFields.firstName}
              onChangeText={(text) => setEditingFields({...editingFields, firstName: text})}
              placeholder="Enter first name"
            />
            
            <Text style={[styles.inputLabel, { color: colors.text }]}>Last Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              value={editingFields.lastName}
              onChangeText={(text) => setEditingFields({...editingFields, lastName: text})}
              placeholder="Enter last name"
            />
            
            <Text style={[styles.inputLabel, { color: colors.text }]}>Email *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              value={editingFields.email}
              onChangeText={(text) => setEditingFields({...editingFields, email: text})}
              placeholder="Enter email"
              keyboardType="email-address"
            />
            
            <Text style={[styles.inputLabel, { color: colors.text }]}>Phone Number *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              value={editingFields.phone}
              onChangeText={(text) => setEditingFields({...editingFields, phone: text})}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
            
            <Text style={[styles.inputLabel, { color: colors.text }]}>Emergency Contact</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              value={editingFields.emergencyContact}
              onChangeText={(text) => setEditingFields({...editingFields, emergencyContact: text})}
              placeholder="Enter emergency contact"
              keyboardType="phone-pad"
            />
            
            <Text style={[styles.inputLabel, { color: colors.text }]}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              value={editingFields.address}
              onChangeText={(text) => setEditingFields({...editingFields, address: text})}
              placeholder="Enter address"
              multiline
              numberOfLines={2}
            />
            
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>City</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  value={editingFields.city}
                  onChangeText={(text) => setEditingFields({...editingFields, city: text})}
                  placeholder="City"
                />
              </View>
              <View style={styles.halfWidth}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>State</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  value={editingFields.state}
                  onChangeText={(text) => setEditingFields({...editingFields, state: text})}
                  placeholder="State"
                />
              </View>
            </View>
            
            <Text style={[styles.inputLabel, { color: colors.text }]}>Pincode</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              value={editingFields.pincode}
              onChangeText={(text) => setEditingFields({...editingFields, pincode: text})}
              placeholder="Enter pincode"
              keyboardType="numeric"
            />
            
            <Text style={[styles.inputLabel, { color: colors.text }]}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              value={editingFields.bio}
              onChangeText={(text) => setEditingFields({...editingFields, bio: text})}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={handleCancelEditing}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveProfile}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={[styles.profileInfoCard, { backgroundColor: colors.card }]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>First Name</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{userProfile.firstName || 'Not set'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Last Name</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{userProfile.lastName || 'Not set'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Email</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{userProfile.email || 'Not set'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Phone</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{userProfile.phone || 'Not set'}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.bottomPadding} />

      {/* Notification Settings Modal */}
      <Modal
        visible={showNotificationSettings}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <NotificationSettings onClose={() => setShowNotificationSettings(false)} />
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FontSizes.md,
    marginTop: Spacing.md,
  },
  errorText: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.sm,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  retryButton: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.huge,
    paddingBottom: Spacing.xxxl,
  },
  avatar: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  name: {
    fontSize: FontSizes.xxxl,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: Spacing.sm,
  },
  roleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    marginBottom: Spacing.sm,
  },
  roleBadgeText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  verifiedBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  statsCard: {
    flexDirection: 'row',
    padding: Spacing.xl,
    marginHorizontal: Spacing.lg,
    marginTop: -Spacing.xxxl,
    borderRadius: BorderRadius.lg,
    ...Shadows.large,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
  },
  statDivider: {
    width: 1,
    height: '100%',
  },
  section: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
    position: 'relative',
  },
  menuIconText: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: FontSizes.xs,
    fontWeight: '700',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  menuSubtitle: {
    fontSize: FontSizes.sm,
  },
  chevron: {
    fontSize: 24,
    fontWeight: '300',
  },
  bottomPadding: {
    height: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  editButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  editForm: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
  },
  inputLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  cancelButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  profileInfoCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  infoLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
});
