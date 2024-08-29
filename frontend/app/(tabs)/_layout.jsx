import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import Colors from "../../constants/Colors"

const Layout = () => {
  return (
    <Tabs 
      initialRouteName="home"
      screenOptions={{
      tabBarStyle: {
        backgroundColor: Colors.white,
        borderTopWidth: 0,
        padding: 0,
        height: 60
      },
      tabBarActiveTintColor: Colors.primaryColor,
      tabBarInactiveTintColor: Colors.black,
      tabBarLabelStyle: {
        fontSize: 14,
        marginBottom: 5
      }
    }}>
        <Tabs.Screen 
        name='map' 
        options={{
          tabBarLabel: "Map",
          tabBarIcon: ({color}) => (
          <Ionicons name='map' size={28} color={color} />
          ),
          headerShown: false,
          }} />
        <Tabs.Screen 
        name='homePage' 
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({color}) => (
          <Ionicons name='home' size={28} color={color} />
  )}} />
        <Tabs.Screen 
        name='explore' 
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({color}) => (
          <Ionicons name='compass' size={30} color={color} />
  )}} />
    </Tabs>
  )
}

export default Layout

const styles = StyleSheet.create({})