import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import React from 'react'


const register = () => {

  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Registration</Text>

      <TextInput style={styles.textinput} placeholder="First name" underlineColorAndroid={'transparent'}/>
      <TextInput style={styles.textinput} placeholder="Last name" underlineColorAndroid={'transparent'}/>
      <TextInput style={styles.textinput} placeholder="Email adress" underlineColorAndroid={'transparent'}/>
      <TextInput style={styles.textinput} placeholder="Password" secureTextEntry={true} underlineColorAndroid={'transparent'}/>

      <TouchableOpacity style={styles.button}
      onPress={() => router.push('/home')}>
          <Text style={styles.btntext}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

export default register

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:'#199187',
    paddingLeft: 60,
    paddingRight: 60,
  },
  header: {
    fontSize: 24,
    color: '#fff',
    paddingBottom: 10,
    marginBottom: 40,
    borderBottomColor: '#f8f8f8',
    borderBottomWidth: 1,
  },
  textinput: {
    alignSelf: 'stretch',
    height: 40,
    marginBottom: 30,
    color: '#fff',
    borderBottomColor: '#f8f8f8',
    borderBottomWidth: 1,
  },
  btntext: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#59cbbd',
    marginTop: 30,
  }
});