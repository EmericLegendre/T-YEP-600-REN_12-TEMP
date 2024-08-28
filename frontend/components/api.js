import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserData = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const response = await axios.get(`http://192.168.250.111:5000/api/users/get/1`, config);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log('Error Response:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    throw error;
  }
};

export const getLocationDetails = async (latitude, longitude) => {
  const apiKey = "52a567c2c8bc4be3a2137fb4bc8e6f36"
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.results && data.results.length > 0) {
      const location = data.results[0];
      const country = location.components.country;
      const city = location.components.city || location.components.town || location.components.village;
      const timezone = location.annotations.timezone.name;
      return { country, city, timezone };
    } else {
      console.error('No location data found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching location data:', error);
    return null;
  }
};

export const getTimezoneFromLocation = async (country, city) => {
  const apiKey = "52a567c2c8bc4be3a2137fb4bc8e6f36"
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)},${encodeURIComponent(country)}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.results && data.results.length > 0) {
      const timezone = data.results[0].annotations.timezone.name;
      console.log('Timezone:', data.results);
      return timezone;
    } else {
      console.error('No timezone data found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching timezone data:', error);
    return null;
  }
};
