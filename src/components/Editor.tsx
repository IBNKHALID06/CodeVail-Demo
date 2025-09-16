"use client"

import { useRef } from "react"
import Editor from "@monaco-editor/react"
import { useTheme } from "../contexts/ThemeContext"

interface CodeEditorProps {
  language: string
  code: string
  onChange: (value: string) => void
  readOnly?: boolean
  className?: string
}

export function CodeEditor({ language, code, onChange, readOnly = false, className = "" }: CodeEditorProps) {
  const { currentTheme } = useTheme()
  const editorRef = useRef<any>(null)

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor

    // Configure Monaco theme
    monaco.editor.defineTheme("codevail-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "7C8591", fontStyle: "italic" },
        { token: "keyword", foreground: "3B82F6", fontStyle: "bold" },
        { token: "string", foreground: "10B981" },
        { token: "number", foreground: "F59E0B" },
        { token: "function", foreground: "60A5FA" },
        { token: "variable", foreground: "FFFFFF" },
      ],
      colors: {
        "editor.background": "#151A21",
        "editor.foreground": "#FFFFFF",
        "editor.lineHighlightBackground": "#0F1419",
        "editor.selectionBackground": "#3B82F640",
        "editor.inactiveSelectionBackground": "#3B82F620",
        "editorLineNumber.foreground": "#5C6470",
        "editorLineNumber.activeForeground": "#B3B9C4",
        "editorCursor.foreground": "#3B82F6",
        "editor.findMatchBackground": "#F59E0B40",
        "editor.findMatchHighlightBackground": "#F59E0B20",
      },
    })

    if (currentTheme === "dark") {
      monaco.editor.setTheme("codevail-dark")
    } else {
      monaco.editor.setTheme("light")
    }

    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: "JetBrains Mono, Consolas, Monaco, monospace",
      lineHeight: 1.6,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      wordWrap: "on",
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      detectIndentation: false,
      renderWhitespace: "selection",
      renderLineHighlight: "line",
      cursorBlinking: "smooth",
      cursorSmoothCaretAnimation: true,
      smoothScrolling: true,
      mouseWheelZoom: true,
      readOnly: readOnly,
    })

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Prevent default save behavior
      console.log("Save shortcut intercepted")
    })

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      // Custom run shortcut
      const runButton = document.querySelector('[data-testid="run-code-button"]') as HTMLButtonElement
      if (runButton) {
        runButton.click()
      }
    })

    // Setup language-specific features
    setupLanguageFeatures(monaco, language)

    // Focus the editor
    editor.focus()
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value)
    }
  }

  const setupLanguageFeatures = (monaco: any, lang: string) => {
    if (lang === "javascript") {
      // Add JavaScript snippets and IntelliSense
      monaco.languages.registerCompletionItemProvider("javascript", {
        provideCompletionItems: (model: any, position: any) => {
          const suggestions = [
            {
              label: "console.log",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "console.log(${1:message});",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Log a message to the console",
            },
            {
              label: "function",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "function ${1:functionName}(${2:parameters}) {\n\t${3:// function body}\n}",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Create a new function",
            },
            {
              label: "for loop",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "for (let ${1:i} = 0; ${1:i} < ${2:array}.length; ${1:i}++) {\n\t${3:// loop body}\n}",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Create a for loop",
            },
          ]

          return { suggestions }
        },
      })
    } else if (lang === "python") {
      // Add Python snippets and IntelliSense
      monaco.languages.registerCompletionItemProvider("python", {
        provideCompletionItems: (model: any, position: any) => {
          const suggestions = [
            {
              label: "print",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "print(${1:message})",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Print a message to the console",
            },
            {
              label: "def",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "def ${1:function_name}(${2:parameters}):\n    ${3:# function body}\n    pass",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Create a new function",
            },
          ]

          return { suggestions }
        },
      })
    }
  }

  return (
    <div className={`code-editor h-full ${className}`}>
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly: readOnly,
          selectOnLineNumbers: true,
          automaticLayout: true,
          contextmenu: false, // Disable right-click menu for security
        }}
        loading={
          <div className="flex items-center justify-center h-full bg-tertiary">
            <div className="spinner" />
          </div>
        }
      />
    </div>
  )
}
