import { Image, StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { useLocalSearchParams, Stack } from 'expo-router'
import countriesData from '../../data/countries.json'

const {width} = Dimensions.get('window');
const IMG_HEIGHT = 300;

const countryDetails = () => {

    const {id} = useLocalSearchParams();
    const listing = countriesData.find((item) => item.id === id);

  return (
    <>
    <Stack.Screen options={{
        headerTransparent: true,
        headerTitle:"",
        headerTintColor:"white"
    }} />
        <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: listing.image }} style={styles.image} />
          <View style={styles.overlay}>
            <Text style={styles.countryName}>{listing.name}</Text>
          </View>
        </View>
      </View>
    </>
  )
}

export default countryDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
      },
      imageContainer: {
        position: 'relative',
        width: width,
        height: IMG_HEIGHT,
      },
      image: {
        width: '100%',
        height: '100%',
      },
      overlay: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        paddingHorizontal: 5,
        paddingVertical: 3,
      },
      countryName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white'
      }
})