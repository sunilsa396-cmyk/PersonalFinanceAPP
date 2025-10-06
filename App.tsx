import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";

import { TransactionsProvider } from "./src/context/TransactionsContext";
import { TransactionsScreen } from "./src/screens/TransactionsScreen";

export default function App() {
  const [fontsLoaded] = useFonts({
    brandonmedium: require("./assets/fonts/brandonmedium.otf"), // 👈 load your font
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <TransactionsProvider>
      <TransactionsScreen />
    </TransactionsProvider>
  );
}
