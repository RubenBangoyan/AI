
import React, { useState, useEffect, useCallback } from 'react';
import { TransportMode, Metric, AIInsight } from './types';
import TransportSelector from './components/TransportSelector';
import MetricsGrid from './components/MetricsGrid';
import AIAssistant from './components/AIAssistant';
import ImageGenerator from './components/ImageGenerator';
import VoiceDispatcher from './components/VoiceDispatcher';
import { getTransportInsights } from './services/gemini';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { Activity, ShieldCheck, Zap, TrendingUp, AlertCircle, Info, LayoutDashboard, Database } from 'lucide-react';

const getMockData = (mode: TransportMode) => {
  switch (mode) {
    case TransportMode.AVIATION:
      return {
        metrics: [
          { label: 'Fuel Efficiency', value: '94.2', unit: '%', change: 2.1 },
          { label: 'On-Time Performance', value: '88.5', unit: '%', change: -1.2 },
          { label: 'AI Routes Optimized', value: '1,242', unit: 'daily', change: 12.4 },
          { label: 'Predictive Safety', value: '99.9', unit: '%', change: 0.5 },
        ],
        chartData: [{ time: '00:00', efficiency: 85 }, { time: '04:00', efficiency: 88 }, { time: '08:00', efficiency: 94 }, { time: '12:00', efficiency: 92 }, { time: '16:00', efficiency: 95 }, { time: '20:00', efficiency: 94 }]
      };
    case TransportMode.RAILWAY:
      return {
        metrics: [
          { label: 'Track Health Index', value: '97.1', unit: '/100', change: 1.5 },
          { label: 'Power Consumption', value: '45.2', unit: 'MW', change: -8.4 },
          { label: 'Autonomous Miles', value: '8.4k', unit: 'km', change: 22.1 },
          { label: 'Schedule Adherence', value: '96.4', unit: '%', change: 0.8 },
        ],
        chartData: [{ time: '00:00', efficiency: 70 }, { time: '04:00', efficiency: 75 }, { time: '08:00', efficiency: 82 }, { time: '12:00', efficiency: 88 }, { time: '16:00', efficiency: 91 }, { time: '20:00', efficiency: 89 }]
      };
    case TransportMode.MARITIME:
      return {
        metrics: [
          { label: 'Vessel Utilization', value: '82.3', unit: '%', change: 4.2 },
          { label: 'Port Turnaround', value: '18.5', unit: 'hr', change: -12.0 },
          { label: 'Fuel Emissions', value: '42.1', unit: 't/km', change: -5.5 },
          { label: 'AI Weather Routing', value: '100', unit: '%', change: 0 },
        ],
        chartData: [{ time: '00:00', efficiency: 60 }, { time: '04:00', efficiency: 65 }, { time: '08:00', efficiency: 75 }, { time: '12:00', efficiency: 82 }, { time: '16:00', efficiency: 85 }, { time: '20:00', efficiency: 84 }]
      };
    case TransportMode.LOGISTICS:
      return {
        metrics: [
          { label: 'Warehouse Pick Rate', value: '450', unit: 'u/hr', change: 15.2 },
          { label: 'Last Mile Success', value: '99.2', unit: '%', change: 2.1 },
          { label: 'Idle Fleet Time', value: '1.2', unit: 'hr/d', change: -32.5 },
          { label: 'Dynamic Cost Sav.', value: '1.4M', unit: '$', change: 8.4 },
        ],
        chartData: [{ time: '00:00', efficiency: 90 }, { time: '04:00', efficiency: 92 }, { time: '08:00', efficiency: 95 }, { time: '12:00', efficiency: 98 }, { time: '16:00', efficiency: 97 }, { time: '20:00', efficiency: 96 }]
      };
  }
};

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<TransportMode>(TransportMode.AVIATION);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (mode: TransportMode) => {
    setLoading(true);
    const mock = getMockData(mode);
    setMetrics(mock.metrics);
    setChartData(mock.chartData);
    const aiInsights = await getTransportInsights(mode);
    setInsights(aiInsights);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData(activeMode);
  }, [activeMode, fetchData]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <Activity className="text-blue-500 animate-pulse" />
            TransAI Hub
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Multi-Tool Intelligent Systems in Transport</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-bold">
            <ShieldCheck size={16} /> Secure
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-bold">
            <Zap size={16} /> Advanced AI
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        <TransportSelector active={activeMode} onChange={setActiveMode} />
        
        <MetricsGrid metrics={metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Visualizations and Search */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="text-blue-400" size={20} /> Operational Metrics
                </h3>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" fontSize={12} />
                    <YAxis stroke="#475569" fontSize={12} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                    <Area type="monotone" dataKey="efficiency" stroke="#3b82f6" strokeWidth={3} fill="url(#colorEff)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <AIAssistant />
            <ImageGenerator />
          </div>

          {/* Sidebar Tools */}
          <div className="lg:col-span-4 space-y-8">
            <VoiceDispatcher />

            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Zap className="text-amber-400" size={20} /> Sector Insights
              </h3>
              <div className="space-y-4">
                {loading ? (
                  Array(3).fill(0).map((_, i) => <div key={i} className="animate-pulse h-20 bg-slate-800 rounded-xl"></div>)
                ) : (
                  insights.map((insight, idx) => (
                    <div key={idx} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 hover:bg-slate-800/60 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-slate-100">{insight.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">{insight.impact}</span>
                      </div>
                      <p className="text-sm text-slate-400">{insight.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Database className="text-emerald-400" size={20} /> Fleet Status
              </h3>
              <div className="space-y-4">
                <div className="bg-slate-800/50 p-3 rounded-lg flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Active Units</span>
                  <span className="font-mono text-emerald-400 font-bold">8,241</span>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg flex justify-between items-center">
                  <span className="text-slate-400 text-sm">AI Handover</span>
                  <span className="font-mono text-blue-400 font-bold">84%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-20 pb-10 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm border-t border-slate-900 pt-8 gap-4">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2"><Info size={14} /> Global Intelligence Node 2025</span>
          <span className="cursor-pointer hover:text-slate-300">Privacy</span>
          <span className="cursor-pointer hover:text-slate-300">Terms</span>
        </div>
        <div className="flex items-center gap-2">
          Tools: <span className="text-blue-500">Search</span> • <span className="text-emerald-500">Maps</span> • <span className="text-purple-500">Image</span> • <span className="text-rose-500">Live Voice</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
