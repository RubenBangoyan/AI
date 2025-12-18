
import React from 'react';
import { TransportMode } from '../types';
import { Plane, Train, Ship, Package } from 'lucide-react';

interface Props {
  active: TransportMode;
  onChange: (mode: TransportMode) => void;
}

const modes = [
  { id: TransportMode.AVIATION, label: 'Aviation', icon: Plane, color: 'text-sky-400', bg: 'bg-sky-400/10' },
  { id: TransportMode.RAILWAY, label: 'Railways', icon: Train, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { id: TransportMode.MARITIME, label: 'Maritime', icon: Ship, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: TransportMode.LOGISTICS, label: 'Logistics', icon: Package, color: 'text-amber-400', bg: 'bg-amber-400/10' },
];

const TransportSelector: React.FC<Props> = ({ active, onChange }) => {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = active === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => onChange(mode.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 ${
              isActive 
                ? `${mode.bg} ${mode.color} ring-1 ring-inset ring-${mode.color}/20 shadow-lg shadow-${mode.color}/10` 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Icon size={20} />
            <span className="font-semibold">{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TransportSelector;
