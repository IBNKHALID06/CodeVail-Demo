import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Play, Code2, FileText } from 'lucide-react'

interface CodeSnippetWindowProps {
  onBack: () => void
  onStartInterview: (title: string, codeSnippet: string, language: string) => void
}

export function CodeSnippetWindow({ onBack, onStartInterview }: CodeSnippetWindowProps) {
  const [title, setTitle] = useState('')
  const [codeSnippet, setCodeSnippet] = useState('')
  const [language, setLanguage] = useState('javascript')

  const handleStart = () => {
    if (codeSnippet.trim()) {
      onStartInterview(title, codeSnippet, language)
    }
  }

  const sampleCode = `// Two Sum Problem
// Given an array of integers nums and an integer target, 
// return indices of the two numbers such that they add up to target.

function twoSum(nums, target) {
    // TODO: Implement your solution here
    
}

// Test cases:
// console.log(twoSum([2,7,11,15], 9)); // Expected: [0,1]
// console.log(twoSum([3,2,4], 6));     // Expected: [1,2]
// console.log(twoSum([3,3], 6));       // Expected: [0,1]`

  const loadSample = () => {
    setTitle('Two Sum Algorithm Challenge')
    setCodeSnippet(sampleCode)
    setLanguage('javascript')
  }

  return (
    <div className="h-full flex flex-col p-6 bg-gradient-surface">
  <div className="flex items-center mb-6 border-b border-border pb-4">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mr-4 hover:bg-gray-700/50 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center">
          <Code2 className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">New Coding Challenge</h1>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Challenge Title (Optional)
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Two Sum Problem, Binary Tree Traversal..."
              className="bg-surface/50 border-border text-foreground focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Programming Language
            </label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="bg-surface/50 border-border text-foreground focus:ring-2 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-surface border-border">
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="csharp">C#</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-300">
              Code Snippet / Challenge *
            </label>
            <Button 
              onClick={loadSample}
              variant="outline"
              size="sm"
              className="border-border hover:border-primary text-foreground-secondary"
            >
              <FileText className="h-4 w-4 mr-1" />
              Load Sample
            </Button>
          </div>
          <Textarea
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            placeholder="Paste your coding challenge here..."
            className="min-h-[400px] bg-surface/50 border-border text-foreground resize-none font-mono text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            <Code2 className="inline h-4 w-4 mr-1" />
            Ready to start your coding challenge
          </div>
          <Button 
            onClick={handleStart}
            disabled={!codeSnippet.trim()}
            className="h-12 px-8 text-lg bg-primary hover:bg-primary-dark disabled:opacity-50 shadow-lg text-white"
          >
            <Play className="mr-2 h-5 w-5" />
            Start Challenge
          </Button>
        </div>
      </div>
    </div>
  )
}
