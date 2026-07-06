"use client";

import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
// Updated imports to bring in Radar Chart components instead of Bar Chart components
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import InsightsPanel from "./InsightsPanel";

interface AnalysisPanelProps {
  result: any;
  isAnalyzing: boolean;
  onNavigate: (tab: string) => void;
  activeTab?: string;
  setActiveTab?: Dispatch<SetStateAction<string>>;
  onReset?: () => void;
  hasUploadedResume?: boolean;
}

export default function AnalysisPanel({ 
  result, 
  isAnalyzing, 
  onNavigate,
  activeTab,
  setActiveTab,
  onReset,
  hasUploadedResume
}: AnalysisPanelProps) {
  const parsed = result?.data || result;
  const [displayScore, setDisplayScore] = useState(0);
  const [currentSubTab, setCurrentSubTab] = useState<"overview" | "insights">("overview");

  useEffect(() => {
    if (!parsed?.ats_score) return;
    let start = 0;
    const end = parsed.ats_score;
    const interval = setInterval(() => {
      start += 1;
      setDisplayScore(start);
      if (start >= end) clearInterval(interval);
    }, 12);
    return () => clearInterval(interval);
  }, [parsed?.ats_score]);

  if (!parsed && isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4 bg-slate-950 rounded-2xl border border-slate-800">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
        <p className="text-slate-400 animate-pulse font-medium text-sm">Analyzing your resume...</p>
      </div>
    );
  }

  if (!parsed) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center shadow-xl max-w-md mx-auto mt-12 font-sans relative z-10">
      <div className="text-3xl mb-4">📊</div>
      <h3 className="font-bold text-slate-100 text-lg tracking-tight">Step 1: Check Your Resume Score</h3>
      <p className="text-sm text-slate-400 mt-2 mb-6 leading-relaxed">
        Once you add your resume, your personalized score breakdown, skill breakdown charts, and executive summary will populate right here.
      </p>
      <button onClick={() => onNavigate("upload")} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer">
        Upload Your Resume to Start
      </button>
    </div>
  );
}

  const summary = parsed.summary || "Analysis complete. Review your metrics below.";
  const skills = parsed.skills?.length > 0 ? parsed.skills : ["Core Skills"];

  const atsData = [
    { name: "Score", value: displayScore },
    { name: "Remaining", value: 100 - displayScore },
  ];

  const COLORS = ["#4f46e5", "#1e293b"]; 

  const skillData = parsed.skill_scores?.length > 0 
    ? parsed.skill_scores.map((s: any) => ({ name: s.name, Strength: s.score }))
    : skills.slice(0, 6).map((s: string) => ({ name: s, Strength: 85 }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans text-slate-200 p-2">
      {/* Dynamic Navigation Toggle Sub-Tabs */}
      <div className="flex border-b border-slate-800/80 gap-4 mb-2">
        <button
          onClick={() => setCurrentSubTab("overview")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            currentSubTab === "overview" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
        Overview
        </button>
        <button
          onClick={() => setCurrentSubTab("insights")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            currentSubTab === "insights" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Deep Insights
        </button>
      </div>

      <AnimatePresence mode="wait">
        {currentSubTab === "overview" ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Score Radial Ring */}
              <div className="bg-slate-900 p-6 border border-slate-800/80 rounded-2xl shadow-xl flex flex-col items-center justify-center relative">
                <h2 className="font-bold tracking-tight self-start w-full text-xs uppercase text-slate-400 mb-2">ATS Score</h2>
                <div className="relative w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={atsData} dataKey="value" innerRadius={55} outerRadius={70} startAngle={90} endAngle={-270}>
                        {atsData.map((_, i) => <Cell key={i} fill={COLORS[i]} stroke="none" />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute text-center">
                    <span className="text-3xl font-extrabold text-slate-100">{displayScore}</span>
                    <span className="text-slate-400 text-sm font-medium">/100</span>
                  </div>
                </div>
              </div>

              {/* Executive Summary Card */}
              <div className="bg-slate-900 p-6 border border-slate-800/80 rounded-2xl shadow-xl col-span-2 flex flex-col justify-between">
                <div>
                  <h2 className="font-bold tracking-tight text-xs uppercase text-slate-400 mb-2">Executive Overview</h2>
                  <p className="text-sm text-slate-300 leading-relaxed">{summary}</p>
                </div>
                <div className="text-[11px] text-indigo-400 font-semibold mt-4 flex items-center gap-1">
                  <span>✨ Optimized via LLM Insights</span>
                  {onReset && (
  <button onClick={onReset} className="ml-auto text-rose-400 hover:underline cursor-pointer">
    Clear & Create New Application
  </button>
)}
                </div>
              </div>
            </div>

            {/* 🔥 Upgraded Radar Chart Visualization */}
            <div className="bg-slate-900 p-6 border border-slate-800/80 rounded-2xl shadow-xl">
              <h2 className="font-bold tracking-tight text-xs uppercase text-slate-400 mb-4">Identified Skill Strengths</h2>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis 
                    dataKey="name" 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} 
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={false} 
                    axisLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#f8fafc', fontSize: '12px' }}
                    itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                  />
                  <Radar
                    name="Proficiency"
                    dataKey="Strength"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="#4f46e5"
                    fillOpacity={0.35}
                    isAnimationActive={true}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <InsightsPanel result={result} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shared Workflow Context Router CTAs */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg">
        <div>
          <h3 className="font-semibold text-base">What is your next priority?</h3>
        <p className="text-xs text-slate-400 mt-0.5">Continue tailoring your application for your target roles.</p>
        </div>
        <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
          <button onClick={() => onNavigate("optimize")} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-xs font-semibold rounded-xl transition-all flex-1 sm:flex-none">
            Resume Rewriter →
          </button>
          <button onClick={() => onNavigate("job-match")} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-xs font-semibold rounded-xl transition-all flex-1 sm:flex-none">
            Job Match →
          </button>
          <button onClick={() => onNavigate("interview")} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold rounded-xl transition-all flex-1 sm:flex-none shadow-md shadow-indigo-600/10">
            Interview Prep →
          </button>
        </div>
      </div>
    </div>
  );
}