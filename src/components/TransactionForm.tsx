import React, { useState, useEffect } from "react";
import { Modal, View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import { Transaction } from "../models/Transaction";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (tx: Transaction) => void;
  initial?: Transaction | null;
};

export const TransactionForm: React.FC<Props> = ({ visible, onClose, onSubmit, initial }) => {
  const [category, setCategory] = useState(initial?.transaction_category ?? "");
  const [amount, setAmount] = useState(initial?.transaction_amount ?? "");
  const [type, setType] = useState<"income" | "expense">(initial?.transaction_type ?? "expense");

  useEffect(() => {
    if (initial) {
      setCategory(initial.transaction_category);
      setAmount(initial.transaction_amount);
      setType(initial.transaction_type);
    } else {
      setCategory("");
      setAmount("");
      setType("expense");
    }
  }, [initial]);

  const handleSave = () => {
    if (!category.trim()) {
      Alert.alert("Validation Error", "Category cannot be empty");
      return;
    }

    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert("Validation Error", "Enter a valid amount greater than 0");
      return;
    }

    const newTx: Transaction = {
      id: initial?.id ?? Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      transaction_type: type,
      transaction_amount: amount,
      transaction_category: category,
    };

    onSubmit(newTx);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{initial ? "Edit Transaction" : "Add Transaction"}</Text>
          <TextInput
            placeholder="Category"
            style={styles.input}
            value={category}
            onChangeText={setCategory}
          />
          <TextInput
            placeholder="Amount"
            style={styles.input}
            value={amount}
            keyboardType="numeric"
            onChangeText={setAmount}
          />
          <View style={styles.actions}>
            <Button
              title="Expense"
              onPress={() => setType("expense")}
              color={type === "expense" ? "red" : "gray"}
            />
            <Button
              title="Income"
              onPress={() => setType("income")}
              color={type === "income" ? "green" : "gray"}
            />
          </View>
          <Button title="Save" onPress={handleSave} />
          <View style={{ marginTop: 8 }}>
            <Button title="Cancel" onPress={onClose} color="#888" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  container: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 12, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  actions: { flexDirection: "row", justifyContent: "space-around", marginBottom: 12 },
});
