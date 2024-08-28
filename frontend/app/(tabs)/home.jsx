import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import moment from "moment-timezone";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from "expo-location";
import {
  getUserData,
  getLocationDetails,
  getTimezoneFromLocation,
} from "../../components/api";

const { width } = Dimensions.get("window");

const Home = () => {
  const router = useRouter();
  const [userCountry, setUserCountry] = useState(null);
  const [userCity, setUserCity] = useState(null);
  const [tripCountry, setTripCountry] = useState(null);
  const [tripCity, setTripCity] = useState(null);
  const [userTimezone, setUserTimezone] = useState(null);
  const [tripTimezone, setTripTimezone] = useState(null);
  const [userTime, setUserTime] = useState("");
  const [tripTime, setTripTime] = useState("");
  const [locationPermission, setLocationPermission] = useState(null);

  const getCurrentTime = (timezone) => {
    try {
      return moment().tz(timezone).format("HH:mm:ss");
    } catch (error) {
      console.error(`Error getting time for timezone ${timezone}:`, error);
      return "Error";
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (!userTimezone || !tripTimezone) return;
      setUserTime(getCurrentTime(userTimezone));
      setTripTime(getCurrentTime(tripTimezone));
    }, 1000);

    return () => clearInterval(timer);
  }, [userTimezone, tripTimezone]);

  const fetchUserTimezone = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status === "granted");

    if (status === "granted") {
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const locationDetails = await getLocationDetails(latitude, longitude);
      if (locationDetails) {
        setTripCity(locationDetails.city);
        setTripCountry(locationDetails.country);
        setTripTimezone(locationDetails.timezone);
      }
    }
  };

  const fetchUserData = async () => {
    try {
      const userData = await getUserData();
      setUserCity(userData.city);
      setUserCountry(userData.country);
      const timezone = await getTimezoneFromLocation(
        userData.city,
        userData.country
      );
      setUserTimezone(timezone);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserTimezone();
    fetchUserData();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      style={styles.scrollView}
    >
      {/* Timezones Block */}
      <View style={styles.timezoneContainer}>
        <View style={styles.timezoneContent}>
          <View style={styles.timezoneItem}>
            <Image
              source={{
                uri: "https://cdn.icon-icons.com/icons2/3761/PNG/512/house_building_home_icon_231030.png",
              }}
              style={styles.clockImage}
            />
            <Text style={styles.timezoneText}>{userTime}</Text>
            <Text style={styles.timezoneLabel}>{userCity}</Text>
            <Text style={styles.timezoneLabel}>{userCountry}</Text>
          </View>
          {tripTimezone && (
            <View style={styles.timezoneItem}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/5219/5219577.png",
                }}
                style={styles.clockImage}
              />
              <Text style={styles.timezoneText}>{tripTime}</Text>
              <Text style={styles.timezoneLabel}>{tripCity}</Text>
              <Text style={styles.timezoneLabel}>{tripCountry}</Text>
            </View>
          )}
        </View>
      </View>
      {/* Grid of Blocks */}
      <View style={styles.grid}>
        <View style={styles.gridRow}>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => router.push("/userTrips")}
          >
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/776/776541.png",
              }}
              style={styles.image}
            />
            <Text style={styles.gridItemText}>Mes voyages</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => router.push("/userStatistics")}
          >
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/9746/9746676.png",
              }}
              style={styles.image}
            />
            <Text style={styles.gridItemText}>Mes statistiques</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.gridRow}>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => router.push("/userHistory")}
          >
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/3286/3286370.png",
              }}
              style={styles.image}
            />
            <Text style={styles.gridItemText}>Mon historique</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => router.push("/userInformations")}
          >
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/8863/8863767.png",
              }}
              style={styles.image}
            />
            <Text style={styles.gridItemText}>Mes informations</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default function HomePage() {
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
    <>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerStyle: { backgroundColor: Colors.grey },
          headerLeft: () => <Text style={styles.headerTitle}>Home</Text>,
          headerRight: () => (
            <TouchableOpacity
              onPress={logOut}
              style={styles.headerRight}
            >
              <Ionicons name="log-out" size={30} color={Colors.white} />
            </TouchableOpacity>
          ),
        }}
      />
      <Home />
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scrollContainer: { padding: 20, backgroundColor: Colors.white },
  timezoneContainer: {
    width: "100%",
    marginBottom: 30,
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  timezoneContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  timezoneItem: { flex: 1, alignItems: "center", marginHorizontal: 10 },
  clockImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  timezoneText: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 5,
  },
  timezoneLabel: { fontSize: 16, color: Colors.textLight },
  grid: { flex: 1 },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  gridItem: {
    width: (width - 40) / 2,
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  image: { width: 120, height: 120, borderRadius: 10, marginBottom: 10 },
  gridItemText: { fontSize: 16, fontWeight: "600", color: Colors.text },
  headerTitle: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: "700",
    marginLeft: 15,
  },
  headerRight: { marginRight: 15 },
});
