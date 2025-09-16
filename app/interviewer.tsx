import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { router } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

export default function InterviewerDashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CodeVail - Interviewer</Text>
        <TouchableOpacity onPress={() => router.replace("/")}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Results Panel */}
        <View style={styles.panel}>
          <View style={styles.panelContent}>
            <Text style={styles.icon}>📊</Text>
            <Text style={styles.panelTitle}>Interview Results</Text>
            <Text style={styles.panelDesc}>
              View performance summaries from all candidates who completed interviews using your codes.
            </Text>

            <View style={styles.stats}>
              <View style={styles.stat}>
                <Text style={styles.statNum}>24</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNum}>18</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNum}>6</Text>
                <Text style={styles.statLabel}>In Progress</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#6C5CE7" }]}
              onPress={() => router.push("/results")}
            >
              <Text style={styles.actionText}>📊 View Results</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Create Interview Panel */}
        <View style={styles.panel}>
          <View style={styles.panelContent}>
            <Text style={styles.icon}>➕</Text>
            <Text style={styles.panelTitle}>Create Interview</Text>
            <Text style={styles.panelDesc}>
              Generate new interview codes for candidates. Choose between meeting or technical interviews.
            </Text>

            <View style={styles.features}>
              <Text style={styles.feature}>📹 Meeting Interviews</Text>
              <Text style={styles.feature}>💻 Technical Challenges</Text>
              <Text style={styles.feature}>🔒 Secure Monitoring</Text>
            </View>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#00D4AA" }]}
              onPress={() => router.push("/create")}
            >
              <Text style={styles.actionText}>➕ Create Interview</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutText: {
    color: "#6C5CE7",
    fontSize: 16,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    padding: 16,
    gap: 16,
  },
  panel: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
  },
  panelContent: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 48,
    marginBottom: 20,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
  },
  panelDesc: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 24,
  },
  stat: {
    alignItems: "center",
  },
  statNum: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6C5CE7",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  features: {
    width: "100%",
    marginBottom: 24,
  },
  feature: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  actionBtn: {
    width: "100%",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})
