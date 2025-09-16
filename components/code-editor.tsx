"use client"

import { MonacoCodeEditor } from "@/components/monaco-code-editor"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
  language?: string
}

export function CodeEditor({ value, onChange, readOnly = false, language = "javascript" }: CodeEditorProps) {
  // Map language names to Monaco language identifiers
  const getMonacoLanguage = (lang: string) => {
    switch (lang.toLowerCase()) {
      case "javascript":
      case "js":
        return "javascript"
      case "python":
      case "py":
        return "python"
      case "java":
        return "java"
      case "cpp":
      case "c++":
        return "cpp"
      case "csharp":
      case "c#":
        return "csharp"
      case "go":
        return "go"
      case "rust":
        return "rust"
      case "typescript":
      case "ts":
        return "typescript"
      default:
        return "javascript"
    }
  }

  return (
    <MonacoCodeEditor
      value={value}
      onChange={onChange}
      language={getMonacoLanguage(language)}
      readOnly={readOnly}
      theme="vs-dark"
    />
  )
}
