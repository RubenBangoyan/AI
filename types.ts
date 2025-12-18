
export enum TransportMode {
  AVIATION = 'AVIATION',
  RAILWAY = 'RAILWAY',
  MARITIME = 'MARITIME',
  LOGISTICS = 'LOGISTICS'
}

export interface Metric {
  label: string;
  value: string | number;
  change: number;
  unit: string;
}

export interface AIInsight {
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface TransportState {
  activeMode: TransportMode;
  metrics: Metric[];
  insights: AIInsight[];
}
