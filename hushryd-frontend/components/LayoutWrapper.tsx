import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import SideMenu from './SideMenu';
import { useColorScheme } from './useColorScheme';

interface LayoutWrapperProps {
  children: React.ReactNode;
  showSideMenu?: boolean;
}

export default function LayoutWrapper({ children, showSideMenu = true }: LayoutWrapperProps) {
  const colorScheme = useColorScheme();
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {children}
      
      {showSideMenu && (
        <>
          {/* Floating Hamburger Menu Button */}
           <TouchableOpacity
             style={{
               position: 'absolute',
               top: 80,
               left: 20,
               zIndex: 9999,
               width: 60,
               height: 60,
               borderRadius: 30,
               backgroundColor: '#1DA1F2',
               justifyContent: 'center',
               alignItems: 'center',
               shadowColor: '#000',
               shadowOffset: {
                 width: 0,
                 height: 4,
               },
               shadowOpacity: 0.3,
               shadowRadius: 5,
               elevation: 8,
               borderWidth: 2,
               borderColor: '#FFFFFF',
             }}
             onPress={() => setIsSideMenuVisible(true)}
           >
            <Text style={{ fontSize: 24, color: '#FFFFFF', fontWeight: 'bold' }}>☰</Text>
          </TouchableOpacity>

          <SideMenu 
            isVisible={isSideMenuVisible} 
            onClose={() => setIsSideMenuVisible(false)} 
          />
        </>
      )}
    </View>
  );
}
