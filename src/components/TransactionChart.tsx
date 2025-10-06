import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
} from "react-native";
import { BarChart } from "react-native-chart-kit";

type Transaction = {
  date: string;
  transaction_amount: string | number;
};

type Props = {
  transactions: Transaction[];
};

const screenWidth = Dimensions.get("window").width;
const BAR_WIDTH = 30;
const BAR_MARGIN = 20;
const CHART_HEIGHT = 220;

const TransactionChart: React.FC<Props> = ({ transactions }) => {
  const grouped = new Map<string, number>();

  transactions.forEach((t) => {
    if (!t.date) return;
    const [year, month, day] = t.date.split("-");
    const formatted = `${day}/${month}`;
    const amount = Number(t.transaction_amount) || 0;
    const currentAmount = grouped.get(formatted) || 0;
    grouped.set(formatted, currentAmount + amount);
  });

  const sortedDates = [...grouped.keys()].sort((a, b) => {
    const [d1, m1] = a.split("/").map(Number);
    const [d2, m2] = b.split("/").map(Number);
    const dateA = new Date(2025, m1 - 1, d1);
    const dateB = new Date(2025, m2 - 1, d2);
    return dateA.getTime() - dateB.getTime();
  });

  const labels = sortedDates;
  const data = sortedDates.map((date) => grouped.get(date) || 0);

  if (labels.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No data available for chart</Text>
      </View>
    );
  }

  const chartWidth = Math.max(
    screenWidth - 40,
    labels.length * (BAR_WIDTH + BAR_MARGIN) + 80
  );

  const chartConfig = {
    backgroundColor: "transparent",
    backgroundGradientFrom: "transparent",
    backgroundGradientTo: "transparent",
    decimalPlaces: 0,
    color: () => "rgba(255,255,255,0.9)", // Bars color: off-white / dark white
    labelColor: () => "#FFFFFF", // Labels white
    propsForLabels: {
      fontSize: 8,
      fontWeight: "600",
    },
    propsForBackgroundLines: {
      stroke: "#adadadff", // Horizontal lines in white
      strokeDasharray: "0",
      strokeWidth: 0.1,
    },
    barPercentage: 0.6,
    propsForBars: {
      rx: 6,
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Spending</Text>
        <Text style={styles.subtitle}>Last 7 days</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.chartWrapper}>
          {/* Y-axis line (vertical) */}
          <View
            style={{
              position: "absolute",
              left: 40, // Adjust to align with chart Y-axis
              top: 0,
              height: CHART_HEIGHT,
              width: 0.5,
              backgroundColor: "#7e7e7eff",
              zIndex: 1,
            }}
          />
          {/* Bar Chart */}
          <BarChart
            data={{
              labels: labels,
              datasets: [{ data: data }],
            }}
            width={chartWidth}
            height={CHART_HEIGHT}
            yAxisLabel="₹"
            yAxisSuffix=""
            chartConfig={chartConfig}
            fromZero
            showValuesOnTopOfBars={true}
            style={styles.chart}
          />
          {/* X-axis line (bottom) */}
          <View
            style={{
              position: "absolute",
              bottom: 10, // leave space for labels
              left: 10,
              width: chartWidth,
              height: 0.5,
              backgroundColor: "#777777ff",
              zIndex: 1,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default TransactionChart;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#009688", // teal background
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255,255,255,0.8)",
  },
  scrollContent: {
    paddingRight: 4,
  },
  chartWrapper: {
    borderRadius: 12,
    overflow: "hidden",
  },
  chart: {},
  noDataContainer: {
    backgroundColor: "#009688",
    borderRadius: 16,
    marginHorizontal: 16,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
});
