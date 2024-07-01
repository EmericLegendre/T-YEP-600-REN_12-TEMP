import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Stack, useRouter } from "expo-router";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
        <Stack.Screen
            options={{
                headerShadowVisible: false,
                headerTitle: ""
            }}
        />
      <Text>Home</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});