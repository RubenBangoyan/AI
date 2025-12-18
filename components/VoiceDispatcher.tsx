
import React, { useState, useRef } from 'react';
import { connectVoiceDispatcher } from '../services/gemini';
import { Mic, MicOff, Volume2, Loader2, Radio } from 'lucide-react';

const VoiceDispatcher: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const decodeAudio = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const startSession = async () => {
    try {
      setIsConnecting(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const sessionPromise = connectVoiceDispatcher({
        onopen: () => {
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
            
            let binary = '';
            const bytes = new Uint8Array(int16.buffer);
            for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
            const base64 = btoa(binary);

            sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
          };
          source.connect(processor);
          processor.connect(inputCtx.destination);
          setIsConnecting(false);
          setIsActive(true);
        },
        onmessage: async (message: any) => {
          const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audioData && audioContextRef.current) {
            const ctx = audioContextRef.current;
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
            const buffer = await decodeAudioData(decodeAudio(audioData), ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
          }
          if (message.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onclose: () => stopSession(),
        onerror: () => stopSession(),
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    setIsActive(false);
    setIsConnecting(false);
  };

  return (
    <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Radio className={isActive ? "text-rose-500 animate-pulse" : "text-slate-500"} size={20} />
          <h2 className="text-xl font-bold">AI Voice Dispatcher</h2>
        </div>
        {isActive && (
          <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            Live Transmission
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-center gap-6 py-4">
        <button
          onClick={isActive ? stopSession : startSession}
          disabled={isConnecting}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
            isActive 
              ? 'bg-rose-600 hover:bg-rose-500 ring-4 ring-rose-500/20' 
              : 'bg-blue-600 hover:bg-blue-500 ring-4 ring-blue-500/20'
          }`}
        >
          {isConnecting ? (
            <Loader2 className="animate-spin text-white" size={32} />
          ) : isActive ? (
            <MicOff className="text-white" size={32} />
          ) : (
            <Mic className="text-white" size={32} />
          )}
        </button>
        
        <div className="text-center space-y-1">
          <p className="font-bold text-slate-100">
            {isActive ? 'Connected to AI Comm' : isConnecting ? 'Initializing Link...' : 'Start Voice Control'}
          </p>
          <p className="text-sm text-slate-500">
            {isActive ? 'AI is listening. Speak your logistics command.' : 'Real-time multi-modal dispatch system'}
          </p>
        </div>

        {isActive && (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-1 bg-blue-500 rounded-full animate-bounce" style={{ height: `${Math.random() * 20 + 10}px`, animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceDispatcher;
