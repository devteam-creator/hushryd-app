import React from 'react';
import { Circle, G, Svg, Text } from 'react-native-svg';

interface HushRydLogoIconProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export default function HushRydLogoIcon({ 
  size = 64, 
  color = '#084F8D',
  backgroundColor = '#00AFF5' 
}: HushRydLogoIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Background Circle */}
      <Circle
        cx="32"
        cy="32"
        r="30"
        fill={backgroundColor}
        stroke={color}
        strokeWidth="2"
      />
      
      {/* Car Icon */}
      <G transform="translate(32, 32)">
        {/* Car Body */}
        <G fill={color} transform="translate(-8, -6)">
          {/* Main body */}
          <rect x="2" y="8" width="12" height="4" rx="1" />
          {/* Windshield */}
          <rect x="3" y="6" width="10" height="2" rx="0.5" fill={backgroundColor} />
          {/* Wheels */}
          <circle cx="4" cy="13" r="1.5" fill={color} />
          <circle cx="12" cy="13" r="1.5" fill={color} />
          {/* Wheel centers */}
          <circle cx="4" cy="13" r="0.8" fill={backgroundColor} />
          <circle cx="12" cy="13" r="0.8" fill={backgroundColor} />
        </G>
        
        {/* Pin/Location Icon */}
        <G transform="translate(-2, -12)">
          <path
            d="M2 2 L6 2 L6 6 L8 6 L8 8 L4 8 L4 6 L2 6 Z"
            fill={color}
          />
        </G>
      </G>
      
      {/* HushRyd Text */}
      <Text
        x="32"
        y="48"
        fontSize="8"
        fontWeight="800"
        textAnchor="middle"
        fill={color}
        fontFamily="system-ui"
      >
        HushRyd
      </Text>
    </Svg>
  );
}
