import { StyleSheet, Text, View, Dimensions, ActivityIndicator, TouchableOpacity, ScrollView, SafeAreaView, Alert, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors';
import tripImages from '../../constants/tripImages';


const TripDetails = () => {
    const { id } = useLocalSearchParams();
    const [trip, setTrip] = useState(null);
    const [keyLocations, setKeyLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) throw new Error('Token not found');

                const tripResponse = await axios.get(`http://${global.local_ip}:5000/api/trip/get/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!tripResponse.data) throw new Error('Trip not found');

                setTrip(tripResponse.data);
            } catch (err) {
                setError('Trip not found');
            } finally {
                setLoading(false);
            }
        };

        const fetchKeyLocations = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) throw new Error('Token not found');

                const TripkeyLocationsResponse = await axios.get(`http://${global.local_ip}:5000/api/tripKeyLocations/get`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const relevantKeyLocations = TripkeyLocationsResponse.data.filter(location => location.trip_id == id);
                return relevantKeyLocations;

            } catch (err) {
                setError('Key locations not found');
                return [];
            }
        };

        const fetchKeyLocationDetails = async (location) => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) throw new Error('Token non trouvé');

                const keyLocationResponse = await axios.get(`http://${global.local_ip}:5000/api/keyLocations/get/${location.key_location_id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                return keyLocationResponse.data;

            } catch (err) {
                setError('Erreur lors de la récupération des détails de l\'emplacement clé: ' + (err.response ? err.response.data : err.message));
                return null;
            }
        };

        const fetchTripData = async () => {
            await fetchTrip();

            const relevantKeyLocations = await fetchKeyLocations();

            for (const location of relevantKeyLocations) {
                const keyLocationDetails = await fetchKeyLocationDetails(location);
                if (keyLocationDetails) {
                    setKeyLocations(prevKeyLocations => [...prevKeyLocations, keyLocationDetails]);
                }
            }
        };

        fetchTripData();
    }, [id]);

    const handleMarkAsFinished = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) throw new Error('Token non trouvé');

            const response = await axios.put(`http://${global.local_ip}:5000/api/trip/update/${id}`, 
                { archived: true }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setTrip({ ...trip, archived: true });
            Alert.alert('Success', 'Trip marked as finished');
        } catch (err) {
            Alert.alert('Error', 'Failed to mark trip as finished');
        }
    };

    const handleDeleteTrip = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) throw new Error('Token non trouvé');

            await axios.delete(`http://${global.local_ip}:5000/api/trip/delete/archived/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Alert.alert('Success', 'Trip deleted');
            router.push('/');  // Navigate to the home or trip list screen after deletion
        } catch (err) {
            Alert.alert('Error', 'Failed to delete trip');
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.centeredContainer}>
                <Stack.Screen 
                    options={{
                        headerTitle: `Trip ${id}`,
                        headerStyle: {
                            backgroundColor: Colors.secondColor,
                        },
                        headerTintColor: Colors.white,
                    }} 
                />
                <View style={styles.content}>
                    <View style={styles.infoContainer}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen 
                    options={{
                        headerTitle: `Trip ${id}`,
                        headerStyle: {
                            backgroundColor: Colors.secondColor,
                        },
                        headerTintColor: Colors.white,
                    }} 
                />
                <View style={styles.content}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>{error}</Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    if (!trip) {
        return (
            <SafeAreaView style={styles.centeredContainer}>
                <Text style={styles.errorText}>Trip not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen 
                options={{
                    headerTitle: `Trip ${id}`,
                    headerStyle: {
                        backgroundColor: Colors.secondColor,
                    },
                    headerTintColor: Colors.white,
                }} 
            />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.imageContainer}>
                    <Image 
                        source={{ uri: tripImages[id] || 'https://example.com/default-image.jpg' }}
                        style={styles.tripImage}
                    />
                </View>
                <View style={styles.content}>
                    <Text style={styles.tripStatus}>
                        Status: {trip.archived ? 'Archived' : 'Active'}
                    </Text>
                    <View style={styles.buttonContainer}>
                        {!trip.archived && (
                            <TouchableOpacity style={styles.button} onPress={handleMarkAsFinished}>
                                <Text style={styles.buttonText}>Mark as Finished</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteTrip}>
                            <Text style={styles.buttonText}>Delete Trip</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>Key Locations</Text>
                        {keyLocations.length > 0 ? (
                            keyLocations.map((location, index) => (
                                <TouchableOpacity 
                                    key={`${location.id}-${index}`}  // Ensuring unique key
                                    style={styles.infoRow}
                                    onPress={() => router.push(`/map`)}
                                >
                                    <Text style={styles.infoText}>{location.name}</Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={styles.infoText}>No key locations found for this trip.</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TripDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    imageContainer: {
        height: 200,
        width: '100%',
        marginBottom: 20,
    },
    tripImage: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    tripStatus: {
        fontSize: 16,
        color: Colors.grey,
        textAlign: 'center',
        marginVertical: 5,
    },
    separator: {
        height: 2,
        backgroundColor: Colors.lightGrey,
        marginVertical: 20,
    },
    infoContainer: {
        backgroundColor: Colors.lightGrey,
        borderRadius: 8,
        padding: 15,
        marginTop: 10,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: Colors.white,
        borderRadius: 5,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    infoText: {
        fontSize: 16,
        color: Colors.darkGrey,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
    },
    errorText: {
        fontSize: 18,
        color: Colors.red,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    button: {
        padding: 15,
        borderRadius: 8,
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: Colors.red,
    },
    buttonText: {
        fontSize: 16,
        color: Colors.white,
    },
});
