import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router'

const StartPage = () => {
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const checkLoggedIn = async () => {
      try {
        const apiToken = await AsyncStorage.getItem('token');

        if (apiToken) {
          router.push('/home');
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Checking login status...</Text>
    </View>
  );
};

export default StartPage;