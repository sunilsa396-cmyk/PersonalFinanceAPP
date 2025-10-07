import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Transaction } from "../models/Transaction";

type Props = {
  selectedCategory: string;
  categories: string[];
  onAddTransaction: (tx: Transaction) => void;
  onSelectCategory: (cat: string) => void;
};

const TransactionActions: React.FC<Props> = ({
  selectedCategory,
  categories,
  onAddTransaction,
  onSelectCategory,
}) => {
  const [formVisible, setFormVisible] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "income"
  );
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const validCategories = categories.filter((c) => c !== "All Transaction");

  const handleSubmit = () => {
    if (!amount || !category) {
      Alert.alert("Error", "Please enter amount and select category");
      return;
    }

    const newTx: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      transaction_type: transactionType,
      transaction_amount: amount.toString(),
      transaction_category: category,
    };

    onAddTransaction(newTx);
    setFormVisible(false);
    setAmount("");
    setCategory("");
    setTransactionType("income");
  };

  return (
    <View style={styles.container}>
      {/* Add New Transaction Section */}
      <Text style={styles.sectionTitle}>Add New Transaction</Text>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: "#E0F7FA" }]}
        onPress={() => setFormVisible(true)}
      >
        <Text style={styles.cardText}>Add New Transaction</Text>
      </TouchableOpacity>

      {/* Select Transaction Section */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
        Transactions by category
      </Text>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: "#FFF3E0" }]}
        onPress={() => setFilterModalVisible(true)}
      >
        <Text style={styles.cardText}>
          {selectedCategory || "Choose Category"}
        </Text>
      </TouchableOpacity>

      {/* Add New Transaction Modal */}
      <Modal
        visible={formVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFormVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Transaction</Text>

            {/* Amount Input */}
            <TextInput
              placeholder="Enter Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={styles.input}
            />

            {/* Category Dropdown */}
            <Text style={styles.label}>Select Category</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="-- Select Category --" value="" />
                {validCategories.map((cat) => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            </View>

            {/* Income / Expense Buttons */}
            <Text style={styles.label}>Transaction Type</Text>
            <View style={styles.typeRow}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  transactionType === "income" && styles.selectedType,
                ]}
                onPress={() => setTransactionType("income")}
              >
                <Text
                  style={[
                    styles.typeText,
                    transactionType === "income" && styles.selectedTypeText,
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  transactionType === "expense" && styles.selectedType,
                ]}
                onPress={() => setTransactionType("expense")}
              >
                <Text
                  style={[
                    styles.typeText,
                    transactionType === "expense" && styles.selectedTypeText,
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>
            </View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#007AFF" }]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#ccc" }]}
                onPress={() => setFormVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Category Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(value) => {
                  onSelectCategory(value);
                  setFilterModalVisible(false);
                }}
              >
                <Picker.Item label="-- Select Category --" value="" />
                {validCategories.map((cat) => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#ccc", marginTop: 12 }]}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TransactionActions;

const styles = StyleSheet.create({
  container: { marginTop: 5 },
  sectionTitle: { fontSize: 18, fontFamily: "brandonmedium", marginBottom: 8, color: "#333" },
  card: { borderRadius: 10, paddingVertical: 16, alignItems: "center", justifyContent: "center", elevation: 2 },
  cardText: { fontSize: 16, fontFamily: "brandonmedium", color: "#333" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "85%", backgroundColor: "#fff", borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 18, fontFamily: "brandonmedium", marginBottom: 12, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10 },
  pickerContainer: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, overflow: "hidden", marginBottom: 12 },
  picker: { height: 60 },
  label: { fontSize: 16, marginBottom: 6, color: "#333",fontFamily: "brandonmedium" },
  typeRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  typeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  selectedType: { backgroundColor: "#007AFF" },
  typeText: { color: "#007AFF", fontFamily: "brandonmedium", fontSize: 16 },
  selectedTypeText: { color: "#fff" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  button: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: "center", marginHorizontal: 5 },
  buttonText: { color: "#fff", fontFamily: "brandonmedium", fontSize: 16 },
});
