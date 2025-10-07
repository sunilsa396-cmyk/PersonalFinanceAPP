import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface CategoryTotalsProps {
  categoryTotals: Record<string, number>;
  grandTotal: number;
  selectedCategory: string;
}

export const CategoryTotals: React.FC<CategoryTotalsProps> = ({
  categoryTotals,
  grandTotal,
  selectedCategory,
}) => {
  return (
    <View style={styles.summaryBox}>
      {selectedCategory === "All" ? (
        <>
          <Text style={styles.summaryTitle}>Category Totals</Text>
          {Object.entries(categoryTotals).map(([cat, total]) => (
            <Text key={cat} style={styles.summaryItem}>
              {cat}: ₹{total.toFixed(2)}
            </Text>
          ))}
          <Text style={styles.summaryGrand}>
            Grand Total: ₹{grandTotal.toFixed(2)}
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.summaryTitle}>{selectedCategory} Total</Text>
          <Text style={styles.summaryGrand}>₹{grandTotal.toFixed(2)}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  summaryBox: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    top: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: "brandonmedium",
    color: "#b40505ff",
    marginBottom: 6,
  },
  summaryItem: {
    fontSize: 14,
    marginVertical: 2,
    fontFamily: "brandonmedium",
  },
  summaryGrand: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: "brandonmedium",
    color: "#007AFF",
  },
});