"use client";

import { useState, useMemo,useEffect } from "react";

export default function JobMatchPanel({ result, jd, setJd, jdResult, setJdResult, onNavigate }: any) {
  const [loading, setLoading] = useState(false);
 const [isEditing, setIsEditing] = useState(!jdResult || !jdResult.matching_skills);

 useEffect(() => {
  if (jdResult && (jdResult.matching_skills || jdResult.match_score)) {
    setIsEditing(false);
  } else {
    setIsEditing(true);
  }
}, [jdResult]);


  const parsed = result?.data || result;

  const handleMatch = async () => {
    if (!parsed || !jd) return;
    setLoading(true);

    try {
      const res = await fetch("/api/match-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeData: parsed,
          jd: jd,
        }),
      });

      const data = await res.json();
      setJdResult(data.data || data);
      setIsEditing(false); 
    } catch (error) {
      console.error("Error generating job match:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🧠 UI Interactive Keyword Highlighter Engine
  const highlightedJd = useMemo(() => {
    if (!jd || !jdResult) return jd;

    let text = jd
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

    const matches = jdResult.matching_skills || [];
    const missing = jdResult.missing_skills || [];

    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Process matching core features (Emerald highlights)
    matches.forEach((skill: string) => {
      if (!skill.trim()) return;
      const regex = new RegExp(`\\b(${escapeRegExp(skill)})\\b`, "gi");
      text = text.replace(regex, `<span class="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200/60 shadow-sm">$1</span>`);
    });

    // Process missing gap features (Rose highlights)
    missing.forEach((skill: string) => {
      if (!skill.trim()) return;
      const regex = new RegExp(`\\b(${escapeRegExp(skill)})\\b`, "gi");
      text = text.replace(regex, `<span class="px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800 font-semibold border border-rose-200/60 shadow-sm">$1</span>`);
    });

    return text;
  }, [jd, jdResult]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Workspace Control Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Job Match Analysis</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare your resume against the job description to find missing skills.
            </p>
          </div>
          {jdResult && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all shadow-sm"
            >
              {isEditing ? "View Highlights 🔍" : "Edit Text ✏️"}
            </button>
          )}
        </div>

        <div className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              <textarea
                className="w-full border border-slate-200 rounded-xl p-4 h-64 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm text-slate-700 leading-relaxed font-sans"
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the job description here..."
              />
              <button
                onClick={handleMatch}
                disabled={!parsed || !jd || loading}
                className="px-6 py-2.5 bg-slate-950 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all disabled:bg-slate-100 disabled:text-slate-400 flex items-center gap-2 shadow-sm"
              >
                {loading ? "Analyzing Match..." : "Compare Resume to Job"}
              </button>
            </div>
          ) : (
            /* ✨ Rich Text Interactive Highlight Terminal */
            <div className="border border-slate-100 bg-slate-50/40 rounded-xl p-6 h-64 overflow-y-auto shadow-inner text-sm text-slate-700 leading-loose whitespace-pre-wrap font-sans">
              <div 
                dangerouslySetInnerHTML={{ __html: highlightedJd }} 
                className="prose prose-slate max-w-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Metric Evaluation Results Split Deck */}
      {jdResult && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Visual Mini Score Deck */}
            <div className="bg-white p-6 border border-slate-200/80 rounded-2xl shadow-sm flex flex-col justify-between items-start">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Match Score</span>
              <div className="my-4">
                <span className="text-4xl font-black text-slate-900 tracking-tight">{jdResult.match_score}</span>
                <span className="text-slate-400 text-sm font-medium"> / 100</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-500" 
                  style={{ width: `${jdResult.match_score}%` }}
                />
              </div>
            </div>

            {/* Strategic Alignment Overview Text Card */}
            <div className="bg-white p-6 border border-slate-200/80 rounded-2xl shadow-sm md:col-span-2 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Match Summary</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{jdResult.analysis}</p>
              </div>
              <div className="flex gap-4 mt-4 pt-3 border-t border-slate-100 text-[11px] font-medium text-slate-500">
                <div className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> Matched Skills
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-rose-500" /> Gaps Identified
                </div>
              </div>
            </div>
          </div>

          {/* Context Router CTA Banner */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="text-sm font-bold text-indigo-900">Match Completed. What's next?</h4>
              <p className="text-xs text-indigo-700 mt-0.5">Use these insights to tailor your resume and prepare for interviews.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                onClick={() => onNavigate("roadmap")}
                className="flex-1 sm:flex-none px-4 py-2 bg-white text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl hover:bg-indigo-100/50 transition-all shadow-sm"
              >
                Build Prep Roadmap 🗺️
              </button>
              <button 
                onClick={() => onNavigate("interview")}
                className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-600/10"
              >
                Simulate Interview 💬
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}