"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert, Share } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import * as Clipboard from "expo-clipboard"

export default function InterviewCode() {
  const { type } = useLocalSearchParams<{ type: string }>()
  const [code, setCode] = useState("")

  useEffect(() => {
    const prefix = type === "meeting" ? "MEET" : "TECH"
    const num = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
    setCode(`${prefix}-${num}`)
  }, [type])

  const copyCode = async () => {
    await Clipboard.setStringAsync(code)
    Alert.alert("Copied!", "Interview code copied to clipboard")
  }

  const shareCode = async () => {
    try {
      await Share.share({
        message: `Your CodeVail interview code is: ${code}\n\nUse this code to join your interview.`,
      })
    } catch (error) {
      console.error("Share error:", error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Interview Code</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.success}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>Interview Created!</Text>
          <Text style={styles.successDesc}>Share this code with your candidate</Text>
        </View>

        <View style={styles.codeContainer}>
          <Text style={styles.codeType}>{type === "meeting" ? "📹 Meeting" : "💻 Technical"} Interview</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{code}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#6C5CE7" }]} onPress={copyCode}>
              <Text style={styles.actionText}>📋 Copy Code</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn} onPress={shareCode}>
              <Text style={styles.shareText}>📤 Share Code</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructTitle}>Instructions for Candidate:</Text>
          <Text style={styles.instructText}>1. Open CodeVail app</Text>
          <Text style={styles.instructText}>2. Select "Sign in as Candidate"</Text>
          <Text style={styles.instructText}>3. Enter code: {code}</Text>
          <Text style={styles.instructText}>4. Complete the {type} interview</Text>
        </View>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.createAnother}>Create Another Interview</Text>
        </TouchableOpacity>
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
  success: {
    alignItems: "center",
    marginBottom: 32,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  successTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  successDesc: {
    color: "#94A3B8",
    fontSize: 14,
  },
  codeContainer: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  codeType: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  codeBox: {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
    borderStyle: "dashed",
  },
  codeText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  shareBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },
  shareText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  instructions: {
    marginBottom: 24,
  },
  instructTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  instructText: {
    color: "#94A3B8",
    fontSize: 14,
    marginBottom: 4,
  },
  createAnother: {
    color: "#6C5CE7",
    fontSize: 16,
    textAlign: "center",
  },
})
