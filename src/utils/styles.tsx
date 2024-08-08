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
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "white",
  },
  home: {
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    rowGap: 20,
    marginTop: 40,
  },
  text: {
    fontSize: 40,
    fontWeight: "700",
    color: "#006D03",
    marginBottom: 20,
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
  input: {
    height: 550,
    margin: 12,
    borderWidth: 3,
    borderColor: "#588550",
    paddingHorizontal: 30,
    fontSize: 20,
    color: "#588550",
  },
  exportdata: {
    marginHorizontal: 20,
  },
});
