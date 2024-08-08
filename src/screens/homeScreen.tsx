import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { TotalEnergyBurned, countStep, distanceWalkAndRun } from "../modules";
import { styles, Value } from "../utils/styles";
import initHealthKit from "../modules/healthKit/healthKit";
import { numberFormat } from "../utils/numberFormat";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;
type Props = {
  navigation: ProfileScreenNavigationProp;
};

const HomeScreen = ({ navigation }: Props) => {
  const [steps, setSteps] = useState("0");
  const [distance, setDistance] = useState("0");
  const [totalCalories, setTotalCalories] = useState("0");

  const healthKitModule = async () => {
    const isAvailable = await initHealthKit();
    if (isAvailable) {
      setSteps(
        numberFormat(await countStep(), { style: "decimal", min: 0, max: 0 })
      );
      setDistance(
        numberFormat(await distanceWalkAndRun(), {
          style: "decimal",
          min: 0,
          max: 2,
        })
      );

      setTotalCalories(
        numberFormat(await TotalEnergyBurned(), {
          style: "decimal",
          min: 0,
          max: 0,
        })
      );
    }
  };

  useEffect(() => {
    healthKitModule();
  }, []);

  const onPressRefresh = async () => {
    await healthKitModule();
  };
  return (
    <View style={styles.box}>
      <View style={styles.container}>
        <Text style={styles.text}> Daily Progress </Text>
        <Value label="Steps" value={steps} />
        <Value label="Distance" value={`${distance} m `} />
        <Value label="Total Calories Burned" value={`${totalCalories} kcal `} />
        <View style={styles.button}>
          <Button
            title="Export Raw Data"
            onPress={() => {
              navigation.navigate("RawData");
            }}
            color="#006D03"
          />
          <Button title="Refresh" onPress={onPressRefresh} color="#006D03" />
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
