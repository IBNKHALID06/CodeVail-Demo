import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { router } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

// Enhanced safe back navigation with fallback to root if no history
function goBackSafe() {
  try {
    // expo-router router.canGoBack() exists; fallback if not
    // @ts-ignore
    if (router.canGoBack && router.canGoBack()) {
      router.back()
    } else {
      router.replace('/')
    }
  } catch {
    router.replace('/')
  }
}

const mockResults = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    type: "Technical",
    score: 85,
    duration: "45 min",
    status: "Completed",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    type: "Meeting",
    score: 92,
    duration: "60 min",
    status: "Completed",
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol@example.com",
    type: "Technical",
    score: 78,
    duration: "38 min",
    status: "Completed",
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david@example.com",
    type: "Meeting",
    score: 0,
    duration: "25 min",
    status: "In Progress",
  },
]

export default function Results() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBackSafe} accessibilityRole="button" accessibilityLabel="Go back">
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Interview Results</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNum}>24</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNum}>18</Text>
          <Text style={styles.summaryLabel}>Completed</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNum}>82%</Text>
          <Text style={styles.summaryLabel}>Avg Score</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNum}>6</Text>
          <Text style={styles.summaryLabel}>In Progress</Text>
        </View>
      </View>

      <ScrollView style={styles.resultsList}>
        <Text style={styles.listTitle}>Recent Candidates</Text>
        {mockResults.map((result) => (
          <View key={result.id} style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View>
                <Text style={styles.resultName}>{result.name}</Text>
                <Text style={styles.resultEmail}>{result.email}</Text>
              </View>
              <View style={styles.resultType}>
                <Text style={styles.typeText}>{result.type}</Text>
              </View>
            </View>
            <View style={styles.resultStats}>
              <View style={styles.resultStat}>
                <Text style={styles.statLabel}>Score</Text>
                <Text style={[styles.statValue, { color: result.status === "Completed" ? "#00D4AA" : "#FFA500" }]}>
                  {result.status === "Completed" ? `${result.score}%` : "In Progress"}
                </Text>
              </View>
              <View style={styles.resultStat}>
                <Text style={styles.statLabel}>Duration</Text>
                <Text style={styles.statValue}>{result.duration}</Text>
              </View>
              <View style={styles.resultStat}>
                <Text style={styles.statLabel}>Status</Text>
                <Text style={styles.statValue}>{result.status}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewBtn}>
              <Text style={styles.viewText}>View Details</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      {/* Lightweight footer for native layout */}
      <View style={styles.footer}> 
        <Text style={styles.footerText}>Demo Results • Not Production Data</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1f2e",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  backText: {
    color: "#6C5CE7",
    fontSize: 16,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  summary: {
    flexDirection: "row",
    padding: 16,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  summaryNum: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6C5CE7",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#94A3B8",
  },
  resultsList: {
    flex: 1,
    padding: 16,
  },
  listTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  resultName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resultEmail: {
    color: "#94A3B8",
    fontSize: 12,
  },
  resultType: {
    backgroundColor: "rgba(108,92,231,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    color: "#6C5CE7",
    fontSize: 12,
  },
  resultStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  resultStat: {
    alignItems: "center",
  },
  statLabel: {
    color: "#64748B",
    fontSize: 12,
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  viewBtn: {
    backgroundColor: "rgba(108,92,231,0.2)",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  viewText: {
    color: "#6C5CE7",
    fontSize: 14,
  },
  footer: {
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)'
  },
  footerText: {
    fontSize: 11,
    color: '#64748B'
  }
})
