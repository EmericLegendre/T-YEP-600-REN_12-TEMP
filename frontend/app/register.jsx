import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import React from 'react'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Picker } from '@react-native-picker/picker'
import axios from 'axios'



const register = () => {

      const navigation = useNavigation();
      const router = useRouter();


      const [first_name, setFirstName] = useState('');
      const [last_name, setLastName] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [country, setCountry] = useState('');
      const [city, setCity] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [errorMessage, setErrorMessage] = useState('');
      const [isValidEmail, setIsValidEmail] = useState(true);
      const [isValidPassword, setIsValidPassword] = useState(true);



      const handleSignUp = async () => {
        if (!first_name || !last_name || !email || !password || !country || !city) {
          setErrorMessage('Please fill in all fields.');
          return;
        }

        if (!validateEmail(email)) {
            setIsValidEmail(false);
            setErrorMessage('Please enter a valid email address.')
            return;
            } else {
                setIsValidEmail(true);
                }

        if (!validatePassword(password)){
            setIsValidPassword(false);
            setErrorMessage('Password must be at least 8 characters long and contain at least one number.')
            return;
            } else {
                setIsValidPassword(true)
                }

        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match.');
          return;
        }

          try {
              const response = await axios.post('http://10.19.255.233:5000/api/users/add', {
                  email,
                  password,
                  first_name,
                  last_name,
                  country,
                  city
              });

              if (response.status === 201) {
                  router.push('/login');
              } else {
                  setErrorMessage('Registration failed. Please try again.');
              }
          } catch (error) {
              setErrorMessage('An error occurred.');
          }
      };


    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
      };

    const validatePassword = (password) => {
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordPattern.test(password);
     };

    const countries = [
        'Afghanistan',
        'Albanie',
        'Algérie',
        'Allemagne',
        'Andorre',
        'Angola',
        'Antigua-et-Barbuda',
        'Arabie Saoudite',
        'Argentine',
        'Arménie',
        'Australie',
        'Autriche',
        'Azerbaïdjan',
        'Bahamas',
        'Bahreïn',
        'Bangladesh',
        'Barbade',
        'Belgique',
        'Belize',
        'Bénin',
        'Bhoutan',
        'Biélorussie',
        'Birmanie',
        'Bolivie',
        'Bosnie-Herzégovine',
        'Botswana',
        'Brésil',
        'Brunei',
        'Bulgarie',
        'Burkina Faso',
        'Burundi',
        'Cambodge',
        'Cameroun',
        'Canada',
        'Cap-Vert',
        'République centrafricaine',
        'Chili',
        'Chine',
        'Chypre',
        'Colombie',
        'Comores',
        'République du Congo',
        'République démocratique du Congo',
        'République dominicaine',
        'Corée du Nord',
        'Corée du Sud',
        'Costa Rica',
        'Côte d\'Ivoire',
        'Croatie',
        'Cuba',
        'Danemark',
        'Djibouti',
        'République dominicaine',
        'Égypte',
        'Émirats arabes unis',
        'Équateur',
        'Érythrée',
        'Espagne',
        'Estonie',
        'États-Unis',
        'Éthiopie',
        'Fidji',
        'Finlande',
        'France',
        'Gabon',
        'Gambie',
        'Géorgie',
        'Ghana',
        'Grèce',
        'Grenade',
        'Guatemala',
        'Guinée',
        'Guinée équatoriale',
        'Guinée-Bissau',
        'Guyana',
        'Haïti',
        'Honduras',
        'Hong Kong',
        'Hongrie',
        'Îles Marshall',
        'Îles Salomon',
        'Inde',
        'Indonésie',
        'Iran',
        'Iraq',
        'Irlande',
        'Islande',
        'Israël',
        'Italie',
        'Jamaïque',
        'Japon',
        'Jordanie',
        'Kazakhstan',
        'Kenya',
        'Kirghizistan',
        'Kiribati',
        'Koweït',
        'Laos',
        'Lesotho',
        'Lettonie',
        'Liban',
        'Liberia',
        'Libye',
        'Liechtenstein',
        'Lituanie',
        'Luxembourg',
        'Macédoine',
        'Madagascar',
        'Malaisie',
        'Malawi',
        'Maldives',
        'Mali',
        'Malte',
        'Maroc',
        'Maurice',
        'Mauritanie',
        'Mexique',
        'Micronésie',
        'Moldavie',
        'Monaco',
        'Mongolie',
        'Monténégro',
        'Mozambique',
        'Namibie',
        'Nauru',
        'Népal',
        'Nicaragua',
        'Niger',
        'Nigeria',
        'Norvège',
        'Nouvelle-Zélande',
        'Oman',
        'Ouganda',
        'Ouzbékistan',
        'Pakistan',
        'Palaos',
        'Palestine',
        'Panama',
        'Papouasie-Nouvelle-Guinée',
        'Paraguay',
        'Pays-Bas',
        'Pérou',
        'Philippines',
        'Pologne',
        'Portugal',
        'Qatar',
        'République tchèque',
        'Roumanie',
        'Royaume-Uni',
        'Russie',
        'Rwanda',
        'Saint-Christophe-et-Niévès',
        'Saint-Marin',
        'Saint-Vincent-et-les-Grenadines',
        'Sainte-Lucie',
        'Salvador',
        'Samoa',
        'Sao Tomé-et-Principe',
        'Sénégal',
        'Serbie',
        'Seychelles',
        'Sierra Leone',
        'Singapour',
        'Slovaquie',
        'Slovénie',
        'Somalie',
        'Soudan',
    ];


    return (
    <>
        <Stack.Screen options={{ headerShown: false }} />
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.container}>
              <Text style={styles.header}>Registration</Text>

              {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
                    {!isValidEmail && (
                      <Text style={styles.error}>Please enter a valid email address.</Text>
                    )}
                    {!isValidPassword && (
                        <Text style={styles.error}>Password must be at least 8 characters long and contain at least one number.</Text>
                      )}


              <TextInput style={styles.textinput} placeholder="First name" value={first_name} onChangeText={text => setFirstName(text)} underlineColorAndroid={'transparent'}/>
              <TextInput style={styles.textinput} placeholder="Last name" value={last_name} onChangeText={text => setLastName(text)} underlineColorAndroid={'transparent'}/>
              <TextInput style={styles.textinput} placeholder="Email address" value={email} onChangeText={text => {setEmail(text);setIsValidEmail(validateEmail(text));}} underlineColorAndroid={'transparent'}/>
              <TextInput style={styles.textinput} placeholder="Password" value={password} onChangeText={text => setPassword(text)} secureTextEntry={true} underlineColorAndroid={'transparent'}/>
              <TextInput style={styles.textinput} placeholder="Confirm password" value={confirmPassword} onChangeText={text => setConfirmPassword(text)} secureTextEntry={true} underlineColorAndroid={'transparent'}/>
              <Picker selectedValue={country} style={styles.picker} onValueChange={(itemValue, itemIndex) => setCountry(itemValue)}>
              <Picker.Item label="Select country" value="" />{countries.map((country, index) => (<Picker.Item key={index} label={country} value={country} />))}</Picker>
              <TextInput style={styles.textinput} placeholder="City" value={city} onChangeText={text => setCity(text)} underlineColorAndroid={'transparent'}/>


              <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                  <Text style={styles.btntext}>Sign Up</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.signInButton} onPress={() => router.push('/login')}>
                  <Text style={styles.signInText}>Already have an account?{' '}<Text style={styles.signInLink}>Sign in</Text></Text>
              </TouchableOpacity>
            </View>
        </ScrollView>
    </>
    );
}

export default register

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:'#199187',
    paddingLeft: 60,
    paddingRight: 60,
  },
  scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  innerContainer: {
      width: '100%',
      alignItems: 'center',
    },
  header: {
    fontSize: 24,
    color: '#fff',
    paddingBottom: 10,
    marginBottom: 40,
    borderBottomColor: '#f8f8f8',
    borderBottomWidth: 1,
  },
  textinput: {
    alignSelf: 'stretch',
    height: 40,
    marginBottom: 30,
    color: '#fff',
    borderBottomColor: '#f8f8f8',
    borderBottomWidth: 1,
  },
  btntext: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#59cbbd',
    marginTop: 30,
  },
  picker: {
      alignSelf: 'stretch',
      height: 50,
      width: '100%',
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      backgroundColor: '#199187',
      marginBottom: 20,
      color: '#333',
  },
  signInButton: {
      marginTop: 20,
  },
  signInText: {
      color: '#fff',
      textAlign: 'center',
  },
  signInLink: {
      color: '#59cbbd',
      fontWeight: 'bold',
  },

});