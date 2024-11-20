import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import OfferScreen from './Offers';
import AbilitiesScreen from './Abilities';
import {Image} from 'react-native';
import Profiles from './Profile';
import Matchs from './Matchs';
import MatchList from '../components/matchList';
import ChatList from '../components/ChatList';
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

const screenOptions = (route, color) => {
  let iconName;

  switch (route.name) {
    case 'Offer':
      iconName = 'home';
      break;
    case 'Matches':
      iconName = 'heart';
      break;
    case 'Profile':
      iconName = 'user';
      break;
    case 'Chats':
      iconName='comments'
      break;
    default:
      break;
  }

  return <Icon name={iconName} color={color} size={24} />;
};

export default function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color}) => screenOptions(route, color),
      })}>
      <Tab.Screen
        name="Offer"
        component={OfferScreen}
        options={{
          tabBarLabel: 'Ofertas',
          headerBackVisible: false,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Matches"
        component={MatchList}
        options={{
          title: 'Mis Matchs',
          tabBarLabel: 'Mis Matchs',
          headerBackVisible: false,
          headerShown: false,
        }}
      />
       <Tab.Screen
        name="Chats"
        component={ChatList}
        options={{
          title: 'Chat',
          tabBarLabel: 'Chat',
          headerBackVisible: false,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profiles}
        options={{
          tabBarLabel: 'Perfil',
          headerBackVisible: false,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
