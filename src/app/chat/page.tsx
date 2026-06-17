'use client'

import { useState, useRef, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { personas, PersonaId } from '@/lib/personas'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const { user } = useUser()
  const [selectedPersona, setSelectedPersona] = useState<PersonaId>('ed')
  const [messages, setMessages] = useState<Record<PersonaId, Message[]>>({
    ed: [],
    edd: [],
    eddy: [],
  })
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const persona = personas[selectedPersona]

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, selectedPersona])

  // Greet on first load per persona
  useEffect(() => {
    if (messages[selectedPersona].length === 0) {
      const greetings: Record<PersonaId, string> = {
        ed: "Hiya! I'm Ed! Don't worry about mistakes — just start talking and we'll have a great time. What's on your mind? 😄",
        edd: "Good day! I'm Edd. I believe understanding the why behind grammar transforms a learner into a true speaker. What would you like to master today?",
        eddy: "Yo! Eddy here. Forget the textbook stuff — I'll teach you how people actually talk. So what's the deal, you wanna sound like a native or what?",
      }
      setMessages((prev) => ({
        ...prev,
        [selectedPersona]: [
          { role: 'assistant', content: greetings[selectedPersona] },
        ],
      }))
    }
  }, [selectedPersona])

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !user) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Add user message
    setMessages((prev) => ({
      ...prev,
      [selectedPersona]: [
        ...prev[selectedPersona],
        { role: 'user', content: userMessage },
      ],
    }))

    // Add empty assistant message for streaming
    setMessages((prev) => ({
      ...prev,
      [selectedPersona]: [
        ...prev[selectedPersona],
        { role: 'assistant', content: '' },
      ],
    }))

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          personaId: selectedPersona,
          userId: user.id,
        }),
      })

      if (!response.ok) throw new Error('API error')

      // Stream the response
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value)

        setMessages((prev) => {
          const current = [...prev[selectedPersona]]
          const last = current[current.length - 1]
          current[current.length - 1] = {
            ...last,
            content: last.content + text,
          }
          return { ...prev, [selectedPersona]: current }
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((prev) => {
        const current = [...prev[selectedPersona]]
        current[current.length - 1] = {
          role: 'assistant',
          content: 'Oops, something went wrong! Try again.',
        }
        return { ...prev, [selectedPersona]: current }
      })
    }

    setIsLoading(false)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const personaColors: Record<PersonaId, string> = {
    ed: 'border-emerald-400 bg-emerald-50',
    edd: 'border-purple-400 bg-purple-50',
    eddy: 'border-orange-400 bg-orange-50',
  }

  const sendBtnColors: Record<PersonaId, string> = {
    ed: 'bg-emerald-500 hover:bg-emerald-600',
    edd: 'bg-purple-500 hover:bg-purple-600',
    eddy: 'bg-orange-500 hover:bg-orange-600',
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-gray-900">Ed, Edd n Eddy</span>
        <span className="text-sm text-gray-400">
          Hey {user?.firstName ?? 'there'} 👋
        </span>
      </header>

      {/* Persona selector */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex gap-3">
        {(Object.keys(personas) as PersonaId[]).map((id) => (
          <button
            key={id}
            onClick={() => setSelectedPersona(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all text-sm font-medium
              ${selectedPersona === id
                ? personaColors[id]
                : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
              }`}
          >
            <span>{personas[id].emoji}</span>
            <span className="text-gray-900">{personas[id].name}</span>
            <span className="hidden md:inline text-gray-400 font-normal">
              — {personas[id].role}
            </span>
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4">
        {messages[selectedPersona].map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0
              ${msg.role === 'user'
                ? 'bg-gray-200 text-gray-600 font-medium'
                : 'bg-white border border-gray-100'
              }`}
            >
              {msg.role === 'user' ? 'You' : persona.emoji}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-100 text-gray-800'
                }`}
            >
              {msg.content || (
                <span className="flex gap-1 items-center">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0ms]"/>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:150ms]"/>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:300ms]"/>
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      <div className="px-6 py-2 flex gap-2 flex-wrap bg-gray-50">
        {persona.suggestions.map((s) => (
          <button
            key={s}
            onClick={() => setInput(s)}
            className="text-xs px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-all"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={`Message ${persona.name}...`}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-all"
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all
            ${sendBtnColors[selectedPersona]}
            disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>

    </div>
  )
}