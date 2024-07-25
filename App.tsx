import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { countStep, distanceWalkAndRun } from "./src/modules";
import initHealthKit, {
  RecordFinalResult,
  TotalEnergyBurned,
  formatCalories,
  formatDistance,
  formatSteps,
} from "./src/modules/healthKit/healthKit";
import { numberFormat } from "./src/utils/numberFormat";
import { combineResults } from "./src/utils/healthFormat";

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

  const ExportRawData = async () => {
    const combinedarray: RecordFinalResult[] = (await formatSteps()).concat(
      await formatDistance(),
      await formatCalories()
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
