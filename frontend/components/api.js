import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserData = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const id = global.currentUserId;
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const response = await axios.get(`http://${global.local_ip}:5000/api/users/get/${id}`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getLocationDetails = async (latitude, longitude) => {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${global.opencagekey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

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
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)},${encodeURIComponent(country)}&key=${global.opencagekey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data && data.results && data.results.length > 0) {
      const timezone = data.results[0].annotations.timezone.name;
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
