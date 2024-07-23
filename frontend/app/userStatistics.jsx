import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Button } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '../constants/Colors';

const userStatistics = () => {
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Mes statistiques',
          headerStyle: {
            backgroundColor: Colors.grey,
          },
          headerTintColor: Colors.white,
        }}
      />

<ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Vous avez vu</Text>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            {/* <Image source={require('./assets/images/mountains.png')} style={styles.icon} /> */}
            <Text style={styles.statText}>4{'\n'}Pays</Text>
          </View>
          <View style={styles.stat}>
            {/* <Image source={require('./assets/images/globe.png')} style={styles.icon} /> */}
            <Text style={styles.statText}>10%{'\n'}Du monde</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Flags collected</Text>
        {/* <FlatList
          data={flagUrls}
          renderItem={({ item }) => <SvgUri width="50" height="30" source={{ uri: item }} style={styles.flag} />}
          keyExtractor={(item, index) => index.toString()}
          numColumns={4}
        /> */}
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Continents visited</Text>
        {/* <Image source={require('./assets/images/world_map.png')} style={styles.map} /> */}
        <View style={styles.legend}>
          <View style={[styles.legendItem, { backgroundColor: 'purple' }]} />
          <Text>Europe</Text>
          <View style={[styles.legendItem, { backgroundColor: 'red' }]} />
          <Text>Africa</Text>
          <View style={[styles.legendItem, { backgroundColor: 'blue' }]} />
          <Text>North-America</Text>
          <View style={[styles.legendItem, { backgroundColor: 'green' }]} />
          <Text>Asia</Text>
          <View style={[styles.legendItem, { backgroundColor: 'yellow' }]} />
          <Text>Oceania</Text>
          <View style={[styles.legendItem, { backgroundColor: 'orange' }]} />
          <Text>South-America</Text>
        </View>
      </View>
    </ScrollView>
    </>
  );
};

export default userStatistics;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
  },
  statText: {
    textAlign: 'center',
    marginTop: 5,
  },
  flag: {
    margin: 5,
  },
  map: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 10,
  },
  legendItem: {
    width: 20,
    height: 20,
    marginRight: 5,
    borderRadius: 10,
  },
});
