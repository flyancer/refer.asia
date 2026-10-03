import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, RefreshCw, Copy, Check, ChevronDown, Minimize2, Maximize2, Bot, ArrowRight, User } from 'lucide-react';
import { playTactileClick } from '../utils/audio';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

interface KammoChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  onOpenReferralModal?: () => void;
  onOpenBuyKarma?: () => void;
  onOpenAtsScanner?: () => void;
}

const STARTER_PROMPTS = [
  {
    icon: '⚡',
    label: 'How do employee referrals work on Refer.asia?',
    prompt: 'How does the employee referral process work on Refer.asia and why is it better than cold applying?',
  },
  {
    icon: '💎',
    label: 'Explain ₹99 Karma tokens & tiers',
    prompt: 'How does the ₹99 INR Self-Referral Starter Pack work, and what are the Karma Tiers from Novice to Legend?',
  },
  {
    icon: '🎯',
    label: 'What tech skills are highest in demand?',
    prompt: 'What technical skills (e.g. React, Go, Python, Distributed Systems) are top tech companies in Bengaluru and Singapore looking for right now?',
  },
  {
    icon: '📄',
    label: 'Tips to beat the ATS resume scanner',
    prompt: 'Give me 4 concrete tips to optimize my resume so it passes ATS filters and impresses verified insiders.',
  },
];

