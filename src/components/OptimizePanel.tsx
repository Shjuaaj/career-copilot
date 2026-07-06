"use client";

import React, { useState } from "react";

export default function OptimizePanel({ result, onNavigate }: any) {
  const parsed = result?.data || result;
  const [optimizations, setOptimizations] = useState<{ [key: string]: string[] }>({});
  const [mistakesMap, setMistakesMap] = useState<{ [key: string]: string[] }>({});
  const [loadingMap, setLoadingMap] = useState<{ [key: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hiddenMap, setHiddenMap] = useState<{ [key: string]: boolean }>({});

if (!parsed) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center shadow-xl max-w-md mx-auto mt-12 font-sans relative z-10">
      <div className="text-3xl mb-4">✍️</div>
      <h3 className="font-bold text-slate-100 text-lg tracking-tight">Step 1: Rewrite Weak Resume Lines</h3>
      <p className="text-sm text-slate-400 mt-2 mb-6 leading-relaxed">
        Upload your resume draft first! Our editor will scan your history for passive phrasing and instantly generate high-impact, professional alternatives.
      </p>
      <button onClick={() => onNavigate("upload")} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer">
        Go to Upload Step
      </button>
    </div>
  );
}

  const weakBullets = parsed?.weak_bullets || [];

  const triggerOptimizationPipeline = async (id: string, bulletText: string) => {
    setLoadingMap((prev) => ({ ...prev, [id]: true }));
    setHiddenMap((prev) => ({ ...prev, [id]: false }));
    try {
      const response = await fetch("/api/optimize-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bullet: bulletText }),
      });

      if (response.ok) {
        const data = await response.json();
        setOptimizations((prev) => ({ ...prev, [id]: data.variations }));
        setMistakesMap((prev) => ({ ...prev, [id]: data.mistakes_found || [] }));
      } else {
        setOptimizations((prev) => ({ ...prev, [id]: ["Error generating suggestions."] }));
        setMistakesMap((prev) => ({ ...prev, [id]: [] }));
      }
    } catch (err) {
      setOptimizations((prev) => ({ ...prev, [id]: ["Network error while optimizing."] }));
      setMistakesMap((prev) => ({ ...prev, [id]: [] }));
    } finally {
      setLoadingMap((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleOrOptimize = (id: string, bulletText: string) => {
    if (optimizations[id]) {
      setHiddenMap((prev) => ({ ...prev, [id]: !prev[id] }));
    } else {
      triggerOptimizationPipeline(id, bulletText);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans text-slate-200 p-2">
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="border-b border-slate-800/80 pb-4">
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">AI Resume Rewriter</h2>
          <p className="text-xs text-slate-400 mt-1">Select a bullet point from your resume and let AI rewrite it into a strong, impact-driven achievement.</p>
        </div>

        {weakBullets.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center">
            <div className="h-16 w-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-100">Your Resume is Solid!</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm">Our AI engine couldn't find any weak or passive bullet points to optimize. Great job!</p>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
          {weakBullets.map((item: any) => (
            <div key={item.id} className="p-4 bg-slate-950/80 border border-slate-800/60 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                    Original Bullet Point
                  </span>
                  {item.section && (
                    <div className="mt-2.5 mb-1.5 text-[10px] font-semibold text-slate-400 bg-slate-900 border border-slate-800 rounded px-2 py-1 w-fit flex items-center gap-1.5">
                      <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Found in: <span className="text-slate-300">{item.section}</span>
                    </div>
                  )}
                  <p className="text-sm font-medium text-slate-300 mt-1 italic">"{item.originalLine}"</p>
                </div>
                <button
                  onClick={() => handleToggleOrOptimize(item.id, item.originalLine)}
                  disabled={loadingMap[item.id]}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-xs font-semibold text-white rounded-xl transition-all shadow-md shadow-indigo-600/10 disabled:opacity-50 flex items-center space-x-1.5 self-center sm:self-start shrink-0 active:scale-[0.98]"
                >
                  {loadingMap[item.id] ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Processing...</span>
                    </>
                  ) : optimizations[item.id] && !hiddenMap[item.id] ? (
                    <span>Hide Suggestions</span>
                  ) : optimizations[item.id] && hiddenMap[item.id] ? (
                    <span>Show Suggestions</span>
                  ) : (
                    <span>Enhance with AI</span>
                  )}
                </button>
              </div>

              {optimizations[item.id] && !hiddenMap[item.id] && (
                <div className="pt-2">
                  <div className="h-px bg-slate-800/60 my-3" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md block w-fit">
                        AI Suggestions
                      </span>
                      <button 
                        onClick={() => triggerOptimizationPipeline(item.id, item.originalLine)}
                        disabled={loadingMap[item.id]}
                        className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors flex items-center space-x-1"
                      >
                        <span>↻ Regenerate</span>
                      </button>
                    </div>

                    {mistakesMap[item.id] && mistakesMap[item.id].length > 0 && (
                      <div className="mb-4 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
                        <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block mb-2">
                          Mistakes Identified
                        </span>
                        <ul className="list-disc list-inside text-xs text-rose-300 ml-2 space-y-1">
                          {mistakesMap[item.id].map((mistake, mIdx) => (
                            <li key={mIdx}>{mistake}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {optimizations[item.id].map((variation, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg transition-all duration-150 flex items-center space-x-2.5 group">
                        <div className="h-5 w-5 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono text-[10px] font-bold mt-0.5 shrink-0 border border-emerald-500/20">
                          0{idx + 1}
                        </div>
                        <p className="text-xs font-medium text-slate-300 leading-relaxed flex-1 pr-2">{variation}</p>
                        <button
                          onClick={() => handleCopy(variation, `${item.id}-${idx}`)}
                          className="shrink-0 h-7 w-7 flex items-center justify-center rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                          title="Copy suggestion"
                        >
                          {copiedId === `${item.id}-${idx}` ? (
                            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}