import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const map = () => {
  return (
    <View style={styles.container}>
      <Text>map</Text>
    </View>
  )
}

export default map

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems:'center'
    }
  })