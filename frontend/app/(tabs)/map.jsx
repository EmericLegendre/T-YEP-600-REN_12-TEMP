import React, { useEffect, useState, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import Modal from 'react-native-modal';
import { debounce } from 'lodash';

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
  const [addedPlaces, setAddedPlaces] = useState([]); // Liste des lieux ajoutés
  const [directions, setDirections] = useState(null); // Points de l'itinéraire
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);

      // Initial fetch of nearby places
      fetchNearbyPlaces(location.coords.latitude, location.coords.longitude, SEARCH_RADIUS);

      // Start watching location for real-time updates
      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 10000, distanceInterval: 1 },
        (location) => {
          setLocation(location.coords);
        }
      );
    })();
  }, []);

  // Fonction de récupération des lieux à proximité, avec debounce
  const fetchNearbyPlaces = useCallback(
    debounce(async (lat, lng, radius = SEARCH_RADIUS) => {
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
          Alert.alert('Aucun lieu trouvé à proximité.');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Erreur', 'Impossible de récupérer les points d\'intérêt.');
      }
    }, 500), // Le délai de 500ms pour le debounce
    []
  );

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);
    
    // Vérification du zoom : on bloque l'appel si le dézoom est trop important
    if (newRegion.latitudeDelta > MAX_LATITUDE_DELTA) {
      return;
    }

    // Utilisation de la fonction fetch avec debounce pour limiter les appels à l'API
    fetchNearbyPlaces(newRegion.latitude, newRegion.longitude);
  };

  const handleMarkerPress = (place) => {
    setSelectedPlace(place);
    setModalVisible(true);
  };

  const addPlaceToList = async (place) => {
    const updatedPlaces = [...addedPlaces, place];
    setAddedPlaces(updatedPlaces);

    // Récupération de l'itinéraire si au moins 2 points sont ajoutés
    if (updatedPlaces.length > 1) {
      const waypoints = updatedPlaces.map(p => ({
        latitude: p.location.latitude,
        longitude: p.location.longitude,
      }));
      const directionsPolyline = await fetchDirections(waypoints);
      setDirections(directionsPolyline);
    }

    setModalVisible(false);
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
        Alert.alert('Erreur', 'Aucun itinéraire trouvé.');
        return null;
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de récupérer les directions.');
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
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            pinColor="pink"
          />
          {places.map((place) => (
            <Marker
              key={place.id}
              coordinate={{
                latitude: place.location.latitude,
                longitude: place.location.longitude,
              }}
              title={place.displayName.text}
              description={place.formattedAddress}
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
            <ScrollView>
              <Text style={styles.modalTitle}>{selectedPlace.text}</Text>
              <Text style={styles.modalText}>Adresse : {selectedPlace.formattedAddress}</Text>
              <Text style={styles.modalText}>Types : {selectedPlace.types.join(', ')}</Text>

              {/* Bouton Ajouter */}
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addPlaceToList(selectedPlace)}
              >
                <Text style={styles.addButtonText}>Ajouter</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Afficher les lieux ajoutés */}
      <View style={styles.addedPlacesContainer}>
        <Text style={styles.addedPlacesTitle}>Lieux ajoutés :</Text>
        {addedPlaces.length > 0 ? (
          addedPlaces.map((place, index) => (
            <Text key={index} style={styles.addedPlaceItem}>{place.displayName.text}</Text>
          ))
        ) : (
          <Text>Aucun lieu ajouté</Text>
        )}
      </View>
    </View>
  );
}

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
    height: '40%',
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
  closeButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4682B4',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addedPlacesContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 10,
  },
  addedPlacesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addedPlaceItem: {
    fontSize: 16,
    marginTop: 5,
  },
});
