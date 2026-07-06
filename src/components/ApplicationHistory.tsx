"use client";

import React, { useState, useEffect } from "react";

export default function ApplicationHistory({ onSelect }: { onSelect: (app: any) => void }) {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/applications")
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch(console.error);
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
          <tr>
            <th className="px-6 py-4">Company</th>
            <th className="px-6 py-4">Job Title</th>
            <th className="px-6 py-4">Match Score</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {history.map((app) => (
            <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 font-semibold text-slate-900">{app.companyName}</td>
              <td className="px-6 py-4 text-slate-600">{app.jobTitle}</td>
              <td className="px-6 py-4">
                <span className="font-mono font-bold text-indigo-600">{app.matchScore}%</span>
              </td>
              <td className="px-6 py-4">
                <button 
                  onClick={() => onSelect(app)}
                  className="text-indigo-600 font-bold hover:text-indigo-800"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}