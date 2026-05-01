import React, { useState, useRef, useEffect } from 'react';
import { MisconceptionAlert } from './MisconceptionAlert';
import { ClassificationResult } from '../../lib/ai/misconceptionClassifier';
import { Language, LessonId, Subject } from '../../lib/types/lesson';
import { ChatMessage, MisconceptionRequest, SocraticRequest } from '../../lib/types/ai';
import { SimulationOutput } from '../../lib/types/simulation';

interface SocraticChatProps {
  lessonId: LessonId;
  language: Language;
  subject: Subject;
  simulationState: SimulationOutput;
  onExchange: () => void; // Triggered when AI finishes a response
}

export function SocraticChat({ lessonId, language, subject, simulationState, onExchange }: SocraticChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hello! What did you notice in the simulation?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMisconception, setActiveMisconception] = useState<ClassificationResult | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeMisconception]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    setActiveMisconception(null);

    try {
      // 1. Check for misconceptions first
      const mcRes = await fetch('/api/misconception', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          studentResponse: userMessage.content,
        } satisfies MisconceptionRequest)
      });
      
      if (!mcRes.ok) {
        const errorData = await mcRes.json();
        throw new Error(errorData.error || 'Failed to check misconception');
      }
      
      const { result } = await mcRes.json();
      if (result && result.confidence > 0.7) {
        setActiveMisconception(result);
      }

      // 2. Stream Socratic response
      const socraticPayload: SocraticRequest<typeof simulationState> = {
        lessonId,
        language,
        sessionHistory: messages,
        simState: simulationState,
        studentMessage: userMessage.content,
      };

      const aiRes = await fetch('/api/socratic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socraticPayload)
      });

      if (!aiRes.ok) {
        const errorData = await aiRes.json();
        throw new Error(errorData.error || 'Failed to get tutor response');
      }

      if (!aiRes.body) throw new Error('No response body');

      const reader = aiRes.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        
        // Simple SSE parser
        const lines = chunkValue.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') continue;
            try {
              const data = JSON.parse(dataStr);
              if (data.text) {
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1].content += data.text;
                  return newMessages;
                });
              }
            } catch (e) {
              // Ignore partial JSON chunks
            }
          }
        }
      }
      
      // We completed one full exchange
      onExchange();

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-4 border-b border-[var(--border)] bg-[var(--surface)]">
        <h3 className="font-mono text-sm tracking-wider text-[var(--text-muted)]">SOCRATIC TUTOR</h3>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        <MisconceptionAlert misconception={activeMisconception} />
        
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <span className="text-[10px] text-[var(--text-muted)] font-mono mb-1 px-1 uppercase">
              {msg.role === 'user' ? 'Student' : 'Vigyan Dost'}
            </span>
            <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-[var(--accent)] text-white' 
                : 'bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-primary)]'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="px-4 py-3 rounded-2xl bg-[var(--surface-hover)] border border-[var(--border)] flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        
        {error && (
          <div className="p-3 rounded bg-red-950/30 border border-red-500/50 text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-[var(--border)] bg-[var(--surface)] flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question or explain your hypothesis..."
          disabled={isLoading}
          className="flex-1 bg-[var(--background)] border border-[var(--border)] rounded px-4 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-[var(--accent)] text-white rounded font-medium text-sm hover:brightness-110 disabled:opacity-50 transition-all shadow-sm shadow-[var(--accent-glow)]"
        >
          Send
        </button>
      </form>
    </div>
  );
}
