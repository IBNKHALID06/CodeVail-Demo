"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Dimensions, Platform } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"

const { width, height } = Dimensions.get("window")

export default function CandidateDashboard() {
  const [meetingCode, setMeetingCode] = useState("")
  const [technicalCode, setTechnicalCode] = useState(`// Two Sum Problem
// Given an array of integers nums and an integer target, 
// return indices of the two numbers such that they add up to target.

function twoSum(nums, target) {
    // Your solution here
    
}`)

  const handleSubmitMeeting = () => {
    console.log("Meeting code submitted:", meetingCode)
  }

  const handleSubmitTechnical = () => {
    console.log("Technical solution submitted:", technicalCode)
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
              <Text style={styles.headerSubtitle}>Candidate Dashboard</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Meeting Interview Panel */}
          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <Ionicons name="videocam-outline" size={24} color="#6C5CE7" />
              <Text style={styles.panelTitle}>Meeting Interview</Text>
            </View>

            <ScrollView style={styles.panelContent} showsVerticalScrollIndicator={false}>
              {/* Video Placeholder */}
              <View style={styles.videoPlaceholder}>
                <Ionicons name="videocam-outline" size={48} color="#64748B" />
                <Text style={styles.videoPlaceholderText}>Video Conference</Text>
                <Text style={styles.videoPlaceholderSubtext}>Camera will activate when interview starts</Text>
              </View>

              {/* Code Editor for Meeting */}
              <View style={styles.editorContainer}>
                <Text style={styles.editorLabel}>Collaborative Code Editor</Text>
                <View style={styles.codeEditor}>
                  <TextInput
                    style={styles.codeInput}
                    value={meetingCode}
                    onChangeText={setMeetingCode}
                    placeholder="// Start coding here during the interview..."
                    placeholderTextColor="#64748B"
                    multiline
                    textAlignVertical="top"
                  />
                </View>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmitMeeting}>
                  <LinearGradient colors={["#6C5CE7", "#5A4FCF"]} style={styles.submitButtonGradient}>
                    <Text style={styles.submitButtonText}>Submit Code</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          {/* Technical Interview Panel */}
          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <Ionicons name="code-slash-outline" size={24} color="#00D4AA" />
              <Text style={styles.panelTitle}>Technical Interview</Text>
            </View>

            <ScrollView style={styles.panelContent} showsVerticalScrollIndicator={false}>
              {/* Problem Description */}
              <View style={styles.problemContainer}>
                <Text style={styles.problemTitle}>Problem: Two Sum</Text>
                <Text style={styles.problemDifficulty}>Difficulty: Easy</Text>
                <Text style={styles.problemDescription}>
                  Given an array of integers nums and an integer target, return indices of the two numbers such that
                  they add up to target.
                  {"\n\n"}
                  You may assume that each input would have exactly one solution, and you may not use the same element
                  twice.
                  {"\n\n"}
                  Example 1:{"\n"}
                  Input: nums = [2,7,11,15], target = 9{"\n"}
                  Output: [0,1]
                </Text>
              </View>

              {/* Code Editor for Technical */}
              <View style={styles.editorContainer}>
                <Text style={styles.editorLabel}>Your Solution</Text>
                <View style={styles.codeEditor}>
                  <TextInput
                    style={styles.codeInput}
                    value={technicalCode}
                    onChangeText={setTechnicalCode}
                    multiline
                    textAlignVertical="top"
                  />
                </View>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmitTechnical}>
                  <LinearGradient colors={["#00D4AA", "#00B894"]} style={styles.submitButtonGradient}>
                    <Text style={styles.submitButtonText}>Submit Solution</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  panelContent: {
    flex: 1,
    padding: 16,
  },
  videoPlaceholder: {
    height: 200,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderStyle: "dashed",
  },
  videoPlaceholderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 8,
  },
  videoPlaceholderSubtext: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
  },
  problemContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  problemTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  problemDifficulty: {
    fontSize: 14,
    color: "#00D4AA",
    fontWeight: "500",
    marginBottom: 12,
  },
  problemDescription: {
    fontSize: 14,
    color: "#94A3B8",
    lineHeight: 20,
  },
  editorContainer: {
    flex: 1,
  },
  editorLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  codeEditor: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    minHeight: 200,
  },
  codeInput: {
    flex: 1,
    padding: 16,
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    textAlignVertical: "top",
  },
  submitButton: {
    marginTop: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonGradient: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
})
