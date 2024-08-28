import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import moment from 'moment-timezone';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

const Home = () => {
  const router = useRouter();
  const [userTimezone, setUserTimezone] = useState('America/New_York');
  const [tripTimezone, setTripTimezone] = useState(null);
  const [userTime, setUserTime] = useState('');
  const [tripTime, setTripTime] = useState('');
  const [locationPermission, setLocationPermission] = useState(null);

  const getCurrentTime = (timezone) => {
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

  const fetchUserTimezone = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status === 'granted');

    if (status === 'granted') {
      let location = await Location.getCurrentPositionAsync({});
      const timezone = moment.tz.guess(); // This may not be always accurate
      setTripTimezone(timezone);
    }
  };

  useEffect(() => {
    fetchUserTimezone();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.scrollView}>

      {/* Timezones Block */}
      <View style={styles.timezoneContainer}>
        <View style={styles.timezoneContent}>
          <View style={styles.timezoneItem}>
            <Image 
              source={{ uri: 'https://t4.ftcdn.net/jpg/03/08/62/45/360_F_308624523_KKYtC0SZZqFyPHtF2MhBzlaBZZw00IaA.jpg' }} 
              style={styles.clockImage} 
            />
            <Text style={styles.timezoneText}>{userTime}</Text>
            <Text style={styles.timezoneLabel}>Your Time</Text>
          </View>
          {tripTimezone && (
            <View style={styles.timezoneItem}>
              <Image 
                source={{ uri: 'https://store-images.s-microsoft.com/image/apps.14783.14399867284918662.1ed3b2f0-79ad-4226-9bf5-81fd9dc40eae.37586b11-bfde-4aaa-a14d-c6663a2e7119' }} 
                style={styles.clockImage} 
              />
              <Text style={styles.timezoneText}>{tripTime}</Text>
              <Text style={styles.timezoneLabel}>Trip Time</Text>
            </View>
          )}
        </View>
      </View>

      {/* Grid of Blocks */}
      <View style={styles.grid}>
        <View style={styles.gridRow}>
          <TouchableOpacity 
            style={styles.gridItem} 
            onPress={() => router.push('/userInformations')}
          >
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/665/665049.png' }} style={styles.image} />
            <Text style={styles.gridItemText}>Mes informations</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.gridItem} 
            onPress={() => router.push('/userStatistics')}
          >
            <Image source={{ uri: 'https://static-00.iconduck.com/assets.00/increase-stats-icon-2021x2048-87in2u2l.png' }} style={styles.image} />
            <Text style={styles.gridItemText}>Mes statistiques</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.gridRow}>
          <TouchableOpacity 
            style={styles.gridItem} 
            onPress={() => router.push('/userHistory')}
          >
            <Image source={{ uri: 'https://static-00.iconduck.com/assets.00/history-icon-2048x1863-258qellh.png' }} style={styles.image} />
            <Text style={styles.gridItemText}>Mon historique</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.gridItem} 
            onPress={() => router.push('/userTrips')}
          >
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/776/776541.png' }} style={styles.image} />
            <Text style={styles.gridItemText}>Mes voyages</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    backgroundColor: Colors.white,
  },
  timezoneContainer: {
    width: '100%',
    marginBottom: 30,
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  timezoneContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  timezoneItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  clockImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  timezoneText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 5,
  },
  timezoneLabel: {
    fontSize: 16,
    color: Colors.textLight,
  },
  grid: {
    flex: 1,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridItem: {
    width: (width - 40) / 2,
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  gridItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
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
