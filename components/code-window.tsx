import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Play, Key, FileText } from 'lucide-react'

interface CodeWindowProps {
  onBack: () => void
  onStartInterview: (title: string, prompt: string) => void
}

export function CodeWindow({ onBack, onStartInterview }: CodeWindowProps) {
  const [accessCode, setAccessCode] = useState('')
  const [title, setTitle] = useState('')
  const [prompt, setPrompt] = useState('')
  const [isCodeVerified, setIsCodeVerified] = useState(false)

  const handleVerifyCode = () => {
    // Mock code verification - in real app, this would validate against a server
    if (accessCode.trim().length >= 6) {
      setIsCodeVerified(true)
      // Auto-populate with sample data for demo
      setTitle('Two Sum Algorithm Challenge')
      setPrompt(`Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]

Constraints:
• 2 <= nums.length <= 10^4
• -10^9 <= nums[i] <= 10^9
• -10^9 <= target <= 10^9
• Only one valid answer exists.`)
    }
  }

  const handleStart = () => {
    if (prompt.trim() && isCodeVerified) {
      onStartInterview(title, prompt)
    }
  }

  return (
    <div className="h-full flex flex-col p-6 bg-background">
  <div className="flex items-center mb-6 border-b border-border pb-4">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mr-4 hover:bg-gray-700 windows-btn"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Interview Access</h1>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full space-y-6">
        {!isCodeVerified ? (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Key className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Enter Your Interview Code</h2>
              <p className="text-gray-400">
                Please enter the access code provided by your interviewer
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              <Input
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-digit access code"
                className="bg-surface border-border text-foreground text-center text-lg tracking-widest focus:ring-2 focus:ring-blue-500"
                maxLength={8}
              />
              
              <Button 
                onClick={handleVerifyCode}
                disabled={accessCode.length < 6}
                className="w-full h-12 text-lg windows-btn bg-primary hover:bg-primary-dark disabled:opacity-50"
              >
                <Key className="mr-2 h-5 w-5" />
                Verify Access Code
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500 mt-8">
              <p>For demo purposes, enter any 6+ character code</p>
            </div>
          </div>
        ) : (
            <div className="space-y-6">
            <div className="flex items-center text-green-400 bg-green-900/20 border border-green-700 rounded p-3">
              <Key className="h-5 w-5 mr-2" />
              <span>Access code verified successfully</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Session Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-surface border-border text-foreground windows-btn focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Problem Statement
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[400px] bg-surface border-border text-foreground resize-none windows-btn focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                <FileText className="inline h-4 w-4 mr-1" />
                Problem loaded and ready to begin
              </div>
              <Button 
                onClick={handleStart}
                className="h-12 px-8 text-lg windows-btn bg-primary hover:bg-primary-dark"
              >
                <Play className="mr-2 h-5 w-5" />
                Begin Interview
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
