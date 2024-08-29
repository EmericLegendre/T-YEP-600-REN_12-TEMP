import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router'
import axios from "axios";
import conf from '../config/config.json';
export const { IP_ADDR, OPENCAGE_API_KEY } = conf;

const StartPage = () => {
  const navigation = useNavigation();
  const router = useRouter();

  global.currentUserId = null;
  global.local_ip = IP_ADDR;
  global.opencagekey = OPENCAGE_API_KEY;

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const checkLoggedIn = async () => {
      try {
        const apiToken = await AsyncStorage.getItem('token');

        if (apiToken) {

            try {
                const response = await axios.post(`http://${global.local_ip}:5000/api/users/verify`,
                    {token: apiToken}
                );
                global.currentUserId = response.data.user.id;
                router.push('/homePage');
            } catch (e) {
                console.log('Cannot verify API token');
                router.push('/login');
            }
        }
        else {
            router.push('/login')
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