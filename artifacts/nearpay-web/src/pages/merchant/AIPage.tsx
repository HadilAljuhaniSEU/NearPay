import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Send, Sparkles } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const PROMPTS = [
  'Who owes the most?',
  'Collection summary',
  'Overdue alerts',
  'Best time to collect',
];

const AI_RESPONSES: Record<string, string> = {
  'Who owes the most?': 'Mohammed Al-Rashid owes the most — SAR 1,250 across 4 debts, and his account has been overdue for 14 days. I recommend sending a payment reminder via WhatsApp today.',
  'Collection summary': "You've collected SAR 10,560 this month — 84.7% of your total receivables. Thursday was your strongest collection day. You're on track to exceed last month's total.",
  'Overdue alerts': '2 customers have overdue debts:\n• Mohammed Al-Rashid — SAR 1,250 (14 days overdue)\n• Fatima Al-Ghamdi — SAR 850 (10 days overdue)\n\nI recommend contacting Mohammed first as his amount is higher.',
  'Best time to collect': 'Based on your payment history, Tuesday and Thursday afternoons (3–6 PM) have your highest payment success rates at 78%. Consider sending reminders on Tuesday mornings for best results.',
};

const WELCOME: Message = {
  id: '0',
  role: 'assistant',
  text: "مرحباً! I'm your NearPay AI Copilot. I can help you understand your debt portfolio, identify overdue accounts, and optimize your collection strategy. Try one of the prompts below or ask me anything.",
};

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

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
      const reply =
        AI_RESPONSES[text.trim()] ??
        "Based on your account data, I'd recommend prioritizing outreach to customers with debts older than 30 days. Your average collection time is 18 days, which is excellent for your category.";
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text: reply }]);
      setLoading(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className="app-container flex flex-col bg-background relative overflow-hidden">
      <div className="absolute top-0 w-full h-[300px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      <StatusBar />
      <PageHeader
        title="AI Copilot"
        subtitle="NearPay Intelligence"
        action={
          <div className="flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-3 py-1.5 text-xs font-bold shadow-sm border border-primary/20">
            <Sparkles size={14} />
            Active
          </div>
        }
      />

      {/* Prompt Chips */}
      <div className="px-6 py-4 bg-background/80 backdrop-blur-md z-30">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="flex-shrink-0 px-4 py-2 rounded-[14px] bg-card border border-border text-sm font-bold shadow-sm hover:border-primary/50 transition-colors whitespace-nowrap text-foreground"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6" style={{ paddingBottom: '120px' }}>
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className={`flex items-end gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mb-1 border border-primary/20">
                  <Zap size={14} className="text-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-[24px] px-5 py-4 text-sm font-medium leading-relaxed whitespace-pre-line shadow-sm ${
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-card border border-border text-foreground rounded-bl-sm'
                }`}
              >
                {m.text}
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="flex items-end gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mb-1 border border-primary/20">
                <Zap size={14} className="text-primary" />
              </div>
              <div className="bg-card border border-border rounded-[24px] rounded-bl-sm px-5 py-4 shadow-sm">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, delay: i * 0.15, duration: 0.6 }}
                      className="w-1.5 h-1.5 bg-primary rounded-full"
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
      <div className="absolute bottom-[80px] left-0 right-0 px-6 pb-4 pt-4 bg-gradient-to-t from-background via-background/95 to-transparent z-40">
        <div className="flex gap-2 items-center bg-card border border-border rounded-[20px] p-1.5 shadow-soft">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder="Ask Copilot..."
            className="flex-1 h-12 bg-transparent px-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <Button
            size="icon"
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="h-12 w-12 rounded-[16px] bg-primary text-primary-foreground disabled:opacity-50"
          >
            <Send size={18} className="ml-1" />
          </Button>
        </div>
      </div>

      <BottomNav role="merchant" />
    </div>
  );
}