import AppleHealthKit, { HealthKitPermissions } from "react-native-health";
import { getGrantedPermissions, initialize, requestPermission, revokeAllPermissions } from "react-native-health-connect";
import { Permission } from "react-native-health-connect/lib/typescript/types";

export const permissions: HealthKitPermissions = {
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

const verifyPermission = (userPermissions: Permission[], requirePermissions: Permission[]): Boolean => {
    const permissionStatus = [];

    for (const pl of requirePermissions) {
        let foundStatus = false;

        for (const pu of userPermissions) {
            const isAccessType = pu.accessType === pl.accessType
            const isRecordType = pu.recordType === pl.recordType
            if (isAccessType && isRecordType) {
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

export const initialHealthKitAndroid = async (): Promise<boolean> => {
    const initialStatus = await initialize();
    if (!initialStatus) {
        console.error("initial Health Connect error");
        return Promise.reject("initial Health Connect error");
    }

    const userPermission = await getGrantedPermissions();
    const verifyStatus = verifyPermission(userPermission, appRequirePermissions);

    if (verifyStatus === false) {
        try {
            revokeAllPermissions();
            await requestPermission(appRequirePermissions);
            await getGrantedPermissions();
            return Promise.resolve(true);
        } catch (error) {
            if (error instanceof Error) {
                return Promise.reject(error.message);
            }
        }
    }
    return Promise.resolve(true);
};

export const initialHealthKit = async (): Promise<boolean> => {
    try {
        const isHealKitAvailable = await available();
        if (isHealKitAvailable) {
            await initHealthKit(permissions);
            return Promise.resolve(true);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            return Promise.reject(error.message);
        }
    }
    return Promise.resolve(false);
}

const available = (): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        AppleHealthKit.isAvailable((err, isAvaliable) => {
            if (err) reject(new Error("error checking availability"));
            resolve(isAvaliable);
        });
    });
};

const initHealthKit = (
    permissions: HealthKitPermissions
): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        AppleHealthKit.initHealthKit(permissions, (err) => {
            if (err) reject("Error getting permissions");
            resolve(true);
        });
    });
};