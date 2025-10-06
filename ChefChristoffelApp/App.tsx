// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Corrected import paths from './src/'

import HomeScreen from './scr/screens/HomeScreen';
import FilterScreen from './scr/screens/FilterScreen';

// Define types for navigation
export type RootStackParamList = {
  Home: undefined;
  Filter: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();

export default function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#1abc9c',
          tabBarInactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Home' }}
        />
        <Tab.Screen 
          name="Filter" 
          component={FilterScreen}
          options={{ title: 'Filter' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

