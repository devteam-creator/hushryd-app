import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import { BorderRadius, FontSizes, Spacing } from '../constants/Design';
import { useColorScheme } from './useColorScheme';

interface TimeSlot {
  key: string;
  label: string;
  icon: string;
  timeRange: string;
}

interface TimeSlotDropdownProps {
  selectedTimeslot: string;
  onTimeslotSelect: (timeslot: string) => void;
  visible: boolean;
}

export default function TimeSlotDropdown({ selectedTimeslot, onTimeslotSelect, visible }: TimeSlotDropdownProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const timeSlots: TimeSlot[] = [
    { key: 'any', label: 'Any Time', icon: '🕐', timeRange: 'All available times' },
    { key: 'early-morning', label: 'Early Morning', icon: '🌄', timeRange: '4:00 AM - 7:00 AM' },
    { key: 'morning', label: 'Morning', icon: '🌅', timeRange: '7:00 AM - 10:00 AM' },
    { key: 'late-morning', label: 'Late Morning', icon: '☀️', timeRange: '10:00 AM - 1:00 PM' },
    { key: 'afternoon', label: 'Afternoon', icon: '🌞', timeRange: '1:00 PM - 4:00 PM' },
    { key: 'evening', label: 'Evening', icon: '🌆', timeRange: '4:00 PM - 7:00 PM' },
    { key: 'late-evening', label: 'Late Evening', icon: '🌇', timeRange: '7:00 PM - 10:00 PM' },
    { key: 'night', label: 'Night', icon: '🌙', timeRange: '10:00 PM - 1:00 AM' },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => onTimeslotSelect(selectedTimeslot)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => onTimeslotSelect(selectedTimeslot)}
      >
        <TouchableOpacity 
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          style={styles.modalContainer}
        >
          <ScrollView 
            style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.dropdownTitle, { color: colors.text }]}>Select Time Slot</Text>
            <Text style={[styles.dropdownSubtitle, { color: colors.textSecondary }]}>
              Choose your preferred departure time
            </Text>
            
            <View style={styles.slotsContainer}>
              {timeSlots.map((slot) => (
                <TouchableOpacity
                  key={slot.key}
                  style={[
                    styles.slotItem,
                    { 
                      backgroundColor: colors.lightGray, 
                      borderColor: colors.border,
                      ...(selectedTimeslot === slot.key && {
                        backgroundColor: colors.primary,
                        borderColor: colors.primary,
                      })
                    }
                  ]}
                  onPress={() => onTimeslotSelect(slot.key)}
                  activeOpacity={0.7}
                >
                  <View style={styles.slotHeader}>
                    <Text style={styles.slotIcon}>{slot.icon}</Text>
                    <View style={styles.slotInfo}>
                      <Text style={[
                        styles.slotLabel, 
                        { color: colors.text },
                        selectedTimeslot === slot.key && { color: '#FFFFFF' }
                      ]}>
                        {slot.label}
                      </Text>
                      <Text style={[
                        styles.slotTimeRange, 
                        { color: colors.textSecondary },
                        selectedTimeslot === slot.key && { color: '#FFFFFF' }
                      ]}>
                        {slot.timeRange}
                      </Text>
                    </View>
                  </View>
                  
                  {selectedTimeslot === slot.key && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.selectedIcon}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Safety Notice */}
            <View style={[styles.safetyNotice, { backgroundColor: colors.lightGray + '80' }]}>
              <Text style={styles.safetyIcon}>⚠️</Text>
              <Text style={[styles.safetyText, { color: colors.textSecondary }]}>
                No rides available between 1:00 AM - 4:00 AM for safety reasons
              </Text>
            </View>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  dropdown: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  dropdownTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  dropdownSubtitle: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.lg,
  },
  slotsContainer: {
    gap: Spacing.sm,
  },
  slotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  slotIcon: {
    fontSize: FontSizes.lg,
    marginRight: Spacing.md,
  },
  slotInfo: {
    flex: 1,
  },
  slotLabel: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  slotTimeRange: {
    fontSize: FontSizes.sm,
  },
  selectedIndicator: {
    marginLeft: Spacing.md,
  },
  selectedIcon: {
    fontSize: FontSizes.lg,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  safetyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
  },
  safetyIcon: {
    fontSize: FontSizes.md,
    marginRight: Spacing.sm,
  },
  safetyText: {
    fontSize: FontSizes.xs,
    flex: 1,
    lineHeight: FontSizes.sm,
  },
});
