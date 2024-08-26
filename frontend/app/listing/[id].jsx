import { Image, StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CategoryButtons from '../../components/CategoryButtons';

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 300;

const formatPopulation = (population) => {
    if (!population) return 'N/A habitants';

    const populationString = population.toString();
    const formatted = populationString.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    return `${formatted} habitants`;
};

const CountryDetails = () => {
    const { id } = useLocalSearchParams();
    const [listing, setListing] = useState(null);
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('Général');
    const [categoryInfo, setCategoryInfo] = useState(null);

    useEffect(() => {
        const fetchCountryData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
    
                if (!token) throw new Error('Token non trouvé');
    
                // Requête pour les détails généraux du pays
                const response = await axios.get(`http://10.19.255.211:5000/api/country/get/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setListing(response.data);
    
                // Requête pour les langues
                const responseLanguages = await axios.get(`http://10.19.255.211:5000/api/countryInfos/get/country/${id}/category/LANGUAGE`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const extractedLanguages = responseLanguages.data.map(lang => lang.content);
                setLanguages(extractedLanguages);
    
                // Requête pour les informations de la catégorie sélectionnée
                const categoryMappings = {
                    'Général': '',
                    'Cuisine': 'COOKING',
                    'Culture': 'CULTURE',
                    'Santé': 'HEALTH',
                    'Loi': 'LAW'
                };
    
                const categoryCode = categoryMappings[selectedCategory];
    
                if (categoryCode && selectedCategory !== 'Général') {
                    const responseCategory = await axios.get(`http://10.19.255.211:5000/api/countryInfos/get/country/${id}/category/${categoryCode}`, {
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
    }, [id, selectedCategory]);  // Ajout de selectedCategory dans les dépendances
    

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
                <Text style={{ color: 'red', fontSize: 18 }}>Pays non trouvé</Text>
            </View>
        );
    }

    const renderCategoryInfo = () => {
        if (selectedCategory === 'Général') {
            return (
                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoTitle}>Capitale :</Text>
                        <Text style={styles.infoText}>{listing.capital || 'N/A'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoTitle}>Continent :</Text>
                        <Text style={styles.infoText}>{listing.continent || 'N/A'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoTitle}>Langues :</Text>
                        <Text style={styles.infoText}>{languages.length > 0 ? languages.join(', ') : 'N/A'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoTitle}>Monnaie :</Text>
                        <Text style={styles.infoText}>{listing.currency || 'N/A'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoTitle}>Population :</Text>
                        <Text style={styles.infoText}>{formatPopulation(listing.population)}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoTitle}>Nom de la population :</Text>
                        <Text style={styles.infoText}>{listing.population_name || 'N/A'}</Text>
                    </View>
                </View>
            );
        } else if (selectedCategory === 'Cuisine' && categoryInfo) {
            return (
                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>Spécialités culinaires :</Text>
                    <Text style={styles.infoText}>{categoryInfo.map(info => info.content).join(', ') || 'Informations sur la cuisine indisponibles'}</Text>
                </View>
            );
        } else if (selectedCategory === 'Culture' && categoryInfo) {
            return (
                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>Culture :</Text>
                    <Text style={styles.infoText}>{categoryInfo.map(info => info.content).join(', ') || 'Informations sur la culture indisponibles'}</Text>
                </View>
            );
        } else if (selectedCategory === 'Santé' && categoryInfo) {
            return (
                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>Santé :</Text>
                    <Text style={styles.infoText}>{categoryInfo.map(info => info.content).join(', ') || 'Informations sur la santé indisponibles'}</Text>
                </View>
            );
        } else if (selectedCategory === 'Loi' && categoryInfo) {
            return (
                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>Loi :</Text>
                    <Text style={styles.infoText}>{categoryInfo.map(info => info.content).join(', ') || 'Informations sur les lois indisponibles'}</Text>
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
    },
    infoContainer: {
      padding: 20,
      borderRadius: 8,
      marginHorizontal: 15,
      marginBottom: 20,
      marginTop: 30,
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
