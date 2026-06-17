import { db } from './db'
import { PersonaId } from './personas'

export interface MessageData {
  role: 'user' | 'assistant'
  content: string
}

// Get or create a session for a user + persona combination
export async function getOrCreateSession(
  userId: string,
  persona: PersonaId
): Promise<string> {
  const existing = await db.session.findFirst({
    where: { userId, persona },
    orderBy: { createdAt: 'desc' },
  })

  if (existing) return existing.id

  const newSession = await db.session.create({
    data: { userId, persona },
  })

  return newSession.id
}

// Load last N messages for context window
export async function loadHistory(
  sessionId: string,
  limit: number = 20
): Promise<MessageData[]> {
  const messages = await db.message.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'asc' },
    take: limit,
  })

  return messages.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }))
}

// Save a single message to the database
export async function saveMessage(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<void> {
  await db.message.create({
    data: { sessionId, role, content },
  })
}

// Update progress counter for a user + persona
export async function updateProgress(
  userId: string,
  persona: PersonaId
): Promise<void> {
  await db.progress.upsert({
    where: { userId_persona: { userId, persona } },
    update: {
      messageCount: { increment: 1 },
      lastActiveAt: new Date(),
    },
    create: {
      userId,
      persona,
      messageCount: 1,
    },
  })
}

// Get progress for all three personas
export async function getUserProgress(userId: string) {
  return await db.progress.findMany({
    where: { userId },
  })
}