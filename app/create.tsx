import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { router } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

export default function CreateInterview() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Interview</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Choose Interview Type</Text>
        <Text style={styles.subtitle}>Select the type of interview for your candidates</Text>

        <View style={styles.options}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => router.push({ pathname: "/code", params: { type: "meeting" } })}
          >
            <Text style={styles.optionIcon}>📹</Text>
            <Text style={styles.optionTitle}>New Meeting Interview</Text>
            <Text style={styles.optionDesc}>
              Video conference interview with collaborative coding. Perfect for pair programming.
            </Text>
            <View style={styles.features}>
              <Text style={styles.feature}>✓ Video conferencing</Text>
              <Text style={styles.feature}>✓ Collaborative editor</Text>
              <Text style={styles.feature}>✓ Real-time interaction</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => router.push({ pathname: "/code", params: { type: "technical" } })}
          >
            <Text style={styles.optionIcon}>💻</Text>
            <Text style={styles.optionTitle}>New Technical Interview</Text>
            <Text style={styles.optionDesc}>
              LeetCode-style coding challenge with automated testing. Ideal for algorithmic assessment.
            </Text>
            <View style={styles.features}>
              <Text style={styles.feature}>✓ Coding challenges</Text>
              <Text style={styles.feature}>✓ Automated testing</Text>
              <Text style={styles.feature}>✓ Performance metrics</Text>
            </View>
          </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 32,
  },
  options: {
    gap: 20,
  },
  option: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  optionIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  optionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  optionDesc: {
    color: "#94A3B8",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  features: {
    width: "100%",
  },
  feature: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 4,
    textAlign: "center",
  },
})
