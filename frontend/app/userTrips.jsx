import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const userTrips = () => {
  return (
    <View style={styles.container}>
      <Text>Mes voyages</Text>
    </View>
  );
};

export default userTrips;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
