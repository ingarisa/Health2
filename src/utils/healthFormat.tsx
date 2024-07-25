export type RecordFinalResult = {
  calories: number;
  distance: number;
  stepCount: number;
  from: string;
  to: string;
  period: number;
  location: string | null;
};

// IOS
type RecordData = {
  startDate: string;
  endDate: string;
  value: number;
};
export const formatStepsData = (steps: RecordData[]) => {
  return steps.map((d) => ({
    calories: 0,
    distance: 0,
    stepCount: parseFloat(d.value.toFixed(0)),
    from: d.startDate,
    to: d.endDate,
    period:
      (new Date(d.endDate).getTime() - new Date(d.startDate).getTime()) / 1000,
    location: null,
  }));
};

export const formatDistanceData = (distance: RecordData[]) => {
  return distance.map((d) => ({
    calories: 0,
    distance: parseFloat(d.value.toFixed(2)),
    stepCount: 0,
    from: d.startDate,
    to: d.endDate,
    period:
      (new Date(d.endDate).getTime() - new Date(d.startDate).getTime()) / 1000,
    location: null,
  }));
};

export const formatCaloriesData = (calories: RecordData[]) => {
  return calories.map((d) => ({
    calories: parseFloat(d.value.toFixed(0)),
    distance: 0,
    stepCount: 0,
    from: d.startDate,
    to: d.endDate,
    period:
      (new Date(d.endDate).getTime() - new Date(d.startDate).getTime()) / 1000,
    location: null,
  }));
};
// ANDROID
type RecordDataA = {
  source: string;
  period: number;
  startDate: string;
  endDate: string;
  count: number;
};

export const formatStepsToDataAndroid = (steps: RecordDataA[]) => {
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

export const formatDistanceToDataAndroid = (distance: RecordDataA[]) => {
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

export const formatCaloriesToDataAndroid = (calories: RecordDataA[]) => {
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

export const combineResults = (combinedarray: RecordFinalResult[]) => {
  return Object.values(
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
};
