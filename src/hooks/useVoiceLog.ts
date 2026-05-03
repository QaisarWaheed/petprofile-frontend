import { useCallback, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import { aiService } from '../services/ai.service';

export function useVoiceLog() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recordingRef = useRef<Audio.Recording | null>(null);

  const startRecording = useCallback(async () => {
    setTranscript('');
    const perm = await Audio.requestPermissionsAsync();
    if (!perm.granted) {
      return;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY,
    );
    await recording.startAsync();
    recordingRef.current = recording;
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(async () => {
    const recording = recordingRef.current;
    if (!recording) {
      setIsRecording(false);
      return '';
    }
    await recording.stopAndUnloadAsync();
    recordingRef.current = null;
    setIsRecording(false);
    const uri = recording.getURI();
    if (!uri) {
      return '';
    }
    const form = new FormData();
    form.append(
      'file',
      {
        uri,
        name: 'voice.m4a',
        type: 'audio/m4a',
      } as unknown as Blob,
    );
    const text = await aiService.transcribe(form);
    setTranscript(text);
    return text;
  }, []);

  return { isRecording, transcript, startRecording, stopRecording };
}
