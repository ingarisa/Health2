import { View, StyleSheet, Text } from "react-native";

export type Valueprop = {
  label: string;
  value: string;
};

export const Value = ({ label, value }: Valueprop) => (
  <View style={styles.valuecontainer}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export const styles = StyleSheet.create({
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
