import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack, useRouter } from 'expo-router'
import Colors from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'

const home = () => {

  const router = useRouter();

  return (
    <Stack.Screen options={{
      headerTitle: '',
      headerStyle: {
        backgroundColor: Colors.grey,
      },
      headerLeft: () => (
        <Text style={styles.headerTitle}>Home</Text>
      ),
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => router.push('/profile')}        
          style={styles.headerRight}
        >
          <Ionicons name="person-sharp" size={30} color={Colors.white} />
        </TouchableOpacity>
      ),
      
    }}/>
  )
}


export default home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center'
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 20,
    marginLeft: 15,
  },
  headerRight: {
    marginRight: 15,
  },
})