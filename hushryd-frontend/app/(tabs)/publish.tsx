import Button from '@/components/Button';
import Input from '@/components/Input';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { CURRENCY_SYMBOL } from '@/constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '@/constants/Design';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PublishRideScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isWeb = Platform.OS === 'web';

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');
  const [seats, setSeats] = useState('');
  const [description, setDescription] = useState('');

  const handlePublish = () => {
    if (!from || !to || !date || !time || !price || !seats) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Success!',
      'Your ride has been published successfully',
      [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setFrom('');
            setTo('');
            setDate('');
            setTime('');
            setPrice('');
            setSeats('');
            setDescription('');
            router.push('/(tabs)/rides');
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={!isWeb ? mobileStyles.content : undefined}
    >
      {!isWeb && (
        <LinearGradient
          colors={[colors.primary, '#FFCA28']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={mobileStyles.header}
        >
          <Text style={mobileStyles.headerTitle}>Publish a ride</Text>
          <Text style={mobileStyles.headerSubtitle}>
            Go Rapido-style with instant matches, smart fares and verified passengers.
          </Text>
          <View style={mobileStyles.heroPills}>
            <View style={mobileStyles.heroPill}>
              <Text style={mobileStyles.heroPillText}>⚡ Go live in 2 mins</Text>
            </View>
            <View style={mobileStyles.heroPill}>
              <Text style={mobileStyles.heroPillText}>💸 Keep up to 80%</Text>
            </View>
            <View style={mobileStyles.heroPill}>
              <Text style={mobileStyles.heroPillText}>🛡️ Verified riders</Text>
            </View>
          </View>
        </LinearGradient>
      )}

      <View
        style={[
          styles.content,
          !isWeb && mobileStyles.formCard,
          !isWeb && { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {isWeb && (
          <>
            <Text style={[styles.title, { color: colors.text }]}>Publish a Ride</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Share your journey and help others travel
            </Text>
          </>
        )}

        <View style={styles.form}>
          <Input
            label="Leaving from *"
            placeholder="Enter departure city"
            value={from}
            onChangeText={setFrom}
            icon={<Text style={styles.inputIcon}>📍</Text>}
          />

          <Input
            label="Going to *"
            placeholder="Enter destination city"
            value={to}
            onChangeText={setTo}
            icon={<Text style={styles.inputIcon}>🎯</Text>}
          />

          <Input
            label="Date *"
            placeholder="YYYY-MM-DD"
            value={date}
            onChangeText={setDate}
            icon={<Text style={styles.inputIcon}>📅</Text>}
          />

          <Input
            label="Time *"
            placeholder="HH:MM"
            value={time}
            onChangeText={setTime}
            icon={<Text style={styles.inputIcon}>🕐</Text>}
          />

          <Input
            label={`Price per seat (${CURRENCY_SYMBOL}) *`}
            placeholder="Enter price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            icon={<Text style={styles.inputIcon}>💰</Text>}
          />

          <Input
            label="Available seats *"
            placeholder="Number of seats"
            value={seats}
            onChangeText={setSeats}
            keyboardType="numeric"
            icon={<Text style={styles.inputIcon}>💺</Text>}
          />

          <Input
            label="Description (optional)"
            placeholder="Add details about your ride..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />

          <Button
            title="Publish Ride"
            onPress={handlePublish}
            size="large"
            style={[styles.publishButton, !isWeb && mobileStyles.publishButton]}
          />
        </View>
      </View>

      <View
        style={[
          styles.infoBox,
          { backgroundColor: colors.card, borderColor: colors.border },
          !isWeb && mobileStyles.infoCard,
        ]}
      >
        <Text style={styles.infoIcon}>💡</Text>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          Make sure to arrive on time and respect your passengers. Good reviews lead to more bookings!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  form: {
    marginBottom: 24,
  },
  inputIcon: {
    fontSize: 18,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  publishButton: {
    marginTop: 8,
  },
  infoBox: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
  },
});

const mobileStyles = StyleSheet.create({
  content: {
    paddingBottom: Spacing.huge,
  },
  header: {
    paddingTop: Spacing.huge,
    paddingBottom: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    marginBottom: Spacing.xxxl,
  },
  headerTitle: {
    fontSize: FontSizes.xxxl,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.sm,
    lineHeight: 20,
    color: '#3A3A3A',
    maxWidth: 320,
  },
  heroPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  heroPill: {
    backgroundColor: 'rgba(26, 26, 26, 0.12)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
  },
  heroPillText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  formCard: {
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.lg,
    ...Shadows.large,
  },
  publishButton: {
    marginTop: Spacing.xl,
    width: '100%',
  },
  infoCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.lg,
    ...Shadows.medium,
  },
});

