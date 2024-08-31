import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../constants/Colors";
import Home from "../../components/home";

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

          global.currentUserId = null;
          AsyncStorage.removeItem(apiToken);
          router.push('/register');
      } catch (error) {
          console.error('Failed to remove the token:', error);
      }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerStyle: { backgroundColor: Colors.secondColor },
          headerLeft: () => <Text style={styles.headerTitle}>Home</Text>,
          headerRight: () => (
            <TouchableOpacity onPress={logOut} style={styles.headerRight}>
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
  headerTitle: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: "700",
    marginLeft: 15,
  },
  headerRight: { marginRight: 15 },
});
