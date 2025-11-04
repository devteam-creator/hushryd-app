import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useColorScheme } from './useColorScheme';
import Colors from '../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../constants/Design';

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback?: string) => Promise<void>;
  targetName: string;
  targetType: 'driver' | 'owner';
  rideId: string;
}

export default function RatingModal({
  visible,
  onClose,
  onSubmit,
  targetName,
  targetType,
  rideId,
}: RatingModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a rating before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating, feedback.trim() || undefined);
      // Reset form after successful submission
      setRating(0);
      setFeedback('');
      onClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
      Alert.alert('Error', 'Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(0);
      setFeedback('');
      onClose();
    }
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleStarPress(star)}
            disabled={isSubmitting}
            style={styles.starButton}
          >
            <Text style={[styles.star, { color: star <= rating ? '#FFD700' : '#E0E0E0' }]}>
              ⭐
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Rate Your {targetType === 'driver' ? 'Driver' : 'Vehicle Owner'}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              How was your ride with {targetName}?
            </Text>
          </View>

          <View style={styles.ratingSection}>
            <Text style={[styles.label, { color: colors.text }]}>Rating</Text>
            {renderStars()}
            {rating > 0 && (
              <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
                {rating === 5 ? 'Excellent!' : rating === 4 ? 'Great!' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
              </Text>
            )}
          </View>

          <View style={styles.feedbackSection}>
            <Text style={[styles.label, { color: colors.text }]}>
              Share your experience (Optional)
            </Text>
            <TextInput
              style={[
                styles.feedbackInput,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Tell others about your experience..."
              placeholderTextColor={colors.textSecondary}
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isSubmitting}
              maxLength={500}
            />
            <Text style={[styles.charCount, { color: colors.textSecondary }]}>
              {feedback.length}/500
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: colors.border }]}
              onPress={handleClose}
              disabled={isSubmitting}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                {
                  backgroundColor: rating > 0 ? colors.primary : colors.mediumGray,
                  opacity: rating > 0 ? 1 : 0.5,
                },
              ]}
              onPress={handleSubmit}
              disabled={rating === 0 || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Rating</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.large,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: BorderRadius.large,
    padding: Spacing.xl,
    borderWidth: 1,
    ...Shadows.large,
  },
  header: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    marginBottom: Spacing.small,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.medium,
    textAlign: 'center',
  },
  ratingSection: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  label: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    marginBottom: Spacing.medium,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.small,
    marginBottom: Spacing.small,
  },
  starButton: {
    padding: Spacing.xs,
  },
  star: {
    fontSize: 48,
  },
  ratingText: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    marginTop: Spacing.small,
  },
  feedbackSection: {
    marginBottom: Spacing.xl,
  },
  feedbackInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.medium,
    padding: Spacing.medium,
    fontSize: FontSizes.medium,
    minHeight: 100,
    marginBottom: Spacing.xs,
  },
  charCount: {
    fontSize: FontSizes.small,
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.medium,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.medium,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    paddingVertical: Spacing.medium,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: FontSizes.medium,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