export const KammoChatbot: React.FC<KammoChatbotProps> = ({
  isOpen,
  onToggle,
  onOpenReferralModal,
  onOpenBuyKarma,
  onOpenAtsScanner,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content: `👋 Hey! I'm **kammo**. \n\n**kammo can help you** navigate the pan-Asian referral network, bypass the ATS black hole, find top engineering roles, and understand our ₹99 Karma system. \n\nAsk me anything or choose a quick topic below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, messages]);

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || isLoading) return;

    playTactileClick();

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned error: ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.reply || "I'm here to help you navigate referrals, ₹99 Karma packs, and tech opportunities across Asia. Could you rephrase your question?";

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Kammo chat request failed:', err);
      const fallbackMessage: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        role: 'model',
        content: `I'm temporarily having trouble connecting to Gemini, but here are the key highlights:\n\n• **Self-Referrals**: Purchase a 500 Karma starter pack for just ₹99 INR / S$1.60 to refer yourself to any verified insider.\n• **Referees**: Post active openings to earn +250 Karma. Reach 1,000 Karma to unlock a guaranteed reciprocal job vouch shield.\n• **ATS Bypass**: Referrals achieve a 95%+ pass rate compared to ~2% on cold job boards!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    playTactileClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    playTactileClick();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        content: `👋 Hey! I'm **kammo**. \n\n**kammo can help you** with employee referrals, ATS evasion strategies, or exploring ₹99 Karma tokens. What can I do for you?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Render markdown-like bullet formatting cleanly
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      let trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} className="h-2" />;
      }

      // Check if bullet point
      const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*');
      if (isBullet) {
        trimmed = trimmed.replace(/^[•\-\*]\s*/, '');
      }

      // Bold parser
      const parts = trimmed.split(/(\*\*.*?\*\*)/g);

      return (
        <div key={idx} className={isBullet ? 'flex items-start gap-2 pl-1 my-1' : 'my-1'}>
          {isBullet && <span className="text-[#1E3A8A] font-bold text-xs mt-0.5">•</span>}
          <p className="text-xs sm:text-sm leading-relaxed text-[#334155]">
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={pIdx} className="font-semibold text-[#0F172A]">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return <span key={pIdx}>{part}</span>;
            })}
          </p>
        </div>
      );
    });
  };

  return (
    <>
      {/* Floating launcher trigger at bottom-right */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            playTactileClick();
            onToggle();
          }}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 p-2.5 sm:px-4 sm:py-3 rounded-full bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] hover:border-[#1E3A8A] shadow-xl shadow-slate-300/60 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Open kammo chat"
        >
          {/* Blue Glowing Avatar Icon */}
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#1E3A8A] text-white font-bold shadow-md shadow-[#1E3A8A]/30">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#2563EB] border-2 border-white" />
          </div>

          {/* Name & Tagline */}
          <div className="text-left hidden sm:block pr-1">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-sm tracking-wide text-[#0F172A]">kammo</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#EFF6FF] text-[#1E3A8A] border border-[#BFDBFE] uppercase font-semibold">
                AI
              </span>
            </div>
            <div className="text-xs text-[#64748B] font-mono font-medium">kammo can help you</div>
          </div>
        </button>
      )}

      {/* Chat Window Overlay */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-white border border-[#CBD5E1] shadow-2xl shadow-slate-400/40 overflow-hidden ${
            isExpanded
              ? 'inset-3 sm:inset-10 md:inset-16 rounded-3xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[440px] h-[640px] max-h-[88vh] rounded-3xl'
          }`}
        >
          {/* Header */}
          <div className="p-4 sm:px-5 sm:py-3.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between select-none">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-[#1E3A8A] text-white shadow-sm font-bold">
                <Sparkles className="w-5 h-5" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#2563EB] ring-2 ring-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-bold text-[#0A2540] tracking-tight">kammo</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[10px] font-mono font-semibold text-[#1E3A8A]">
                    Gemini 3.5
                  </span>
                </div>
                <p className="text-xs text-[#64748B] font-mono font-normal flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                  kammo can help you
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                title="Reset conversation"
                className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] rounded-xl transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Collapse' : 'Expand'}
                className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] rounded-xl transition-colors hidden sm:block"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  onToggle();
                }}
                title="Close chat"
                className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Hub Navigation Pills */}
          <div className="px-4 py-2 bg-[#F1F5F9] border-b border-[#E2E8F0] flex items-center gap-2 overflow-x-auto text-[11px] font-mono text-[#64748B]">
            <span className="text-[#1E3A8A] uppercase font-semibold">Quick Actions:</span>
            {onOpenReferralModal && (
              <button
                onClick={() => {
                  playTactileClick();
                  onOpenReferralModal();
                }}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#EFF6FF] text-[#0F172A] border border-[#CBD5E1] hover:border-[#1E3A8A] transition-colors whitespace-nowrap shadow-2xs"
              >
                Request Referral
              </button>
            )}
            {onOpenBuyKarma && (
              <button
                onClick={() => {
                  playTactileClick();
                  onOpenBuyKarma();
                }}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#EFF6FF] text-[#1E3A8A] border border-[#CBD5E1] hover:border-[#1E3A8A] transition-colors whitespace-nowrap shadow-2xs font-semibold"
              >
                Buy Karma (₹99)
              </button>
            )}
            {onOpenAtsScanner && (
              <button
                onClick={() => {
                  playTactileClick();
                  onOpenAtsScanner();
                }}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#EFF6FF] text-[#0F172A] border border-[#CBD5E1] hover:border-[#1E3A8A] transition-colors whitespace-nowrap shadow-2xs"
              >
                ATS Scanner
              </button>
            )}
          </div>

          {/* Messages Scrollable Thread */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-white">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs mt-1 shadow-xs">
                      K
                    </div>
                  )}

                  <div className={`relative max-w-[85%] group ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3.5 sm:p-4 rounded-2xl text-sm leading-relaxed ${
                        isUser
                          ? 'bg-[#1E3A8A] text-white rounded-br-xs shadow-xs'
                          : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#334155] rounded-bl-xs shadow-2xs'
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{m.content}</p>
                      ) : (
                        <div>{renderFormattedContent(m.content)}</div>
                      )}
                    </div>

                    {/* Metadata & Copy action */}
                    <div
                      className={`flex items-center gap-2 mt-1 text-[10px] font-mono text-[#94A3B8] ${
                        isUser ? 'justify-end' : 'justify-start pl-1'
                      }`}
                    >
                      <span>{m.timestamp}</span>
                      {!isUser && (
                        <button
                          type="button"
                          onClick={() => handleCopy(m.id, m.content)}
                          title="Copy text"
                          className="opacity-0 group-hover:opacity-100 hover:text-[#1E3A8A] transition-opacity flex items-center gap-1"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-3 h-3 text-[#2563EB]" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {isUser && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs mt-1">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing / Thinking Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs mt-1 animate-pulse">
                  K
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#64748B] flex items-center gap-2 rounded-bl-xs">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping" />
                  <span>kammo is typing...</span>
                </div>
              </div>
            )}

            {/* Prompt Starter Chips */}
            {messages.length <= 2 && !isLoading && (
              <div className="pt-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] mb-2 px-1 font-semibold">
                  Popular questions for Kammo:
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {STARTER_PROMPTS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(item.prompt)}
                      className="p-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#E2E8F0] hover:border-[#93C5FD] text-left transition-all flex items-center justify-between group shadow-2xs"
                    >
                      <div className="flex items-center gap-2 text-xs text-[#0F172A] group-hover:text-[#1E3A8A]">
                        <span className="text-sm">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#1E3A8A] group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Form */}
          <div className="p-3 sm:p-4 bg-[#F8FAFC] border-t border-[#E2E8F0]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask kammo about referrals, skills, or ₹99 karma..."
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-white border border-[#CBD5E1] focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] rounded-xl text-sm text-[#0F172A] placeholder-[#94A3B8] outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-3 rounded-xl font-bold font-mono text-xs flex items-center gap-1.5 shadow-md bg-[#1E3A8A] text-white hover:bg-[#1E40AF] active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </form>

            <div className="mt-2 text-center text-[10px] font-mono text-[#64748B]">
              kammo can help you // Powered by Gemini 3.5 Flash
            </div>
          </div>
        </div>
      )}
    </>
  );
};
