import React, { useEffect, useState, memo } from 'react';
import { View, Text, StyleSheet, Image, FlatList, SectionList, Dimensions, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserStatistics = () => {
  const [countriesIdVisited, setCountriesIdVisited] = useState([13,20,22,23,29,55,65,66,96,98,99,109,112,125,132,147,172,193,201,202,216,222,223,245]);
  const [countriesVisited, setCountriesVisited] = useState(0);
  const [continentVisited, setContinentVisited] = useState([]);
  const [worldpercent, setWorldPercent] = useState(0);
  const [flags, setFlags] = useState([]);
  const router = useRouter(); 
  
  useEffect(() => {
    const fetchCountriesVisited = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Token:', token);

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const response = await axios.get('http://192.168.250.254:5000/api/travel/get/', config);
        setCountriesIdVisited(response.data);
      } catch (error) {
        if (error.response) {
          console.log('Error Response:', error.response.data);
        } else {
          console.log('Error:', error.message);
        }
      }
    };
    // fetchCountriesVisited();
  }, []);

  useEffect(() => {
    setCountriesVisited(countriesIdVisited.length);
    const percent = (countriesIdVisited.length / 249) * 100;
    setWorldPercent(Number.isInteger(percent) ? percent.toFixed(0) : percent.toFixed(1));
  }, [countriesIdVisited]);

  useEffect(() => {
    const fetchCountriesData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const fetchWithRetry = async (url, config, retries = 3) => {
          try {
            return await axios.get(url, config);
          } catch (error) {
            if (retries > 0) {
              await new Promise(resolve => setTimeout(resolve, 1000));
              return fetchWithRetry(url, config, retries - 1);
            } else {
              throw error;
            }
          }
        };

        const requests = countriesIdVisited.map(id => fetchWithRetry(`http://192.168.250.111:5000/api/country/get/${id}`, config));
        const responses = await Promise.all(requests);

        setFlags(responses.map(response => ({ url: response.data.flag, id: response.data.id })));
        setContinentVisited(responses.map(response => response.data.continent));

      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (countriesIdVisited.length > 0) {
      // fetchCountriesData();
    }
  }, [countriesIdVisited]);

  const handleFlagPress = (id) => {
    router.push(`/listing/${id}`);
  };

  const MemoizedFlagItem = memo(({ item }) => (
    <TouchableOpacity
      style={styles.flagContainer}
      onPress={() => handleFlagPress(item.id)}
    >
      <Image source={{ uri: item.url }} style={styles.flag} />
    </TouchableOpacity>
  ));

  const renderContinents = () => {
    const continents = [
      { name: 'Europe', color: 'purple', slug: 'Europe' },
      { name: 'Afrique', color: 'red', slug: 'Africa' },
      { name: 'North-America', color: 'blue', slug: 'North-America' },
      { name: 'Asie', color: 'orange', slug: 'Asia' },
      { name: 'Oceanie', color: 'yellow', slug: 'Oceania' },
      { name: 'South-America', color: 'green', slug: 'South-America' },
      { name: 'Antarctique', color: 'gray', slug: 'Antarctic' },
    ];

    return continents
      .filter(continent => continentVisited.includes(continent.slug))
      .map(continent => (
        <View key={continent.slug} style={styles.legendRow}>
          <View style={[styles.legendItem, { backgroundColor: continent.color }]} />
          <Text style={styles.legendText}>{continent.name}</Text>
        </View>
      ));
  };

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
      <SectionList
        sections={[
          { title: 'Vous avez vu', data: [{ countriesVisited, worldpercent }] },
          { title: 'Drapeau collecter', data: [flags] },
          { title: 'Continents visités', data: [continentVisited] },
        ]}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.title}>{title}</Text>
        )}
        renderItem={({ item, section }) => {
          if (section.title === 'Vous avez vu') {
            return (
              <View style={styles.statsContainer}>
                <View style={styles.stat}>
                  <Image source={require('../assets/images/mountains.png')} style={styles.icon} />
                  <View style={styles.overlay}>
                    <Text style={styles.statTextCountries}>{item.countriesVisited}</Text>
                    <Text style={styles.statText}>{'\n'}Pays</Text>
                  </View>
                </View>
                <View style={styles.stat}>
                  <Image source={require('../assets/images/globe.png')} style={styles.icon} />
                  <View style={styles.overlay}>
                    <Text style={styles.statText}>{item.worldpercent}%{'\n'}Du monde</Text>
                  </View>
                </View>
              </View>
            );
          } else if (section.title === 'Drapeau collecter') {
            return (
              <FlatList
                data={item}
                renderItem={({ item }) => <MemoizedFlagItem item={item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={5}
                contentContainerStyle={styles.list}
                initialNumToRender={20}
                maxToRenderPerBatch={10}
                windowSize={21}
              />
            );
          } else if (section.title === 'Continents visités') {
            return (
              <View>
                <Image source={require('../assets/images/world_map.png')} style={styles.map} />
                <View style={styles.legend}>
                  {renderContinents()}
                </View>
              </View>
            );
          }
        }}
        keyExtractor={(index) => index.toString()}
        contentContainerStyle={styles.container}
      />
    </>
  );
};

export default UserStatistics;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: Colors.white,
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
    marginBottom: 20,
  },
  stat: {
    position: 'relative',
    alignItems: 'center',
  },
  icon: {
    width: Dimensions.get('window').width / 3 + 30,
    height: Dimensions.get('window').width / 3 + 30,
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
  list: {
    justifyContent: 'center',
  },
  flagContainer: {
    margin: 5,
    width: Dimensions.get('window').width / 7,
    alignItems: 'center',
  },
  flag: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
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
    marginBottom: 5,
  },
  legendItem: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  legendText: {
    fontSize: 16,
  },
});
