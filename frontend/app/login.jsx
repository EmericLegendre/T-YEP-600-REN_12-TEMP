import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import React from 'react'
import {useState} from 'react'
import axios from 'axios';

const login = () => {

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/users/auth', { email, password });
        const { token } = response.data;

        localStorage.setItem('token', token);

        router.push('/home');
      } catch (err) {
        setError('Invalid email or password');
      }
  };

  return (
      <View style={styles.container}>
        <Text style={styles.header}>Login</Text>

        <TextInput style={styles.textinput} placeholder="Email address" underlineColorAndroid={'transparent'}/>
        <TextInput style={styles.textinput} placeholder="Password" secureTextEntry={true} underlineColorAndroid={'transparent'}/>

        <TouchableOpacity style={styles.button}
            onPress={() => router.push('/home')}>
            <Text style={styles.btntext}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
}

export default login

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:'#F4661B',
    paddingLeft: 60,
    paddingRight: 60,
  },
  header: {
    fontSize: 24,
    color: '#fff',
    paddingBottom: 10,
    marginBottom: 40,
    borderBottomColor: '#fff',
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
  placeholder: {
    color: '#fff',
  },
  btntext: {
      alignSelf: 'stretch',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#ffb74d',
      marginTop: 30,
  },
});