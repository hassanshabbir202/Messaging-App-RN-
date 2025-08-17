import React from 'react';

// Step 1: React Navigation se zaroori cheezein import karein
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Step 2: Apni saari screens ko import karein
import HomeScreen from './src/screens/HomeScreen';
import ChatHistoryScreen from './src/screens/ChatHistoryScreen';
import CreateNewContactScreen from './src/screens/CreateNewContactScreen';
import ContactDetailsScreen from './src/screens/ContactDetailsScreen';

// Step 3: Ek Stack Navigator banayein
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // Step 4: Poore navigation ko NavigationContainer mein wrap karein
    <NavigationContainer>
      {/* Step 5: Apni screens ko Stack.Navigator ke andar define karein */}
      <Stack.Navigator initialRouteName="Home">
        
        {/* Pehli Screen */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          // Is screen ke header ko chupane ke liye
          options={{ headerShown: false }} 
        />
        
        {/* Doosri Screen */}
        <Stack.Screen 
          name="ChatHistory" 
          component={ChatHistoryScreen} 
          // Is screen ke header ko bhi chupa dete hain kyunki aapne custom header banaya hai
          options={{ headerShown: false }} 
        />

            
        {/* Doosri Screen */}
        <Stack.Screen 
          name="NewContact" 
          component={CreateNewContactScreen} 
          // Is screen ke header ko bhi chupa dete hain kyunki aapne custom header banaya hai
          options={{ headerShown: false }} 
        />
            
        {/* Doosri Screen */}
        <Stack.Screen 
          name="ContactDetails" 
          component={ContactDetailsScreen} 
          // Is screen ke header ko bhi chupa dete hain kyunki aapne custom header banaya hai
          options={{ headerShown: false }} 
        />


      </Stack.Navigator>
    </NavigationContainer>
  );
}