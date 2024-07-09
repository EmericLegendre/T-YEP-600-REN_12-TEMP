import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import Colors from '../constants/Colors';

const Profile = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        headerTitle: '',
        headerStyle: {
          backgroundColor: Colors.grey,
        },
        headerRight: () => (
          <Text style={styles.headerTitle}>Mon profil</Text>
        ),
        headerTintColor: Colors.white
      }}
      />

      <View style={styles.list}>
        <TouchableOpacity 
          style={styles.listItem} 
          onPress={() => router.push('/userInformations')}
        >
          <Text style={styles.listItemText}>Mes informations</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.listItem} 
          onPress={() => router.push('/userStatistics')}
        >
          <Text style={styles.listItemText}>Mes statistiques</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.listItem} 
          onPress={() => router.push('/userHistory')}
        >
          <Text style={styles.listItemText}>Mon historique</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.listItem} 
          onPress={() => router.push('/userTrips')}
        >
          <Text style={styles.listItemText}>Mes voyages</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 20,
    marginRight: 15,
  },
  list: {
    marginTop: 20,
  },
  listItem: {
    padding: 15,
    backgroundColor: Colors.lightGrey,
    borderRadius: 5,
    marginVertical: 10,
  },
  listItemText: {
    fontSize: 18,
    color: Colors.black,
  }
});
