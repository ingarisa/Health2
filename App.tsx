import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import  AppleHealthKit, {HealthKitPermissions, HealthInputOptions, HealthUnit} from 'react-native-health';
import { Platform } from 'react-native';

import {
  initialize,
  requestPermission,
  readRecords,
} from 'react-native-health-connect';
import { Permission } from 'react-native-health-connect/lib/typescript/types';
import { TimeRangeFilter } from 'react-native-health-connect/lib/typescript/types/base.types';


const permissions: HealthKitPermissions = {
  permissions: {
    read : [AppleHealthKit.Constants.Permissions.Steps, AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
    AppleHealthKit.Constants.Permissions.SleepAnalysis, AppleHealthKit.Constants.Permissions.ActiveEnergyBurned],
    write: [], 
  },
};

type Valueprop = {
  label: string; 
  value: string; 
}

const Value = ({label, value}: Valueprop) => (
  <View style={styles.valuecontainer} >
  <Text style = {styles.label}>{label}</Text>
  <Text style = {styles.value}>{value}</Text>
  </View> 
)

export default function App() {
  const [hasPermissions, setHasPermission] = useState(false) ; 
  const [steps, setSteps] = useState(0) ;
  const [distance, setDistance] = useState(0) ;
  const [sleep, setSleep] = useState(0) ;
  const [active, setActive] = useState(0) ;



 /* AppleHealthKit.isAvailable(() => {}); */ 
  useEffect(() => {
    if (Platform.OS != 'ios') {
      return ; 
    }
    AppleHealthKit.isAvailable((err, isAvaliable) => {
      if (err) {
        console.log('error checking availability');
        return ; 
      }
      if (!isAvaliable) {
        console.log('Apple Health NOT AVAILABLE'); 
        return ; 
      }
      AppleHealthKit.initHealthKit(permissions, (err) => {
        if (err) {
          console.log('Error getting permissions');
          return ; 
        }
        setHasPermission(true) ; 
    }) ; 
    }); 

}, []); 



useEffect(() => {
  if (!hasPermissions) {
    return; 
  }

  const options: HealthInputOptions = {
    date: new Date().toISOString(),  
    startDate: new Date(2024,0,0).toISOString(),
    /*includeManuallyAdded: false, */

  } ; 
  AppleHealthKit.getStepCount(options, (err, results) => {
    if (err) {
      console.log('Error getting steps');
    }
    setSteps(results.value) ; 
  });

  AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
    if (err) {
      console.log('Error getting distance');
    }
    setDistance(results.value) ; 
  });

  AppleHealthKit.getActiveEnergyBurned(options, (err, results) => {
    if (err) {
      console.log('Error getting active energy');
    }
    setActive(results[0].value) ;
    console.log(results) ;
  });

 /* AppleHealthKit.getSleepSamples(options, (err, results) => {
    if (err) {
      console.log('Error getting sleep samples');
    }
    setSleep(results[0].value) ; 
  }); */ 

}, [hasPermissions]); 

// const useHealthData = () => {
	const [androidPermissions, setAndroidPermissions] = useState<Permission[]>([]);
	

	useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }
    const init = async () => {
      // initialize the client
      const isInitialized = await initialize();
      if (!isInitialized) {
        console.log('Failed to initialize Health Connect');
        return;
      }

      // request permissions
      const grantedPermissions = await requestPermission([
        { accessType: 'read', recordType: 'Steps' },
        { accessType: 'read', recordType: 'Distance' },
        { accessType: 'read', recordType: 'FloorsClimbed' },
      ]);

      setAndroidPermissions(grantedPermissions);
    };

    init();
  }, []);

// }

const hasAndroidPermission = (recordType: string) => {
  return androidPermissions.some((perm) => perm.recordType === recordType);
};

useEffect(() => {
  if (!hasAndroidPermission('Steps')) {
    return;
  }
  const getHealthData = async () => {
    const today = new Date();
    const timeRangeFilter: TimeRangeFilter = {
      operator: 'between',
      startTime: new Date(today.getTime() - 86400000).toISOString(),
      endTime: today.toISOString(),
    };

    // Steps
    const steps = await readRecords('Steps', { timeRangeFilter });
    const totalSteps = steps.reduce((sum, cur) => sum + cur.count, 0);
    setSteps(totalSteps);
  };

  getHealthData();
}, [androidPermissions]);



  return (
    <View style={styles.container}>
      <Text>Hello!</Text>
 
  <Value label = "Steps" value = {steps.toString()} /> 
  <Value label = "Sleep" value = {sleep.toString()} />
  <Value label = "Walking + Running Distance" value = {`${distance.toString()} m `}/>
  <Value label = "Active Energy" value = {`${active.toString()} cal `}/>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 13,
  },

  valuecontainer: {
    marginVertical: 10,
  }, 
  label: {
    fontSize: 20, 
    color: '#588550'
  },
  value: { 
    fontSize: 40,
    fontWeight: '500', 
    color: '#006D03'

  }, 
});
