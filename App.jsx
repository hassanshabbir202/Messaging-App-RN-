import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Step 1: SafeAreaProvider ko import karein
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Navigation libraries
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Icons
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import ChatsScreen from './src/screens/HomeScreen';
import ChatHistoryScreen from './src/screens/ChatHistoryScreen';
import CreateNewContactScreen from './src/screens/CreateNewContactScreen';
import ContactDetailsScreen from './src/screens/ContactDetailsScreen';
import CallsScreen from './src/screens/CallsScreen';
import CommunitiesScreen from './src/screens/CommunitiesScreen';
import UpdatesScreen from './src/screens/UpdatesScreen';

// Navigators
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Chats"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          const iconSize = 26;

          if (route.name === 'Chats') {
            iconName = focused
              ? 'chatbubble-ellipses'
              : 'chatbubble-ellipses-outline';
          } else if (route.name === 'Updates') {
            iconName = focused ? 'sync-circle' : 'sync-circle-outline';
          } else if (route.name === 'Communities') {
            iconName = focused ? 'people' : 'people-outline';
            return (
              <Ionicons name={iconName} size={iconSize + 4} color={color} />
            );
          } else if (route.name === 'Calls') {
            iconName = focused ? 'call' : 'call-outline';
          }

          const icon = (
            <Ionicons name={iconName} size={iconSize} color={color} />
          );

          if (route.name === 'Updates') {
            return (
              <View>
                {icon}
                <View style={styles.notificationDot} />
              </View>
            );
          }
          return icon;
        },
        tabBarActiveTintColor: '#005D4B',
        tabBarInactiveTintColor: '#435B55',
      })}
    >
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Updates" component={UpdatesScreen} />
      <Tab.Screen name="Communities" component={CommunitiesScreen} />
      <Tab.Screen name="Calls" component={CallsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    // Step 2: Poore app ko SafeAreaProvider se wrap karein
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomeTabs">
          <Stack.Screen
            name="HomeTabs"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChatHistory"
            component={ChatHistoryScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NewContact"
            component={CreateNewContactScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ContactDetails"
            component={ContactDetailsScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  screenText: { fontSize: 24, fontWeight: 'bold' },
  tabBar: {
    backgroundColor: '#F6F6F6',
    height: 65,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 5,
    paddingTop: 5,
  },
  tabBarLabel: { fontSize: 12, fontWeight: '500' },
  notificationDot: {
    position: 'absolute',
    right: -6,
    top: -2,
    backgroundColor: '#25D366',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#F6F6F6',
  },
});