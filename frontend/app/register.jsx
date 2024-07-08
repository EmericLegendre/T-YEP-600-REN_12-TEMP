import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import React from 'react'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'



const register = () => {

    const [firstName, setFirstName] = useState('');
      const [lastName, setLastName] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [errorMessage, setErrorMessage] = useState('');



      const handleSignUp = () => {
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
          setErrorMessage('Please fill in all fields.');
          return;
        }

        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match.');
          return;
        }

        navigation.navigate('home');
      };

    return (
        <View style={styles.container}>
          <Text style={styles.header}>Registration</Text>

          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}


          <TextInput style={styles.textinput} placeholder="First name" value={firstName} onChangeText={text => setFirstName(text)} underlineColorAndroid={'transparent'}/>
          <TextInput style={styles.textinput} placeholder="Last name" value={lastName} onChangeText={text => setLastName(text)} underlineColorAndroid={'transparent'}/>
          <TextInput style={styles.textinput} placeholder="Email address" value={email} onChangeText={text => setEmail(text)} underlineColorAndroid={'transparent'}/>
          <TextInput style={styles.textinput} placeholder="Password" value={password} onChangeText={text => setPassword(text)} secureTextEntry={true} underlineColorAndroid={'transparent'}/>
          <TextInput style={styles.textinput} placeholder="Confirm password" value={confirmPassword} onChangeText={text => setConfirmPassword(text)} secureTextEntry={true} underlineColorAndroid={'transparent'}/>


          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
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