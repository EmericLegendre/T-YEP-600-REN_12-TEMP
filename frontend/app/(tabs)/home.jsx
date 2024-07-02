import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const home = () => {
  return (
    <View style={styles.container}>
      <Text>HomePage</Text>
    </View>
  )
}

export default home

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignitems:'center'
  }
})