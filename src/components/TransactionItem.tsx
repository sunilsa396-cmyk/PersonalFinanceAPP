import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Transaction } from "../models/Transaction";

type Props = {
  item: Transaction;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
};

const TransactionItem: React.FC<Props> = ({ item, onEdit, onDelete }) => {
  // Format date to DD/MM/YYYY
  const formattedDate = new Date(item.date).toLocaleDateString("en-GB"); // en-GB gives DD/MM/YYYY

  return (
    <View
      style={[
        styles.card,
        item.transaction_type === "income" ? styles.income : styles.expense,
      ]}
    >
      {/* Left Side - Details */}
      <View style={{ flex: 1 }}>
        <Text style={styles.category}>{item.transaction_category}</Text>
        <Text style={styles.amount}>
          {item.transaction_type === "income" ? "+" : "-"} ₹
          {item.transaction_amount}
        </Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>

      {/* Right Side - Actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(item)} style={styles.actionBtn}>
          <Ionicons name="create-outline" size={22} color="#007bff" />
          <Text style={styles.actionLabel}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.actionBtn}>
          <Ionicons name="trash-outline" size={22} color="red" />
          <Text style={styles.actionLabel}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TransactionItem;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },
  income: { borderLeftWidth: 5, borderLeftColor: "green" },
  expense: { borderLeftWidth: 5, borderLeftColor: "red" },
  category: { fontSize: 18, fontFamily: "brandonmedium" },
  amount: { fontSize: 16, marginTop: 4, fontFamily: "brandonmedium" },
  date: { fontSize: 14, color: "#666", marginTop: 2, fontFamily: "brandonmedium" },
  actions: { flexDirection: "row", alignItems: "center", gap: 20 },
  actionBtn: { alignItems: "center" },
  actionLabel: { fontSize: 12, fontFamily: "brandonmedium", marginTop: 2 },
});
