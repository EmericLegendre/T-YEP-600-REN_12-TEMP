import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Button } from 'react-native';
import { Stack } from 'expo-router';
import { Entypo } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const UserInformations = () => {
  const initialUserData = {
    firstName: 'Mehdi',
    lastName: 'Sabir',
    email: 'mehdi3601@hotmail.fr',
    city: 'Rennes',
    country: 'France',
    password: '********',
  };

  const [userData, setUserData] = useState(initialUserData);

  const [isEditing, setIsEditing] = useState({
    firstName: false,
    lastName: false,
    email: false,
    city: false,
    country: false,
    password: false,
  });

  const handleSave = () => {
    console.log("Saved user data: ", userData);
    setIsEditing({
      firstName: false,
      lastName: false,
      email: false,
      city: false,
      country: false,
      password: false,
    });
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
          headerTitle: 'Mes informations',
          headerStyle: {
            backgroundColor: Colors.secondColor,
          },
          headerTintColor: Colors.white,
        }}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.section}>
          <Entypo name="info" size={30} color={Colors.black} style={styles.icon} />
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Prénom</Text>
            {renderValueOrInput('firstName')}

            <Text style={styles.label}>Nom</Text>
            {renderValueOrInput('lastName')}
          </View>
        </View>

        <View style={styles.section}>
          <Entypo name="mail" size={30} color={Colors.black} style={styles.icon} />
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Email</Text>
            {renderValueOrInput('email')}
          </View>
        </View>

        <View style={styles.section}>
          <Entypo name="home" size={30} color={Colors.black} style={styles.icon} />
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Ville</Text>
            {renderValueOrInput('city')}

            <Text style={styles.label}>Pays</Text>
            {renderValueOrInput('country')}
          </View>
        </View>

        <View style={styles.section}>
          <Entypo name="lock" size={30} color={Colors.black} style={styles.icon} />
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Mot de passe</Text>
            {renderValueOrInput('password')}
          </View>
        </View>

        <View style={styles.saveButtonContainer}>
          <Button title="Enregistrer" onPress={handleSave} />
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
    marginTop: 20
  },
});
