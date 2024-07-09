import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const userHistory = () => {
  return (
    <View style={styles.container}>
      <Text>Mon historique</Text>
    </View>
  );
};

export default userHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
