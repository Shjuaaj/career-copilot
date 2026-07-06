"use main-thread";
"use client";

import React from "react";

export default function InsightsPanel({ result }: any) {
  const parsed = result?.data || result;

  if (!parsed) {
  return (
    <div className="text-center p-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 max-w-md mx-auto shadow-xl mt-12 font-sans">
      <div className="text-3xl mb-3">✨</div>
      <p className="font-bold text-slate-200 text-base mb-2">Nothing here yet!</p>
      <p className="text-xs text-slate-400 leading-relaxed px-2">
        Head over to the <span className="text-indigo-400 font-bold">Upload Resume</span> tab and drop in your file. We will instantly highlight your career strengths, hidden skill gaps, and custom improvements right here!
      </p>
    </div>
  );
}

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans text-slate-200 p-2">
      <div className="bg-slate-900 p-6 border border-slate-800/80 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Target Assessment Tier</h2>
          <p className="text-2xl font-black text-slate-100 tracking-tight">{parsed.career_level || "Not Evaluated"}</p>
        </div>
        <div className="bg-indigo-500/10 text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-500/20">
          Verified Tier Profile
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-6 border border-slate-800/80 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800/60 pb-3">
            <span className="text-amber-500 text-sm">⚠️</span>
            <h2 className="font-bold text-slate-200 text-xs uppercase tracking-wider">Critical Weaknesses</h2>
          </div>
          <ul className="space-y-3">
            {(parsed.weaknesses || []).map((w: string, i: number) => (
              <li key={i} className="flex gap-3 text-xs text-slate-300 leading-relaxed items-start font-medium">
                <span className="text-amber-500 font-bold">•</span>
                <span>{w}</span>
              </li>
            ))}
            {(!parsed.weaknesses || parsed.weaknesses.length === 0) && (
              <p className="text-xs text-slate-500 italic">No structural weaknesses identified.</p>
            )}
          </ul>
        </div>

        <div className="bg-slate-900 p-6 border border-slate-800/80 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800/60 pb-3">
            <span className="text-emerald-400 text-sm">✨</span>
            <h2 className="font-bold text-slate-200 text-xs uppercase tracking-wider">Recommended Fixes</h2>
          </div>
          <ul className="space-y-3">
            {(parsed.improvements || []).map((imp: string, idx: number) => (
              <li key={idx} className="flex gap-3 text-xs text-slate-300 leading-relaxed items-start font-medium">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{imp}</span>
              </li>
            ))}
            {(!parsed.improvements || parsed.improvements.length === 0) && (
              <p className="text-xs text-slate-500 italic">No recommendations required.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}