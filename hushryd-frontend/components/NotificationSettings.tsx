import React, { useEffect, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Colors from '../constants/Colors';
import { BorderRadius, FontSizes, Spacing } from '../constants/Design';
import { useNotifications } from './NotificationProvider';
import { useColorScheme } from './useColorScheme';

interface NotificationSettingsProps {
  onClose?: () => void;
}

export default function NotificationSettings({ onClose }: NotificationSettingsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { areNotificationsEnabled, registerForNotifications } = useNotifications();

  const [settings, setSettings] = useState({
    rideUpdates: true,
    paymentNotifications: true,
    promotionalMessages: false,
    safetyAlerts: true,
    systemUpdates: true,
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    const enabled = await areNotificationsEnabled();
    setNotificationsEnabled(enabled);
  };

  const handleToggleNotification = async () => {
    if (!notificationsEnabled) {
      // Request permissions
      const granted = await registerForNotifications();
      if (granted) {
        setNotificationsEnabled(true);
        Alert.alert('Success', 'Notifications enabled successfully!');
      } else {
        Alert.alert('Permission Denied', 'Please enable notifications in your device settings.');
      }
    } else {
      Alert.alert(
        'Disable Notifications',
        'To disable notifications, please go to your device settings.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSettingToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveSettings = () => {
    // Here you would typically save settings to your backend or local storage
    Alert.alert('Settings Saved', 'Your notification preferences have been saved.');
    onClose?.();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Notification Settings</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeText, { color: colors.text }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        {/* Main notification toggle */}
        <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>
              Push Notifications
            </Text>
            <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
              Receive notifications about rides, payments, and important updates
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggleNotification}
            trackColor={{ false: colors.lightGray, true: colors.primary }}
            thumbColor={notificationsEnabled ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>

        {/* Individual notification settings */}
        {notificationsEnabled && (
          <>
            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Ride Updates
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Booking confirmations, ride status changes
                </Text>
              </View>
              <Switch
                value={settings.rideUpdates}
                onValueChange={() => handleSettingToggle('rideUpdates')}
                trackColor={{ false: colors.lightGray, true: colors.primary }}
                thumbColor={settings.rideUpdates ? '#FFFFFF' : '#f4f3f4'}
              />
            </View>

            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Payment Notifications
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Payment confirmations, refund updates
                </Text>
              </View>
              <Switch
                value={settings.paymentNotifications}
                onValueChange={() => handleSettingToggle('paymentNotifications')}
                trackColor={{ false: colors.lightGray, true: colors.primary }}
                thumbColor={settings.paymentNotifications ? '#FFFFFF' : '#f4f3f4'}
              />
            </View>

            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Safety Alerts
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Important safety updates and emergency alerts
                </Text>
              </View>
              <Switch
                value={settings.safetyAlerts}
                onValueChange={() => handleSettingToggle('safetyAlerts')}
                trackColor={{ false: colors.lightGray, true: colors.primary }}
                thumbColor={settings.safetyAlerts ? '#FFFFFF' : '#f4f3f4'}
              />
            </View>

            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Promotional Messages
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Offers, discounts, and promotional content
                </Text>
              </View>
              <Switch
                value={settings.promotionalMessages}
                onValueChange={() => handleSettingToggle('promotionalMessages')}
                trackColor={{ false: colors.lightGray, true: colors.primary }}
                thumbColor={settings.promotionalMessages ? '#FFFFFF' : '#f4f3f4'}
              />
            </View>

            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  System Updates
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  App updates and maintenance notifications
                </Text>
              </View>
              <Switch
                value={settings.systemUpdates}
                onValueChange={() => handleSettingToggle('systemUpdates')}
                trackColor={{ false: colors.lightGray, true: colors.primary }}
                thumbColor={settings.systemUpdates ? '#FFFFFF' : '#f4f3f4'}
              />
            </View>
          </>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSaveSettings}
        >
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>
      </View>
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
    borderBottomWidth: 1,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: Spacing.small,
  },
  closeText: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.large,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.medium,
  },
  settingTitle: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    marginBottom: Spacing.tiny,
  },
  settingDescription: {
    fontSize: FontSizes.small,
    lineHeight: FontSizes.small * 1.4,
  },
  footer: {
    padding: Spacing.large,
  },
  saveButton: {
    paddingVertical: Spacing.medium,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
  },
});
