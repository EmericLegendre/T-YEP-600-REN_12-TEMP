import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const App = () => {
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://192.168.56.1:5000/');
      const data = response.data.favorite_colors;
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error('Data is not an array:', data);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Couleurs Favorites:</Text>
      {users.length > 0 ? (
        users.map((user, index) => (
          <Text key={index} style={styles.user}>
            {user.name} - {user.color}
          </Text>
        ))
      ) : (
        <Text style={styles.user}>Aucun utilisateur trouvé</Text>
      )}
      <Button title="Recharger les données" onPress={fetchData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 10,
  },
  user: {
    marginBottom: 5,
  },
});

export default App;
