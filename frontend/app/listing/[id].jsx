import { Image, StyleSheet, Text, View, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CategoryButtons from '../../components/CategoryButtons';
import Colors from '../../constants/Colors'

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 300;

const formatPopulation = (population) => {
    if (!population) return 'N/A inhabitants';

    const populationString = population.toString();
    const formatted = populationString.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    return `${formatted} inhabitants`;
};

const CountryDetails = () => {
    const { id } = useLocalSearchParams();
    const [listing, setListing] = useState(null);
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('General');
    const [categoryInfo, setCategoryInfo] = useState(null);

    useEffect(() => {
        const fetchCountryData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
    
                if (!token) throw new Error('Token non trouvé');
    
                const response = await axios.get(`http://${global.local_ip}:5000/api/country/get/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setListing(response.data);
    
                const responseLanguages = await axios.get(`http://${global.local_ip}:5000/api/countryInfos/get/country/${id}/category/LANGUAGE`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const extractedLanguages = responseLanguages.data.map(lang => lang.content);
                setLanguages(extractedLanguages);
    
                const categoryMappings = {
                    'General': '',
                    'Cooking': 'COOKING',
                    'Culture': 'CULTURE',
                    'Health': 'HEALTH',
                    'Law': 'LAW'
                };
    
                const categoryCode = categoryMappings[selectedCategory];
    
                if (categoryCode && selectedCategory !== 'General') {
                    const responseCategory = await axios.get(`http://${global.local_ip}:5000/api/countryInfos/get/country/${id}/category/${categoryCode}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setCategoryInfo(responseCategory.data);
                } else {
                    setCategoryInfo(null);
                }
    
            } catch (err) {
                console.log('Erreur capturée:', err.response ? err.response.data : err.message);
                setError(err.response ? err.response.data : err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchCountryData();
    }, [id, selectedCategory]);
    

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

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

    if (!listing) {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'red', fontSize: 18 }}>Country not found</Text>
            </View>
        );
    }

    const renderCategoryInfo = () => {
        if (selectedCategory === 'General') {
            return (
                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoTitle}>Capital :</Text>
                        <Text style={styles.infoText}>{listing.capital || 'N/A'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoTitle}>Continent :</Text>
                        <Text style={styles.infoText}>{listing.continent || 'N/A'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                    <Text style={styles.infoTitle}>Languages :</Text>
                    {languages.length > 2 ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {languages.map((language, index) => (
                                <Text key={index} style={styles.infoText}>{language}{index < languages.length - 1 ? ', ' : ''}</Text>
                            ))}
                        </ScrollView>
                    ) : (
                        <Text style={styles.infoText}>{languages.length > 0 ? languages.join(', ') : 'N/A'}</Text>
                    )}
                </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoTitle}>Currency :</Text>
                        <Text style={styles.infoText}>{listing.currency || 'N/A'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoTitle}>Population :</Text>
                        <Text style={styles.infoText}>{formatPopulation(listing.population)}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoTitle}>Population name :</Text>
                        <Text style={styles.infoText}>{listing.population_name || 'N/A'}</Text>
                    </View>
                </View>
            );
        } else if (selectedCategory === 'Cooking' && categoryInfo) {
            return (
                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>Culinary Specialties :</Text>
                    <Text style={styles.infoText}>{categoryInfo.map(info => info.content).join(', ') || 'Cooking information unavailable'}</Text>
                </View>
            );
        } else if (selectedCategory === 'Culture' && categoryInfo) {
            return (
                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>Culture:</Text>
                    <Text style={styles.infoText}>{categoryInfo.map(info => info.content).join(', ') || 'Cultural information unavailable'}</Text>
                </View>
            );
        } else if (selectedCategory === 'Health' && categoryInfo) {
            return (
                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>Health:</Text>
                    <Text style={styles.infoText}>{categoryInfo.map(info => info.content).join(', ') || 'Health information unavailable'}</Text>
                </View>
            );
        } else if (selectedCategory === 'Law' && categoryInfo) {
            return (
                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>Law:</Text>
                    <Text style={styles.infoText}>{categoryInfo.map(info => info.content).join(', ') || 'Law information unavailable'}</Text>
                </View>
            );
        }
        return null;
    };
    
    return (
        <>
            <Stack.Screen options={{
                headerTransparent: true,
                headerTitle: "",
                headerTintColor: "white"
            }} />
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    {<Image source={{ uri: listing.image }} style={styles.image} />}
                    <View style={styles.overlay}>
                        <Text style={styles.countryName}>{listing.name}</Text>
                    </View>
                </View>
                <CategoryButtons onCategorySelect={handleCategorySelect} />
                <View style={styles.separator} />
                {renderCategoryInfo()}
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
        color: Colors.white
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
      marginRight: 10
  },
  infoText: {
      fontSize: 16,
      color: '#333',
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
},
languageScrollContainer: {
    flexDirection: 'row',
},
languageText: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
}
});
