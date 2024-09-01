import React, { useState, useEffect, memo } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import tripImages from '../constants/tripImages';


const userHistory = () => {
  const [activeTab, setActiveTab] = useState('Places'); // Initial tab is "Places" (Places)
  const [places, setPlaces] = useState([]);
  const [trips, setTrips] = useState([]);
  const router = useRouter(); 

  useEffect(() => {
    const fetchTrip = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) throw new Error('Token non trouvé');

            const response = await axios.get(`http://${global.local_ip}:5000/api/trip/get/archived`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.data) throw new Error('Trip not found');

            setTrips(response.data);
        } catch (err) {
            console.log(err);
            setError('Trip not found');
        }
    };

    const fetchKeyLocations = async () => {
      try {
          const token = await AsyncStorage.getItem('token');
          if (!token) throw new Error('Token non trouvé');

          const response = await axios.get(`http://${global.local_ip}:5000//api/keyLocations/get`, {
              headers: { Authorization: `Bearer ${token}` }
          });          
          if (!response.data) throw new Error('KeyLocations not found');

          setPlaces(response.data);
      } catch (err) {
          console.log(err);
          setError('KeyLocations not found');
      }
  };

    fetchTrip();
    fetchKeyLocations();
  }, []);

  const handlePlacePress = (id) => {
    router.push(`/map`);
  };

  const handleTripPress = (id) => {
    router.push(`/trip/${id}`);
  };

  const MemoizedPlaceItem = memo(({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handlePlacePress(item.id)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.overlay}>
        <Text style={styles.itemText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  ));

  const MemoizedTripItem = memo(({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleTripPress(item.id)}
    >
      <Image
        source={{ uri: tripImages[item.id] || 'https://example.com/default-image.jpg' }}
        style={styles.itemImage}
      />
      <View style={styles.overlay}>
        <Text style={styles.itemText}>Trip {item.id}</Text>
      </View>
    </TouchableOpacity>
  ));

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'History',
          headerStyle: {
            backgroundColor: Colors.secondColor,
          },
          headerTintColor: Colors.white,
        }}
      />
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Places' && styles.activeTab]}
          onPress={() => setActiveTab('Places')}
        >
          <Text style={styles.tabText}>Places</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Trip' && styles.activeTab]}
          onPress={() => setActiveTab('Trip')}
        >
          <Text style={styles.tabText}>Trip</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'Places' ? (
        <FlatList
          data={places}
          renderItem={({ item }) => <MemoizedPlaceItem item={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      ) : (
        <FlatList
          data={trips}
          renderItem={({ item }) => <MemoizedTripItem item={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </>
  );
};

export default userHistory;

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.primaryColor,
    paddingVertical: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: Colors.bgColor,
  },
  activeTab: {
    backgroundColor: Colors.lightGrey,
  },
  tabText: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    padding: 10,
    backgroundColor: Colors.lightGrey,
  },
  itemContainer: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: Dimensions.get('window').width / 2,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  itemText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
