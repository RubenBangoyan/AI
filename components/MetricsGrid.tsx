
import React from 'react';
import { Metric } from '../types';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Props {
  metrics: Metric[];
}

const MetricsGrid: React.FC<Props> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {metrics.map((metric, idx) => (
        <div key={idx} className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800/50 hover:border-slate-700 transition-colors">
          <p className="text-slate-400 text-sm font-medium mb-2">{metric.label}</p>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-2xl font-bold tracking-tight">{metric.value}</span>
              <span className="text-slate-500 text-sm ml-1">{metric.unit}</span>
            </div>
            <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
              metric.change >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
            }`}>
              {metric.change >= 0 ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
              {Math.abs(metric.change)}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsGrid;
