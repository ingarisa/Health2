import AppleHealthKit, {
  HealthInputOptions,
  HealthValue,
} from "react-native-health";
import { initialHealthKit, initialHealthKitAndroid } from "./permission";
import { Platform } from "react-native";
import { getHealthDataRecord } from "./healthKitAndroid";

// const pipe = require("./util");

const getMidnight = (): Date => {
  return new Date(new Date().setHours(0, 0, 0, 0));
};
const getTodayDate = (): Date => {
  return new Date();
};
const options: HealthInputOptions = {
  startDate: getMidnight().toISOString(),
  endDate: getTodayDate().toISOString(),
  ascending: true,
  period: 60,
  /*includeManuallyAdded: false, */
};

const initHealthKit = async (): Promise<boolean> => {
  if (Platform.OS === "ios") {
    return initialHealthKit();
  }
  return initialHealthKitAndroid();
};

export const countStep = async (): Promise<number> => {
  // get sum of steps for display
  if (Platform.OS === "ios") {
    return new Promise<number>((resolve, reject) => {
      AppleHealthKit.getStepCount(options, (err, results) => {
        if (err) reject("Error getting display steps");
        resolve(results.value);
      });
    });
  }

  const stepList = await getHealthDataRecord("Steps");
  return stepList.reduce((sum, cur) => sum + cur.count, 0);
};

export const distanceWalkAndRun = async (): Promise<number> => {
  // get sum of distance for display
  if (Platform.OS === "ios") {
    return new Promise<number>((resolve, reject) => {
      AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
        if (err) reject("Error getting display distance");
        resolve(results.value);
      });
    });
  }

  const result = await getHealthDataRecord("Distance");
  return result.reduce((sum, cur) => sum + cur.distance.inMeters, 0);
};

export const energyBurned = async (): Promise<HealthValue[]> => {
  //get array of active energy
  return new Promise<HealthValue[]>((resolve, reject) => {
    AppleHealthKit.getActiveEnergyBurned(options, (err, results) => {
      if (err) reject("Error getting active energy list");
      resolve(results);
    });
  });
};

export const basalEnergyBurned = (): Promise<HealthValue[]> => {
  // get array of basal energy
  return new Promise<HealthValue[]>((resolve, reject) => {
    AppleHealthKit.getBasalEnergyBurned(options, (err, results) => {
      if (err) reject("Error getting basal energy list");
      resolve(results);
    });
  });
};

export const totalEnergyBurned = async () => {
  // android
  const result = await getHealthDataRecord("TotalCaloriesBurned");
  return result.reduce((sum, cur) => sum + cur.energy.inKilocalories, 0);
};

export const getListCaloriesAndroid = async () => {
  return await getHealthDataRecord("TotalCaloriesBurned");
};

export const getListStepCount = async (): Promise<HealthValue[]> => {
  // get array of steps
  return new Promise<HealthValue[]>((resolve, reject) => {
    AppleHealthKit.getDailyStepCountSamples(options, (err, results) => {
      if (err) reject("Error getting steps list");
      resolve(results);
    });
  });
};

export const getListStepCountAndroid = async () => {
  return await getHealthDataRecord("Steps");
};

export const getListDistanceWalkAndRun = async (): Promise<HealthValue[]> => {
  // get array of distance
  //   if (Platform.OS === "ios") {
  return new Promise<HealthValue[]>((resolve, reject) => {
    AppleHealthKit.getDailyDistanceWalkingRunningSamples(
      options,
      (err, results) => {
        if (err) reject("Error getting distance list");
        resolve(results);
      }
    );
  });
  //   }
};

export const getListWalkAndRunAndroid = async () => {
  return await getHealthDataRecord("Distance");
};

export const sumHealthValue = (list: HealthValue[]) => {
  const totalValue = list.reduce((sum, cur) => sum + cur.value, 0);
  return totalValue;
};

export default initHealthKit;
