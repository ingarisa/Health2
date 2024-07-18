import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Platform } from "react-native";
import {
  countStep,
  distanceWalkAndRun,
  getListDistanceWalkAndRun,
} from "./src/modules";
import initHealthKit, {
  basalEnergyBurned,
  energyBurned,
  getListCaloriesAndroid,
  getListStepCount,
  getListStepCountAndroid,
  getListWalkAndRunAndroid,
  sumHealthValue,
  totalEnergyBurned,
} from "./src/modules/healthKit/healthKit";
import { numberFormat } from "./src/utils/numberFormat";
import {
  combineResults,
  formatCaloriesData,
  formatDistanceData,
  formatStepsData,
} from "./src/utils/healthFormat";
import {
  calculateCaloriesData,
  calculateDistanceData,
  calculateStepsData,
} from "./src/modules/healthKit/healthKitAndroid";

type Valueprop = {
  label: string;
  value: string;
};

const Value = ({ label, value }: Valueprop) => (
  <View style={styles.valuecontainer}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default function App() {
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

      if (Platform.OS === "ios") {
        const sumActiveEnergy = sumHealthValue(await energyBurned());
        const sumBasalEnergy = sumHealthValue(await basalEnergyBurned());
        setTotalCalories(
          numberFormat(sumActiveEnergy + sumBasalEnergy, {
            style: "decimal",
            min: 0,
            max: 0,
          })
        );
      }

      if (Platform.OS === "android") {
        setTotalCalories(
          numberFormat(await totalEnergyBurned(), {
            style: "decimal",
            min: 0,
            max: 0,
          })
        );
      }
    }
  };

  useEffect(() => {
    healthKitModule();
  }, []);
  interface RecordFinalResult {
    calories: number;
    distance: number;
    stepCount: number;
    from: string;
    to: string;
    period: number;
    location: string | null;
  }

  const onPressRefresh = async () => {
    await healthKitModule();
  };

  const ExportRawData = async () => {
    if (Platform.OS === "ios") {
      var stepsresult = formatStepsData(await getListStepCount());
      var distanceresult = formatDistanceData(
        await getListDistanceWalkAndRun()
      );
      var caloriesresult = formatCaloriesData(
        (await energyBurned()).concat(await basalEnergyBurned())
      );
    } else {
      // android
      stepsresult = await calculateStepsData(await getListStepCountAndroid());
      distanceresult = await calculateDistanceData(
        await getListWalkAndRunAndroid()
      );
      caloriesresult = await calculateCaloriesData(
        await getListCaloriesAndroid()
      );
    }

    const combinedarray: RecordFinalResult[] = caloriesresult.concat(
      stepsresult,
      distanceresult
    );

    const result = combineResults(combinedarray);
    const sortedresults = result.sort(
      (a: any, b: any) =>
        new Date(a.from).getTime() - new Date(b.from).getTime()
    );
    console.log("final result:", JSON.stringify(sortedresults));
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
            onPress={ExportRawData}
            color="#006D03"
          />
          <Button title="Refresh" onPress={onPressRefresh} color="#006D03" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    justifyContent: "center",
    flex: 1,
  },
  button: {
    rowGap: 20,
    marginTop: 60,
  },
  text: {
    fontSize: 40,
    fontWeight: "700",
    color: "#006D03",
    marginBottom: 40,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    rowGap: 20,
    backgroundColor: "#fff",
  },

  valuecontainer: {
    alignItems: "center",
    marginVertical: 7,
  },
  label: {
    fontSize: 20,
    color: "#588550",
  },
  value: {
    fontSize: 40,
    fontWeight: "500",
    color: "#006D03",
  },
});
