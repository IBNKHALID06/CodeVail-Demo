import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"

const { width, height } = Dimensions.get("window")

export default function InterviewerDashboard() {
  const handleViewResults = () => {
    router.push("/results")
  }

  const handleCreateInterview = () => {
    router.push("/create-interview")
  }

  const handleLogout = () => {
    router.replace("/")
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#1a1f2e", "#0f1419"]} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoSymbol}>{"<>"}</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>CodeVail</Text>
              <Text style={styles.headerSubtitle}>Interviewer Dashboard</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Results Side */}
          <View style={styles.panel}>
            <View style={styles.panelContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="analytics-outline" size={64} color="#6C5CE7" />
              </View>
              <Text style={styles.panelTitle}>Interview Results</Text>
              <Text style={styles.panelDescription}>
                View performance summaries and detailed results from all candidates who have completed interviews using
                your codes.
              </Text>

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>24</Text>
                  <Text style={styles.statLabel}>Total Interviews</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>18</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>6</Text>
                  <Text style={styles.statLabel}>In Progress</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.actionButton} onPress={handleViewResults} activeOpacity={0.8}>
                <LinearGradient colors={["#6C5CE7", "#5A4FCF"]} style={styles.buttonGradient}>
                  <Ionicons name="analytics-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.buttonText}>View Results</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Create Interview Side */}
          <View style={styles.panel}>
            <View style={styles.panelContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="add-circle-outline" size={64} color="#00D4AA" />
              </View>
              <Text style={styles.panelTitle}>Create Interview</Text>
              <Text style={styles.panelDescription}>
                Generate new interview codes for candidates. Choose between meeting-style interviews or technical coding
                challenges.
              </Text>

              <View style={styles.featuresContainer}>
                <View style={styles.featureItem}>
                  <Ionicons name="videocam-outline" size={20} color="#00D4AA" />
                  <Text style={styles.featureText}>Meeting Interviews</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="code-slash-outline" size={20} color="#00D4AA" />
                  <Text style={styles.featureText}>Technical Challenges</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="shield-checkmark-outline" size={20} color="#00D4AA" />
                  <Text style={styles.featureText}>Secure Monitoring</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.actionButton} onPress={handleCreateInterview} activeOpacity={0.8}>
                <LinearGradient colors={["#00D4AA", "#00B894"]} style={styles.buttonGradient}>
                  <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Create Interview</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#6C5CE7",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoSymbol: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#94A3B8",
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  mainContent: {
    flex: 1,
    flexDirection: "row",
    padding: 16,
    gap: 16,
  },
  panel: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  panelContent: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 24,
  },
  panelTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
  },
  panelDescription: {
    fontSize: 16,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 32,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6C5CE7",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
  featuresContainer: {
    width: "100%",
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  featureText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginLeft: 12,
  },
  actionButton: {
    width: "100%",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
})
