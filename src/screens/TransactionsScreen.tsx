import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useTransactions } from "../context/TransactionsContext";
import { Transaction } from "../models/Transaction";
import TransactionItem from "../components/TransactionItem";
import { BatteryMonitor } from "../native/BatteryMonitor";
import TransactionChart from "../components/TransactionChart";
import { CategoryTotals } from "../components/CategoryTotals";
import TransactionActions from "../components/TransactionActions";
import { TransactionForm } from "../components/TransactionForm";

const PAGE_SIZE = 5;

export const TransactionsScreen: React.FC = () => {
  const {
    transactions,
    loading,
    fetchAll,
    addTransaction,
    updateTransaction,
    removeTransaction,
  } = useTransactions();

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [visibleData, setVisibleData] = useState<Transaction[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Edit modal state
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [formVisible, setFormVisible] = useState(false);

  // Fetch all transactions on mount
  useEffect(() => {
    fetchAll();
  }, []);

  // Update visibleData, totals, and grand total when data or filters change
  useEffect(() => {
    const filtered =
      selectedCategory === "All"
        ? transactions
        : transactions.filter((t) => t.transaction_category === selectedCategory);

    const sortedFiltered = [...filtered].sort((a, b) => {
      const aDate = new Date(a.date).getTime();
      const bDate = new Date(b.date).getTime();
      return sortOrder === "desc" ? bDate - aDate : aDate - bDate;
    });

    setVisibleData(sortedFiltered.slice(0, currentPage * PAGE_SIZE));

    const totals: Record<string, number> = {};
    let total = 0;
    sortedFiltered.forEach((t) => {
      const cat = t.transaction_category || "Uncategorized";
      const amt = Number(t.transaction_amount) || 0;
      totals[cat] = (totals[cat] || 0) + amt;
      total += amt;
    });

    setCategoryTotals(totals);
    setGrandTotal(total);
  }, [transactions, selectedCategory, sortOrder, currentPage]);

  const categories = [
    "All",
    ...Array.from(new Set(transactions.map((t) => t.transaction_category).filter(Boolean))),
  ];

  const handleLoadMore = () => {
    if (visibleData.length < transactions.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Edit modal handler
  const handleEdit = useCallback((tx: Transaction) => {
    setEditTransaction(tx);
    setFormVisible(true);
  }, []);

  const handleFormSubmit = (tx: Transaction) => {
    if (editTransaction) {
      updateTransaction(tx);
    } else {
      addTransaction(tx);
    }
    setFormVisible(false);
    setEditTransaction(null);
  };

  const handleAddTransactionFromAction = (tx: Transaction) => {
    addTransaction(tx); // Add transaction from TransactionActions
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading transactions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => console.log("Toggle pressed")}
        >
          <Text style={styles.toggleButtonText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.fixedTitle}>My Personal Finances</Text>
      </View>

      {/* FlatList */}
      <FlatList
        data={visibleData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TransactionItem
            item={item}
            onEdit={handleEdit}
            onDelete={removeTransaction}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20, paddingTop: 70 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No transactions found</Text>
        }
        ListHeaderComponent={
          <>
            <BatteryMonitor />
            <TransactionChart transactions={transactions} />
            <TransactionActions
              selectedCategory={selectedCategory}
              categories={categories}
              onAddTransaction={handleAddTransactionFromAction}
              onSelectCategory={setSelectedCategory}
            />
            <CategoryTotals
              categoryTotals={categoryTotals}
              grandTotal={grandTotal}
              selectedCategory={selectedCategory}
            />
          </>
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />

      {/* Edit Transaction Modal */}
      <TransactionForm
        visible={formVisible}
        initial={editTransaction}
        onClose={() => {
          setFormVisible(false);
          setEditTransaction(null);
        }}
        onSubmit={handleFormSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, top: 40, backgroundColor: "#f9f9f9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#f9f9f9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    zIndex: 10,
    paddingHorizontal: 16,
  },
  fixedTitle: {
    fontSize: 22,
    fontFamily: "brandonmedium",
    color: "#333",
    textAlign: "center",
    flex: 1,
  },
  toggleButton: {
    position: "absolute",
    left: 16,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleButtonText: {
    fontSize: 22,
    color: "#007AFF",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#555",
    fontFamily: "brandonmedium",
  },
});

export default TransactionsScreen;
