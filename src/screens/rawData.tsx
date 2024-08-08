import { View, TextInput, Text, Button } from "react-native";
import { styles } from "../utils/styles";
import { formatSteps, formatDistance, formatCalories } from "../modules";
import { RecordFinalResult, combineResults } from "../utils/healthFormat";
import { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "RawData"
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export const RawData = ({ navigation }: Props) => {
  const [exportData, setExportData] = useState("");
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
    setExportData(JSON.stringify(sortedresults));
  };

  useEffect(() => {
    ExportRawData();
  }, []);

  return (
    <View style={styles.box}>
      <Text style={styles.text}> Exported Data </Text>
      <View style={styles.exportdata}>
        <TextInput
          style={styles.input}
          value={exportData}
          placeholder="Export Data"
          placeholderTextColor={"#638264"}
          multiline={true}
          showSoftInputOnFocus={false}
        />
        <View style={styles.home}>
          <Button
            title="Home"
            onPress={() => {
              navigation.navigate("Home");
            }}
            color="#006D03"
          />
        </View>
      </View>
    </View>
  );
};
