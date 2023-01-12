import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import HomeStackNavigator from './HomeStackNavigator';
// import SavedToursStackNavigator from './SavedToursStackNavigator';
// import ProfileStackNavigator from './ProfileStackNavigator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GetAuth from '../screens/AuthStack/GetAuth'
import App from '../../App';

const BottomTab = createBottomTabNavigator();

const BottomTabNavigator = (props) => {
    return (
        <BottomTab.Navigator screenOptions={{
            headerShown: false,
            tabBarStyle: {
                backgroundColor: 'gray',
            },
            tabBarShowLabel: false,
        }}>
            <BottomTab.Screen
                name={'Auth'}
                component={GetAuth}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Ionicons name="globe" color={focused ? '#FFFFFF' : '#000000'} size={26} />
                    ),
                }}
            />
            {/* <BottomTab.Screen
                name={'SearchStack'}
                component={GetAuth}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Ionicons name="ios-search" color={focused ? '#FFFFFF' : '#000000'} size={26} />
                    ),
                }}
            />
            <BottomTab.Screen
                name={'SavedToursStack'}
                component={GetAuth}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Ionicons name="paper-plane" color={focused ? '#FFFFFF' : '#000000'} size={26} />
                    ),
                }}
            />
            <BottomTab.Screen
                name={'ProfileStack'}
                component={GetAuth}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Ionicons name="person" color={focused ? '#FFFFFF' : '#000000'} size={26} />
                    ),
                }}
            /> */}
        </BottomTab.Navigator>
    );
}

export default BottomTabNavigator;
