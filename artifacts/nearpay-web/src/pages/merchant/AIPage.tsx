import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Send, Sparkles } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '@/components/ui/button';
import { useT } from '../../contexts/LanguageContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const WELCOME_TEXT =
  "مرحباً! I'm your NearPay AI Copilot. I can help you understand your debt portfolio, identify overdue accounts, and optimize your collection strategy. Try one of the prompts below or ask me anything.";

const AI_STATIC_RESPONSE =
  "Based on your account data, I'd recommend prioritizing outreach to customers with debts older than 30 days. Your average collection time is 18 days, which is excellent for your category.";

const PROMPT_RESPONSES: Record<string, string> = {
  who_owes: 'Mohammed Al-Rashid owes the most — SAR 1,250 across 4 debts, and his account has been overdue for 14 days. I recommend sending a payment reminder via WhatsApp today.',
  collection_summary: "You've collected SAR 10,560 this month — 84.7% of your total receivables. Thursday was your strongest collection day. You're on track to exceed last month's total.",
  overdue_alerts: '2 customers have overdue debts:\n• Mohammed Al-Rashid — SAR 1,250 (14 days overdue)\n• Fatima Al-Ghamdi — SAR 850 (10 days overdue)\n\nI recommend contacting Mohammed first as his amount is higher.',
  best_time: 'Based on your payment history, Tuesday and Thursday afternoons (3–6 PM) have your highest payment success rates at 78%. Consider sending reminders on Tuesday mornings for best results.',
};

export default function AIPage() {
  const t = useT();
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', text: WELCOME_TEXT },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const promptKeys = ['ai_prompt_who_owes', 'ai_prompt_collection', 'ai_prompt_overdue', 'ai_prompt_best_time'] as const;
  const promptResponseKeys: Record<string, string> = {
    [t('ai_prompt_who_owes')]: PROMPT_RESPONSES.who_owes,
    [t('ai_prompt_collection')]: PROMPT_RESPONSES.collection_summary,
    [t('ai_prompt_overdue')]: PROMPT_RESPONSES.overdue_alerts,
    [t('ai_prompt_best_time')]: PROMPT_RESPONSES.best_time,
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const reply = promptResponseKeys[text.trim()] ?? AI_STATIC_RESPONSE;
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text: reply }]);
      setLoading(false);
    }, 1200 + Math.random() * 600);
  };

  return (
    <div className="app-container flex flex-col bg-background relative overflow-hidden">
      <div className="absolute top-0 w-full h-[280px] pointer-events-none"
           style={{ background: 'linear-gradient(to bottom, rgba(11,35,65,0.06), transparent)' }} />
      <StatusBar />
      <PageHeader
        title={t('ai_copilot_title')}
        subtitle={t('ai_copilot_sub')}
        action={
          <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold border"
               style={{ background: 'rgba(46,216,195,0.1)', color: '#2ED8C3', borderColor: 'rgba(46,216,195,0.25)' }}>
            <Sparkles size={12} />
            {t('ai_active')}
          </div>
        }
      />

      {/* Prompt Chips */}
      <div className="px-5 py-3 bg-background/80 backdrop-blur-md z-30">
        <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden pb-1">
          {promptKeys.map((pk) => (
            <button
              key={pk}
              onClick={() => send(t(pk))}
              className="flex-shrink-0 px-4 py-2 rounded-[12px] bg-card border border-border/60 text-xs font-bold hover:border-teal/40 transition-colors whitespace-nowrap text-foreground shadow-sm"
            >
              {t(pk)}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5" style={{ paddingBottom: '130px' }}>
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', bounce: 0.25 }}
              className={`flex items-end gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-1 border"
                     style={{ background: 'rgba(46,216,195,0.12)', borderColor: 'rgba(46,216,195,0.25)' }}>
                  <Zap size={13} style={{ color: '#2ED8C3' }} />
                </div>
              )}
              <div className={`max-w-[80%] rounded-[22px] px-4 py-3.5 text-sm font-medium leading-relaxed whitespace-pre-line ${
                m.role === 'user'
                  ? 'text-white rounded-br-sm'
                  : 'bg-card border border-border/60 text-foreground rounded-bl-sm shadow-sm'
              }`} style={m.role === 'user' ? { background: 'linear-gradient(135deg, #0B2341, #143B63)' } : {}}>
                {m.text}
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-end gap-2.5"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-1 border"
                   style={{ background: 'rgba(46,216,195,0.12)', borderColor: 'rgba(46,216,195,0.25)' }}>
                <Zap size={13} style={{ color: '#2ED8C3' }} />
              </div>
              <div className="bg-card border border-border/60 rounded-[22px] rounded-bl-sm px-4 py-3.5 shadow-sm">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, delay: i * 0.15, duration: 0.6 }}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: '#2ED8C3' }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="absolute bottom-[76px] left-0 right-0 px-5 pb-3 pt-4 z-40"
           style={{ background: 'linear-gradient(to top, var(--background) 70%, transparent)' }}>
        <div className="flex gap-2 items-center bg-card border border-border/60 rounded-[18px] p-1.5 shadow-soft">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder={t('ai_input_placeholder')}
            className="flex-1 h-11 bg-transparent px-3 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <Button
            size="icon"
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="h-11 w-11 rounded-[14px] disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #2ED8C3, #19B8D3)', color: '#0B2341' }}
          >
            <Send size={16} className="ms-0.5 rtl-flip" />
          </Button>
        </div>
      </div>

      <BottomNav role="merchant" />
    </div>
  );
}
