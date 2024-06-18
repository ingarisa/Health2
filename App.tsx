import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import appleHealthKit, { HealthInputOptions } from 'react-native-health';
import  AppleHealthKit, {HealthKitPermissions} from 'react-native-health';

const permissions: HealthKitPermissions = {
  permissions: {
    read : [AppleHealthKit.Constants.Permissions.Steps, AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
    AppleHealthKit.Constants.Permissions.SleepAnalysis],
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


 AppleHealthKit.isAvailable(() => {});
  useEffect(() => {
    AppleHealthKit.initHealthKit(permissions, (err) => {
      if (err) {
        console.log('Error getting permissions');
        return ; 
      }
      setHasPermission(true) ; 
  }) ; 
}, []); 



useEffect(() => {
  if (!hasPermissions) {
    return; 
  }

  const options: HealthInputOptions = {
    date: new Date().toISOString(),  
    startDate: new Date().toISOString(),
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

/* AppleHealthKit.getSleepSamples(options, (err, results) => {
    if (err) {
      console.log('Error getting sleep samples');
    }
    setSleep(results.value) ; 
  }); */

}, [hasPermissions]); 

  return (
    <View style={styles.container}>
      <Text>Hello!</Text>
 
  <Value label = "Steps" value = {steps.toString()} /> 
  <Value label = "Sleep" value = {sleep.toString()} />
  <Value label = "Distance" value = {`${distance.toString()} m `}/>

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
