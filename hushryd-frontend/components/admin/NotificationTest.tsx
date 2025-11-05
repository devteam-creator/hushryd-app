import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';
import { BorderRadius, FontSizes, Spacing } from '../../constants/Design';
import { notificationService } from '../../services/notificationService';
import { useColorScheme } from '../useColorScheme';

export default function NotificationTest() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const testSuccessNotification = () => {
    notificationService.showSuccess('This is a success notification!');
  };

  const testErrorNotification = () => {
    notificationService.showError('This is an error notification!');
  };

  const testWarningNotification = () => {
    notificationService.showWarning('This is a warning notification!');
  };

  const testInfoNotification = () => {
    notificationService.showInfo('This is an info notification!');
  };

  const testApiResponse = () => {
    const mockResponse = {
      success: true,
      message: 'API operation completed successfully!',
    };
    notificationService.showApiResponse(mockResponse);
  };

  const testApiError = () => {
    const mockResponse = {
      success: false,
      message: 'API operation failed!',
      error: 'Network timeout',
    };
    notificationService.showApiResponse(mockResponse);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Notification Service Test
      </Text>
      
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Test different types of notifications
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#10b981' }]}
        onPress={testSuccessNotification}
      >
        <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
          Test Success Notification
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#ef4444' }]}
        onPress={testErrorNotification}
      >
        <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
          Test Error Notification
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#f59e0b' }]}
        onPress={testWarningNotification}
      >
        <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
          Test Warning Notification
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#3b82f6' }]}
        onPress={testInfoNotification}
      >
        <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
          Test Info Notification
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#8b5cf6' }]}
        onPress={testApiResponse}
      >
        <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
          Test API Success Response
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#ef4444' }]}
        onPress={testApiError}
      >
        <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
          Test API Error Response
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.medium,
    borderRadius: BorderRadius.medium,
    margin: Spacing.medium,
  },
  title: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    marginBottom: Spacing.small,
  },
  description: {
    fontSize: FontSizes.medium,
    marginBottom: Spacing.medium,
  },
  button: {
    padding: Spacing.medium,
    borderRadius: BorderRadius.small,
    marginBottom: Spacing.small,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
  },
});
