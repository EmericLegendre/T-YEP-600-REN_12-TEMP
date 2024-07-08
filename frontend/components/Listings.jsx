import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../constants/Colors'
import React from 'react'

Props = {
    listings: []
}

const Listings = ({listings}) => {

    const sortedListings = listings.sort((a, b) => a.name.localeCompare(b.name))

    const handlePress = (item) => {
        
        console.log('Pays cliqué:', item.name)
      }

    const renderItems = ({ item }) => {
        return (
          <TouchableOpacity 
            style={styles.countryCard} 
            onPress={() => handlePress(item)}
          >
            <Image source={{ uri: item.flag }} style={styles.flag} />
            <View style={styles.textContainer}>
              <Text style={styles.countryName}>{item.name}</Text>
              <Text style={styles.continent}>{item.continent}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.gray} />
          </TouchableOpacity>
        )
      }

      return (
        <View style={styles.container}>
          <FlatList 
            data={listings} 
            renderItem={renderItems} 
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )
}

export default Listings

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 5
    },
    countryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      marginVertical:3,
      backgroundColor: '#f9f9f9',
      borderRadius: 8,
    },
    flag: {
      width: 50,
      height: 30,
      marginRight: 15,
    },
    textContainer: {
      flex: 1,
    },
    countryName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    continent: {
      fontSize: 14,
      color: '#666',
    }
  })