import { readRecords } from "react-native-health-connect";
import { HealthConnectRecord, RecordResult } from "react-native-health-connect/lib/typescript/types";
import pipe from "../../utils/util";
import { formatCaloriesToDataAndroid, formatDistanceToDataAndroid, formatStepsToDataAndroid } from "../../utils/healthFormat";

const getMidnight = (): Date => {
    return new Date(new Date().setHours(0, 0, 0, 0));
};
const getTodayDate = (): Date => {
    return new Date();
};

export const getHealthDataRecord = async <T extends HealthConnectRecord["recordType"]>(type: T): Promise<RecordResult<T>[]> => {
    const healthRecord = await readRecords(type, {
        timeRangeFilter: {
            operator: "between",
            startTime: getMidnight().toISOString(),
            endTime: getTodayDate().toISOString(),
        },
    });
    return healthRecord
};

interface RecordData {
    source: string;
    period: number;
    startDate: string;
    endDate: string;
    count: number;
}

const formatRawStepsToData = (
    rawSteps: RecordResult<"Steps">[]
): RecordData[] => {
    return rawSteps.map((d) => ({
        source: d.metadata ? d.metadata.dataOrigin : "",
        startDate: d.startTime,
        endDate: d.endTime,
        count: d.count,
        period: 0,
    }));
};

const formatRawDistanceToData = (
    rawDistance: RecordResult<"Distance">[]
): RecordData[] => {
    return rawDistance.map((d) => ({
        source: d.metadata ? d.metadata.dataOrigin : "",
        startDate: d.startTime,
        endDate: d.endTime,
        count: d.distance.inMeters,
        period: 0,
    }));
};


const formatRawCaloriesToData = (
    rawCalories: RecordResult<"TotalCaloriesBurned">[]
): RecordData[] => {
    return rawCalories.map((d) => ({
        source: d.metadata ? d.metadata.dataOrigin : "",
        startDate: d.startTime,
        endDate: d.endTime,
        count: d.energy.inKilocalories,
        period: 0,
    }));
};


const extractDataGroupByMinutes = (data: RecordData[]): RecordData[] => {
    const result: RecordData[] = [];

    data.forEach((entry) => {
        const source = entry.source;
        const startTime = new Date(entry.startDate);
        startTime.setSeconds(0, 0);

        const endTime = new Date(entry.endDate);
        endTime.setSeconds(59, 999);

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

const mergeDataGroupByHours = (steps: RecordData[]): RecordData[] => {
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
        groupedData[hourStartStr].period = +(
            (new Date(hourStart.getTime() + 3600 * 1000 - 1).getTime() -
                hourStart.getTime()) /
            1000
        ).toFixed(0);
    });

    return Object.values(groupedData) as RecordData[];
};

const cleanupData = (steps: RecordData[]) => {
    return steps.map((d) => ({ ...d, count: +d.count.toFixed(0) }));
};
const cleanupDataDistance = (distance: RecordData[]) => {
    return distance.map((d) => ({ ...d, count: +d.count.toFixed(2) }));
};

const formatStepsToTrackingData = (steps: RecordData[]) => {
    return formatStepsToDataAndroid(steps);
};

const formatDistanceToTrackingData = (distance: RecordData[]) => {
    return formatDistanceToDataAndroid(distance)
};

const formatCaloriesToTrackingData = (calories: RecordData[]) => {
    return formatCaloriesToDataAndroid(calories)
};

export const calculateStepsData = pipe(
    formatRawStepsToData,
    extractDataGroupByMinutes,
    mergeDataGroupByHours,
    cleanupData,
    formatStepsToTrackingData,
);

export const calculateDistanceData = pipe(
    formatRawDistanceToData,
    extractDataGroupByMinutes,
    mergeDataGroupByHours,
    cleanupDataDistance,
    formatDistanceToTrackingData,
);

export const calculateCaloriesData = pipe(
    formatRawCaloriesToData,
    extractDataGroupByMinutes,
    mergeDataGroupByHours,
    cleanupData,
    formatCaloriesToTrackingData,
);

