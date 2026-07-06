"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { hydrateAppState } from "@/lib/hydration";

interface JobApplicationSummary {
  id: string;
  companyName: string;
  jobTitle: string;
  matchScore: number;
  jobDescription: string;
  resumeAnalysisResult: any; // Add this to store the full resume analysis result
  matchAnalysis: any;
  interviewPrep: any;
  roadmap: any;
  completedTasks: string[];
  simulatorAnswers: Record<string, string>;
}

interface SidebarProps {
  currentResult: any;
  setCurrentResult: (val: any) => void;
  setJd: (val: string) => void;
  setJdResult: (val: any) => void;
  setInterviewData: (val: any) => void;
  setRoadmapData: (val: any) => void;
  setActiveTab: (val: string) => void;
  setCompletedTasks: (val: string[]) => void;
  setSimulatorAnswers: (val: Record<string, string>) => void;
  setActiveApplicationId: (val: string | null) => void;
  refreshApps: number;
  setCompanyName: (val: string) => void;
  setJobTitle: (val: string) => void;
  onDeleteApplication: (id: string, e: React.MouseEvent) => void;
}

export default function SidebarWithSavedApps({
  currentResult,
  setCurrentResult,
  setJd,
  setJdResult,
  setInterviewData,
  setRoadmapData,
  setActiveTab,
  setCompletedTasks,
  setSimulatorAnswers,
  setActiveApplicationId,
  refreshApps,
  setCompanyName,
  setJobTitle,
  onDeleteApplication,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [applications, setApplications] = useState<JobApplicationSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchHistoricalLogs() {
      setLoading(true);
      try {
        const res = await fetch("/api/applications");
        if (res.ok) {
          const data = await res.json();
          setApplications(data);
        }
      } catch (err) {
        console.error("Failed to query runtime storage logs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistoricalLogs();
  }, [refreshApps]);

 const handleHydrateContext = (app: JobApplicationSummary) => {
  setJd(app.jobDescription || "");
  setCurrentResult(app.resumeAnalysisResult || null);
  setJdResult(app.matchAnalysis || null);
  setInterviewData(app.interviewPrep || null);
  setRoadmapData(app.roadmap || null);
  setCompletedTasks(app.completedTasks || []);
  setSimulatorAnswers(app.simulatorAnswers || {});
  setActiveApplicationId(app.id);
  setCompanyName(app.companyName || "");
    setJobTitle(app.jobTitle || "");
  setActiveTab("analysis");
};

  

 return (
    // 1. UPDATE: Added flex and overflow constraints to the outer block wrapper
    <div className="px-2 py-3 border-t border-slate-800/60 font-sans flex flex-col min-h-0 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-slate-700/80 rounded-xl text-sm font-semibold text-slate-300 transition-all duration-150 shrink-0"
      >
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span>Saved Applications</span>
        </div>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4 text-slate-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          // 2. UPDATE: Configured sub-layout wrapper to manage vertical growth safely
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden mt-2 bg-slate-950/40 border border-slate-800/60 rounded-xl flex flex-col min-h-0"
          >
            {loading ? (
              <div className="p-4 text-xs text-center text-slate-500 font-medium">
                Loading your saved applications...
              </div>
            ) : applications.length === 0 ? (
              <div className="p-4 text-xs text-center text-slate-500 font-medium">
                No historic applications recorded.
              </div>
            ) : (
              // 3. UPDATE: Locked the list to a fixed maximum height window with self-contained scrolling
              <ul className="divide-y divide-slate-900 overflow-y-auto custom-scrollbar p-1 space-y-0.5 max-h-[180px] flex-1">
                {applications.map((app) => (
                  <li key={app.id}>
                    <div className="w-full group flex items-center justify-between p-1 hover:bg-slate-800/50 rounded-lg transition-all duration-150">
                      <button
                        onClick={() => handleHydrateContext(app)}
                        className="flex-1 text-left p-1 truncate cursor-pointer"
                      >
                        <div className="truncate pr-1">
                          <p className="text-xs font-bold text-slate-300 group-hover:text-indigo-400 truncate">
                            {app.companyName}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate font-medium">
                            {app.jobTitle}
                          </p>
                        </div>
                      </button>
                      <div className="flex items-center space-x-2 shrink-0 pr-1 select-none">
                        <span className="text-[10px] font-mono font-bold bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded-md text-indigo-400">
                          {app.matchScore}%
                        </span>
                        <button
                          onClick={(e) => onDeleteApplication(app.id, e)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors rounded opacity-40 group-hover:opacity-100 cursor-pointer"
                          title="Delete Application Entry"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}