import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"

export default function CreateInterview() {
  const handleBack = () => {
    router.back()
  }

  const handleCreateMeeting = () => {
    router.push({
      pathname: "/interview-code",
      params: { type: "meeting" },
    })
  }

  const handleCreateTechnical = () => {
    router.push({
      pathname: "/interview-code",
      params: { type: "technical" },
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#1a1f2e", "#0f1419"]} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Interview</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Choose Interview Type</Text>
            <Text style={styles.subtitle}>Select the type of interview you want to create for your candidates</Text>
          </View>

          <View style={styles.optionsContainer}>
            {/* Meeting Interview Option */}
            <TouchableOpacity style={styles.optionCard} onPress={handleCreateMeeting} activeOpacity={0.8}>
              <LinearGradient
                colors={["rgba(108, 92, 231, 0.1)", "rgba(108, 92, 231, 0.05)"]}
                style={styles.optionGradient}
              >
                <View style={styles.optionIcon}>
                  <Ionicons name="videocam-outline" size={48} color="#6C5CE7" />
                </View>
                <Text style={styles.optionTitle}>New Meeting Interview</Text>
                <Text style={styles.optionDescription}>
                  Create a video conference interview with collaborative coding environment. Perfect for pair
                  programming and real-time discussions.
                </Text>
                <View style={styles.optionFeatures}>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#6C5CE7" />
                    <Text style={styles.featureText}>Video conferencing</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#6C5CE7" />
                    <Text style={styles.featureText}>Collaborative editor</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#6C5CE7" />
                    <Text style={styles.featureText}>Real-time interaction</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Technical Interview Option */}
            <TouchableOpacity style={styles.optionCard} onPress={handleCreateTechnical} activeOpacity={0.8}>
              <LinearGradient
                colors={["rgba(0, 212, 170, 0.1)", "rgba(0, 212, 170, 0.05)"]}
                style={styles.optionGradient}
              >
                <View style={styles.optionIcon}>
                  <Ionicons name="code-slash-outline" size={48} color="#00D4AA" />
                </View>
                <Text style={styles.optionTitle}>New Technical Interview</Text>
                <Text style={styles.optionDescription}>
                  Create a LeetCode-style coding challenge with automated testing. Ideal for assessing algorithmic
                  thinking and coding skills.
                </Text>
                <View style={styles.optionFeatures}>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#00D4AA" />
                    <Text style={styles.featureText}>Coding challenges</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#00D4AA" />
                    <Text style={styles.featureText}>Automated testing</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#00D4AA" />
                    <Text style={styles.featureText}>Performance metrics</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#FFFFFF" },
  headerRight: { width: 40 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 32 },
  titleContainer: { alignItems: "center", marginBottom: 48 },
  title: { fontSize: 28, fontWeight: "bold", color: "#FFFFFF", marginBottom: 12, textAlign: "center" },
  subtitle: { fontSize: 16, color: "#94A3B8", textAlign: "center", lineHeight: 24 },
  optionsContainer: { flex: 1, gap: 24 },
  optionCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  optionGradient: { borderRadius: 20, padding: 24, alignItems: "center" },
  optionIcon: { marginBottom: 20 },
  optionTitle: { fontSize: 22, fontWeight: "bold", color: "#FFFFFF", marginBottom: 12, textAlign: "center" },
  optionDescription: {
    fontSize: 16,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  optionFeatures: { width: "100%", gap: 12 },
  featureItem: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16 },
  featureText: { fontSize: 16, color: "#FFFFFF", marginLeft: 12 },
})
