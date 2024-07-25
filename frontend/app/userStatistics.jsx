import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, SectionList, Dimensions, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserStatistics = () => {
  const [countriesIdVisited, setCountriesIdVisited] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249]);
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

        const response = await axios.get('http://192.168.250.111:5000/api/travel/get/', config);
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
      fetchCountriesData();
    }
  }, [countriesIdVisited]);

  const handleFlagPress = (id) => {
    router.push(`/listing/${id}`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.flagContainer}
      onPress={() => handleFlagPress(item.id)}
    >
      <Image source={{ uri: item.url }} style={styles.flag} />
    </TouchableOpacity>
  );

  const renderContinents = () => {
    const continents = [
      { name: 'Europe', color: 'purple' },
      { name: 'Africa', color: 'red' },
      { name: 'North-America', color: 'blue' },
      { name: 'Asia', color: 'orange' },
      { name: 'Oceania', color: 'yellow' },
      { name: 'South-America', color: 'green' },
      { name: 'Antarctica', color: 'gray' }
    ];

    return continents
      .filter(continent => continentVisited.includes(continent.name))
      .map(continent => (
        <View key={continent.name} style={styles.legendRow}>
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
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={5}
                contentContainerStyle={styles.list}
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
        keyExtractor={(item, index) => index.toString()}
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
