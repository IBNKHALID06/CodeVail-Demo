import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { router } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

export default function MainLogin() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>{"<>"}</Text>
          </View>
          <Text style={styles.title}>CodeVail</Text>
          <Text style={styles.subtitle}>Secure Coding Interview Platform</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, styles.candidateBtn]}
            onPress={() => router.push({ pathname: "/login", params: { role: "candidate" } })}
          >
            <Text style={styles.buttonText}>👨‍💻 Sign in as Candidate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.interviewerBtn]}
            onPress={() => router.push({ pathname: "/login", params: { role: "interviewer" } })}
          >
            <Text style={styles.buttonText}>👩‍🏫 Sign in as Interviewer</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Secure • Monitored • Professional</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1f2e",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  logoSection: {
    alignItems: "center",
    marginTop: 60,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: "#6C5CE7",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#94A3B8",
    textAlign: "center",
  },
  buttons: {
    gap: 20,
  },
  button: {
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  candidateBtn: {
    backgroundColor: "#6C5CE7",
  },
  interviewerBtn: {
    backgroundColor: "#00D4AA",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  footer: {
    textAlign: "center",
    color: "#64748B",
    fontSize: 12,
    marginBottom: 20,
  },
})
