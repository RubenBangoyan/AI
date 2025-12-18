
import React, { useState } from 'react';
import { generateTransportImage } from '../services/gemini';
import { Image as ImageIcon, Loader2, Download, Wand2 } from 'lucide-react';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    const url = await generateTransportImage(prompt);
    setImageUrl(url);
    setLoading(false);
  };

  return (
    <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 h-full">
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon className="text-purple-400" size={20} />
        <h2 className="text-xl font-bold">Concept Visualizer</h2>
      </div>
      <p className="text-sm text-slate-400 mb-6">Generate futuristic infrastructure or vehicle concepts using Gemini Flash Image.</p>

      <form onSubmit={handleGenerate} className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe a future autonomous cargo ship or hyperloop station..."
          className="w-full bg-slate-800 border-slate-700 text-slate-100 p-4 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all outline-none resize-none h-24"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 text-white py-3 rounded-xl font-medium transition-all"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <><Wand2 size={18} /> Generate Concept</>}
        </button>
      </form>

      {imageUrl && (
        <div className="mt-6 relative group animate-in zoom-in-95 duration-300">
          <img src={imageUrl} alt="Generated concept" className="w-full rounded-xl border border-slate-700 shadow-lg" />
          <button 
            onClick={() => {
              const link = document.createElement('a');
              link.href = imageUrl;
              link.download = 'transport-concept.png';
              link.click();
            }}
            className="absolute bottom-3 right-3 p-2 bg-slate-900/80 backdrop-blur-sm text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border border-slate-700"
          >
            <Download size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
