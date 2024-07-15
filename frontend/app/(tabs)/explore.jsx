import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Stack, useRouter } from 'expo-router'
import Colors from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import Listings from '../../components/Listings'
import countriesData from '../../data/countries.json'

const explore = () => {

  const router = useRouter();

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(countriesData);
  
    const handleSearch = (text) => {
      setSearchTerm(text);
      if (text) {
        const filtered = countriesData.filter(country =>
          country.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredData(filtered);
      } else {
        setFilteredData(countriesData);
      }
    };

  return (
    <>
    <Stack.Screen options={{
      headerTitle: '',
      headerStyle: {
        backgroundColor: Colors.grey,
      },
      headerLeft: () => (
        <Text style={styles.headerTitle}>Explore</Text>
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

    <View style={styles.container}>
      <View style={styles.searchSectionWrapper}>
        <View style={styles.searchBar}>
          <Ionicons 
          name="search" 
          size={18}
          style={{ marginRight: 5}}
          color={Colors.black} />
          <TextInput 
          placeholder='Search...' 
          value={searchTerm}
          onChangeText={handleSearch}
          />
        </View>
        <TouchableOpacity onPress={() => {}} style={styles.filterBtn}>
          <Ionicons name="options" size={30} />
        </TouchableOpacity>
      </View>

      <Listings listings={filteredData}/>

    </View>
  </>
  );
};

export default explore

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
    borderRadius:10,
    marginLeft: 5
  }
})