import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Transaction } from "../models/Transaction";

interface Props {
  item: Transaction;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionActionsButtons: React.FC<Props> = ({ item, onEdit, onDelete }) => {
  const handleDelete = () => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => onDelete(item.id) },
      ]
    );
  };

  return (
    <View style={styles.actions}>
      <TouchableOpacity onPress={() => onEdit(item)} style={styles.actionBtn}>
        <Ionicons name="create-outline" size={22} color="#007bff" />
        <Text style={styles.actionLabel}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDelete} style={styles.actionBtn}>
        <Ionicons name="trash-outline" size={22} color="red" />
        <Text style={styles.actionLabel}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actions: { flexDirection: "row", alignItems: "center", gap: 20 },
  actionBtn: { alignItems: "center" },
  actionLabel: { fontSize: 12, fontFamily: "brandonmedium", marginTop: 2 },
});

export default TransactionActionsButtons;
