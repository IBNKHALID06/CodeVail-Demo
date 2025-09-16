import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Play } from 'lucide-react'

interface PromptWindowProps {
  onBack: () => void
  onStartInterview: (title: string, prompt: string) => void
}

export function PromptWindow({ onBack, onStartInterview }: PromptWindowProps) {
  const [title, setTitle] = useState('')
  const [prompt, setPrompt] = useState('')

  const handleStart = () => {
    if (prompt.trim()) {
      onStartInterview(title, prompt)
    }
  }

  return (
    <div className="h-full flex flex-col p-8">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mr-4 hover:bg-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">New Interview Session</h1>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Prompt Title (Optional)
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Two Sum Problem, Binary Tree Traversal..."
            className="bg-surface border-border text-foreground focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Interview Prompt *
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Paste your coding interview prompt here..."
            className="min-h-[400px] bg-surface border-border text-foreground resize-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleStart}
            disabled={!prompt.trim()}
            className="h-12 px-8 text-lg bg-primary hover:bg-primary-dark disabled:opacity-50"
          >
            <Play className="mr-2 h-5 w-5" />
            Start Interview
          </Button>
        </div>
      </div>
    </div>
  )
}
