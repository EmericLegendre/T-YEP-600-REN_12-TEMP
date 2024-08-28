import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import moment from 'moment-timezone';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import * as Location from 'expo-location';

const Home = () => {
  const router = useRouter();
  const [userTimezone, setUserTimezone] = useState('America/New_York'); // Assume this is predefined
  const [tripTimezone, setTripTimezone] = useState(null);
  const [userTime, setUserTime] = useState('');
  const [tripTime, setTripTime] = useState('');

  const getCurrentTime = (timezone) => {
    if (!timezone) return 'Loading...'; // Return a placeholder if timezone is not set
    try {
      return moment().tz(timezone).format('HH:mm:ss');
    } catch (error) {
      console.error(`Error getting time for timezone ${timezone}:`, error);
      return 'Error';
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setUserTime(getCurrentTime(userTimezone));
      setTripTime(getCurrentTime(tripTimezone));
    }, 1000);

    return () => clearInterval(timer);
  }, [userTimezone, tripTimezone]);

  const fetchTripTimezone = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      let location = await Location.getCurrentPositionAsync({});
      const timezone = moment.tz.guess(); // Using moment.tz.guess() for the timezone based on location
      setTripTimezone(timezone);
    }
  };

  useEffect(() => {
    fetchTripTimezone();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.timezoneContainer}>
        <Text style={styles.sectionTitle}>Time Zones</Text>
        <View style={styles.timezoneRow}>
          <Text style={styles.timezoneText}>Your Time: {userTime}</Text>
        </View>
        {tripTimezone && (
          <View style={styles.timezoneRow}>
            <Text style={styles.timezoneText}>Trip Time: {tripTime}</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/userTrip')}>
          <Text style={styles.buttonText}>Go to Trips</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/places')}>
          <Text style={styles.buttonText}>Go to Places</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/statistics')}>
          <Text style={styles.buttonText}>View Statistics</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
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
        }}
      />
      <Home />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.secondary,
    marginBottom: 15,
  },
  timezoneContainer: {
    marginBottom: 30,
  },
  timezoneRow: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
    paddingBottom: 10,
  },
  timezoneText: {
    fontSize: 20,
    color: Colors.darkGrey,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 15,
  },
  headerRight: {
    marginRight: 15,
  },
});