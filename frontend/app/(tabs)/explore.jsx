import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import Listings from '../../components/Listings';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FilterModal from '../../components/FilterModal';

const Explore = () => {
  const router = useRouter();

  const [countriesData, setCountriesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [languagesData, setLanguagesData] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({
    continent: 'All',
    language: 'All',
  });

  useEffect(() => {
    const fetchCountriesData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const response = await axios.get(`http://${global.local_ip}:5000/api/country/get`, config);
        setCountriesData(response.data);
        setFilteredData(response.data); 

        const languagesResponse = await axios.get(`http://${global.local_ip}:5000/api/countryInfos/get/languages`, config);

        const languagesByCountry = {};
        languagesResponse.data.forEach(item => {
          if (!languagesByCountry[item.country]) {
            languagesByCountry[item.country] = [];
          }
          languagesByCountry[item.country].push(item.content);
        });

        setLanguagesData(languagesByCountry);

      } catch (error) {
        // add setErrorMessage ?
      }
    };

    fetchCountriesData();
  }, []);

  const handleSearch = (text) => {
    setSearchTerm(text);

    let filtered = countriesData;

    if (appliedFilters.continent !== 'All') {
      filtered = filtered.filter(country => country.continent === appliedFilters.continent);
    }

    if (appliedFilters.language !== 'All') {
      filtered = filtered.filter(country =>
        languagesData[country.name] && languagesData[country.name].includes(appliedFilters.language)
      );
    }

    if (text) {
      filtered = filtered.filter(country =>
        country.name.toLowerCase().includes(text.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const handleFilter = ({ continent, language }) => {
    let filtered = countriesData;

    if (continent !== 'All') {
      filtered = filtered.filter(country => country.continent === continent);
    }

    if (language !== 'All') {
      filtered = filtered.filter(country =>
        languagesData[country.name] && languagesData[country.name].includes(language)
      );
    }

    setFilteredData(filtered);
    setAppliedFilters({ continent, language });
  };

  return (
    <>
      <Stack.Screen options={{
        headerTitle: '',
        headerStyle: {
          backgroundColor: Colors.secondColor,
        },
        headerLeft: () => (
          <Text style={styles.headerTitle}>Explore</Text>
        ),
        headerRight: () => (
          <TouchableOpacity 
            onPress={() => router.push('/userInformations')}        
            style={styles.headerRight}
          >
            <Ionicons name="person-sharp" size={30} color={Colors.white} />
          </TouchableOpacity>
        ),
      }}/>

      <View style={styles.container}>
        <View style={styles.searchSectionWrapper}>
          <View style={styles.searchBar}>
            <Ionicons 
              name="search" 
              size={18}
              style={{ marginRight: 5 }}
              color={Colors.black} />
            <TextInput 
              placeholder='Search...' 
              value={searchTerm}
              onChangeText={handleSearch}
            />
          </View>
          <TouchableOpacity 
            onPress={() => setModalVisible(true)} 
            style={styles.filterBtn}
          >
            <Ionicons name="options" size={30} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <Listings listings={filteredData} />

        <FilterModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelect={(filters) => {
            handleFilter(filters);
            setModalVisible(false);
          }}
        />

      </View>
    </>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 20,
    marginLeft: 15,
  },
  headerRight: {
    marginRight: 15,
  },
  searchSectionWrapper: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 10
  },
  filterBtn: {
    backgroundColor: Colors.primaryColor,
    padding: 15,
    borderRadius: 10,
    marginLeft: 5
  }
});
