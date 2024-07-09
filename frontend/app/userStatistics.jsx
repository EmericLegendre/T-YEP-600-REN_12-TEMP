import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const userStatistics = () => {
  return (
    <View style={styles.container}>
      <Text>Mes statistiques</Text>
    </View>
  );
};

export default userStatistics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
