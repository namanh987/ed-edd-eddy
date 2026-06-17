import { GoogleGenerativeAI } from '@google/generative-ai'
import { getPersona, PersonaId } from '@/lib/personas'
import { getOrCreateSession, loadHistory, saveMessage, updateProgress } from '@/lib/memory'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

export async function POST(req: Request) {
  try {
    const { message, personaId, userId } = await req.json()

    if (!message || !personaId || !userId) {
      return Response.json(
        { error: 'Missing message, personaId or userId' },
        { status: 400 }
      )
    }

    const persona = getPersona(personaId as PersonaId)
    const sessionId = await getOrCreateSession(userId, personaId)
    const history = await loadHistory(sessionId, 20)

    await saveMessage(sessionId, 'user', message)

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: persona.systemPrompt,
    })

    const geminiHistory = history.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const chat = model.startChat({
      history: geminiHistory,
    })

    const result = await chat.sendMessageStream(message)

    let fullResponse = ''

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text()
          fullResponse += text
          controller.enqueue(new TextEncoder().encode(text))
        }

        await saveMessage(sessionId, 'assistant', fullResponse)
        await updateProgress(userId, personaId)

        controller.close()
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error) {
    console.error('Chat API error full:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
    return Response.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}