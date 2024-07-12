import React from "react";
import { Text, View } from "react-native";
import { healthKit } from "../modules";

const HomeScreen = () => {
  healthKit();
  return (
    <View>
      <Text>Home screen</Text>
    </View>
  );
};

export default HomeScreen;
