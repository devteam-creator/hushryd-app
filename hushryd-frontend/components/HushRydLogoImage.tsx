import React from 'react';
import { Image as RNImage, StyleSheet, View } from 'react-native';
import Images from '../assets/images';
import { BorderRadius, Spacing } from '../constants/Design';

interface HushRydLogoImageProps {
  size?: 'small' | 'medium' | 'large';
  showBackground?: boolean;
  backgroundColor?: string;
  shadow?: boolean;
  darkBackground?: boolean; // New prop to indicate if background is dark
}

export default function HushRydLogoImage({ 
  size = 'medium', 
  showBackground = false,
  backgroundColor = '#32CD32',
  shadow = false,
  darkBackground = false
}: HushRydLogoImageProps) {
  
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: 120,
          height: 40,
          containerPadding: Spacing.tiny,
        };
      case 'large':
        return {
          width: 300,
          height: 100,
          containerPadding: Spacing.lg,
        };
      default: // medium
        return {
          width: 180,
          height: 60,
          containerPadding: Spacing.sm,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={[
      styles.container, 
      { 
        padding: sizeStyles.containerPadding,
        backgroundColor: showBackground ? backgroundColor : 'transparent',
        borderRadius: showBackground ? BorderRadius.md : 0,
        shadowColor: shadow ? '#000' : 'transparent',
        shadowOffset: shadow ? { width: 0, height: 2 } : { width: 0, height: 0 },
        shadowOpacity: shadow ? 0.1 : 0,
        shadowRadius: shadow ? 4 : 0,
        elevation: shadow ? 3 : 0,
      }
    ]}>
      <RNImage 
        source={darkBackground ? Images.hushrydLogoGradient : Images.hushrydLogoGradient}
        style={[
          styles.logoImage,
          {
            width: sizeStyles.width,
            height: sizeStyles.height,
            // Apply white tint color for dark backgrounds to show white gradient
            tintColor: darkBackground ? '#FFFFFF' : undefined
          }
        ]}
        resizeMode="contain"
        onError={() => {
          console.log('HushRyd logo failed to load');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    // Image styles are set dynamically based on size
  },
});