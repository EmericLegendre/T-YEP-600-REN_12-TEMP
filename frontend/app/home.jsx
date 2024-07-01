import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const profile = () => {
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

export default profile

const styles = StyleSheet.create({})