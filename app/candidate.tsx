"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native"
import { router } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

export default function CandidateDashboard() {
  const [meetingCode, setMeetingCode] = useState("")
  const [technicalCode, setTechnicalCode] = useState(`// Two Sum Problem
function twoSum(nums, target) {
    // Your solution here
    
}`)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CodeVail - Candidate</Text>
        <TouchableOpacity onPress={() => router.replace("/")}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Meeting Interview Panel */}
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>📹 Meeting Interview</Text>
          </View>
          <ScrollView style={styles.panelContent}>
            <View style={styles.videoPlaceholder}>
              <Text style={styles.placeholderText}>📹 Video Conference</Text>
              <Text style={styles.placeholderSub}>Camera activates during interview</Text>
            </View>
            <Text style={styles.editorLabel}>Collaborative Code Editor</Text>
            <TextInput
              style={styles.codeEditor}
              value={meetingCode}
              onChangeText={setMeetingCode}
              placeholder="// Start coding here..."
              placeholderTextColor="#64748B"
              multiline
            />
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: "#6C5CE7" }]}
              onPress={() => Alert.alert("Success", "Meeting code submitted!")}
            >
              <Text style={styles.submitText}>Submit Code</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Technical Interview Panel */}
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>💻 Technical Interview</Text>
          </View>
          <ScrollView style={styles.panelContent}>
            <View style={styles.problemBox}>
              <Text style={styles.problemTitle}>Problem: Two Sum</Text>
              <Text style={styles.problemText}>
                Given an array of integers nums and an integer target, return indices of the two numbers that add up to
                target.
                {"\n\n"}
                Example: nums = [2,7,11,15], target = 9 → Output: [0,1]
              </Text>
            </View>
            <Text style={styles.editorLabel}>Your Solution</Text>
            <TextInput style={styles.codeEditor} value={technicalCode} onChangeText={setTechnicalCode} multiline />
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: "#00D4AA" }]}
              onPress={() => Alert.alert("Success", "Technical solution submitted!")}
            >
              <Text style={styles.submitText}>Submit Solution</Text>
            </TouchableOpacity>
          </ScrollView>
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
  panelHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  panelTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  panelContent: {
    flex: 1,
    padding: 16,
  },
  videoPlaceholder: {
    height: 150,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
    borderStyle: "dashed",
  },
  placeholderText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  placeholderSub: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 4,
  },
  problemBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  problemTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  problemText: {
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 20,
  },
  editorLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  codeEditor: {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 12,
    padding: 16,
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "monospace",
    minHeight: 150,
    marginBottom: 16,
    textAlignVertical: "top",
  },
  submitBtn: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})
