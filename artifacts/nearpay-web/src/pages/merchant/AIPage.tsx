import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Send } from 'lucide-react';
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
    }, 900 + Math.random() * 500);
  };

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader
        title="AI Copilot"
        subtitle="Powered by NearPay Intelligence"
        action={
          <div className="flex items-center gap-1.5 bg-violet-100 text-violet-600 rounded-full px-3 py-1.5 text-xs font-semibold">
            <Zap size={12} />
            Active
          </div>
        }
      />

      {/* Prompt Chips */}
      <div className="px-6 py-3 border-b border-border flex gap-2 overflow-x-auto no-scrollbar">
        {PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => send(p)}
            className="flex-shrink-0 px-3.5 py-2 rounded-full bg-secondary border border-border text-sm text-foreground font-medium hover:bg-secondary/70 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4" style={{ paddingBottom: '100px' }}>
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-end gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                <Zap size={14} className="text-violet-600" />
              </div>
            )}
            <div
              className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-end gap-2"
          >
            <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
              <Zap size={14} className="text-violet-600" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, delay: i * 0.15, duration: 0.6 }}
                    className="w-1.5 h-1.5 bg-muted-foreground rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="absolute bottom-16 left-0 right-0 px-6 pb-4 bg-background/95 backdrop-blur-md border-t border-border pt-3">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder="Ask anything about your debts..."
            className="flex-1 h-11 rounded-xl border border-border bg-secondary/50 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Button
            size="icon"
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="h-11 w-11 rounded-xl bg-primary text-primary-foreground disabled:opacity-40"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>

      <BottomNav role="merchant" />
    </div>
  );
}
