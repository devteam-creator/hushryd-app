import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';
import { BorderRadius, FontSizes, Spacing } from '../../constants/Design';
import HushRydLogo from '../HushRydLogo';
import HushRydLogoImage from '../HushRydLogoImage';
import { useColorScheme } from '../useColorScheme';

export default function LogoTest() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Logo Display Test
      </Text>
      
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Testing logo display on different backgrounds
      </Text>

      {/* Light Background Test */}
      <View style={[styles.testSection, { backgroundColor: '#FFFFFF' }]}>
        <Text style={[styles.sectionTitle, { color: '#000000' }]}>
          Light Background
        </Text>
        <HushRydLogo 
          size="medium" 
          variant="horizontal" 
          color="#000000"
          showBackground={false}
          darkBackground={false}
        />
      </View>

      {/* Dark Background Test */}
      <View style={[styles.testSection, { backgroundColor: '#000000' }]}>
        <Text style={[styles.sectionTitle, { color: '#FFFFFF' }]}>
          Dark Background (White Gradient)
        </Text>
        <HushRydLogo 
          size="medium" 
          variant="horizontal" 
          color="#FFFFFF"
          showBackground={false}
          darkBackground={true}
        />
      </View>

      {/* Logo Image Test */}
      <View style={[styles.testSection, { backgroundColor: '#1f2937' }]}>
        <Text style={[styles.sectionTitle, { color: '#FFFFFF' }]}>
          Logo Image Component
        </Text>
        <HushRydLogoImage 
          size="medium" 
          showBackground={false}
          darkBackground={true}
        />
      </View>

      {/* Small Size Test */}
      <View style={[styles.testSection, { backgroundColor: '#374151' }]}>
        <Text style={[styles.sectionTitle, { color: '#FFFFFF' }]}>
          Small Size (Minimum Dimensions)
        </Text>
        <HushRydLogo 
          size="small" 
          variant="horizontal" 
          color="#FFFFFF"
          showBackground={false}
          darkBackground={true}
        />
      </View>
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
  testSection: {
    padding: Spacing.medium,
    borderRadius: BorderRadius.small,
    marginBottom: Spacing.medium,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
    marginBottom: Spacing.small,
  },
});
