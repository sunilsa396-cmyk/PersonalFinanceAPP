// src/screens/TransactionsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { useTransactions } from "../context/TransactionsContext";
import { Transaction } from "../models/Transaction";
import TransactionItem from "../components/TransactionItem";
import { TransactionForm } from "../components/TransactionForm";
import { BatteryMonitor } from "../components/BatteryMonitor";
import { calculateCompoundInterest } from "../utils/finance";
import CompoundInterestModal from "../components/CompoundInterestModal";
import TransactionChart from "../components/TransactionChart";
import { CategoryTotals } from "../components/CategoryTotals"; // Import the new component
import { StatusBar } from 'react-native';
import { addTransactionReminder, fetchReminders } from '../api/TransactionCalendar';
import { Button } from 'react-native';

export const TransactionsScreen: React.FC = () => {
  const {
    transactions,
    loading,
    fetchAll,
    addTransaction,
    updateTransaction,
    removeTransaction,
  } = useTransactions();

  const [formVisible, setFormVisible] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [visibleData, setVisibleData] = useState<Transaction[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [firstLoadDone, setFirstLoadDone] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const toggleSort = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };
  const PAGE_SIZE = 5;

  // Totals state
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [ciVisible, setCiVisible] = useState(false);


  const handleAddReminder = async () => {
  try {
    const now = new Date();
    const dateString = now.toISOString(); // Use current time for demo
    await addTransactionReminder('Pay Credit Card Bill', dateString);
  } catch (err) {
    console.error('Error adding reminder:', err);
  }
};

const handleFetchReminders = async () => {
  try {
    const reminders = await fetchReminders();
    console.log('Fetched reminders:', reminders);
  } catch (err) {
    console.error('Error fetching reminders:', err);
  }
};


  // Fetch transactions on mount
  useEffect(() => {
    const load = async () => {
      try {
        await fetchAll();
      } catch (e) {
        console.error("Failed to fetch transactions:", e);
      } finally {
        setFirstLoadDone(true);
      }
    };
    load();
  }, []);

  // Sort + filter + calculate totals whenever transactions or category changes
  useEffect(() => {
    const filtered =
      selectedCategory === "All"
        ? transactions
        : transactions.filter((t) => t.transaction_category === selectedCategory);

    // Sort by transaction_date (if it exists), fallback to ID
    const sortedFiltered = [...filtered].sort((a, b) => {
      const aDate = (a as any).transaction_date
        ? new Date((a as any).transaction_date).getTime()
        : Number(a.id);
      const bDate = (b as any).transaction_date
        ? new Date((b as any).transaction_date).getTime()
        : Number(b.id);

      return sortOrder === "desc" ? bDate - aDate : aDate - bDate;
    });

    setVisibleData(sortedFiltered.slice(0, PAGE_SIZE));

    // Calculate totals
    const totals: Record<string, number> = {};
    let sum = 0;
    sortedFiltered.forEach((t) => {
      const cat = t.transaction_category || "Uncategorized";
      const amount = Number(t.transaction_amount) || 0;
      totals[cat] = (totals[cat] || 0) + amount;
      sum += amount;
    });

    setCategoryTotals(totals);
    setGrandTotal(sum);
  }, [transactions, selectedCategory, sortOrder]);

  // Infinite scroll
  const loadMore = () => {
    if (loadingMore || !transactions) return;

    const filtered =
      selectedCategory === "All"
        ? transactions
        : transactions.filter((t) => t.transaction_category === selectedCategory);

    const sortedFiltered = filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const start = visibleData.length;
    const end = start + PAGE_SIZE;

    if (start < sortedFiltered.length) {
      setLoadingMore(true);
      setTimeout(() => {
        setVisibleData((prev) => [...prev, ...sortedFiltered.slice(start, end)]);
        setLoadingMore(false);
      }, 300);
    }
  };

  const categories = [
    "All",
    ...Array.from(
      new Set(transactions.map((t) => t.transaction_category).filter(Boolean))
    ),
  ];

  if (!firstLoadDone || loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading transactions...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

            <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />

      {/* Title */}
      <Text style={styles.title}>My Personal Finances</Text>



      {/* iOS Calendar Sync (Native Module) */}
      {/* <View style={{ marginVertical: 12 }}>
        <Button title="Add iOS Calendar Reminder" onPress={handleAddReminder} />
        <View style={{ height: 10 }} />
        <Button title="Fetch iOS Reminders" onPress={handleFetchReminders} />
      </View> */}


      {/* Battery Monitor */}
      <BatteryMonitor />

      <TransactionChart transactions={transactions} />


      {/* Add Transaction Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setEditTx(null);
          setFormVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>Add New Transaction</Text>
      </TouchableOpacity>

      {/* Filter Button */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setFilterModalVisible(true)}
      >
        <Text style={styles.filterButtonText}>
          {selectedCategory === "All" ? "Select Transaction" : selectedCategory}
        </Text>
      </TouchableOpacity>

      {/* Use the new CategoryTotals component */}
      <CategoryTotals
        categoryTotals={categoryTotals}
        grandTotal={grandTotal}
        selectedCategory={selectedCategory}
      />

      {/* Sort Button */}
      <TouchableOpacity
        onPress={toggleSort}
        style={{
          padding: 8,
          backgroundColor: "#eee",
          borderRadius: 6,
          marginBottom: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ fontFamily: "brandonmedium" }}>
          Sort: {sortOrder === "desc" ? "Newest First" : "Oldest First"}
        </Text>
      </TouchableOpacity>

      {/* Transactions List */}
      <FlatList
        scrollEnabled={false}
        data={visibleData}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) =>
          item ? (
            <TransactionItem
              item={item}
              onEdit={(tx) => {
                setEditTx(tx);
                setFormVisible(true);
              }}
              onDelete={(id) => removeTransaction(id)}
            />
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 20, marginTop: 12 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loader}>
              <ActivityIndicator size="small" color="#007AFF" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          visibleData.length === 0 ? (
            <Text style={styles.emptyText}>No transactions found</Text>
          ) : null
        }
      />

      {/* Transaction Form Modal */}
      <TransactionForm
        visible={formVisible}
        initial={editTx}
        onClose={() => setFormVisible(false)}
        onSubmit={(tx) => (editTx ? updateTransaction(tx) : addTransaction(tx))}
      />

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Transaction</Text>
            <ScrollView>
              {categories.map((cat, idx) => (
                <TouchableOpacity
                  key={`${cat}-${idx}`}
                  style={[
                    styles.categoryItem,
                    selectedCategory === cat && styles.selectedCategory,
                  ]}
                  onPress={() => {
                    setSelectedCategory(cat);
                    setFilterModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === cat && styles.selectedCategoryText,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <CompoundInterestModal
        visible={ciVisible}
        onClose={() => setCiVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, marginTop: 30, backgroundColor: "#f9f9f9" },
  title: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "brandonmedium",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 12,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "brandonmedium",
  },
  filterButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    alignItems: "center",
  },
  filterButtonText: {
    fontSize: 16,
    fontFamily: "brandonmedium",
    color: "#333",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loader: { padding: 12, alignItems: "center" },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#555",
    fontFamily: "brandonmedium",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  categoryText: {
    fontSize: 16,
    fontFamily: "brandonmedium",
  },
  selectedCategory: {
    backgroundColor: "#007AFF20",
  },
  selectedCategoryText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  closeButton: {
    marginTop: 12,
    paddingVertical: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});