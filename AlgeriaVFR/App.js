import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import MapScreen from './src/screens/MapScreen';
import WaypointsScreen from './src/screens/WaypointsScreen';
import VFRScreen from './src/screens/VFRScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#1e3a8a" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Map') {
              iconName = focused ? 'map' : 'map-outline';
            } else if (route.name === 'Waypoints') {
              iconName = focused ? 'location' : 'location-outline';
            } else if (route.name === 'VFR') {
              iconName = focused ? 'airplane' : 'airplane-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#1e3a8a',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#1e3a8a',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen 
          name="Map" 
          component={MapScreen} 
          options={{ title: 'Live Map' }}
        />
        <Tab.Screen 
          name="Waypoints" 
          component={WaypointsScreen} 
          options={{ title: 'Waypoints' }}
        />
        <Tab.Screen 
          name="VFR" 
          component={VFRScreen} 
          options={{ title: 'VFR References' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
