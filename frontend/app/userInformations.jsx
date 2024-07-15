import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const userInformations = () => {
  return (
    <View style={styles.container}>
      <Text>Mes informations</Text>
    </View>
  );
};

export default userInformations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
