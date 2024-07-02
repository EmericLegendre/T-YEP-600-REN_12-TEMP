import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const explore = () => {
  return (
    <View style={styles.container}>
      <Text>Explore</Text>
    </View>
  )
}

export default explore

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignitems:'center'
  }
})