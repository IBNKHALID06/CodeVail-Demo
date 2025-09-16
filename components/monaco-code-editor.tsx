"use client"

import { useRef, useState } from "react"
import Editor from "@monaco-editor/react"
import type { editor } from "monaco-editor"
import { Loader2, Settings, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MonacoCodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  readOnly?: boolean
  theme?: "vs-dark" | "light" | "vs"
  height?: string
}

export function MonacoCodeEditor({
  value,
  onChange,
  language,
  readOnly = false,
  theme = "vs-dark",
  height = "100%",
}: MonacoCodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fontSize, setFontSize] = useState(14)

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: typeof import("monaco-editor")) => {
    editorRef.current = editor
    setIsLoading(false)

    // Configure editor options
    editor.updateOptions({
      fontSize: fontSize,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', Monaco, Menlo, 'Ubuntu Mono', monospace",
      fontLigatures: true,
      lineNumbers: "on",
      roundedSelection: false,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      minimap: { enabled: true },
      wordWrap: "on",
      tabSize: 4,
      insertSpaces: true,
      detectIndentation: true,
      folding: true,
      foldingStrategy: "indentation",
      showFoldingControls: "always",
      unfoldOnClickAfterEndOfLine: false,
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
      suggest: {
        showKeywords: true,
        showSnippets: true,
        showFunctions: true,
        showConstructors: true,
        showFields: true,
        showVariables: true,
        showClasses: true,
        showStructs: true,
        showInterfaces: true,
        showModules: true,
        showProperties: true,
        showEvents: true,
        showOperators: true,
        showUnits: true,
        showValues: true,
        showConstants: true,
        showEnums: true,
        showEnumMembers: true,
        showColors: true,
        showFiles: true,
        showReferences: true,
        showFolders: true,
        showTypeParameters: true,
      },
      quickSuggestions: {
        other: true,
        comments: false,
        strings: false,
      },
      parameterHints: { enabled: true },
      autoClosingBrackets: "always",
      autoClosingQuotes: "always",
      autoSurround: "languageDefined",
      formatOnPaste: true,
      formatOnType: true,
    })

    // Add custom key bindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Prevent default save behavior
      console.log("Save shortcut pressed")
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

  const setupLanguageFeatures = (monaco: typeof import("monaco-editor"), lang: string) => {
    if (lang === "javascript") {
      // Add JavaScript snippets and IntelliSense
      monaco.languages.registerCompletionItemProvider("javascript", {
        provideCompletionItems: (model, position) => {
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
            {
              label: "while loop",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "while (${1:condition}) {\n\t${2:// loop body}\n}",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Create a while loop",
            },
            {
              label: "if statement",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "if (${1:condition}) {\n\t${2:// if body}\n}",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Create an if statement",
            },
            {
              label: "try-catch",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "try {\n\t${1:// try body}\n} catch (${2:error}) {\n\t${3:// catch body}\n}",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Create a try-catch block",
            },
          ]

          return { suggestions }
        },
      })
    } else if (lang === "python") {
      // Add Python snippets and IntelliSense
      monaco.languages.registerCompletionItemProvider("python", {
        provideCompletionItems: (model, position) => {
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
            {
              label: "for loop",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "for ${1:item} in ${2:iterable}:\n    ${3:# loop body}",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Create a for loop",
            },
            {
              label: "while loop",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "while ${1:condition}:\n    ${2:# loop body}",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Create a while loop",
            },
            {
              label: "if statement",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "if ${1:condition}:\n    ${2:# if body}",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Create an if statement",
            },
            {
              label: "try-except",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "try:\n    ${1:# try body}\nexcept ${2:Exception} as ${3:e}:\n    ${4:# except body}",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Create a try-except block",
            },
            {
              label: "class",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText:
                "class ${1:ClassName}:\n    def __init__(self${2:, parameters}):\n        ${3:# constructor body}\n        pass",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Create a new class",
            },
          ]

          return { suggestions }
        },
      })
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 2, 24)
    setFontSize(newSize)
    if (editorRef.current) {
      editorRef.current.updateOptions({ fontSize: newSize })
    }
  }

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 2, 10)
    setFontSize(newSize)
    if (editorRef.current) {
      editorRef.current.updateOptions({ fontSize: newSize })
    }
  }

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument")?.run()
    }
  }

  return (
    <div className={`relative ${isFullscreen ? "fixed inset-0 z-50 bg-gray-900" : "h-full"}`}>
      {/* Editor Controls */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-gray-800/90 rounded-lg p-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={decreaseFontSize}
          className="h-6 w-6 p-0 text-xs hover:bg-gray-700"
          title="Decrease font size"
        >
          A-
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={increaseFontSize}
          className="h-6 w-6 p-0 text-xs hover:bg-gray-700"
          title="Increase font size"
        >
          A+
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={formatCode}
          className="h-6 w-6 p-0 hover:bg-gray-700"
          title="Format code (Alt+Shift+F)"
        >
          <Settings className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFullscreen}
          className="h-6 w-6 p-0 hover:bg-gray-700"
          title="Toggle fullscreen"
        >
          {isFullscreen ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
        </Button>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-20">
          <div className="flex items-center gap-2 text-white">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading Monaco Editor...</span>
          </div>
        </div>
      )}

      {/* Monaco Editor */}
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={(val) => onChange(val || "")}
        onMount={handleEditorDidMount}
        theme={theme}
        options={{
          readOnly,
          selectOnLineNumbers: true,
          automaticLayout: true,
        }}
        loading={
          <div className="flex items-center justify-center h-full bg-gray-900">
            <div className="flex items-center gap-2 text-white">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading Editor...</span>
            </div>
          </div>
        }
      />

      {/* Keyboard Shortcuts Help */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-gray-800/80 rounded px-2 py-1">
        <div>Ctrl+Enter: Run • Ctrl+S: Save • Alt+Shift+F: Format</div>
      </div>
    </div>
  )
}
