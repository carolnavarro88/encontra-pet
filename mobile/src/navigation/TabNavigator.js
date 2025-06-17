import 'react-native-gesture-handler';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Importação das telas
import Feed from '../screens/Feed';
import MinhasPostagens from '../screens/MinhasPostagens';
import Perfil from '../screens/Perfil';

// Tab Navigator para as abas principais
const Tab = createBottomTabNavigator();

function TabNavigator({ route }) {
  const { usuarioId } = route?.params || {};
  console.log('TabNavigator usuarioId:', usuarioId); // Verifique se o usuarioId está sendo recebido corretamente
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#B0B0B0',
        tabBarStyle: {
          backgroundColor: '#007BFF',
          borderTopWidth: 0,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Feed}
        initialParams={{ usuarioId }} // Passando o usuarioId para Feed
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Minhas Postagens"
        initialParams={{ usuarioId }} // Passando o usuarioId para Feed
        component={MinhasPostagens}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        initialParams={{ usuarioId }} // Passando o usuarioId para Feed
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;