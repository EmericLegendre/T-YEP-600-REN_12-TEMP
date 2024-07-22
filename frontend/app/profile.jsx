import { StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import Colors from '../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'

const Profile = () => {
  const router = useRouter();

  let response = {
      data: {
          apiToken: 'token'
      }
  };
     const logOut = () => {
         try {
             const { apiToken } = response.data;

             AsyncStorage.removeItem(apiToken);
             router.push('/register');
             console.log('Token removed successfully');
         } catch (error) {
             console.error('Failed to remove the token:', error);
         }
     };


  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        headerTitle: '',
        headerStyle: {
          backgroundColor: Colors.grey,
        },
        headerRight: () => (
          <Text style={styles.headerTitle}>Mon profil</Text>
          // mon profil = nom du user connecté
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
          <Ionicons name="chevron-forward" size={20} color={Colors.black} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.listItem} 
          onPress={() => router.push('/userStatistics')}
        >
          <Text style={styles.listItemText}>Mes statistiques</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.black} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.listItem} 
          onPress={() => router.push('/userHistory')}
        >
          <Text style={styles.listItemText}>Mon historique</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.black} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.listItem} 
          onPress={() => router.push('/userTrips')}
        >
          <Text style={styles.listItemText}>Mes voyages</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.black} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem} onPress={logOut}>
            <Text style={styles.listItemText}>Log out</Text>
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
    marginTop: 5,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 10,
    backgroundColor: Colors.lightGrey,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
  },
  listItemText: {
    fontSize: 18,
    color: Colors.black,
  },
});
