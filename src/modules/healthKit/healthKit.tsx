import AppleHealthKit, {
  HealthKitPermissions,
  HealthInputOptions,
  HealthUnit,
  HealthValue,
} from "react-native-health";
import {
  initialize,
  readRecords,
  revokeAllPermissions,
  requestPermission,
  getGrantedPermissions,
} from "react-native-health-connect";
import {
  Permission,
  RecordResult,
} from "react-native-health-connect/lib/typescript/types";
import {
  initialHealthKit,
  initialHealthKitAndroid,
  permissions,
} from "./permission";
import { numberFormat } from "../../utils/numberFormat";
import { Platform } from "react-native";
import { getHealthDataRecord } from "./healthKitAndroid";

// const pipe = require("./util");

const getMidnight = (): Date => {
  return new Date(new Date("2023-07-10").setHours(0, 0, 0, 0));
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

const healthKit = async (): Promise<boolean> => {
  if (Platform.OS === "ios") {
    return initialHealthKit();
  }
  return initialHealthKitAndroid();
};

export const countStep = async (): Promise<number> => {
  if (Platform.OS === "ios") {
    return new Promise<number>((resolve, reject) => {
      AppleHealthKit.getStepCount(options, (err, results) => {
        if (err) reject("Error getting steps");
        resolve(results.value);
      });
    });
  }

  const stepList = await getHealthDataRecord("Steps");
  return stepList.reduce((sum, cur) => sum + cur.count, 0);
};

export const distanceWalkAndRun = (): Promise<number> => {
  return new Promise<number>((resolve, reject) => {
    AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
      if (err) reject("Error getting daily steps");
      resolve(results.value);
    });
  });
};

export const energyBurned = (): Promise<HealthValue[]> => {
  return new Promise<HealthValue[]>((resolve, reject) => {
    AppleHealthKit.getActiveEnergyBurned(options, (err, results) => {
      if (err) reject("Error getting daily steps");
      resolve(results);
    });
  });
};

export const basalEnergyBurned = (): Promise<HealthValue[]> => {
  return new Promise<HealthValue[]>((resolve, reject) => {
    AppleHealthKit.getBasalEnergyBurned(options, (err, results) => {
      if (err) reject("Error getting daily steps");
      resolve(results);
    });
  });
};

export const getListStepCount = (): Promise<HealthValue[]> => {
  return new Promise<HealthValue[]>((resolve, reject) => {
    AppleHealthKit.getDailyStepCountSamples(options, (err, results) => {
      if (err) reject("Error getting daily steps");
      resolve(results);
    });
  });
};

export const getListDistanceWalkAndRun = (): Promise<HealthValue[]> => {
  return new Promise<HealthValue[]>((resolve, reject) => {
    AppleHealthKit.getDailyDistanceWalkingRunningSamples(
      options,
      (err, results) => {
        if (err) reject("Error getting daily distance samples");
        resolve(results);
      }
    );
  });
};

export const summaryHealthValue = (list: HealthValue[]) => {
  const totalBasalCalories = list.reduce((sum, cur) => sum + cur.value, 0);
  return totalBasalCalories;
};

export default healthKit;
