import { useCallback, useState } from 'react';
import type { AxiosError } from 'axios';
import { aiService } from '../services/ai.service';
import { usePetStore } from '../stores/pet.store';

export type UiChatMessage = {
  id: string;
  role: 'user' | 'ai';
  text: string;
  time: string;
  isInsight?: boolean;
};

export function useChat() {
  const activePet = usePetStore((s) => s.activePet);
  const [messages, setMessages] = useState<UiChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const getTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const petId =
    activePet?.id ??
    ((activePet as { _id?: string } | null)?._id as string | undefined);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !petId) return;

      const history = messages.map((m) => ({
        role:
          m.role === 'ai' ? ('assistant' as const) : ('user' as const),
        content: m.text,
      }));

      const userMsg: UiChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: text.trim(),
        time: getTime(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      try {
        const res = await aiService.chat({
          petId,
          message: text.trim(),
          history,
        });

        let aiText =
          typeof res === 'string'
            ? res
            : typeof res === 'object' &&
                res !== null &&
                'message' in res &&
                typeof (res as { message?: unknown }).message === 'string'
              ? (res as { message: string }).message
              : null;

        if (
          aiText === null ||
          aiText === undefined ||
          `${aiText}`.trim() === ''
        ) {
          aiText = 'I had trouble responding. Please try again.';
        }

        const aiMsg: UiChatMessage = {
          id: `${Date.now() + 1}`,
          role: 'ai',
          text: `${aiText}`,
          time: getTime(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch (e) {
        console.error('Chat failed', e);
        let extra = '';
        const ax = e as AxiosError<{ message?: string | string[] }>;
        const m = ax.response?.data?.message;
        if (Array.isArray(m)) extra = `: ${m.join(', ')}`;
        else if (typeof m === 'string') extra = `: ${m}`;

        const errMsg: UiChatMessage = {
          id: `${Date.now() + 1}`,
          role: 'ai',
          text: `Sorry, I could not connect right now${extra}. Please try again.`,
          time: getTime(),
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setIsTyping(false);
      }
    },
    [messages, petId],
  );

  return { messages, isTyping, sendMessage, setMessages };
}
