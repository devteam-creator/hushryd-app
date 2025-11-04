import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../components/admin/AdminLayout';
import { useColorScheme } from '../components/useColorScheme';
import Colors from '../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../constants/Design';

interface SupportCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  topics: string[];
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function SupportScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const supportCategories: SupportCategory[] = [
    {
      id: 'booking',
      title: 'Booking & Rides',
      description: 'Help with booking rides and managing your trips',
      icon: '🚗',
      topics: ['How to book a ride', 'Cancelling rides', 'Ride modifications', 'Driver matching'],
    },
    {
      id: 'payment',
      title: 'Payment & Billing',
      description: 'Payment methods, billing issues, and refunds',
      icon: '💰',
      topics: ['Payment methods', 'Billing disputes', 'Refunds', 'Promo codes'],
    },
    {
      id: 'account',
      title: 'Account & Profile',
      description: 'Account management and profile settings',
      icon: '👤',
      topics: ['Account setup', 'Profile updates', 'Password reset', 'Account deletion'],
    },
    {
      id: 'driver',
      title: 'Driver Support',
      description: 'Information for drivers and partners',
      icon: '👨‍💼',
      topics: ['Becoming a driver', 'Earnings', 'Vehicle requirements', 'Driver app'],
    },
    {
      id: 'technical',
      title: 'Technical Issues',
      description: 'App problems and technical support',
      icon: '🔧',
      topics: ['App crashes', 'Login issues', 'GPS problems', 'Notifications'],
    },
  ];

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I book a ride?',
      answer: 'To book a ride, open the HushRyd app, enter your destination, select your preferred ride type, and confirm your booking. You\'ll be matched with a nearby driver.',
      category: 'booking',
    },
    {
      id: '2',
      question: 'What payment methods do you accept?',
      answer: 'We accept credit/debit cards, UPI, digital wallets, and cash payments. You can add multiple payment methods in your account settings.',
      category: 'payment',
    },
    {
      id: '3',
      question: 'How can I cancel a ride?',
      answer: 'You can cancel a ride through the app before the driver arrives. Cancellation fees may apply depending on the timing of your cancellation.',
      category: 'booking',
    },
    {
      id: '4',
      question: 'How do I become a driver?',
      answer: 'Download the HushRyd Driver app, complete the registration process, submit required documents, and pass the background verification to start driving.',
      category: 'driver',
    },
    {
      id: '5',
      question: 'What if I have a complaint?',
      answer: 'You can submit complaints through the app or contact our support team. We take all feedback seriously and work to resolve issues promptly.',
      category: 'account',
    },
  ];

  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const contactMethods = [
    {
      icon: '📞',
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      details: '+91-9876543210',
      action: 'Call Now',
    },
    {
      icon: '📧',
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      details: 'support@hushryd.com',
      action: 'Send Email',
    },
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      details: 'Available 24/7',
      action: 'Start Chat',
    },
    {
      icon: '🎫',
      title: 'Support Tickets',
      description: 'Create a support ticket for complex issues',
      details: 'Track your request',
      action: 'Create Ticket',
    },
  ];

  return (
    <AdminLayout title="Support" currentPage="support">
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['#1DA1F2', '#1976D2', '#1565C0']}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.heroIcon}>🆘</Text>
            <Text style={styles.heroTitle}>How can we help you?</Text>
            <Text style={styles.heroSubtitle}>
              Find answers to common questions or get in touch with our support team
            </Text>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {contactMethods.map((method, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickActionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => {/* Handle action */}}
              >
                <Text style={styles.quickActionIcon}>{method.icon}</Text>
                <Text style={[styles.quickActionTitle, { color: colors.text }]}>{method.title}</Text>
                <Text style={[styles.quickActionDescription, { color: colors.textSecondary }]}>
                  {method.description}
                </Text>
                <Text style={[styles.quickActionDetails, { color: colors.primary }]}>{method.details}</Text>
                <View style={[styles.quickActionButton, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.quickActionButtonText, { color: colors.primary }]}>
                    {method.action}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Support Categories */}
        <View style={styles.categoriesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Browse by Category</Text>
          <View style={styles.categoriesList}>
            {supportCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <View style={styles.categoryInfo}>
                    <Text style={[styles.categoryTitle, { color: colors.text }]}>{category.title}</Text>
                    <Text style={[styles.categoryDescription, { color: colors.textSecondary }]}>
                      {category.description}
                    </Text>
                  </View>
                </View>
                <View style={styles.categoryTopics}>
                  {category.topics.map((topic, index) => (
                    <View key={index} style={[styles.topicTag, { backgroundColor: colors.lightGray }]}>
                      <Text style={[styles.topicText, { color: colors.textSecondary }]}>{topic}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {selectedCategory === 'all' ? 'Frequently Asked Questions' : `${supportCategories.find(c => c.id === selectedCategory)?.title} FAQs`}
          </Text>
          
          {filteredFAQs.map((faq) => (
            <View
              key={faq.id}
              style={[styles.faqCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={[styles.faqQuestion, { color: colors.text }]}>{faq.question}</Text>
              <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{faq.answer}</Text>
            </View>
          ))}
        </View>

        {/* Emergency Contact */}
        <View style={styles.emergencySection}>
          <LinearGradient
            colors={['#EF4444', '#DC2626', '#B91C1C']}
            style={styles.emergencyGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.emergencyIcon}>🚨</Text>
            <Text style={styles.emergencyTitle}>Emergency Support</Text>
            <Text style={styles.emergencySubtitle}>
              For urgent safety concerns or emergencies during rides
            </Text>
            <TouchableOpacity
              style={styles.emergencyButton}
              onPress={() => {/* Handle emergency */}}
            >
              <Text style={styles.emergencyButtonText}>Call Emergency Hotline</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    marginBottom: Spacing.xl,
  },
  heroGradient: {
    padding: Spacing.xxxl,
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadows.large,
  },
  heroIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  heroTitle: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: Spacing.sm,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  heroSubtitle: {
    fontSize: FontSizes.lg,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  quickActionsSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    marginBottom: Spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  quickActionCard: {
    width: '48%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    ...Shadows.small,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  quickActionTitle: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  quickActionDescription: {
    fontSize: FontSizes.sm,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },
  quickActionDetails: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  quickActionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  quickActionButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  categoriesSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  categoriesList: {
    gap: Spacing.md,
  },
  categoryCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    ...Shadows.small,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  categoryIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  categoryDescription: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
  categoryTopics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  topicTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  topicText: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
  },
  faqSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  faqCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  faqQuestion: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  faqAnswer: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
  emergencySection: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.large,
  },
  emergencyGradient: {
    padding: Spacing.xxxl,
    alignItems: 'center',
  },
  emergencyIcon: {
    fontSize: 48,
    marginBottom: Spacing.lg,
  },
  emergencyTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emergencySubtitle: {
    fontSize: FontSizes.md,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  emergencyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.medium,
  },
  emergencyButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  bottomPadding: {
    height: Spacing.xxxl,
  },
});
