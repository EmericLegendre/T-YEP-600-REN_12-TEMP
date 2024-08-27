import React, { useState, useEffect, memo } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '../constants/Colors';

const userHistory = () => {
  const [activeTab, setActiveTab] = useState('Lieux'); // Initial tab is "Lieux" (Places)
  const [places, setPlaces] = useState([]);
  const [trips, setTrips] = useState([]);
  const router = useRouter(); 

  // Fake data for testing
  const fakePlaces = [
    { id: 1, name: 'Tribunal - Cité Judiciaire', imageUrl: 'https://locations.filmfrance.net/sites/default/files/styles/colorbox_location_photo_zoomed/public/photos/tribunal-cite-judiciaire-rennes-121357/tribunalrennesdelphinejouan2.jpg?itok=CAX4FOln' },
    { id: 2, name: 'Bowl Skatepark', imageUrl: 'https://skateparks.fr/wp-content/uploads/2021/08/image.jpg' },
    { id: 3, name: 'La cavale', imageUrl: 'https://atelier-lanoe.fr/wp-content/uploads/2021/11/cavale-1-1_1365.jpeg' },
    { id: 4, name: 'Cathédrale Saint-Pierre', imageUrl: 'https://i.pinimg.com/originals/ec/1f/77/ec1f77ca36d3227f98741a4102a24ddd.jpg' },
    { id: 5, name: 'La Bamboche du Béret', imageUrl: 'https://www.le-beret.fr/wp-content/uploads/2021/12/Le-Beret-Restaurant-Rennes-Page-interne-2.png' },

  ];

  const fakeTrips = [
    { id: 1, name: 'Trip to Paris', imageUrl: 'https://a.eu.mktgcdn.com/f/100004519/N2BB4ohwclor2uLoZ7XMHgJmxOZaMOokMdQqqXQAq3s.jpg' },
    { id: 2, name: 'Weekend in Rome', imageUrl: 'https://www.turismoroma.it/sites/default/files/Roma%20in%20breve.jpg' },
    { id: 3, name: 'Hiking in the Alps', imageUrl: 'https://www.civitatis.com/blog/wp-content/uploads/2023/01/panoramica-mont-blanc-francia.jpg' },
    { id: 4, name: 'Surfing in hawai', imageUrl: 'https://media.tacdn.com/media/attractions-content--1x-1/12/3f/37/b6.jpg' },
  ];

  useEffect(() => {
    if (activeTab === 'Lieux') {
      setPlaces(fakePlaces);
    } else {
      setTrips(fakeTrips);
    }
  }, [activeTab]);

  const handlePlacePress = (id) => {
    router.push(`/places/${id}`);
  };

  const handleTripPress = (id) => {
    router.push(`/trips/${id}`);
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
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.overlay}>
        <Text style={styles.itemText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  ));

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: activeTab === 'Lieux' ? 'Places' : 'Trips',
          headerStyle: {
            backgroundColor: Colors.grey,
          },
          headerTintColor: Colors.white,
        }}
      />
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Lieux' && styles.activeTab]}
          onPress={() => setActiveTab('Lieux')}
        >
          <Text style={styles.tabText}>Lieux</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Trip' && styles.activeTab]}
          onPress={() => setActiveTab('Trip')}
        >
          <Text style={styles.tabText}>Trip</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'Lieux' ? (
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
    backgroundColor: Colors.lightGrey,
    paddingVertical: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: Colors.bgColor,
  },
  activeTab: {
    textShadowColor: Colors.white,
    backgroundColor: Colors.grey,
  },
  tabText: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    padding: 10,
    backgroundColor: Colors.white,
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
