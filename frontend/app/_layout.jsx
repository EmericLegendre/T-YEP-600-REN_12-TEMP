import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false}}/>
      <Stack.Screen name="profile" options={{ headerShown: true }}/>

    </Stack>
  );
}


// export default function RootLayout() {
//   return (
//     <Stack>
//       <Stack.Screen name="index" />
//       <Stack.Screen name="explore" />
//       <Stack.Screen name="home" />
//       <Stack.Screen name="profile" />
//       <Stack.Screen name="register" />
//       <Stack.Screen name="login" />
//     </Stack>
//   );
// }