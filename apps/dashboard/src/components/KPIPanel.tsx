'use client';

import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

interface Metrics {
  mrr: number;
  arr: number;
  activePatients: number;
  doctorsOnboarded: number;
  aiAutomationRate: number;
  revenueByCountry: Record<string, number>;
}

export function KPIPanel() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/investor/metrics`)
      .then((res) => res.json())
      .then(setMetrics)
      .catch(() => setMetrics(null));
  }, []);

  if (!metrics) return <aside className="panel">Loading KPIs...</aside>;

  return (
    <aside className="panel">
      <h3>KPIs</h3>
      <div className="kpi"><h4>MRR</h4><p>${metrics.mrr.toLocaleString()}</p></div>
      <div className="kpi"><h4>ARR</h4><p>${metrics.arr.toLocaleString()}</p></div>
      <div className="kpi"><h4>Active Patients</h4><p>{metrics.activePatients}</p></div>
      <div className="kpi"><h4>Doctors Onboarded</h4><p>{metrics.doctorsOnboarded}</p></div>
      <div className="kpi"><h4>AI Automation Rate</h4><p>{metrics.aiAutomationRate}%</p></div>
    </aside>
  );
}
