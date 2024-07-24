import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ScrollView, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '../constants/Colors';
import axios from 'axios';

async function getFlagsUrls(flags) {
  const results = [];

  for (const flag of flags) {
    try {
      const url = `https://flagcdn.com/w320/fr.png`;
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      if (response.status === 200) {
        results.push(url);
      } else {
        throw new Error(`Error fetching flag URL for: ${flag}`);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  return results;
}

async function getFlag() {
  return fetch('https://flagcdn.com/w320/fr.png')
  .then((response) => {
    return response.json();
  })
}

const UserStatistics = () => {
  const [worldpercent, setWorldPercent] = useState(0);
  const [countries, setCountries] = useState(0);
  const [flagData, setFlagData] = useState([]);

  const renderFlagItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.flag} />
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Mes statistiques',
          headerStyle: {
            backgroundColor: Colors.grey,
          },
          headerTintColor: Colors.white,
        }}
      />
      <View style={styles.container}>
      <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Drapeau collecter</Text>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://flagcdn.com/w320/fr.png' }}
          style={styles.image}
        />
      </View>
    </SafeAreaView>
        {/* <View style={styles.section}>
          <Text style={styles.title}>Vous avez vu</Text>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Image source={require('../assets/images/mountains.png')} style={styles.icon} />
              <View style={styles.overlay}>
                <Text style={styles.statTextCountries}>{countries}</Text>
                <Text style={styles.statText}>{'\n'}Pays</Text>
              </View>
            </View>
            <View style={styles.stat}>
              <Image source={require('../assets/images/globe.png')} style={styles.icon} />
              <View style={styles.overlay}>
                <Text style={styles.statText}>{worldpercent}%{'\n'}Du monde</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Drapeau collecter</Text>
          <FlatList
            data={flagData}
            renderItem={renderFlagItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={4}
          />
          <Image  source={{
            uri: 'https://flagcdn.com/w320/fr.png',
          }}/>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Continents visités</Text>
          <Image source={require('../assets/images/world_map.png')} style={styles.map} />
          <View style={styles.legend}>
            <View style={styles.legendRow}>
              <View style={[styles.legendItem, { backgroundColor: 'purple' }]} />
              <Text style={styles.legendText}>Europe</Text>
              <View style={[styles.legendItem, { backgroundColor: 'red' }]} />
              <Text style={styles.legendText}>Africa</Text>
              <View style={[styles.legendItem, { backgroundColor: 'blue' }]} />
              <Text style={styles.legendText}>North-America</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendItem, { backgroundColor: 'orange' }]} />
              <Text style={styles.legendText}>Asia</Text>
              <View style={[styles.legendItem, { backgroundColor: 'yellow' }]} />
              <Text style={styles.legendText}>Oceania</Text>
              <View style={[styles.legendItem, { backgroundColor: 'green' }]} />
              <Text style={styles.legendText}>South-America</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendItem, { backgroundColor: 'gray' }]} />
              <Text style={styles.legendText}>Antarctica</Text>
            </View>
          </View>
        </View> */}
      </View>
    </>
  );
};

export default UserStatistics;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  stat: {
    position: 'relative',
    alignItems: 'center',
  },
  icon: {
    width: 170,
    height: 170,
    borderRadius: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statTextCountries: {
    color: '#0000FF',
    fontSize: 35,
    fontWeight: 'bold',
  },
  flag: {
    width: 50,
    height: 30,
    margin: 5,
  },
  map: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  legend: {
    marginTop: 10,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendItem: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  legendText: {
    marginRight: 15,  // Adjust spacing as needed
  },
});