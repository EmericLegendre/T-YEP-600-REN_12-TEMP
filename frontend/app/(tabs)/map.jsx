import React, { useEffect, useState, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = 'AIzaSyAl4gx3aIX0Tc6mRCYDsyAplhGoSPDSX5A'; // Remplace par ta clé API Google
const INCLUDED_TYPES = ["restaurant", "cafe", "bar", "tourist_attraction", "amusement_center", "amusement_park", "aquarium"];
const SEARCH_RADIUS = 1500; // Rayon en mètres
const DEFAULT_ZOOM = 0.0922; // Valeur de zoom par défaut
const MAX_LATITUDE_DELTA = 0.2; // Seuil au-delà duquel on ne fait pas de requête (valeur à ajuster)

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  // const [addedPlaces, setAddedPlaces] = useState([]); // Liste des lieux ajoutés
  const [directions, setDirections] = useState(null); // Points de l'itinéraire
  const mapRef = useRef(null);
  const [keyLocations, setKeyLocations] = useState([]);

  const [userId, setUserId] = useState(null);
  const [tripId, setTripId] = useState(null);
  const [token, setToken] = useState(null);


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      };

      const token = await AsyncStorage.getItem('token');
      const userId = global.currentUserId;
      setUserId(userId);
      setToken(token);

      fetchTripKeyId(token, userId);

      fetchKeyLocations(userId, token); // Assuming this function is defined elsewhere.

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);

      // Initial fetch of nearby places
      fetchNearbyPlaces(location.coords.latitude, location.coords.longitude, SEARCH_RADIUS); // Assuming SEARCH_RADIUS is defined.

      // Start watching location for real-time updates
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 1,
        },
        (location) => {
          setLocation(location.coords);
        }
      );

    })();
  }, []); // Ensure you have a dependency array here, even if empty.

  const fetchTripKeyId = async (token, userId) => {
    try {
      // console.log(userId);
      // console.log(token);
      const response = await fetch('http://192.168.1.14:5000/api/trip/get/currenttrip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId
        }),

      });

      if (!response.ok) {
        throw new Error('Failed to fetch current trip id');
      }

      const data = await response.json();
      setTripId(data.trip_id);
    } catch (error) {
      setErrorMsg(error.message);
    }
  }

  const fetchKeyLocations = async (userId, token) => {
    // console.log(userId);
    // console.log(token);

    try {
      const response = await fetch('http://192.168.1.14:5000/api/keyLocations/get/currentkeylocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch key locations');
      }

      const data = await response.json();
      console.log(data);
      if (data.key_locations) {
        // Si la réponse contient les key_locations, on les stocke dans l'état
        console.log(data.key_locations);
        setKeyLocations(data.key_locations);
      } else {
        setErrorMsg(data.message || 'No key locations found');
      }
    } catch (error) {
      // En cas d'erreur (ex: serveur indisponible)
      setErrorMsg(error.message);
    }
  };

  // Fonction de récupération des lieux à proximité, avec debounce
  const fetchNearbyPlaces = async (lat, lng, radius = SEARCH_RADIUS) => {
    try {
      const response = await axios.post(
        'https://places.googleapis.com/v1/places:searchNearby',
        {
          includedTypes: INCLUDED_TYPES,
          locationRestriction: {
            circle: {
              center: { latitude: lat, longitude: lng },
              radius: radius,
            },
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': API_KEY,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.photos,places.formattedAddress,places.location,places.types',
          },
        }
      );

      // Vérification que l'API renvoie bien des lieux
      if (response.data && response.data.places && response.data.places.length > 0) {
        const placesData = response.data.places;
        setPlaces(placesData);
      } else {
        setPlaces([]);  // Réinitialisation si aucune place n'est trouvée
      }
    } catch (error) {
      console.error(error);
    }
  } // Le délai de 500ms pour le debounce;

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);

    // Vérification du zoom : on bloque l'appel si le dézoom est trop important
    if (newRegion.latitudeDelta > MAX_LATITUDE_DELTA) {
      console.log('Le dézoom est trop important, pas de requête envoyée');
      return;
    }

    // Utilisation de la fonction fetch avec debounce pour limiter les appels à l'API
    fetchNearbyPlaces(newRegion.latitude, newRegion.longitude);
  };

  const handleMarkerPress = (place) => {
    setSelectedPlace(place);
    setModalVisible(true);
  };

  const addKeyLocations = async (token, place) => {
    try {
      const response = await fetch('http://192.168.1.14:5000/api/keyLocations/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: place.displayName.text,
          place_id: place.id,
        }),
      });

      const data = await response.json();
      console.log(!response.ok);

      if (!response.ok) {
        if (data.alreadyExist) {
          return data.keyLocation.id;
        }
      }

      return data.keyLocation.id;
    } catch (error) {
      setErrorMsg(error.message);
    }
  };


  const addTripKeyLocation = async (token, tripId, place, keyLocationId) => {
    console.log(keyLocationId);
    try {
      const response2 = await fetch('http://192.168.1.14:5000/api/tripKeyLocations/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          key_location_id: keyLocationId,
          trip_id: tripId,
          position: 12,
        }),
      });
      data = await response2.json();

      setKeyLocations((prevKeyLocations) => {
        const newLocation = {
          trip_key_location_id: data.tripKeyLocationId,  // Assurez-vous que 'tripKeyLocationId' existe
          place_id: place.id,
          name: place.displayName?.text,
        };

        console.log('Anciennes locations:', prevKeyLocations);
        console.log('Nouvelle location ajoutée:', newLocation);

        return [...prevKeyLocations, newLocation];
      });
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const addPlaceKeyLocations = async (token, tripId, place) => {
    try {
      const keyLocationId = await addKeyLocations(token, place);
      await addTripKeyLocation(token, tripId, place, keyLocationId);
      await fetchKeyLocations(userId, token); // Rafraîchir la liste des lieux ajoutés
    } catch (error) {
      setErrorMsg(error.message);
    }
  }

  const handleRemovePlace = async (tripKeyLocationId) => {
    console.log('Suppression du lieu avec l\'ID:', tripKeyLocationId);
    try {
      const response = await fetch(`http://192.168.1.14:5000/api/tripKeyLocations/delete/${tripKeyLocationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete place');
      }

      // Met à jour la liste des lieux après suppression
      setKeyLocations((prevKeyLocations) => {
        const updatedLocations = prevKeyLocations.filter((place) => place.trip_key_location_id !== tripKeyLocationId);
        console.log('Lieux après suppression:', updatedLocations);
        return updatedLocations;
      });
    } catch (error) {
      setErrorMsg(error.message);
    }
  };



  const fetchDirections = async (waypoints) => {
    try {
      const origin = waypoints[0];
      const destination = waypoints[waypoints.length - 1];
      const waypointsStr = waypoints.slice(1, -1).map(p => `${p.latitude},${p.longitude}`).join('|');

      const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
        params: {
          origin: `${origin.latitude},${origin.longitude}`,
          destination: `${destination.latitude},${destination.longitude}`,
          waypoints: waypointsStr,
          key: API_KEY,
        },
      });

      if (response.data.routes.length > 0) {
        return response.data.routes[0].overview_polyline.points;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const decodePolyline = (encoded) => {
    // Fonction pour décoder les polylignes Google Maps
    const points = [];
    let index = 0, lat = 0, lng = 0;

    while (index < encoded.length) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;
      points.push({ latitude: (lat / 1E5), longitude: (lng / 1E5) });
    }

    return points;
  };

  let message;
  if (errorMsg) {
    message = errorMsg;
  } else if (!location) {
    message = 'Waiting for location...';
  }


  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider="google"
          showsUserLocation={true}
          followsUserLocation={true}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: DEFAULT_ZOOM,
            longitudeDelta: DEFAULT_ZOOM,
          }}
          onRegionChangeComplete={handleRegionChange}
        >
          {places.map((place) => (
            <Marker
              key={place.id}
              coordinate={{
                latitude: place.location.latitude,
                longitude: place.location.longitude,
              }}
              title={place.displayName?.text || place.name || 'No name'}
              description={place.formattedAddress || 'No address'}
              pinColor="blue"
              onPress={() => handleMarkerPress(place)}
            />
          ))}
          {directions && (
            <Polyline
              coordinates={decodePolyline(directions)}
              strokeColor="#FF6347"
              strokeWidth={4}
            />
          )}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text>{message}</Text>
        </View>
      )}

      <Modal
        isVisible={isModalVisible}
        swipeDirection="down"
        onSwipeComplete={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.bottomModal}
      >
        <View style={styles.modalContent}>
          {selectedPlace && (
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Text style={styles.modalTitle}>
                {selectedPlace.displayName?.text || selectedPlace.name || 'Unnamed Place'}
              </Text>
              <Text style={styles.modalText}>
                Adresse : {selectedPlace.formattedAddress || 'No address available'}
              </Text>
              <Text style={styles.modalText}>
                Types : {selectedPlace.types ? selectedPlace.types.join(', ') : 'No types available'}
              </Text>

              {/* Bouton Ajouter amélioré */}
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addPlaceKeyLocations(token, tripId, selectedPlace)}
              >
                <Text style={styles.addButtonText}>Ajouter</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </Modal>



      <View style={styles.addedPlacesContainer}>
        <Text style={styles.addedPlacesTitle}>Lieux ajoutés :</Text>
        {keyLocations.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {keyLocations.map((place, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.cardTitle}>{place.displayName?.text || place.name || 'Unnamed Place'}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleRemovePlace(place.trip_key_location_id)} // Fonction pour supprimer un lieu
                >
                  <Text style={styles.deleteButtonText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text>Aucun lieu ajouté</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%', // Ajuste la hauteur maximale pour éviter que le modal ne dépasse l'écran
  },
  scrollViewContent: {
    flexGrow: 1, // Permet au contenu de s'étendre
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#4682B4', // Couleur visible
    padding: 15, // Augmenter la taille du bouton
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18, // Augmenter la taille du texte pour meilleure visibilité
    fontWeight: 'bold',
  },
  addedPlacesContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: '#fff',
  },
  addedPlacesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});


