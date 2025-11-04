import React, { useState } from 'react';
import { Modal, Platform, Image as RNImage, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Images from '../assets/images';
import Colors from '../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../constants/Design';
import { SearchParams } from '../types/models';
import Button from './Button';
import DatePicker from './DatePicker';
import LocationAutocomplete from './LocationAutocomplete';
import TimeSlotDropdown from './TimeSlotDropdown';
import { useColorScheme } from './useColorScheme';

interface SearchBarProps {
  onSearch: (params: SearchParams) => void;
  initialValues?: Partial<SearchParams>;
  compact?: boolean;
}

export default function SearchBar({ onSearch, initialValues, compact = false }: SearchBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [from, setFrom] = useState(initialValues?.from || '');
  const [to, setTo] = useState(initialValues?.to || '');
  const [date, setDate] = useState(initialValues?.date || getTodayDate());
  const [passengers, setPassengers] = useState(initialValues?.passengers || 1);
  const [timeslot, setTimeslot] = useState<'any' | 'early-morning' | 'morning' | 'late-morning' | 'afternoon' | 'evening' | 'late-evening' | 'night'>(initialValues?.timeslot || 'any');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimeSlotDropdown, setShowTimeSlotDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(initialValues?.date || getTodayDate()));

  const handleSearch = () => {
    console.log('SearchBar handleSearch called with:', { from, to, date, passengers, timeslot });
    if (from && to && date) {
      onSearch({ from, to, date, passengers, timeslot });
    } else {
      console.log('Search validation failed - missing required fields');
    }
  };

  const swapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleTimeslotSelect = (selectedTimeslot: string) => {
    setTimeslot(selectedTimeslot as any);
    setShowTimeSlotDropdown(false);
  };

  const handleReset = () => {
    console.log('Resetting search criteria');
    setFrom('');
    setTo('');
    setDate(getTodayDate());
    setSelectedDate(new Date());
    setPassengers(1);
    setTimeslot('any');
    setShowTimeSlotDropdown(false);
  };

  const handleDatePress = () => {
    setShowTimeSlotDropdown(false); // Hide timeslot dropdown when selecting date
    setShowDatePicker(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(currentDate);
    setDate(currentDate.toISOString().split('T')[0]);
  };

  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      <View style={[styles.searchCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {/* Background Image */}
        <RNImage 
          source={Images.searchBanner} 
          style={styles.backgroundImage}
          resizeMode="cover"
          onError={() => {
            console.log('Search bar background image failed to load');
          }}
        />
        
        {/* Content Overlay */}
        <View style={styles.contentOverlay}>
        {/* Main Search Row */}
        <View style={styles.mainRow}>
          {/* First Row: From, To, Date, Passengers */}
          <View style={styles.firstRow}>
            {/* From Location */}
            <View style={styles.inputWrapper}>
              <LocationAutocomplete
                placeholder="From"
                value={from}
                onLocationSelect={setFrom}
                icon={<Text style={styles.inputIcon}>📍</Text>}
              />
            </View>

            {/* Swap Button */}
            <TouchableOpacity 
              style={[styles.swapButton, { backgroundColor: colors.primary }]} 
              onPress={swapLocations}
            >
              <Text style={styles.swapIcon}>⇅</Text>
            </TouchableOpacity>

            {/* To Location */}
            <View style={styles.inputWrapper}>
              <LocationAutocomplete
                placeholder="To"
                value={to}
                onLocationSelect={setTo}
                icon={<Text style={styles.inputIcon}>🎯</Text>}
              />
            </View>

            {/* Date Input */}
            <View style={styles.dateWrapper}>
              <TouchableOpacity
                style={[styles.dateInput, { backgroundColor: colors.lightGray, borderColor: colors.border }]}
                onPress={handleDatePress}
              >
                <Text style={styles.inputIcon}>📅</Text>
                <Text style={[styles.dateText, { color: colors.text }]}>
                  {formatDateDisplay(date)}
                </Text>
                {date && (
                  <TouchableOpacity
                    style={styles.timeSlotTrigger}
                    onPress={() => setShowTimeSlotDropdown(!showTimeSlotDropdown)}
                  >
                    <Text style={styles.timeSlotIcon}>⏰</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
              
              {/* Time Slot Dropdown */}
              <TimeSlotDropdown
                selectedTimeslot={timeslot}
                onTimeslotSelect={handleTimeslotSelect}
                visible={showTimeSlotDropdown}
              />
            </View>

            {/* Passengers Input */}
            <View style={styles.passengerWrapper}>
              <View
                style={[
                  styles.passengerControl,
                  { backgroundColor: colors.lightGray, borderColor: colors.border },
                ]}
              >
                <TouchableOpacity
                  style={styles.passengerButton}
                  onPress={() => setPassengers(Math.max(1, passengers - 1))}
                >
                  <Text style={[styles.passengerButtonText, { color: colors.text }]}>−</Text>
                </TouchableOpacity>
                <View style={styles.passengerDisplay}>
                  <Text style={[styles.passengerText, { color: colors.text }]}>{passengers}</Text>
                </View>
                <TouchableOpacity
                  style={styles.passengerButton}
                  onPress={() => setPassengers(Math.min(8, passengers + 1))}
                >
                  <Text style={[styles.passengerButtonText, { color: colors.text }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

        {/* Second Row: Timeslots and Buttons */}
        <View style={styles.secondRow}>
          {/* Timeslot Selector */}
          <View style={styles.timeslotContainer}>
            <Text style={[styles.timeslotLabel, { color: colors.textSecondary }]}>Time</Text>
            <View style={styles.timeslotButtons}>
              {([
                { key: 'any', label: 'Any', icon: '🕐' },
                { key: 'early-morning', label: '4-7AM', icon: '🌄' },
                { key: 'morning', label: '7-10AM', icon: '🌅' },
                { key: 'late-morning', label: '10-1PM', icon: '☀️' },
                { key: 'afternoon', label: '1-4PM', icon: '🌞' },
                { key: 'evening', label: '4-7PM', icon: '🌆' },
                { key: 'late-evening', label: '7-10PM', icon: '🌇' },
                { key: 'night', label: '10-1AM', icon: '🌙' },
              ] as const).map((slot) => (
                <TouchableOpacity
                  key={slot.key}
                  style={[
                    styles.timeslotButton,
                    { backgroundColor: colors.lightGray, borderColor: colors.border },
                    timeslot === slot.key && [
                      styles.timeslotButtonActive,
                      { backgroundColor: colors.primary, borderColor: colors.primary },
                    ],
                  ]}
                  onPress={() => setTimeslot(slot.key)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.timeslotIcon}>{slot.icon}</Text>
                  <Text
                    style={[
                      styles.timeslotText,
                      { color: colors.text },
                      timeslot === slot.key && { color: '#FFFFFF' },
                    ]}
                  >
                    {slot.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Reset Button */}
          <Button 
            title="Reset" 
            onPress={handleReset} 
            variant="outline"
            size="medium"
            style={styles.resetButton}
          />
          
          {/* Search Button */}
          <Button 
            title="Search" 
            onPress={handleSearch} 
            variant="outline"
            size="medium"
            style={styles.searchButton}
          />
        </View>
        </View>
        </View>
      </View>

      {/* Calendar Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.calendarModal, { backgroundColor: colors.card }]}>
            <View style={styles.calendarHeader}>
              <Text style={[styles.calendarTitle, { color: colors.text }]}>Select Date</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(false)}
                style={styles.closeButton}
              >
                <Text style={[styles.closeButtonText, { color: colors.text }]}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setDate(date.toISOString().split('T')[0]);
              }}
              minimumDate={new Date()}
              placeholder="Select date"
              showLabel={true}
            />
            
            <View style={styles.calendarFooter}>
              <Button
                title="Cancel"
                onPress={() => setShowDatePicker(false)}
                variant="outline"
                size="medium"
                style={styles.cancelButton}
              />
              <Button
                title="Select"
                onPress={() => setShowDatePicker(false)}
                size="medium"
                style={styles.selectButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  compactContainer: {
    padding: Spacing.md,
  },
  searchCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    ...Shadows.medium,
    overflow: 'hidden',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  contentOverlay: {
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  mainRow: {
    flexDirection: 'column',
    gap: Spacing.md,
  },
  firstRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    flexWrap: 'nowrap',
    zIndex: 200,
  },
  secondRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flexWrap: 'nowrap',
  },
  inputWrapper: {
    width: 250,
    position: 'relative',
  },
  dateWrapper: {
    width: 250,
    position: 'relative',
    zIndex: 50,
  },
  swapButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
    marginHorizontal: Spacing.xs,
  },
  swapIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  inputIcon: {
    fontSize: 16,
  },
  passengerWrapper: {
    width: 250,
  },
  passengerControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    height: 52,
  },
  passengerButton: {
    width: 32,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passengerButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  passengerDisplay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passengerText: {
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  timeslotContainer: {
    flex: 1,
    gap: Spacing.xs,
  },
  timeslotLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  timeslotButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  timeslotButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    minHeight: 52,
    minWidth: 80,
  },
  timeslotButtonActive: {
    borderWidth: 2,
  },
  timeslotIcon: {
    fontSize: 16,
    marginBottom: Spacing.xs,
  },
  timeslotText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    textAlign: 'center',
  },
  resetButton: {
    minWidth: 120,
    minHeight: 52,
  },
  searchButton: {
    minWidth: 120,
    minHeight: 52,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    height: 52,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  dateText: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    flex: 1,
  },
  timeSlotTrigger: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  timeSlotIcon: {
    fontSize: FontSizes.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModal: {
    width: '90%',
    maxWidth: 400,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    minHeight: 400,
    ...Shadows.large,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  calendarTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
  datePicker: {
    alignSelf: 'center',
    marginVertical: Spacing.md,
    width: '100%',
    height: 300,
  },
  calendarFooter: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  cancelButton: {
    flex: 1,
  },
  selectButton: {
    flex: 1,
  },
  webDatePicker: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  webDateLabel: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
});
