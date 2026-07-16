import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import { AI_RESPONSES } from '@/data/mock';

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

const WELCOME: Message = {
  id: '0',
  role: 'assistant',
  text: 'مرحباً! I\'m your NearPay AI Copilot. I can help you understand your debt portfolio, identify overdue accounts, and optimize your collection strategy. How can I help?',
};

export default function AIScreen() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const flatRef = useRef<FlatList>(null);
  const topPad = Platform.OS === 'web' ? 67 : insets.top + 16;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const send = (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const delay = 900 + Math.random() * 600;
    setTimeout(() => {
      const reply = AI_RESPONSES[text.trim()] ??
        `Based on your account data, ${text.trim().toLowerCase().includes('payment') ? 'your best performing customers pay within the first week of the month. I recommend sending reminders on the 25th of each month.' : 'I\'ll analyze your portfolio and provide personalized insights. Your collection rate is currently 70.4%, which is above average for your business category.'}`;
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: reply,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, delay);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <View>
          <Text style={styles.headerTitle}>AI Copilot</Text>
          <Text style={styles.headerSub}>Powered by NearPay Intelligence</Text>
        </View>
        <View style={styles.aiBadge}>
          <Feather name="zap" size={14} color="#8B5CF6" />
          <Text style={styles.aiBadgeTxt}>Active</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Prompt chips */}
        <View style={[styles.chips, { borderBottomColor: colors.border }]}>
          {PROMPTS.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.chip, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => send(p)}
              activeOpacity={0.75}
            >
              <Text style={[styles.chipTxt, { color: colors.foreground }]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.msgList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => (
            <View style={[styles.msgRow, item.role === 'user' && styles.msgRowUser]}>
              {item.role === 'assistant' && (
                <View style={styles.aiAvatar}>
                  <Feather name="zap" size={14} color="#8B5CF6" />
                </View>
              )}
              <View
                style={[
                  styles.bubble,
                  item.role === 'user'
                    ? styles.bubbleUser
                    : [styles.bubbleAI, { backgroundColor: colors.card, borderColor: colors.border }],
                ]}
              >
                <Text
                  style={[
                    styles.bubbleTxt,
                    { color: item.role === 'user' ? '#fff' : colors.foreground },
                  ]}
                >
                  {item.text}
                </Text>
              </View>
            </View>
          )}
          ListFooterComponent={
            loading ? (
              <View style={styles.msgRow}>
                <View style={styles.aiAvatar}>
                  <Feather name="zap" size={14} color="#8B5CF6" />
                </View>
                <View style={[styles.bubble, styles.bubbleAI, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.bubbleTxt, { color: colors.mutedForeground }]}>Thinking...</Text>
                </View>
              </View>
            ) : null
          }
        />

        <View style={[styles.inputRow, { borderTopColor: colors.border, paddingBottom: botPad + 8, backgroundColor: colors.background }]}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            placeholder="Ask anything about your debts..."
            placeholderTextColor={colors.mutedForeground}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => send(input)}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: input.trim() ? '#16A34A' : colors.muted }]}
            onPress={() => send(input)}
            activeOpacity={0.8}
          >
            <Feather name="send" size={18} color={input.trim() ? '#fff' : colors.mutedForeground} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#fff' },
  headerSub: { fontSize: 12, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  aiBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#1E1B4B', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  aiBadgeTxt: { fontSize: 12, fontFamily: 'Inter_500Medium', color: '#A78BFA' },
  chips: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 8, padding: 12, borderBottomWidth: 1,
  },
  chip: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 7 },
  chipTxt: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  msgList: { padding: 16, gap: 12 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgRowUser: { justifyContent: 'flex-end' },
  aiAvatar: {
    width: 30, height: 30, borderRadius: 10,
    backgroundColor: '#EDE9FE', alignItems: 'center', justifyContent: 'center',
  },
  bubble: { maxWidth: '78%', borderRadius: 16, padding: 12 },
  bubbleUser: { backgroundColor: '#16A34A', borderBottomRightRadius: 4 },
  bubbleAI: { borderWidth: 1, borderBottomLeftRadius: 4 },
  bubbleTxt: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, paddingHorizontal: 16, paddingTop: 10, borderTopWidth: 1,
  },
  input: {
    flex: 1, borderRadius: 14, borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 14, fontFamily: 'Inter_400Regular',
  },
  sendBtn: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
});
