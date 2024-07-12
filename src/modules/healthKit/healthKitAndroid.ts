import { readRecords } from "react-native-health-connect";
import { HealthConnectRecord, RecordResult } from "react-native-health-connect/lib/typescript/types";

const getMidnight = (): Date => {
    return new Date(new Date("2023-07-10").setHours(0, 0, 0, 0));
};
const getTodayDate = (): Date => {
    return new Date();
};

export const getHealthDataRecord = async <T extends HealthConnectRecord["recordType"]>(type: T): Promise<RecordResult<T>[]> => {
    const steps = await readRecords(type, {
        timeRangeFilter: {
            operator: "between",
            startTime: getMidnight().toISOString(),
            endTime: getTodayDate().toISOString(),
        },
    });
    return steps
};

