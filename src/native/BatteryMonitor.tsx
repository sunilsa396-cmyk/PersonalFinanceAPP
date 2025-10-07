import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  NativeModules,
} from "react-native";
import * as Battery from "expo-battery";

const { BatteryModule } = NativeModules;

export const BatteryMonitor = () => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  useEffect(() => {
    // Fetch initial battery level
    const fetchBattery = async () => {
      try {
        const level = await Battery.getBatteryLevelAsync();
        setBatteryLevel(Math.round(level * 100));
      } catch (e) {
        console.error(e);
      }
    };
    fetchBattery();

    // Subscribe to battery changes
    const subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      const levelPercent = Math.round(batteryLevel * 100);
      setBatteryLevel(levelPercent);

      if (levelPercent <= 20) {
        Alert.alert("⚠️ Battery Low", `Battery is only ${levelPercent}%`);
      }
    });

    return () => subscription.remove();
  }, []);

  const openBatterySettings = () => {
    if (BatteryModule?.openBatteryOptimizationSettings) {
      BatteryModule.openBatteryOptimizationSettings();
    } else {
      Alert.alert("Error", "BatteryModule not available");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Titles */}
      <Text style={styles.mainTitle}>
        Send events to the React Native layer based on battery state.
      </Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.valueLabel}>Battery Level:</Text>
          <Text style={styles.value}>
            {batteryLevel !== null ? `${batteryLevel}%` : "Loading..."}
          </Text>
        </View>
      </View>

      <Text style={styles.mainTitle}>
        Access device battery optimization settings.
      </Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.valueLabel}>Optimization Settings:</Text>
          <TouchableOpacity style={styles.button} onPress={openBatterySettings}>
            <Text style={styles.buttonText}>⚙️ Open Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainTitle: {
    fontSize: 12,
    marginVertical: 8,
    fontFamily: "brandonmedium",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  valueLabel: {
    fontSize: 16,
    fontFamily: "brandonmedium",
    color: "#333",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    fontFamily: "brandonmedium",

  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#007AFF20",
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    color: "#007AFF",
    fontFamily: "brandonmedium",

  },
});
