// Centralized configuration for anti-cheat banned entities
// These are used by UI simulators and can be referenced by backend/proctoring as needed.

export const BANNED_PROCESSES: string[] = [
  "cluely.exe",
  "chatgpt.exe",
  "copilot.exe",
  "stackoverflow.exe",
  // Common communication/collab tools
  "discord.exe",
  "slack.exe",
  "teams.exe",
  "whatsapp.exe",
  "telegram.exe",
  // Conferencing/remote control/recording
  "zoom.exe",
  "skype.exe",
  "obs64.exe",
  "anydesk.exe",
  "teamviewer.exe",
  "ultraviewer.exe",
  "chrome-remote-desktop.exe",
]

export const BANNED_DOMAINS: string[] = [
  "chat.openai.com",
  "openai.com",
  "chatgpt.com",
  "copilot.microsoft.com",
  "githubcopilot.com",
  "stackoverflow.com",
  // Communications
  "discord.com",
  "slack.com",
  "teams.microsoft.com",
  "web.whatsapp.com",
  "telegram.org",
  // Conferencing
  "zoom.us",
  "skype.com",
]
