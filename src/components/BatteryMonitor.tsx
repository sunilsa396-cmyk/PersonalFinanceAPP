import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import * as Battery from "expo-battery";

export const BatteryMonitor = () => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  useEffect(() => {
    // Fetch initial battery level
    const fetchBattery = async () => {
      try {
        const level = await Battery.getBatteryLevelAsync();
        setBatteryLevel(Math.round(level * 100));
      } catch (e) {
        console.error("Battery error:", e);
      }
    };
    fetchBattery();

    // Subscribe to battery level changes
    const subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      const levelPercent = Math.round(batteryLevel * 100);
      setBatteryLevel(levelPercent);

      if (levelPercent <= 20) {
        Alert.alert("⚠️ Battery Low", `Battery is only ${levelPercent}%`);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={{ padding: 10 }}>
      <Text>🔋 Battery Level: {batteryLevel ?? "Loading..."}%</Text>
    </View>
  );
};
