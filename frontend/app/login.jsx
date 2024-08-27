import { StyleSheet, Text, View, TextInput, TouchableOpacity, Pressable, ScrollView } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import React from 'react'
import {useState} from 'react'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const login = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
      if (!email || !password) {
            setErrorMessage('Please fill in all fields.');
            return;
      }
      console.log("coucou")
      try {
          const dataJson = {
              email: email,
              password: password
          }

        console.log("je suis dans le try");
        const response = await axios.post('http:///10.19.255.233:5000/api/users/auth', dataJson );
        console.log("Response from server:", response.data);
        const { apiToken } = response.data;
        await AsyncStorage.setItem('token', apiToken);

        console.log("Login successful, navigating to home...");
        router.push('/home');
      } catch (err) {
        setError('Invalid email or password');
    }
  };

  return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
          <View style={styles.container}>
            <Text style={styles.header}>Login</Text>

            <TextInput style={styles.textinput} placeholder="Email address" value={email} onChangeText={setEmail} underlineColorAndroid={'transparent'}/>
            <TextInput style={styles.textinput} placeholder="Password" value={password}  onChangeText={setPassword} secureTextEntry={true} underlineColorAndroid={'transparent'}/>

            <Pressable style={styles.button} onPress={handleLogin}>
                <Text style={styles.btntext}>Sign in</Text>
            </Pressable>

            <TouchableOpacity style={styles.signUpButton} onPress={() => router.push('/register')}><Text style={styles.signUpText}>Don't have an account?{' '}
                <Text style={styles.signUpLink}>Sign up</Text></Text>
            </TouchableOpacity>

          </View>
      </>
    );
}

export default login

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:'#c7522a',
    paddingLeft: 60,
    paddingRight: 60,
    width: '100%'
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
     width: '100%',
  },
  placeholder: {
    color: '#fff',
  },
  btntext: {
      alignSelf: 'stretch',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#FD00CF',
      marginTop: 30,
  },
  signUpButton: {
        marginTop: 20,
    },
    signUpText: {
        color: '#fff',
        textAlign: 'center',
    },
    signUpLink: {
        color: '#dda15e',
        fontWeight: 'bold',
    },
});