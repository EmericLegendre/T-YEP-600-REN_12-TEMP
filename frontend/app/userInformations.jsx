import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, activityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
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
        const token = await AsyncStorage.getItem('token');
        const userId = global.currentUserId;
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

      const response = await axios.get(`http://${global.local_ip}:5000/api/users/get/${userId}`, {
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
        const token = await AsyncStorage.getItem('token');


        const requiredFields = ['id', 'first_name', 'last_name', 'email', 'country', 'city'];
        const missingFields = requiredFields.filter(field => !userInfo[field]);
        if (missingFields.length > 0) {
          console.log('Missing fields:', missingFields);
          Alert.alert('Error', `Missing required fields: ${missingFields.join(', ')}`);
          setLoading(false);
          return;
        }

        console.log("Updating user data with token:", token, "and userInfo:", userInfo);

        const response = await axios.put(
          `http://${global.local_ip}:5000/api/users/update/${userInfo.id}`,
          userInfo,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

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
    setUserInfo((prevUserInfo) => ({ ...prevUserInfo, [field]: value }));
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

            const response = await axios.delete(`http://${global.local_ip}:5000/api/users/delete/${userId}`, {
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
                  backgroundColor: Colors.secondColor,
                },
                headerRight: () => (
                  <Text style={styles.headerTitle}>Hello {userInfo.first_name}</Text>

                ),
                headerTintColor: Colors.white
              }}
              />
        <View style={styles.headerContainer}>
            <Text style={styles.mainTitle}>Personal information</Text>
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
    borderBottomColor: Colors.black,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems:'center',
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 20,
    marginRight: 15,
  },
  mainTitle: {
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
    backgroundColor: Colors.white,
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
    backgroundColor: Colors.primaryColor,
  },
  editButton: {
    backgroundColor: Colors.primaryColor,
    marginBottom: 5
  },
  deleteButtonContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
  },
  deleteButton: {
      backgroundColor: Colors.prima,
  },
  deleteButtonText: {
      color: Colors.black,
      fontSize: 16,
      fontWeight: 'bold',
    },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
      marginBottom: 20,
      padding: 10,
      alignItems:'center',
  },
  backButtonText:{
    fontSize: 16,
    color: Colors.primary,
  },
});

export default UserProfile;