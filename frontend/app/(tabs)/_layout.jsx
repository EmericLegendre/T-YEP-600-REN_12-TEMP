import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const Layout = () => {
  return (
    <Tabs>
        <Tabs.Screen name='map' />
        <Tabs.Screen name='home' />
        <Tabs.Screen name='explore' />
    </Tabs>
  )
}

export default Layout

const styles = StyleSheet.create({})