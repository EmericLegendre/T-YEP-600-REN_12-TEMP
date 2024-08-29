import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import tripImages from '../constants/tripImages';

const UserTrip = () => {
  const [ongoingTrips, setOngoingTrips] = useState([]);
  const [error, setError] = useState(null); // Added state for error handling
  const router = useRouter(); 

  useEffect(() => {
    const fetchTrip = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) throw new Error('Token non trouvé');

            const tripResponse = await axios.get(`http://${global.local_ip}:5000/api/trip/get`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!tripResponse.data) throw new Error('Trip non trouvé');

            const relevantTrips = tripResponse.data.filter(trip => trip.archived === false);

            setOngoingTrips(relevantTrips);
        } catch (err) {
            console.log(err);
            setError('Trip not found');
        }
    };

    fetchTrip();
    
  }, []);

  const handleTripPress = (id) => {
    router.push(`/trip/${id}`);
  };

  const handleCreateTrip = () => {
    router.push('/(tabs)/map');
  };

  const TripItem = ({ item }) => (
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
  );

  const ListHeaderComponent = () => (
    <View>
      {/* Create Trip Box */}
      <TouchableOpacity style={styles.createTripBox} onPress={handleCreateTrip}>
        <Text style={styles.createTripText}>Create New Trip</Text>
      </TouchableOpacity>
      
      {/* Ongoing Trips Section */}
      {ongoingTrips.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ongoing Trips</Text>
          <FlatList
            data={ongoingTrips}
            renderItem={({ item }) => <TripItem item={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
          />
        </View>
      ) : (
        <Text style={styles.emptyText}>No ongoing trips</Text>
      )}
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'My Trips',
          headerStyle: {
            backgroundColor: Colors.secondColor,
          },
          headerTintColor: Colors.white,
        }}
      />

      <FlatList
        ListHeaderComponent={ListHeaderComponent}
        data={[]}
        style={styles.container}
        renderItem={() => null}
        keyExtractor={() => 'dummy'}
        contentContainerStyle={styles.container}
      />
    </>
  );
};

export default UserTrip;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: Colors.lightGrey,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  list: {
    paddingBottom: 10,
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
  createTripBox: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.lightGrey,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  createTripText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.grey,
    marginVertical: 20,
  },
});
