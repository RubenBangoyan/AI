
import React, { useState } from 'react';
import { askTransportAI } from '../services/gemini';
import { Search, Loader2, Globe, Sparkles, Map as MapIcon } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [useMaps, setUseMaps] = useState(false);
  const [response, setResponse] = useState<{ answer: string; sources: any[] } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const result = await askTransportAI(query, useMaps);
    setResponse(result);
    setLoading(false);
  };

  return (
    <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-amber-400" size={20} />
          <h2 className="text-xl font-bold">AI Transport Intelligence</h2>
        </div>
        <button
          onClick={() => setUseMaps(!useMaps)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
            useMaps ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          <MapIcon size={14} />
          Maps Mode: {useMaps ? 'On' : 'Off'}
        </button>
      </div>
      
      <form onSubmit={handleSearch} className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={useMaps ? "Find logistics hubs in Germany..." : "Ask about route optimization..."}
          className="w-full bg-slate-800 border-slate-700 text-slate-100 pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400" size={20} />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'Ask AI'}
        </button>
      </form>

      {response && (
        <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="prose prose-invert max-w-none text-slate-300 bg-slate-800/50 p-5 rounded-xl border border-slate-700/50 leading-relaxed whitespace-pre-wrap">
            {response.answer}
          </div>
          
          {response.sources.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest w-full mb-1">Grounding Sources</span>
              {response.sources.map((source: any, i: number) => (
                (source.web || source.maps) && (
                  <a
                    key={i}
                    href={source.web?.uri || source.maps?.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full text-xs transition-colors border border-slate-700"
                  >
                    {source.maps ? <MapIcon size={12} className="text-emerald-400" /> : <Globe size={12} className="text-blue-400" />}
                    <span className="truncate max-w-[150px]">{source.web?.title || source.maps?.title || 'Location'}</span>
                  </a>
                )
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
