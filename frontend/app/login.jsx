import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const login = () => {
  return (
    <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerShadowVisible: false,
                    headerTitle: ""
                }}
            />
          <Text>Login</Text>
        </SafeAreaView>
  )
}

export default login

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignitems:'center'
  }
})