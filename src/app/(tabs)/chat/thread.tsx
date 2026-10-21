import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useChat, type UiChatMessage } from '../../../hooks/useChat';

type Message = UiChatMessage;

export default function ChatThreadScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const { messages, isTyping, sendMessage } = useChat();
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    const t = input.trim();
    setInput('');
    await sendMessage(t);
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#ab3500" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                <MaterialCommunityIcons name="dog" size={20} color="#ab3500" />
              </View>
              <View style={styles.onlineDot} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Chat with Cooper's AI</Text>
              <Text style={styles.headerSub}>ALWAYS LEARNING ABOUT COOPER</Text>
            </View>
          </View>
          <TouchableOpacity>
            <MaterialCommunityIcons name="dots-vertical" size={22} color="#4c5f7e" />
          </TouchableOpacity>
        </View>

        {/* MESSAGES */}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {/* DATE MARKER */}
          <View style={styles.dateMarker}>
            <Text style={styles.dateText}>TODAY</Text>
          </View>

          {messages.map(msg => (
            <View key={msg.id}>
              {msg.role === 'ai' ? (
                <View style={styles.aiMsgWrapper}>
                  {msg.isInsight ? (
                    <View style={styles.insightBubble}>
                      <View style={styles.insightHeader}>
                        <MaterialCommunityIcons name="chart-line" size={14} color="#ab3500" />
                        <Text style={styles.insightTag}>HEALTH INSIGHT</Text>
                      </View>
                      <Text style={styles.insightText}>{msg.text}</Text>
                      <View style={styles.insightBadge}>
                        <MaterialCommunityIcons name="heart" size={12} color="#ab3500" />
                        <Text style={styles.insightBadgeText}>Mood: Joyful</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.aiBubble}>
                      <Text style={styles.aiBubbleText}>{msg.text}</Text>
                    </View>
                  )}
                  <Text style={styles.timeText}>{msg.time}</Text>
                </View>
              ) : (
                <View style={styles.userMsgWrapper}>
                  <View style={styles.userBubble}>
                    <Text style={styles.userBubbleText}>{msg.text}</Text>
                  </View>
                  <Text style={[styles.timeText, { textAlign: 'right', marginRight: 4 }]}>{msg.time}</Text>
                </View>
              )}
            </View>
          ))}

          {/* TYPING INDICATOR */}
          {isTyping && (
            <View style={styles.typingWrapper}>
              <View style={styles.typingDots}>
                <View style={[styles.dot, styles.dot1]} />
                <View style={[styles.dot, styles.dot2]} />
                <View style={[styles.dot, styles.dot3]} />
              </View>
              <Text style={styles.typingLabel}>AI Vet is typing...</Text>
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* INPUT BAR */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.inputIconBtn}>
            <MaterialCommunityIcons name="plus-circle-outline" size={24} color="#4c5f7e" />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Ask about Cooper..."
            placeholderTextColor="#8d7168"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            multiline
          />
          <TouchableOpacity style={styles.inputIconBtn}>
            <MaterialCommunityIcons name="microphone" size={22} color="#ab3500" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend} activeOpacity={0.85}>
            <MaterialCommunityIcons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fbf9f6' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fbf9f6',
    borderBottomWidth: 1, borderBottomColor: 'rgba(225,191,181,0.2)',
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, marginLeft: 4 },
  avatarWrapper: { position: 'relative', width: 40, height: 40 },
  avatarCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#efeeeb', borderWidth: 2, borderColor: 'rgba(171,53,0,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute', bottom: 0, right: 0,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: '#2ECC71', borderWidth: 2, borderColor: '#fbf9f6',
  },
  headerTitle: { fontSize: 15, fontWeight: '700', color: '#ab3500' },
  headerSub: { fontSize: 9, fontWeight: '800', color: '#4c5f7e', letterSpacing: 1.2, textTransform: 'uppercase' },
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  dateMarker: { alignItems: 'center', marginBottom: 20 },
  dateText: {
    backgroundColor: '#f5f3f0', paddingHorizontal: 14, paddingVertical: 4,
    borderRadius: 999, fontSize: 10, fontWeight: '800',
    color: '#4c5f7e', letterSpacing: 1.5,
  },
  aiMsgWrapper: { marginBottom: 16, maxWidth: '85%' },
  aiBubble: {
    backgroundColor: '#ffffff', borderRadius: 20,
    borderTopLeftRadius: 4, padding: 14,
    borderWidth: 1, borderColor: 'rgba(225,191,181,0.15)',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
  },
  aiBubbleText: { fontSize: 14, color: '#1b1c1a', lineHeight: 21 },
  insightBubble: {
    backgroundColor: 'rgba(255,219,208,0.35)', borderRadius: 20,
    borderTopLeftRadius: 4, padding: 16,
    borderWidth: 1, borderColor: 'rgba(171,53,0,0.12)',
    gap: 8,
  },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  insightTag: { fontSize: 10, fontWeight: '800', color: '#ab3500', letterSpacing: 1.2, textTransform: 'uppercase' },
  insightText: { fontSize: 14, color: '#594139', lineHeight: 21 },
  insightBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start',
  },
  insightBadgeText: { fontSize: 11, fontWeight: '700', color: '#4d607f' },
  userMsgWrapper: { marginBottom: 16, maxWidth: '85%', alignSelf: 'flex-end' },
  userBubble: {
    backgroundColor: '#4c5f7e', borderRadius: 20,
    borderTopRightRadius: 4, padding: 14,
  },
  userBubbleText: { fontSize: 14, color: '#ffffff', lineHeight: 21 },
  timeText: { fontSize: 10, color: '#594139', marginTop: 4, marginLeft: 4 },
  typingWrapper: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  typingDots: {
    flexDirection: 'row', gap: 4, backgroundColor: '#f5f3f0',
    paddingHorizontal: 12, paddingVertical: 10, borderRadius: 999,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(171,53,0,0.4)' },
  dot1: {}, dot2: {}, dot3: {},
  typingLabel: { fontSize: 10, fontWeight: '800', color: '#594139', letterSpacing: 1, textTransform: 'uppercase' },
  inputBar: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderTopWidth: 1, borderTopColor: 'rgba(225,191,181,0.2)',
  },
  inputIconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  textInput: {
    flex: 1, fontSize: 14, color: '#1b1c1a',
    maxHeight: 80, paddingVertical: 8,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#ab3500', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#ab3500', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
});
