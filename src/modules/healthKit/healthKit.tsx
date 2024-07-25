import AppleHealthKit, {
  HealthInputOptions,
  HealthValue,
} from "react-native-health";
import { initialHealthKit, initialHealthKitAndroid } from "./permission";
import { Platform } from "react-native";
import {
  calculateCaloriesData,
  calculateDistanceData,
  calculateStepsData,
  getHealthDataRecord,
} from "./healthKitAndroid";
import {
  formatCaloriesData,
  formatDistanceData,
  formatStepsData,
} from "../../utils/healthFormat";

type RecordFinalResult = {
  calories: number;
  distance: number;
  stepCount: number;
  from: string;
  to: string;
  period: number;
  location: string | null;
};

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
  // initialize health kit
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

export const TotalEnergyBurned = async () => {
  // get sum of calories for display
  if (Platform.OS == "ios") {
    const sumActiveEnergy = sumHealthValue(await energyBurned());
    const sumBasalEnergy = sumHealthValue(await basalEnergyBurned());
    return sumActiveEnergy + sumBasalEnergy;
  }

  const result = await getHealthDataRecord("TotalCaloriesBurned");
  return result.reduce((sum, cur) => sum + cur.energy.inKilocalories, 0);
};

export const basalEnergyBurned = async (): Promise<HealthValue[]> => {
  // get array of basal energy
  return new Promise<HealthValue[]>((resolve, reject) => {
    AppleHealthKit.getBasalEnergyBurned(options, (err, results) => {
      if (err) reject("Error getting basal energy list");
      resolve(results);
    });
  });
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

export const getListCaloriesIOS = async (): Promise<HealthValue[]> => {
  // get array sum of basal and active calories
  const basal = await basalEnergyBurned();
  const energy = await energyBurned();
  return basal.concat(energy);
};

export const getListCaloriesAndroid = async () => {
  // get array of total calories burned
  return await getHealthDataRecord("TotalCaloriesBurned");
};

// export const getCalories = async (): Promise<
//   Omit<HealthValue, "id" | "metadata">[]
// > => {
//   if (Platform.OS === "ios") {
//     return await getListCaloriesIOS();
//   }
//   return await getListCaloriesAndroid();
// };

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
  // get array of steps android
  return await getHealthDataRecord("Steps");
};

export const getListDistanceWalkAndRun = async (): Promise<HealthValue[]> => {
  // get array of distance
  return new Promise<HealthValue[]>((resolve, reject) => {
    AppleHealthKit.getDailyDistanceWalkingRunningSamples(
      options,
      (err, results) => {
        if (err) reject("Error getting distance list");
        resolve(results);
      }
    );
  });
};

export const getListWalkAndRunAndroid = async () => {
  // get array of distance
  return await getHealthDataRecord("Distance");
};

export const sumHealthValue = (list: HealthValue[]) => {
  // used to get sum of value for display
  const totalValue = list.reduce((sum, cur) => sum + cur.value, 0);
  return totalValue;
};

export default initHealthKit;

// format data for final result
export const formatSteps = async (): Promise<RecordFinalResult[]> => {
  if (Platform.OS == "ios") {
    return formatStepsData(await getListStepCount());
  }
  return await calculateStepsData(await getListStepCountAndroid());
};

export const formatDistance = async (): Promise<RecordFinalResult[]> => {
  if (Platform.OS == "ios") {
    return formatDistanceData(await getListDistanceWalkAndRun());
  }
  return await calculateDistanceData(await getListWalkAndRunAndroid());
};

export const formatCalories = async (): Promise<RecordFinalResult[]> => {
  if (Platform.OS == "ios") {
    formatCaloriesData(await getListCaloriesIOS());
  }
  return await calculateCaloriesData(await getListCaloriesAndroid());
};
