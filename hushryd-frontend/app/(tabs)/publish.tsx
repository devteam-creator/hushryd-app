import Button from '@/components/Button';
import Input from '@/components/Input';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { CURRENCY_SYMBOL } from '@/constants/Colors';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PublishRideScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Publish a Ride</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Share your journey and help others travel
        </Text>

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

          <Button title="Publish Ride" onPress={handlePublish} size="large" style={styles.publishButton} />
        </View>

        <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Make sure to arrive on time and respect your passengers. Good reviews lead to more bookings!
          </Text>
        </View>
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

