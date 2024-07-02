import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const index = () => {
  return (
    <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerShadowVisible: false,
                    headerTitle: ""
                }}
            />
          <Text>Home</Text>
        </SafeAreaView>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignitems:'center'
  }
})