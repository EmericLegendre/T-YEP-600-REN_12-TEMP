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
import { useRouter } from "expo-router";
import moment from "moment-timezone";
import Colors from "../constants/Colors";
import * as Location from "expo-location";
import {
  getUserData,
  getLocationDetails,
  getTimezoneFromLocation,
} from "./api";

const { width } = Dimensions.get("window");

const Home = () => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState({
    city: null,
    country: null,
    timezone: null,
    time: "",
  });
  const [tripDetails, setTripDetails] = useState({
    city: null,
    country: null,
    timezone: null,
    time: "",
  });
  const [locationPermission, setLocationPermission] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        const timezone = await getTimezoneFromLocation(
          userData.city,
          userData.country
        );
        setUserDetails({
          city: userData.city,
          country: userData.country,
          timezone: timezone,
          time: "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchUserTimezone = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");

      if (status === "granted") {
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        const locationDetails = await getLocationDetails(latitude, longitude);
        setTripDetails({
          city: locationDetails.city,
          country: locationDetails.country,
          timezone: locationDetails.timezone,
          time: "",
        });
      }
    };

    fetchUserData();
    fetchUserTimezone();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (userDetails.timezone) {
        setUserDetails((prev) => ({
          ...prev,
          time: getCurrentTime(prev.timezone),
        }));
      }
      if (tripDetails.timezone) {
        setTripDetails((prev) => ({
          ...prev,
          time: getCurrentTime(prev.timezone),
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [userDetails.timezone, tripDetails.timezone]);

  const getCurrentTime = (timezone) => {
    try {
      return moment().tz(timezone).format("HH:mm:ss");
    } catch (error) {
      console.error(`Error getting time for timezone ${timezone}:`, error);
      return "Error";
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      style={styles.scrollView}
    >
      <TimezonesBlock userDetails={userDetails} tripDetails={tripDetails} />
      <GridMenu router={router} />
    </ScrollView>
  );
};

const TimezonesBlock = ({ userDetails, tripDetails }) => (
  <View style={styles.timezoneContainer}>
    <View style={styles.timezoneContent}>
      <TimezoneItem
        time={userDetails.time}
        city={userDetails.city}
        country={userDetails.country}
        imageUri="https://cdn.icon-icons.com/icons2/3761/PNG/512/house_building_home_icon_231030.png"
      />
      {tripDetails.timezone && (
        <TimezoneItem
          time={tripDetails.time}
          city={tripDetails.city}
          country={tripDetails.country}
          imageUri="https://cdn-icons-png.flaticon.com/512/5219/5219577.png"
        />
      )}
    </View>
  </View>
);

const TimezoneItem = ({ time, city, country, imageUri }) => (
  <View style={styles.timezoneItem}>
    <Image source={{ uri: imageUri }} style={styles.clockImage} />
    <Text style={styles.timezoneText}>{time}</Text>
    <Text style={styles.timezoneLabel}>{city}</Text>
    <Text style={styles.timezoneLabel}>{country}</Text>
  </View>
);

const GridMenu = ({ router }) => (
  <View style={styles.grid}>
    <View style={styles.gridRowFull}>
      <GridItem
        router={router}
        route="/currencyConverter"
        imageUri="https://cdn-icons-png.flaticon.com/512/6395/6395470.png"
        label="Currency converter"
        fullWidth={true}
      />
    </View>
    <View style={styles.gridRow}>
      <GridItem
        router={router}
        route="/userTrips"
        imageUri="https://cdn-icons-png.flaticon.com/512/776/776541.png"
        label="Trips"
      />
      <GridItem
        router={router}
        route="/userStatistics"
        imageUri="https://cdn-icons-png.flaticon.com/512/9746/9746676.png"
        label="Statistics"
      />
    </View>
    <View style={styles.gridRow}>
      <GridItem
        router={router}
        route="/userHistory"
        imageUri="https://cdn-icons-png.flaticon.com/512/3286/3286370.png"
        label="History"
      />
      <GridItem
        router={router}
        route="/userInformations"
        imageUri="https://cdn-icons-png.flaticon.com/512/8863/8863767.png"
        label="Profile"
      />
    </View>
  </View>
);


const GridItem = ({ router, route, imageUri, label, fullWidth }) => (
  <TouchableOpacity
    style={[styles.gridItem, fullWidth ? styles.gridItemFullWidth : null]}
    onPress={() => router.push(route)}
  >
    <Image source={{ uri: imageUri }} style={styles.image} />
    <Text style={styles.gridItemText}>{label}</Text>
  </TouchableOpacity>
);


export default Home;

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scrollContainer: { padding: 20},
  timezoneContainer: {
    width: "100%",
    marginBottom: 30,
    backgroundColor: Colors.primaryColor,
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
    color: Colors.white,
    marginBottom: 5,
  },
  timezoneLabel: { fontSize: 16, color: Colors.white },
  grid: { flex: 1 },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
    gridRowFull: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 20,
    },
    gridItemFullWidth: {
      width: width - 40,
    },
    gridItem: {
      width: (width - 60) / 2,
      backgroundColor: Colors.primaryColor,
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
  gridItemText: { fontSize: 16, fontWeight: "600", color: Colors.white },
});
