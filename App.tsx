import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { countStep, distanceWalkAndRun } from "./src/modules";
import initHealthKit, {
  TotalEnergyBurned,
  formatCalories,
  formatDistance,
  formatSteps,
} from "./src/modules/healthKit/healthKit";
import { numberFormat } from "./src/utils/numberFormat";
import { RecordFinalResult, combineResults } from "./src/utils/healthFormat";
import { Value, styles } from "./src/utils/styles";

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
