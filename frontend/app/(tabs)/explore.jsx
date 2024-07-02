import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const explore = () => {
  return (
    <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerShadowVisible: false,
                    headerTitle: ""
                }}
            />
          <Text>Explore</Text>
        </SafeAreaView>
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