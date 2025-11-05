import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from '../components/useColorScheme';
import Colors from '../constants/Colors';
import { BorderRadius, FontSizes, Spacing } from '../constants/Design';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'booking' | 'payment' | 'safety' | 'general';
}

export default function HelpScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: 'How do I book a ride?',
      answer: 'To book a ride, enter your pickup and destination locations, select your preferred service type, and confirm your booking. You can track your driver in real-time.',
      category: 'booking'
    },
    {
      id: '2',
      question: 'What payment methods are accepted?',
      answer: 'We accept cash, credit/debit cards, digital wallets, and UPI payments. You can add multiple payment methods in the Payment section.',
      category: 'payment'
    },
    {
      id: '3',
      question: 'How do I cancel a ride?',
      answer: 'You can cancel a ride from the My Rides section or by contacting your driver directly. Cancellation charges may apply based on timing.',
      category: 'booking'
    },
    {
      id: '4',
      question: 'What safety features are available?',
      answer: 'We provide SOS button, live ride tracking, driver verification, emergency contacts, and 24/7 safety support.',
      category: 'safety'
    },
    {
      id: '5',
      question: 'How do I contact customer support?',
      answer: 'You can reach us through the app chat, call our helpline, or email support. Our team is available 24/7 to assist you.',
      category: 'general'
    },
    {
      id: '6',
      question: 'How does the referral program work?',
      answer: 'Share your referral code with friends. When they complete their first ride, both you and your friend earn rewards points.',
      category: 'general'
    }
  ];

  const categories = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'booking', label: 'Booking', icon: '🚗' },
    { id: 'payment', label: 'Payment', icon: '💳' },
    { id: 'safety', label: 'Safety', icon: '🛡️' },
    { id: 'general', label: 'General', icon: '❓' }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCall = () => {
    Linking.openURL('tel:+918888888888');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@hushryd.com');
  };

  const handleLiveChat = () => {
    Alert.alert('Live Chat', 'Starting live chat with support team...');
    // TODO: Implement live chat functionality
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Help & Support</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Quick Actions */}
          <View style={[styles.quickActions, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Support</Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={handleLiveChat}
              >
                <Text style={styles.actionIcon}>💬</Text>
                <Text style={styles.actionText}>Live Chat</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#10B981' }]}
                onPress={handleCall}
              >
                <Text style={styles.actionIcon}>📞</Text>
                <Text style={styles.actionText}>Call Us</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#F59E0B' }]}
                onPress={handleEmail}
              >
                <Text style={styles.actionIcon}>✉️</Text>
                <Text style={styles.actionText}>Email</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search */}
          <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search help topics..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Categories */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: selectedCategory === category.id ? colors.primary : colors.card,
                    borderColor: colors.border
                  }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryText,
                  { color: selectedCategory === category.id ? '#FFFFFF' : colors.text }
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* FAQ Section */}
          <View style={[styles.faqContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Frequently Asked Questions ({filteredFAQs.length})
            </Text>
            
            {filteredFAQs.map(faq => (
              <TouchableOpacity
                key={faq.id}
                style={[styles.faqItem, { borderColor: colors.border }]}
                onPress={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
              >
                <View style={styles.faqHeader}>
                  <Text style={[styles.faqQuestion, { color: colors.text }]}>{faq.question}</Text>
                  <Text style={[styles.faqToggle, { color: colors.primary }]}>
                    {expandedFAQ === faq.id ? '−' : '+'}
                  </Text>
                </View>
                
                {expandedFAQ === faq.id && (
                  <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                    {faq.answer}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Contact Info */}
          <View style={[styles.contactInfo, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Information</Text>
            
            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>📞</Text>
              <View>
                <Text style={[styles.contactLabel, { color: colors.text }]}>Phone</Text>
                <Text style={[styles.contactValue, { color: colors.textSecondary }]}>+91 88888 88888</Text>
              </View>
            </View>
            
            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>✉️</Text>
              <View>
                <Text style={[styles.contactLabel, { color: colors.text }]}>Email</Text>
                <Text style={[styles.contactValue, { color: colors.textSecondary }]}>support@hushryd.com</Text>
              </View>
            </View>
            
            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>🕒</Text>
              <View>
                <Text style={[styles.contactLabel, { color: colors.text }]}>Support Hours</Text>
                <Text style={[styles.contactValue, { color: colors.textSecondary }]}>24/7 Available</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: Spacing.sm,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  quickActions: {
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.md,
  },
  categoriesContainer: {
    marginBottom: Spacing.md,
  },
  categoriesContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  faqContainer: {
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  faqItem: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginRight: Spacing.sm,
  },
  faqToggle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  faqAnswer: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
  contactInfo: {
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  contactIcon: {
    fontSize: 24,
  },
  contactLabel: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  contactValue: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
});