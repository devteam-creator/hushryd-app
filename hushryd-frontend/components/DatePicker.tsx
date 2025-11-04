import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DatePickerProps {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  style?: any;
  showLabel?: boolean;
}

export default function DatePicker({
  label,
  value,
  onChange,
  minimumDate,
  maximumDate,
  placeholder = 'Select date',
  error,
  disabled = false,
  style,
  showLabel = true,
}: DatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  // Web platform: Use HTML5 date input
  if (Platform.OS === 'web') {
    const inputStyle = {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      border: `1px solid ${error ? '#EF4444' : '#E5E7EB'}`,
      borderRadius: '8px',
      minHeight: '48px',
      fontFamily: 'inherit',
      outline: 'none',
    };

    return (
      <View style={[styles.container, style]}>
        {label && showLabel && <Text style={styles.label}>{label}</Text>}
        {/* @ts-ignore - React Native Web supports rendering HTML elements */}
        <input
          type="date"
          value={value ? value.toISOString().split('T')[0] : ''}
          onChange={(e) => {
            const dateValue = e.target.value;
            if (dateValue) {
              onChange(new Date(dateValue));
            }
          }}
          disabled={disabled}
          style={inputStyle}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  // iOS platform: Show inline picker
  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.container, style]}>
        {label && showLabel && <Text style={styles.label}>{label}</Text>}
        <View style={[styles.iosContainer]}>
          <DateTimePicker
            value={value}
            mode="date"
            display="compact"
            onChange={handleDateChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            disabled={disabled}
          />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  // Android platform: Show picker in modal
  return (
    <View style={[styles.container, style]}>
      {label && showLabel && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={() => !disabled && setShowPicker(true)}
        disabled={disabled}
      >
        <Text style={[styles.buttonText, !value && styles.placeholderText]}>
          {value ? value.toLocaleDateString() : placeholder}
        </Text>
        <Text style={styles.icon}>📅</Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  webInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 48,
  },
  iosContainer: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 48,
    backgroundColor: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.5,
    backgroundColor: '#F3F4F6',
  },
  buttonText: {
    fontSize: 16,
    flex: 1,
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  icon: {
    fontSize: 20,
    marginLeft: 8,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
});
