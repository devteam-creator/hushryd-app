import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Images from '../assets/images';
import { FontSizes, Spacing } from '../constants/Design';

interface HushRydLogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'horizontal' | 'vertical' | 'icon-only';
  color?: string;
  showBackground?: boolean;
  backgroundColor?: string;
  shadow?: boolean;
  darkBackground?: boolean; // New prop to indicate if background is dark
}

export default function HushRydLogo({ 
  size = 'medium', 
  variant = 'horizontal', 
  color = '#084F8D',
  showBackground = false,
  backgroundColor = '#32CD32',
  shadow = false,
  darkBackground = false
}: HushRydLogoProps) {
  
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          logoSize: 24,
          text: FontSizes.small,
          spacing: Spacing.tiny,
          containerPadding: Spacing.tiny,
        };
      case 'large':
        return {
          logoSize: 80,
          text: FontSizes.extraLarge * 1.5,
          spacing: Spacing.medium,
          containerPadding: Spacing.medium,
        };
      default: // medium
        return {
          logoSize: 40,
          text: FontSizes.large,
          spacing: Spacing.small,
          containerPadding: Spacing.small,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const renderLogoImage = () => {
    return (
      <Image 
        source={Images.hushrydLogoGradient}
        style={[styles.logoImage, { 
          width: sizeStyles.logoSize, 
          height: sizeStyles.logoSize,
          // Apply white tint color for dark backgrounds to show white gradient
          tintColor: darkBackground ? '#FFFFFF' : undefined
        }]}
        resizeMode="contain"
      />
    );
  };

  const renderTextSection = () => (
    <Text style={[styles.logoText, { fontSize: sizeStyles.text, color }]}>
      HushRyd
    </Text>
  );

  const renderContent = () => {
    switch (variant) {
      case 'vertical':
        return (
          <View style={[styles.verticalLayout, { gap: sizeStyles.spacing }]}>
            {renderLogoImage()}
            {renderTextSection()}
          </View>
        );
      case 'icon-only':
        return renderLogoImage();
      default: // horizontal
        return (
          <View style={[styles.horizontalLayout, { gap: sizeStyles.spacing }]}>
            {renderLogoImage()}
            {renderTextSection()}
          </View>
        );
    }
  };

  return (
    <View style={[
      styles.container, 
      { 
        padding: sizeStyles.containerPadding,
        backgroundColor: showBackground ? backgroundColor : 'transparent',
        borderRadius: showBackground ? 8 : 0,
        shadowColor: shadow ? '#000' : 'transparent',
        shadowOffset: shadow ? { width: 0, height: 2 } : { width: 0, height: 0 },
        shadowOpacity: shadow ? 0.1 : 0,
        shadowRadius: shadow ? 4 : 0,
        elevation: shadow ? 3 : 0,
      }
    ]}>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalLayout: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    // Image styles are applied inline based on size
  },
  logoText: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
