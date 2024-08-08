import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/homeScreen";
import { RawData } from "./src/screens/rawData";

export type RootStackParamList = {
  Home: undefined;
  RawData: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RawData" component={RawData} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
