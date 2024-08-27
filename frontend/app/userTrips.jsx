import React, { useState, useEffect, memo } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '../constants/Colors';

const UserTrip = () => {
  const [ongoingTrips, setOngoingTrips] = useState([]); // Multiple ongoing trips
  const [plannedTrips, setPlannedTrips] = useState([]);
  const router = useRouter(); 

  // Fake data for testing
  const fakeOngoingTrips = [
    { id: 1, name: 'Trip to Paris', imageUrl: 'https://a.eu.mktgcdn.com/f/100004519/N2BB4ohwclor2uLoZ7XMHgJmxOZaMOokMdQqqXQAq3s.jpg' },
  ];
  const fakePlannedTrips = [
    { id: 2, name: 'Weekend in Rome', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8zlN2MynhkvSeX452Oxe-heMUuK_3iJMPcQ&s' },
    { id: 3, name: 'Hiking in the Alps', imageUrl: 'https://www.civitatis.com/blog/wp-content/uploads/2023/01/panoramica-mont-blanc-francia.jpg' },
    { id: 4, name: 'Surfing in hawai', imageUrl: 'https://media.tacdn.com/media/attractions-content--1x-1/12/3f/37/b6.jpg' },
  ];

  useEffect(() => {
    setOngoingTrips(fakeOngoingTrips); // Set ongoing trips
    setPlannedTrips(fakePlannedTrips); // Set planned trips
  }, []);

  const handleTripPress = (id) => {
    router.push(`/trips/${id}`);
  };

  const handleCreateTrip = () => {
    router.push('/(tabs)/map'); // Navigate to the create trip screen
  };

  const MemoizedTripItem = memo(({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleTripPress(item.id)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.overlay}>
        <Text style={styles.itemText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  ));

  const renderItem = ({ item }) => <MemoizedTripItem item={item} />;

  const ListHeaderComponent = () => (
    <View>
      {/* Create Trip Box */}
      
        <TouchableOpacity style={styles.createTripBox} onPress={handleCreateTrip}>
          <Text style={styles.createTripText}>Create New Trip</Text>
        </TouchableOpacity>
      
      {/* Ongoing Trips Section */}
      {ongoingTrips.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ongoing Trips</Text>
          <FlatList
            data={ongoingTrips}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
          />
        </View>
      )}
      
      {/* Planned Trips Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Planned Trips</Text>
        <FlatList
          data={plannedTrips}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No planned trips</Text>}
        />
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'My Trips',
          headerStyle: {
            backgroundColor: Colors.grey,
          },
          headerTintColor: Colors.white,
        }}
      />

      <FlatList
        ListHeaderComponent={ListHeaderComponent}
        data={[]}
        renderItem={() => null} // FlatList needs a data prop, but we use ListHeaderComponent for rendering
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
    backgroundColor: Colors.white,
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
    borderColor: Colors.grey,
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
