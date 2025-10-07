import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import * as Animatable from "react-native-animatable";
import LinearGradient from "react-native-linear-gradient";

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

const PIE_COLORS = [
  "#FFD700",
  "#FF6347",
  "#1E90FF",
  "#32CD32",
  "#FF69B4",
  "#BA55D3",
  "#00CED1",
];

const TransactionChart: React.FC<Props> = ({ transactions }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const grouped = new Map<string, number>();

  transactions.forEach((t) => {
    if (!t.date) return;
    const [year, month, day] = t.date.split("-");
    const formatted = `${day}/${month}`;
    const amount = Number(t.transaction_amount) || 0;
    grouped.set(formatted, (grouped.get(formatted) || 0) + amount);
  });

  const sortedDates = [...grouped.keys()].sort((a, b) => {
    const [d1, m1] = a.split("/").map(Number);
    const [d2, m2] = b.split("/").map(Number);
    return (
      new Date(2025, m1 - 1, d1).getTime() -
      new Date(2025, m2 - 1, d2).getTime()
    );
  });

  const labels = sortedDates;
  const data = sortedDates.map((date) => grouped.get(date) || 0);

  if (labels.length === 0) {
    return (
      <Animatable.View
        animation="fadeIn"
        duration={1000}
        style={styles.noDataContainer}
      >
        <Text style={styles.noDataText}>No data available for chart</Text>
      </Animatable.View>
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
    color: () => "rgba(255,255,255,0.9)",
    labelColor: () => "#FFFFFF",
    propsForLabels: {
      fontSize: 10,
      fontFamily: "brandonmedium",

    },
    propsForBackgroundLines: {
      stroke: "#adadadff",
      strokeDasharray: "0",
      strokeWidth: 0.2,
    },
    barPercentage: 0.7,
    propsForBars: {
      rx: 8,
    },
  };

  const pieData = sortedDates.map((date, index) => ({
    name: date,
    amount: grouped.get(date) || 0,
    color: PIE_COLORS[index % PIE_COLORS.length],
    legendFontColor: "#0a0a0aff",
    legendFontSize: 12,
  }));

  return (
    <>
      {loading ? (
        <LinearGradient
          colors={["#009688", "#00BFA5", "#009688"]}
          style={styles.loader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading Charts...</Text>
        </LinearGradient>
      ) : (
        <>
          {/* ===== HEADER ===== */}
          <Animatable.View
            animation="fadeInDown"
            duration={1000}
            style={styles.header}
          >
            <Text style={styles.title}>Visualize data through Bar charts</Text>
            <Text style={styles.subtitle}>Last 7 Days Overview</Text>
          </Animatable.View>

          {/* ===== BAR CHART ===== */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Animatable.View
              animation="fadeInUp"
              duration={1200}
              delay={200}
              style={styles.chartWrapper}
            >
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
            </Animatable.View>
          </ScrollView>

          {/* ===== PIE CHART ===== */}
          <Animatable.View
            animation="zoomIn"
            duration={1000}
            delay={600}
            style={styles.pieSection}
          >
            <Text style={styles.title}>Visualize data through Pie charts</Text>
                        <Text style={styles.piesubtitle}>Last 7 Days Overview</Text>

            <PieChart
              data={pieData}
              width={screenWidth - 20}
              height={220}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="10"
              chartConfig={chartConfig}
              absolute
            />
          </Animatable.View>
        </>
      )}
    </>
  );
};

export default TransactionChart;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#009688", 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    top:5,
    color: "#000000ff",
    fontFamily: "brandonmedium",

  },
  subtitle: {
    fontSize: 8,
    top:20,
    right:10,
    color: "rgba(0, 0, 0, 0.8)",
    fontFamily: "brandonmedium",

  },
  piesubtitle: {
    fontSize: 8,
    textAlign: "right",
    right: 10,
    color: "rgba(0, 0, 0, 0.8)",
    fontFamily: "brandonmedium",

  },
  scrollContent: {
    paddingRight: 8,
  },
  chartWrapper: {
    borderRadius: 12,
    marginVertical: 6,
  },
  chart: {
    borderRadius: 8,
    
  },
  pieSection: {
    marginTop: 10,
  },
  
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
    color: "#000000ff",
    fontWeight: "500",
  },
  loader: {
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#000000ff",
    marginTop: 10,
    fontSize: 14,
    fontFamily: "brandonmedium",

  },
});
