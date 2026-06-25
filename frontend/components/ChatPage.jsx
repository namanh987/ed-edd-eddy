'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getConversation, streamChat, deleteConversation } from '@/lib/api';
import { PERSONA_CONFIG } from '@/lib/personas';
import styles from '@/styles/Chat.module.css';

function TypingDots({ color }) {
  return (
    <div className={styles.typingDots}>
      {[0,1,2].map(i => (
        <span key={i} className={styles.dot} style={{ background: color, animationDelay: `${i*0.2}s` }} />
      ))}
    </div>
  );
}

function Message({ msg, persona }) {
  const p = PERSONA_CONFIG[persona];
  const isUser = msg.role === 'user';
  return (
    <div className={`${styles.msgRow} ${isUser ? styles.userRow : styles.assistantRow}`}>
      {!isUser && (
        <div className={styles.avatarBubble} style={{ background: p.color }}>
          {p.emoji}
        </div>
      )}
      <div
        className={`${styles.bubble} ${isUser ? styles.userBubble : styles.assistantBubble}`}
        style={!isUser ? { borderColor: p.color, background: p.bgColor, color: p.textColor } : {}}
      >
        <p className={styles.bubbleText}>{msg.content}</p>
      </div>
    </div>
  );
}

export default function ChatPage({ conversationId }) {
  const router = useRouter();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getConversation(conversationId);
        setConversation(data);
        setMessages(data.messages || []);
      } catch {
        setError('Could not load conversation');
      }
    }
    load();
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;
    setInput('');
    setStreaming(true);
    setStreamingText('');
    setError(null);

    // Optimistic user message
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: text }]);

    let accumulated = '';
    await streamChat(
      conversationId,
      text,
      (chunk) => {
        accumulated += chunk;
        setStreamingText(accumulated);
      },
      () => {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: accumulated }]);
        setStreamingText('');
        setStreaming(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      },
      (err) => {
        setError(err || 'Something went wrong');
        setStreaming(false);
      }
    );
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this conversation?')) return;
    await deleteConversation(conversationId);
    router.push('/');
  }

  if (!conversation) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingDots}>
          <span>.</span><span>.</span><span>.</span>
        </div>
      </div>
    );
  }

  const p = PERSONA_CONFIG[conversation.persona];

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header} style={{ borderBottomColor: p.color }}>
        <button className={styles.backBtn} onClick={() => router.push('/')} aria-label="Back to home">
          ← Back
        </button>
        <div className={styles.headerCenter}>
          <div className={styles.headerAvatar} style={{ background: p.color }}>
            {p.emoji}
          </div>
          <div>
            <span className={styles.headerName} style={{ color: p.textColor }}>{p.fullName}</span>
            <span className={styles.headerRole}>{p.role}</span>
          </div>
        </div>
        <button className={styles.deleteBtn} onClick={handleDelete} aria-label="Delete conversation">
          🗑
        </button>
      </header>

      {/* Messages */}
      <div className={styles.messages}>
        {messages.length === 0 && !streaming && (
          <div className={styles.emptyState}>
            <div className={styles.emptyEmoji}>{p.emoji}</div>
            <p className={styles.emptyText} style={{ color: p.color }}>
              {p.catchphrase}
            </p>
            <p className={styles.emptyHint}>Say hello and start learning English!</p>
          </div>
        )}
        {messages.map((msg) => (
          <Message key={msg.id} msg={msg} persona={conversation.persona} />
        ))}
        {streaming && streamingText && (
          <div className={`${styles.msgRow} ${styles.assistantRow}`}>
            <div className={styles.avatarBubble} style={{ background: p.color }}>{p.emoji}</div>
            <div className={styles.bubble} style={{ borderColor: p.color, background: p.bgColor, color: p.textColor }}>
              <p className={styles.bubbleText}>{streamingText}</p>
            </div>
          </div>
        )}
        {streaming && !streamingText && (
          <div className={`${styles.msgRow} ${styles.assistantRow}`}>
            <div className={styles.avatarBubble} style={{ background: p.color }}>{p.emoji}</div>
            <TypingDots color={p.color} />
          </div>
        )}
        {error && <p className={styles.error}>{error}</p>}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className={styles.inputArea} style={{ borderTopColor: p.color }}>
        <textarea
          ref={inputRef}
          className={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={`Ask ${p.name} something in English...`}
          rows={1}
          disabled={streaming}
          style={{ '--focus-color': p.color }}
        />
        <button
          className={styles.sendBtn}
          style={{ background: p.color }}
          onClick={send}
          disabled={streaming || !input.trim()}
          aria-label="Send message"
        >
          {streaming ? '...' : '→'}
        </button>
      </div>
    </div>
  );
}
