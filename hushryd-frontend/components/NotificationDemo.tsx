import React, { useState } from 'react';
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Colors from '../constants/Colors';
import { BorderRadius, FontSizes, Spacing } from '../constants/Design';
import { useNotifications } from './NotificationProvider';
import NotificationSettings from './NotificationSettings';
import { useColorScheme } from './useColorScheme';

export default function NotificationDemo() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { pushToken, sendLocalNotification, areNotificationsEnabled } = useNotifications();
  const [showSettings, setShowSettings] = useState(false);

  const handleSendTestNotification = async () => {
    try {
      await sendLocalNotification(
        'Test Notification',
        'This is a test notification from HushRyd!',
        {
          type: 'system_update',
          message: 'Test notification sent successfully',
        }
      );
      Alert.alert('Success', 'Test notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
    }
  };

  const handleSendRideNotification = async () => {
    try {
      await sendLocalNotification(
        'Ride Confirmed',
        'Your ride from Hyderabad to Bangalore has been confirmed!',
        {
          type: 'ride_confirmed',
          rideId: 'ride_123',
          deepLink: '/ride/ride_123',
        }
      );
      Alert.alert('Success', 'Ride notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send ride notification');
    }
  };

  const handleSendPaymentNotification = async () => {
    try {
      await sendLocalNotification(
        'Payment Received',
        'You received ₹500 for your ride completion',
        {
          type: 'payment_received',
          amount: 500,
          deepLink: '/transactions',
        }
      );
      Alert.alert('Success', 'Payment notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send payment notification');
    }
  };

  const handleSendSafetyAlert = async () => {
    try {
      await sendLocalNotification(
        'Safety Alert',
        'Emergency SOS activated. Help is on the way.',
        {
          type: 'safety_alert',
          deepLink: '/sos',
        }
      );
      Alert.alert('Success', 'Safety alert sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send safety alert');
    }
  };

  const handleCheckPermissions = async () => {
    const enabled = await areNotificationsEnabled();
    Alert.alert(
      'Notification Status',
      enabled ? 'Notifications are enabled' : 'Notifications are disabled'
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Push Notifications Demo</Text>
        <TouchableOpacity
          style={[styles.settingsButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowSettings(true)}
        >
          <Text style={styles.settingsButtonText}>⚙️ Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={[styles.statusCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statusTitle, { color: colors.text }]}>Notification Status</Text>
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            Push Token: {pushToken ? '✅ Registered' : '❌ Not Registered'}
          </Text>
          {pushToken && (
            <Text style={[styles.tokenText, { color: colors.textSecondary }]} numberOfLines={2}>
              {pushToken}
            </Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.demoButton, { backgroundColor: colors.primary }]}
            onPress={handleSendTestNotification}
          >
            <Text style={styles.buttonText}>🔔 Send Test Notification</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.demoButton, { backgroundColor: '#10b981' }]}
            onPress={handleSendRideNotification}
          >
            <Text style={styles.buttonText}>🚗 Send Ride Notification</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.demoButton, { backgroundColor: '#f59e0b' }]}
            onPress={handleSendPaymentNotification}
          >
            <Text style={styles.buttonText}>💰 Send Payment Notification</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.demoButton, { backgroundColor: '#ef4444' }]}
            onPress={handleSendSafetyAlert}
          >
            <Text style={styles.buttonText}>🆘 Send Safety Alert</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.demoButton, { backgroundColor: colors.lightGray }]}
            onPress={handleCheckPermissions}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>🔍 Check Permissions</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showSettings}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <NotificationSettings onClose={() => setShowSettings(false)} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.large,
    paddingTop: Spacing.xxxl,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
  },
  settingsButton: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    borderRadius: BorderRadius.medium,
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.small,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: Spacing.large,
  },
  statusCard: {
    padding: Spacing.large,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  statusTitle: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    marginBottom: Spacing.small,
  },
  statusText: {
    fontSize: FontSizes.medium,
    marginBottom: Spacing.tiny,
  },
  tokenText: {
    fontSize: FontSizes.small,
    fontFamily: 'monospace',
    marginTop: Spacing.small,
  },
  buttonContainer: {
    gap: Spacing.medium,
  },
  demoButton: {
    paddingVertical: Spacing.large,
    paddingHorizontal: Spacing.large,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
  },
});
