import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Colors from '../constants/Colors';

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTokenAndUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('apiToken');
        const userId = await AsyncStorage.getItem('userId');
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
      if (!token || !userInfo.id){
        Alert.alert('Error','Missing token or user id') ;
        return
      }

      const response = await axios.put(`http://192.168.1.23:5000/api/users/update/${userId}`, userInfo, {
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

     const handleDelete = async () => {
        setLoading(true);
        try {
          const token = await AsyncStorage.getItem('apiToken');
          const userId = await AsyncStorage.getItem('userId');
          if (!token || !userId) {
            Alert.alert('Error', 'Missing token or user ID');
            return;
          }

          const response = await axios.delete(`http://192.168.1.23:5000/api/users/delete/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.status === 200) {
            await AsyncStorage.removeItem('apiToken');
            await AsyncStorage.removeItem('userId');
            Alert.alert('Success', 'Account deleted successfully');
            router.push('/register');
          }
        } catch (error) {
          console.error('Error deleting account:', error);
          Alert.alert('Error', 'Failed to delete account');
        } finally {
          setLoading(false);
        }
      };

      const confirmDelete = () => {
        Alert.alert(
          'Delete Account',
          'Are you sure you want to delete your account?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'OK', onPress: handleDelete },
          ]
        );
      };

  return (

    <View style={styles.container}>
        <Stack.Screen options={{
                headerTitle: '',
                headerStyle: {
                  backgroundColor: Colors.grey,
                },
                headerRight: () => (
                  <Text style={styles.headerTitle}>Hello, {userInfo.first_name}</Text>

                ),
                headerTintColor: Colors.white
              }}
              />
        <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Personal information</Text>
        </View>
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
      <TouchableOpacity
          onPress={handleUpdate}
          style={[styles.button, styles.saveButton]}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.buttonText}>Save</Text>}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => setEditable(true)}
          style={[styles.button, styles.editButton]}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        )}
    <View style={styles.deleteButtonContainer}>
            <TouchableOpacity
              onPress={confirmDelete}
              style={[styles.button, styles.deleteButton]}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.deleteButtonText}>Delete Account</Text>}
            </TouchableOpacity>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems:'center',
  },
  headerTitle: {
    color: Colors.black,
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
    backgroundColor: '#c7522a',
  },
  editButton: {
    backgroundColor: '#dda15e',
  },
  deleteButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  deleteButton: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: Colors.grey,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserProfile;
