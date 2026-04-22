'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

interface InvestorData {
  mrr: number;
  arr: number;
  activePatients: number;
  doctorsOnboarded: number;
  aiAutomationRate: number;
  revenueByCountry: Record<string, number>;
}

export default function InvestorPage() {
  const [data, setData] = useState<InvestorData | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/investor/metrics`).then((res) => res.json()).then(setData);
  }, []);

  return (
    <main className="layout">
      <Sidebar />
      <section className="panel">
        <h2>Investor Dashboard</h2>
        {!data && <p>Loading...</p>}
        {data && (
          <>
            <p>MRR: ${data.mrr.toLocaleString()}</p>
            <p>ARR: ${data.arr.toLocaleString()}</p>
            <p>Active Patients: {data.activePatients}</p>
            <p>Doctors Onboarded: {data.doctorsOnboarded}</p>
            <p>AI Automation Rate: {data.aiAutomationRate}%</p>
            <h4>Revenue by Country</h4>
            <ul>
              {Object.entries(data.revenueByCountry).map(([country, amount]) => (
                <li key={country}>{country}: ${amount.toLocaleString()}</li>
              ))}
            </ul>
          </>
        )}
      </section>
      <aside className="panel">
        <h3>Growth Notes</h3>
        <p>Localization ready for UAE / KSA / India with pricing segmentation.</p>
      </aside>
    </main>
  );
}
