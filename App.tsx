import { StatusBar } from "expo-status-bar";
import RNRestart from "react-native-restart";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import AppleHealthKit, {
  HealthKitPermissions,
  HealthInputOptions,
  HealthUnit,
  HealthValue,
} from "react-native-health";
import { Platform } from "react-native";

import {
  initialize,
  requestPermission,
  readRecords,
  revokeAllPermissions,
  getGrantedPermissions,
} from "react-native-health-connect";
import {
  Permission,
  RecordResult,
} from "react-native-health-connect/lib/typescript/types";
import { TimeRangeFilter } from "react-native-health-connect/lib/typescript/types/base.types";
import {
  countStep,
  distanceWalkAndRun,
  getListDistanceWalkAndRun,
  healthKit,
} from "./src/modules";

const pipe = require("./util");

const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.BasalEnergyBurned,
    ],
    write: [],
  },
};

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

const getMidnight = (): Date => {
  return new Date(new Date("2023-07-10").setHours(0, 0, 0, 0));
};

const getTodayDate = (): Date => {
  return new Date();
};

export default function App() {
  /* AppleHealthKit.isAvailable(() => {}); */

  // IOS
  if (Platform.OS === "ios") {
    const [hasPermissions, setHasPermission] = useState(false);
    const [steps, setSteps] = useState("0");
    const [distance, setDistance] = useState("0");
    const [active, setActive] = useState(0);
    const [basal, setBasalCalories] = useState(0);
    const [totalCalories, setTotalCalories] = useState("0");

    const healthvalue: HealthValue[] = [];
    const [stepsData, setStepsData] = useState(healthvalue);
    const [distanceData, setDistanceData] = useState(healthvalue);
    const [activeData, setActiveData] = useState(healthvalue);
    const [basalData, setBasalData] = useState(healthvalue);

    const healthKitModule = async () => {
      const isAvailable = await healthKit();
      if (isAvailable) {
        await countStep();
        await distanceWalkAndRun();
        const res = await getListDistanceWalkAndRun();
        console.log(res);
      }
    };

    useEffect(() => {
      healthKitModule();
    }, []);
    // useEffect(() => {
    //   if (Platform.OS !== "ios") {
    //     return;
    //   }
    //   AppleHealthKit.isAvailable((err, isAvaliable) => {
    //     if (err) {
    //       console.log("error checking availability");
    //       return;
    //     }
    //     if (!isAvaliable) {
    //       console.log("Apple Health NOT AVAILABLE");
    //       return;
    //     }
    //     AppleHealthKit.initHealthKit(permissions, (err) => {
    //       if (err) {
    //         console.log("Error getting permissions");
    //         return;
    //       }
    //       setHasPermission(true);
    //     });
    //   });
    // }, []);

    // useEffect(() => {
    //   if (!hasPermissions) {
    //     return;
    //   }

    //   const options: HealthInputOptions = {
    //     startDate: getMidnight().toISOString(),
    //     endDate: getTodayDate().toISOString(),
    //     ascending: true,
    //     period: 60,
    //     /*includeManuallyAdded: false, */
    //   };
    //   AppleHealthKit.getStepCount(options, (err, results) => {
    //     if (err) {
    //       console.log("Error getting steps");
    //     }

    //     setSteps(results.value.toLocaleString("en-US", options));
    //     // console.log(results);
    //   });

    //   AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
    //     if (err) {
    //       console.log("Error getting distance samples");
    //     }
    //     const options = {
    //       style: "decimal",
    //       minimumFractionDigits: 0,
    //       maximumFractionDigits: 2,
    //     };
    //     setDistance(results.value.toLocaleString("en-US", options));
    //   });

    //   AppleHealthKit.getActiveEnergyBurned(options, (err, results) => {
    //     if (err) {
    //       console.log("Error getting active energy");
    //     }
    //     // console.log("active calories:", results);
    //     const totalActiveCalories = results.reduce(
    //       (sum, cur) => sum + cur.value,
    //       0
    //     );
    //     // setTotalCalories(totalActiveCalories.toLocaleString());
    //     setActive(totalActiveCalories);
    //     setActiveData(results);
    //   });

    //   AppleHealthKit.getBasalEnergyBurned(options, (err, results) => {
    //     if (err) {
    //       console.log("Error getting basal energy");
    //     }
    //     // console.log("daily resting energy samples:", results);
    //     const totalBasalCalories = results.reduce(
    //       (sum, cur) => sum + cur.value,
    //       0
    //     );

    //     // const totalCalories = totalBasalCalories + +active;
    //     setBasalCalories(totalBasalCalories);
    //     setBasalData(results);
    //   });
    //   AppleHealthKit.getDailyStepCountSamples(options, (err, results) => {
    //     if (err) {
    //       console.log("Error getting daily steps");
    //     }
    //     // console.log("daily step count:", results);
    //     setStepsData(results);
    //   });
    //   AppleHealthKit.getDailyDistanceWalkingRunningSamples(
    //     options,
    //     (err, results) => {
    //       if (err) {
    //         console.log("Error getting daily distance samples");
    //       }
    //       console.log("results", err, results);
    //       // console.log("daily distance samples:", results);
    //       setDistanceData(results);
    //     }
    //   );
    // }, [hasPermissions]);

    const waiting = async () => {
      await active;
      await basal;
      await stepsData;
      await distanceData;
      await activeData;
      await basalData;
      const style = {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      };
      setTotalCalories((active + basal).toLocaleString("en-US", style));
    };
    waiting();

    interface RecordData {
      startDate: string;
      endDate: string;
      value: number;
    }
    const formatStepsData = (steps: RecordData[]) => {
      return steps.map((d) => ({
        calories: 0,
        distance: 0,
        stepCount: d.value,
        from: d.startDate,
        to: d.endDate,
        period:
          (new Date(d.endDate).getTime() - new Date(d.startDate).getTime()) /
          1000,
        location: null,
      }));
    };

    const formatDistanceData = (distance: RecordData[]) => {
      return distance.map((d) => ({
        calories: 0,
        distance: d.value,
        stepCount: 0,
        from: d.startDate,
        to: d.endDate,
        period:
          (new Date(d.endDate).getTime() - new Date(d.startDate).getTime()) /
          1000,
        location: null,
      }));
    };

    const formatCaloriesData = (calories: RecordData[]) => {
      return calories.map((d) => ({
        calories: d.value,
        distance: 0,
        stepCount: 0,
        from: d.startDate,
        to: d.endDate,
        period:
          (new Date(d.endDate).getTime() - new Date(d.startDate).getTime()) /
          1000,
        location: null,
      }));
    };

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
      RNRestart.Restart();
    };

    const ExportRawDataIOS = async () => {
      interface DailySteps {
        startDate: Date;
        endDate: Date;
        value: number;
      }

      // console.log("stepsData:", stepsData);
      // console.log("distanceData:", distanceData);

      const stepsresult = formatStepsData(stepsData);
      const distanceresult = formatDistanceData(distanceData);
      const combinedcalories: HealthValue[] = activeData.concat(basalData);
      const caloriesresult = formatCaloriesData(combinedcalories);
      // console.log("formatted stepsData:", JSON.stringify(stepsresult));
      // console.log("formatted distanceData:", JSON.stringify(distanceresult));
      // console.log("formatted caloriesData:", JSON.stringify(caloriesresult));

      const combinedarray: RecordFinalResult[] = caloriesresult.concat(
        stepsresult,
        distanceresult
      );

      let result = Object.values(
        combinedarray.reduce(
          (
            a: any,
            { calories, distance, stepCount, from, to, period, location }
          ) => {
            if (!a[from])
              a[from] = Object.assign(
                {},
                { calories, distance, stepCount, from, to, period, location }
              );
            else {
              a[from].calories += calories;
              a[from].distance += distance;
              a[from].stepCount += stepCount;
            }
            return a;
          },
          {}
        )
      );
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
          <Value
            label="Total Calories Burned"
            value={`${totalCalories} kcal `}
          />

          <View style={styles.button}>
            <Button
              title="Export Raw Data"
              onPress={ExportRawDataIOS}
              color="#006D03"
            />
            <Button title="Refresh" onPress={onPressRefresh} color="#006D03" />
          </View>
        </View>
      </View>
    );
  }

  // const useHealthData = () => {

  //ANDROID

  // const [initialStatus, setinitialStatus] = useState(false);
  else if (Platform.OS === "android") {
    const [steps, setSteps] = useState("0");
    const [distance, setDistance] = useState("0");
    const [totalcalories, setTotalCalories] = useState("0");
    const verifyPermission = (
      userPermissions: Permission[],
      requirePermissions: Permission[]
    ): Boolean => {
      const permissionStatus = [];

      for (const pl of requirePermissions) {
        let foundStatus = false;

        for (const pu of userPermissions) {
          if (
            pu.accessType === pl.accessType &&
            pu.recordType === pl.recordType
          ) {
            foundStatus = true;
          }
        }

        permissionStatus.push(foundStatus);
      }

      return permissionStatus.every((ps) => ps);
    };

    const appRequirePermissions: Permission[] = [
      { accessType: "read", recordType: "Steps" },
      { accessType: "read", recordType: "Distance" },
      { accessType: "read", recordType: "TotalCaloriesBurned" },
    ];

    const requestHealthConnectPermission = async () => {
      const initialStatus = await initialize();

      // console.log('initialStatus:', initialStatus);

      if (!initialStatus) {
        console.error("initial Health Connect error");
      } else {
        const userPermission = await getGrantedPermissions();

        // console.log('userPermission:', JSON.stringify(userPermission));

        const verifyStatus = verifyPermission(
          userPermission,
          appRequirePermissions
        );

        if (verifyStatus === false) {
          // console.log('need to grant new permissions');
          try {
            revokeAllPermissions();
            const requestedPermission = await requestPermission(
              appRequirePermissions
            );
            const grantedPermission = await getGrantedPermissions();
            console.log(
              "requested permission:",
              JSON.stringify(requestedPermission)
            );
            // console.log('granted permission:', JSON.stringify(grantedPermission));
          } catch (error) {
            // console.log('requestPermission error:', error);
          }
        }

        // console.log('end');
      }
    };

    const getStepsData = async (startDate: string, endDate: string) => {
      return await readRecords("Steps", {
        timeRangeFilter: {
          operator: "between",
          startTime: startDate,
          endTime: endDate,
        },
      });
    };

    const getDistanceData = async (startDate: string, endDate: string) => {
      return await readRecords("Distance", {
        timeRangeFilter: {
          operator: "between",
          startTime: startDate,
          endTime: endDate,
        },
      });
    };

    const getCaloriesData = async (startDate: string, endDate: string) => {
      return await readRecords("TotalCaloriesBurned", {
        timeRangeFilter: {
          operator: "between",
          startTime: startDate,
          endTime: endDate,
        },
      });
    };

    useEffect(() => {
      const getStepsNow = async () => {
        const steps = await readRecords("Steps", {
          timeRangeFilter: {
            operator: "between",
            startTime: getMidnight().toISOString(),
            endTime: getTodayDate().toISOString(),
          },
        });

        // console.log(steps);
        const totalSteps = steps.reduce((sum, cur) => sum + cur.count, 0);
        setSteps(totalSteps.toLocaleString("en-US"));
      };

      const getDistanceNow = async () => {
        const distance = await readRecords("Distance", {
          timeRangeFilter: {
            operator: "between",
            startTime: getMidnight().toISOString(),
            endTime: getTodayDate().toISOString(),
          },
        });
        const totalDistance = distance.reduce(
          (sum, cur) => sum + cur.distance.inMeters,
          0
        );
        const options = {
          style: "decimal",
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        };
        setDistance(totalDistance.toLocaleString("en-US", options));
      };

      const getCaloriesNow = async () => {
        const calories = await readRecords("TotalCaloriesBurned", {
          timeRangeFilter: {
            operator: "between",
            startTime: getMidnight().toISOString(),
            endTime: getTodayDate().toISOString(),
          },
        });
        const totalCalories = calories.reduce(
          (sum, cur) => sum + cur.energy.inKilocalories,
          0
        );
        const options = {
          style: "decimal",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        };
        setTotalCalories(totalCalories.toLocaleString("en-US", options));
      };
      getStepsNow();
      getDistanceNow();
      getCaloriesNow();
    }, [steps, distance, totalcalories]);

    interface RecordStep {
      source: string;
      period: number;
      startDate: string;
      endDate: string;
      count: number;
    }

    interface RecordDistance {
      source: string;
      period: number;
      startDate: string;
      endDate: string;
      count: number;
    }

    interface RecordCalories {
      source: string;
      period: number;
      startDate: string;
      endDate: string;
      count: number;
    }

    const formatRawStepsToSteps = (
      rawSteps: RecordResult<"Steps">[]
    ): RecordStep[] => {
      return rawSteps.map((d) => ({
        source: d.metadata ? d.metadata.dataOrigin : "",
        startDate: d.startTime,
        endDate: d.endTime,
        count: d.count,
        period: 0,
      }));
    };

    const formatRawDistanceToDistance = (
      rawDistance: RecordResult<"Distance">[]
    ): RecordDistance[] => {
      return rawDistance.map((d) => ({
        source: d.metadata ? d.metadata.dataOrigin : "",
        startDate: d.startTime,
        endDate: d.endTime,
        count: d.distance.inMeters,
        period: 0,
      }));
    };

    const formatRawCaloriesToCalories = (
      rawCalories: RecordResult<"TotalCaloriesBurned">[]
    ): RecordCalories[] => {
      return rawCalories.map((d) => ({
        source: d.metadata ? d.metadata.dataOrigin : "",
        startDate: d.startTime,
        endDate: d.endTime,
        count: d.energy.inKilocalories,
        period: 0,
      }));
    };

    const extractStepsGroupByMinutes = (steps: RecordStep[]): RecordStep[] => {
      const result: RecordStep[] = [];

      steps.forEach((entry) => {
        const source = entry.source;
        const startTime = new Date(entry.startDate);
        startTime.setSeconds(0, 0);

        const endTime = new Date(entry.endDate);
        endTime.setSeconds(59, 599);

        const count = entry.count;
        const minutes = Math.ceil((+endTime - +startTime) / 60000);
        const countPerMinute = +(count / minutes).toFixed(5);
        //console.log('minutes:', minutes);

        for (let i = 0; i < minutes; i++) {
          const minuteStartTime = new Date(startTime.getTime() + i * 60000);
          const minuteEndTime = new Date(startTime.getTime() + (i + 1) * 60000);

          result.push({
            source: source,
            startDate: minuteStartTime.toISOString(),
            endDate: minuteEndTime.toISOString(),
            count: countPerMinute,
            period: 60,
          });
        }
      });

      return result;
    };

    const extractDistanceGroupByMinutes = (
      distance: RecordDistance[]
    ): RecordDistance[] => {
      const result: RecordDistance[] = [];

      distance.forEach((entry) => {
        const source = entry.source;
        const startTime = new Date(entry.startDate);
        startTime.setSeconds(0, 0);

        const endTime = new Date(entry.endDate);
        endTime.setSeconds(59, 599);

        const count = entry.count;
        const minutes = Math.ceil((+endTime - +startTime) / 60000);
        const countPerMinute = +(count / minutes).toFixed(5);

        for (let i = 0; i < minutes; i++) {
          const minuteStartTime = new Date(startTime.getTime() + i * 60000);
          const minuteEndTime = new Date(startTime.getTime() + (i + 1) * 60000);

          result.push({
            source: source,
            startDate: minuteStartTime.toISOString(),
            endDate: minuteEndTime.toISOString(),
            count: countPerMinute,
            period: 60,
          });
        }
      });

      return result;
    };

    const extractCaloriesGroupByMinutes = (
      calories: RecordCalories[]
    ): RecordCalories[] => {
      const result: RecordCalories[] = [];

      calories.forEach((entry) => {
        const source = entry.source;
        const startTime = new Date(entry.startDate);
        startTime.setSeconds(0, 0);

        const endTime = new Date(entry.endDate);
        endTime.setSeconds(59, 599);

        const count = entry.count;
        const minutes = Math.ceil((+endTime - +startTime) / 60000);
        const countPerMinute = +(count / minutes).toFixed(5);

        for (let i = 0; i < minutes; i++) {
          const minuteStartTime = new Date(startTime.getTime() + i * 60000);
          const minuteEndTime = new Date(startTime.getTime() + (i + 1) * 60000);

          result.push({
            source: source,
            startDate: minuteStartTime.toISOString(),
            endDate: minuteEndTime.toISOString(),
            count: countPerMinute,
            period: 60,
          });
        }
      });

      return result;
    };

    const mergeStepsGroupByHours = (steps: RecordStep[]): RecordStep[] => {
      // const groupedData: Record<string, RecordStep> = {};
      const groupedData: any = {};

      steps.forEach((entry) => {
        const startTime = new Date(entry.startDate);
        const hourStart = new Date(startTime);
        hourStart.setMinutes(0, 0, 0);
        const hourStartStr = hourStart.toISOString();

        if (!groupedData[hourStartStr]) {
          groupedData[hourStartStr] = {
            source: entry.source,
            period: 0,
            startDate: hourStartStr,
            endDate: new Date(
              hourStart.getTime() + 3600 * 1000 - 1
            ).toISOString(),
            count: 0,
          };
        }

        groupedData[hourStartStr].count = +(
          groupedData[hourStartStr].count + entry.count
        ).toFixed(5);
        // groupedData[hourStartStr].period += 60;
        groupedData[hourStartStr].period = +(
          (new Date(hourStart.getTime() + 3600 * 1000 - 1).getTime() -
            hourStart.getTime()) /
          1000
        ).toFixed(0);
      });

      return Object.values(groupedData) as RecordDistance[];
    };

    const mergeDistanceGroupByHours = (
      distance: RecordDistance[]
    ): RecordDistance[] => {
      // const groupedData: Record<string, RecordStep> = {};
      const groupedData: any = {};

      distance.forEach((entry) => {
        const startTime = new Date(entry.startDate);
        const hourStart = new Date(startTime);
        hourStart.setMinutes(0, 0, 0);
        const hourStartStr = hourStart.toISOString();

        if (!groupedData[hourStartStr]) {
          groupedData[hourStartStr] = {
            source: entry.source,
            period: 0,
            startDate: hourStartStr,
            endDate: new Date(
              hourStart.getTime() + 3600 * 1000 - 1
            ).toISOString(),
            count: 0,
          };
        }

        groupedData[hourStartStr].count = +(
          groupedData[hourStartStr].count + entry.count
        ).toFixed(5);
        // groupedData[hourStartStr].period += 60;
        groupedData[hourStartStr].period = +(
          (new Date(hourStart.getTime() + 3600 * 1000 - 1).getTime() -
            hourStart.getTime()) /
          1000
        ).toFixed(0);
      });

      return Object.values(groupedData) as RecordDistance[];
    };

    const mergeCaloriesGroupByHours = (
      calories: RecordCalories[]
    ): RecordCalories[] => {
      // const groupedData: Record<string, RecordStep> = {};
      const groupedData: any = {};

      calories.forEach((entry) => {
        const startTime = new Date(entry.startDate);
        const hourStart = new Date(startTime);
        hourStart.setMinutes(0, 0, 0);
        const hourStartStr = hourStart.toISOString();

        if (!groupedData[hourStartStr]) {
          groupedData[hourStartStr] = {
            source: entry.source,
            period: 0,
            startDate: hourStartStr,
            endDate: new Date(
              hourStart.getTime() + 3600 * 1000 - 1
            ).toISOString(),
            count: 0,
          };
        }

        groupedData[hourStartStr].count = +(
          groupedData[hourStartStr].count + entry.count
        ).toFixed(5);

        groupedData[hourStartStr].period = +(
          (new Date(hourStart.getTime() + 3600 * 1000 - 1).getTime() -
            hourStart.getTime()) /
          1000
        ).toFixed(0);
      });

      return Object.values(groupedData) as RecordCalories[];
    };
    const cleanupSteps = (steps: RecordStep[]) => {
      return steps.map((d) => ({ ...d, count: +d.count.toFixed(0) }));
    };
    const cleanupDistance = (distance: RecordDistance[]) => {
      return distance.map((d) => ({ ...d, count: +d.count.toFixed(2) }));
    };

    const cleanupCalories = (calories: RecordCalories[]) => {
      return calories.map((d) => ({ ...d, count: +d.count.toFixed(0) }));
    };

    const formatStepsToTrackingData = (steps: RecordStep[]) => {
      return steps.map((d) => ({
        calories: 0,
        distance: 0,
        stepCount: d.count,
        from: d.startDate,
        to: d.endDate,
        period: d.period,
        location: null,
      }));
    };

    const formatDistanceToTrackingData = (distance: RecordDistance[]) => {
      return distance.map((d) => ({
        calories: 0,
        distance: d.count,
        stepCount: 0,
        from: d.startDate,
        to: d.endDate,
        period: d.period,
        location: null,
      }));
    };

    const formatCaloriesToTrackingData = (calories: RecordCalories[]) => {
      return calories.map((d) => ({
        calories: d.count,
        distance: 0,
        stepCount: 0,
        from: d.startDate,
        to: d.endDate,
        period: d.period,
        location: null,
      }));
    };

    const onButtonClick = async () => {
      // console.log('clicked');
      const startDate = getMidnight().toISOString();
      const endDate = getTodayDate().toISOString();

      // initialize

      // check permission
      await requestHealthConnectPermission();

      // get step data
      const rawSteps = await getStepsData(startDate, endDate);
      const rawDistance = await getDistanceData(startDate, endDate);
      const rawCalories = await getCaloriesData(startDate, endDate);

      // console.log('rawSteps:', JSON.stringify(rawSteps));

      const calculateSteps = pipe(
        formatRawStepsToSteps,
        extractStepsGroupByMinutes,
        mergeStepsGroupByHours,
        cleanupSteps,
        formatStepsToTrackingData
      );

      const calculateDistance = pipe(
        formatRawDistanceToDistance,
        extractDistanceGroupByMinutes,
        mergeDistanceGroupByHours,
        cleanupDistance,
        formatDistanceToTrackingData
      );

      const calculateCalories = pipe(
        formatRawCaloriesToCalories,
        extractCaloriesGroupByMinutes,
        mergeCaloriesGroupByHours,
        cleanupCalories,
        formatCaloriesToTrackingData
      );

      const steps = await calculateSteps(rawSteps);
      const distance = await calculateDistance(rawDistance);
      const calories = await calculateCalories(rawCalories);

      // console.log('raw distance:', JSON.stringify(rawDistance));
      // console.log('raw calories:', JSON.stringify(rawCalories));

      // format data
      // print formatted data

      // console.log("steps:", JSON.stringify(steps));
      // console.log('distance:', JSON.stringify(distance));
      // console.log("calories:", JSON.stringify(calories));

      interface Results {
        calories: number;
        distance: number;
        stepCount: number;
        from: string;
        to: string;
        period: number;
        location: string;
      }

      const combinedarray: Results[] = [].concat(calories, steps, distance);
      // console.log("Combined Array:", JSON.stringify(combinedarray));

      let result = Object.values(
        combinedarray.reduce(
          (
            a: any,
            { calories, distance, stepCount, from, to, period, location }
          ) => {
            if (!a[from])
              a[from] = Object.assign(
                {},
                { calories, distance, stepCount, from, to, period, location }
              );
            else {
              a[from].calories += calories;
              a[from].distance += distance;
              a[from].stepCount += stepCount;
            }
            return a;
          },
          {}
        )
      );

      const sortedresults = result.sort(
        (a: any, b: any) =>
          new Date(a.from).getTime() - new Date(b.from).getTime()
      );

      console.log("results:", JSON.stringify(sortedresults));
    };

    const onPressRefresh = async () => {
      RNRestart.Restart();
    };

    requestHealthConnectPermission();

    return (
      <View style={styles.box}>
        <View style={styles.container}>
          <Text style={styles.text}> Daily Progress </Text>
          <Value label="Steps" value={steps} />
          <Value label="Distance" value={`${distance} m `} />
          <Value
            label="Total Calories Burned"
            value={`${totalcalories} kcal `}
          />
          <View style={styles.button}>
            <Button
              title="Export Raw Data"
              onPress={onButtonClick}
              color="#006D03"
            />
            <Button title="Refresh" onPress={onPressRefresh} color="#006D03" />
          </View>
        </View>
      </View>
    );
  }
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
