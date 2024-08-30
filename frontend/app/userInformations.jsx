import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Colors from '../constants/Colors';

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTokenAndUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('apiToken');
        const userId = await AsyncStorage.getItem('userId');
        console.log('Stored Token:', token);
        console.log('Stored User ID:', userId);
        if (token && userId) {
          fetchUserData(token, userId);
        } else {
          console.log("Token or User ID not found in AsyncStorage.");
        }
      } catch (error) {
        console.error("Error fetching token or user ID from AsyncStorage:", error);
      }
    };

    fetchTokenAndUserData();
  }, []);

  const fetchUserData = async (token, userId) => {
    try {
      console.log("Fetching user data with token:", token, "and userId:", userId);

      const response = await axios.get(`http://192.168.1.23:5000/api/users/get/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("User data fetched:", response.data);
      setUserInfo(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to fetch user data');
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('apiToken');
      console.log("Updating user data with token:", token, "and userInfo:", userInfo);

      const response = await axios.put(`http://192.168.1.23:5000/api/users/update/${userInfo.id}`, userInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        Alert.alert('Success', 'User updated successfully');
        setEditable(false);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      Alert.alert('Error', 'Failed to update user data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setUserInfo({ ...userInfo, [field]: value });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Profile</Text>
      <TextInput
        style={styles.input}
        value={userInfo.first_name || ''}
        editable={editable}
        onChangeText={(text) => handleChange('first_name', text)}
        placeholder="First Name"
      />
      <TextInput
        style={styles.input}
        value={userInfo.last_name || ''}
        editable={editable}
        onChangeText={(text) => handleChange('last_name', text)}
        placeholder="Last Name"
      />
      <TextInput
        style={styles.input}
        value={userInfo.email || ''}
        editable={editable}
        onChangeText={(text) => handleChange('email', text)}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        value={userInfo.country || ''}
        editable={editable}
        onChangeText={(text) => handleChange('country', text)}
        placeholder="Country"
      />
      <TextInput
        style={styles.input}
        value={userInfo.city || ''}
        editable={editable}
        onChangeText={(text) => handleChange('city', text)}
        placeholder="City"
      />

      {editable ? (
        <Button title="Save" onPress={handleUpdate} disabled={loading} />
      ) : (
        <Button title="Edit" onPress={() => setEditable(true)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
    paddingBottom: 10,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 20,
    marginRight: 15,
  },
  form: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: Colors.lightGrey,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  editButton: {
    backgroundColor: Colors.secondary,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserProfile;
