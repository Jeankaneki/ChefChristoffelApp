import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigatorScreenParams } from '@react-navigation/native';

// Corrected import paths from the root directory using relative paths
import HomeScreen from './scr/screens/HomeScreen';
import AddItemScreen from './scr/screens/AddItemScreen';
import FilterScreen from './scr/screens/FilterScreen';

// --- Type Definitions for Navigators ---
export type AddItemStackParamList = {
  AddItemMain: undefined;
};

export type RootTabParamList = {
  Home: undefined;
  AddItem: NavigatorScreenParams<AddItemStackParamList>;
  Filter: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<AddItemStackParamList>();

// Stack Navigator for Add Item Screen
function AddItemStack(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AddItemMain"
        component={AddItemScreen}
        options={{ title: 'Add Menu Item' }}
      />
    </Stack.Navigator>
  );
}

// Main Tab Navigator
function TabNavigator(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1abc9c',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="AddItem"
        component={AddItemStack}
        options={{ title: 'Add Item' }}
      />
      <Tab.Screen name="Filter" component={FilterScreen} />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}
