import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Button } from 'react-native';
import { Stack } from 'expo-router';
import { Entypo } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';


const UserInformations = () => {
  const initialUserData = {
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    country: '',
    password: '',
  };


  const [userData, setUserData] = useState(initialUserData);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState({
    firstName: false,
    lastName: false,
    email: false,
    city: false,
    country: false,
    password: false,
  });
  useEffect(() => {
      const fetchUserData = async () => {
        try {

          const token = await AsyncStorage.getItem('token');
          const userId = await AsyncStorage.getItem('userId');

          if (!token) {
              setError('No token found, please log in.');
              setIsLoading(false);
              return;
          }

          if (!userId) {
              setError('No user Id found, please log in.');
              setIsLoading(false);
              return;
          }

          const response = await axios.get(`http://10.19.255.212:5000/api/users/get/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUserData(response.data);
        } catch (error) {
          setError('Failed to fetch user data.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    },[]);

  const handleSave = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');

        if (!token) {
          setError('No token found, please log in.');
          return;
        }

        if (!userId) {
            setError('No user ID found, unable to update.');
            return;
        }

        await axios.put(`http://10.19.255.212:5000/api/users/update/${userId}`, userData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Saved user data: ", userData);
        setIsEditing({
          firstName: false,
          lastName: false,
          email: false,
          city: false,
          country: false,
          password: false,
        });
      } catch (error) {
        setError('Failed to save user data.');
      }
    };

    const handleEdit = (field) => {
      setIsEditing({ ...isEditing, [field]: true });
    };

    const handleChangeText = (text, field) => {
      setUserData({ ...userData, [field]: text });
    };

    const renderValueOrInput = (field) => {
      if (isEditing[field]) {
        return (
          <TextInput
            style={styles.input}
            value={userData[field]}
            onChangeText={(text) => handleChangeText(text, field)}
            onBlur={() => setIsEditing({ ...isEditing, [field]: false })}
            autoFocus={true}
          />
        );
      } else {
        return (
          <TouchableOpacity onPress={() => handleEdit(field)}>
            <Text style={styles.value}>{userData[field]}</Text>
          </TouchableOpacity>
        );
      }
    };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'My information',
          headerStyle: {
            backgroundColor: Colors.grey,
          },
          headerTintColor: Colors.white,
        }}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.section}>
          <Entypo name="info" size={30} color={Colors.black} style={styles.icon} />
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Firstname</Text>
            {renderValueOrInput('firstName')}

            <Text style={styles.label}>Lastname</Text>
            {renderValueOrInput('lastName')}
          </View>
        </View>

        <View style={styles.section}>
          <Entypo name="mail" size={30} color={Colors.black} style={styles.icon} />
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Email address</Text>
            {renderValueOrInput('email')}
          </View>
        </View>

        <View style={styles.section}>
          <Entypo name="home" size={30} color={Colors.black} style={styles.icon} />
          <View style={styles.infoContainer}>
            <Text style={styles.label}>City</Text>
            {renderValueOrInput('city')}

            <Text style={styles.label}>Country</Text>
            {renderValueOrInput('country')}
          </View>
        </View>

        <View style={styles.section}>
          <Entypo name="lock" size={30} color={Colors.black} style={styles.icon} />
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Password</Text>
            {renderValueOrInput('password')}
          </View>
        </View>

        <View style={styles.saveButtonContainer}>
          <Button title="Save" onPress={handleSave} />
        </View>
      </ScrollView>
    </>
  );
};

export default UserInformations;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: Colors.white,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  icon: {
    marginRight: 30,
    marginTop: 5,
  },
  infoContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.grey,
    marginBottom: 5,
  },
  value: {
    fontSize: 20,
    color: Colors.black,
    marginBottom: 12,
  },
  input: {
    fontSize: 20,
    color: Colors.black,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
  },
  saveButtonContainer: {
    alignSelf: 'center',
    width: '50%',
    marginTop: 20,
  },
});
