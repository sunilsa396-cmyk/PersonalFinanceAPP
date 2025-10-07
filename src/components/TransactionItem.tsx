import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Transaction } from "../models/Transaction";
import TransactionActionsButtons from "./TransactionActionsButtons";

type Props = {
  item: Transaction;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
};

const TransactionItem: React.FC<Props> = ({ item, onEdit, onDelete }) => {
  const formattedDate = new Date(item.date).toLocaleDateString("en-GB");

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

      {/* Right Side - Action Buttons */}
      <TransactionActionsButtons
        item={item}
        onEdit={onEdit}
        onDelete={onDelete}
      />
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
    marginTop: 20,
    borderRadius: 10,
    elevation: 2,
  },
  income: { borderLeftWidth: 5, borderLeftColor: "green" },
  expense: { borderLeftWidth: 5, borderLeftColor: "red" },
  category: { fontSize: 18, fontFamily: "brandonmedium" },
  amount: { fontSize: 16, marginTop: 4, fontFamily: "brandonmedium" },
  date: { fontSize: 14, color: "#666", marginTop: 2, fontFamily: "brandonmedium" },
});
