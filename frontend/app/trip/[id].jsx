import { Image, StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CategoryButtons from '../../components/CategoryButtons';
import Colors from '../../constants/Colors'

const { width } = Dimensions.get('window');

const formatPopulation = (population) => {
    if (!population) return 'N/A inhabitants';

    const populationString = population.toString();
    const formatted = populationString.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    return `${formatted} inhabitants`;
};

const CountryDetails = () => {
    const { id } = useLocalSearchParams();
    const [trip, setTrip] = useState(null);
    const [TripKeyLocation, setTripKeyLocation] = useState(null);
    const [KeyLocation, setKeyLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTripData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
    
                if (!token) throw new Error('Token non trouvé');
    
                const tripResponse = await axios.get(`http://${global.local_ip}:5000/api/trip/get/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTrip(tripResponse.data);

                const TripKeyLocationResponse = await axios.get(`http://${global.local_ip}:5000/api/tripKeyLocations/${id}/keylocations`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setTripKeyLocation(TripKeyLocationResponse.data);

                const KeyLocationResponse = await axios.get(`http://${global.local_ip}:5000/api/trip/get/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setKeyLocation(KeyLocationResponse.data);
                
                
    
            } catch (err) {
                console.log('Erreur capturée:', err.response ? err.response.data : err.message);
                setError(err.response ? err.response.data : err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchTripData();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'red', fontSize: 18 }}>Erreur: {error}</Text>
            </View>
        );
    }

    if (!trip) {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'red', fontSize: 18 }}>Trip not found</Text>
            </View>
        );
    }

       

    return (
        <>
            <Stack.Screen options={{
                headerTransparent: true,
                headerTitle: "",
                headerTintColor: "white"
            }} />
            <View style={styles.container}>
                <View style={styles.overlay}>
                    <Text style={styles.countryName}>{id}</Text>
                </View>
                <View style={styles.separator} />
            </View>
        </>
    );
};

export default CountryDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor : Colors.white
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
    },
    separator: {
        height: 2,
        backgroundColor: Colors.lightGrey,
        marginTop: 20,
    },
    infoContainer: {
      padding: 20,
      borderRadius: 8,
      marginHorizontal: 15,
      marginBottom: 20,
      marginTop: 20,
  },
  infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
  },
  infoTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
  },
  infoText: {
      fontSize: 16,
      color: '#333',
  }
});
