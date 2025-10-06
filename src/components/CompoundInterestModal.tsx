import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { calculateCompoundInterest } from "../utils/finance";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function CompoundInterestModal({ visible, onClose }: Props) {
  const { total, interest } = calculateCompoundInterest(10000, 8, 4, 5);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Compound Interest Example</Text>
          <Text style={styles.text}>Principal: ₹10,000</Text>
          <Text style={styles.text}>
            Interest (5 yrs @ 8% quarterly): ₹{interest.toFixed(2)}
          </Text>
          <Text style={styles.result}>Final Amount: ₹{total.toFixed(2)}</Text>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
  },
  result: {
    fontSize: 17,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
