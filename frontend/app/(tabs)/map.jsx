import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import Colors from '../../constants/Colors';

const map = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const onRegionChange = (region) => {
    console.log(region);
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.primaryColor} style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        initialRegion={location}
        showsUserLocation
        showsMyLocationButton
        onRegionChangeComplete={onRegionChange}
      />
    </View>
  );
}

export default map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
