import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import SideMenu from './SideMenu';
import { useColorScheme } from './useColorScheme';

interface AdminHeaderProps {
  title: string;
  showBackButton?: boolean;
  showSideMenu?: boolean;
}

export default function AdminHeader({ title, showBackButton = true, showSideMenu = true }: AdminHeaderProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      paddingVertical: 15,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {showSideMenu && (
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => setIsSideMenuVisible(true)}
          >
            <Text style={{ fontSize: 24, color: colors.primary }}>☰</Text>
          </TouchableOpacity>
        )}
        
        {showBackButton && (
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => router.back()}
          >
            <Text style={{ fontSize: 20, color: colors.primary }}>←</Text>
          </TouchableOpacity>
        )}
        
        <Text style={{ 
          fontSize: 20, 
          fontWeight: 'bold', 
          color: colors.text 
        }}>
          {title}
        </Text>
      </View>
      
      <SideMenu 
        isVisible={isSideMenuVisible} 
        onClose={() => setIsSideMenuVisible(false)} 
      />
    </View>
  );
}
