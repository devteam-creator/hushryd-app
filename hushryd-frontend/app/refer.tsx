import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '@/constants/Design';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ReferScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const referralCode = 'HUSHRYD2024';
  const referralLink = `https://hushryd.com/refer?code=${referralCode}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join HushRyd and get ₹100! Use my referral code: ${referralCode}\n${referralLink}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCopyCode = () => {
    Alert.alert('Copied!', 'Referral code copied to clipboard');
  };

  const benefits = [
    {
      icon: 'gift',
      title: 'Refer Friends',
      description: 'Earn ₹100 for each friend who signs up',
    },
    {
      icon: 'cash',
      title: 'Get Credits',
      description: 'Your friend gets ₹50 on their first ride',
    },
    {
      icon: 'trophy',
      title: 'Unlimited Rewards',
      description: 'No limit on how many friends you can refer',
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Refer & Earn</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Hero Section */}
      <LinearGradient colors={['#00D4FF', '#00AFF5', '#0090D9']} style={styles.heroCard}>
        <Text style={styles.heroTitle}>Invite Friends</Text>
        <Text style={styles.heroSubtitle}>Earn ₹100 per referral</Text>
        <View style={styles.referralCodeContainer}>
          <Text style={styles.referralLabel}>Your Referral Code</Text>
          <Text style={styles.referralCode}>{referralCode}</Text>
          <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
            <Ionicons name="copy" size={20} color="#FFFFFF" />
            <Text style={styles.copyButtonText}>Copy Code</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Benefits */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>How It Works</Text>
        {benefits.map((benefit, index) => (
          <View key={index} style={[styles.benefitCard, { backgroundColor: colors.card }]}>
            <View style={[styles.benefitIcon, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name={benefit.icon as any} size={24} color={colors.primary} />
            </View>
            <View style={styles.benefitInfo}>
              <Text style={[styles.benefitTitle, { color: colors.text }]}>{benefit.title}</Text>
              <Text style={[styles.benefitDescription, { color: colors.textSecondary }]}>
                {benefit.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Share Button */}
      <View style={styles.shareSection}>
        <TouchableOpacity
          style={[styles.shareButton, { backgroundColor: colors.primary }]}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Ionicons name="share" size={24} color="#FFFFFF" />
          <Text style={styles.shareButtonText}>Share with Friends</Text>
        </TouchableOpacity>
      </View>

      {/* Terms */}
      <View style={styles.termsSection}>
        <Text style={[styles.termsText, { color: colors.textSecondary }]}>
          * Terms and conditions apply. Credits will be added to your account within 24 hours of your
          friend's first completed ride.
        </Text>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: '700',
  },
  heroCard: {
    margin: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.medium,
  },
  heroTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: Spacing.sm,
  },
  heroSubtitle: {
    fontSize: FontSizes.md,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: Spacing.xl,
  },
  referralCodeContainer: {
    alignItems: 'center',
    width: '100%',
  },
  referralLabel: {
    fontSize: FontSizes.sm,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: Spacing.sm,
  },
  referralCode: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: Spacing.lg,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.round,
    gap: Spacing.sm,
  },
  copyButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  benefitInfo: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  benefitDescription: {
    fontSize: FontSizes.sm,
  },
  shareSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  shareButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  termsSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  termsText: {
    fontSize: FontSizes.xs,
    lineHeight: 16,
    textAlign: 'center',
  },
  bottomPadding: {
    height: Spacing.xl,
  },
});
