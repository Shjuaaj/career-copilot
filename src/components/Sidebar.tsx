"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import SidebarWithSavedApps from "./SidebarWithSavedApps";

interface SidebarProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  onReset: () => void;
  hasUploadedResume: boolean;
  result?: any;
  setCurrentResult?: (val: any) => void;
  setJd?: (val: string) => void;
  setJdResult?: (val: any) => void;
  setInterviewData?: (val: any) => void;
  setRoadmapData?: (val: any) => void;
  onSaveApplication?: () => void;
  setCompletedTasks?: (val: string[]) => void;
  setSimulatorAnswers?: (val: Record<string, string>) => void;
  setActiveApplicationId?: (val: string | null) => void;
  refreshApps?: number;
  activeApplicationId?: string | null;
  setCompanyName?: (val: string) => void;
  setJobTitle?: (val: string) => void;
  onDeleteApplication?: (id: string, e: React.MouseEvent) => void;
  setIsTourOpen: (val: boolean) => void;
  setTourStep: (val: number) => void;
  setIsStandaloneInfo?: (val: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  onReset,
  result,
  setCurrentResult = () => {},
  setJd = () => {},
  setJdResult = () => {},
  setInterviewData = () => {},
  setRoadmapData = () => {},
  onSaveApplication = () => {},
  setCompletedTasks = () => {},
  setSimulatorAnswers = () => {},
  setActiveApplicationId = () => {},
  refreshApps = 0,
  activeApplicationId = null,
  setCompanyName = () => {},
  setJobTitle = () => {},
  onDeleteApplication = () => {},
  setIsTourOpen,
  setTourStep,
  setIsStandaloneInfo = () => {},
}: SidebarProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="hidden md:flex w-64 h-screen bg-slate-900 border-r border-slate-800 items-center justify-center">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const navItems = [
    { 
      id: "upload", 
      label: "Upload Resume", 
      tourStepIndex: 0,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1m-4-4l-4-4m0 0l-4 4m4-4v12" />
        </svg>
      )
    },
    { 
      id: "analysis", 
      label: "Resume Analysis", 
      tourStepIndex: 1,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      )
    },
    { 
      id: "optimize", 
      label: "Resume Rewriter", 
      tourStepIndex: 2,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    { 
      id: "job-match", 
      label: "Job Description Match", 
      tourStepIndex: 3,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    { 
      id: "interview", 
      label: "Interview Simulation", 
      tourStepIndex: 4,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      )
    },
    { 
      id: "roadmap", 
      label: "Preparation Roadmap", 
      tourStepIndex: 5,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      )
    },
  ];

  const handleTriggerOnDemandHelp = (e: React.MouseEvent, stepIndex: number, tabId: string) => {
    e.stopPropagation();
    setActiveTab(tabId);
    setTourStep(stepIndex);
    setIsStandaloneInfo(true);
    setIsTourOpen(true);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-300 shadow-xl hover:bg-slate-800 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed md:relative inset-y-0 left-0 z-50 w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col p-4 font-sans text-slate-200 select-none transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        
        <div className="flex items-center justify-between px-2 py-3 mb-2 shrink-0">
          <div id="sidebar-branding" className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <span className="text-white font-black text-sm tracking-tight">RAI</span>
            </div>
            <span className="text-lg font-bold text-slate-100 tracking-wide">ResumeAI Ent.</span>
          </div>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex flex-col min-h-0 space-y-4 pr-1 overflow-hidden">
          <nav className="space-y-1 shrink-0">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <div
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`group/nav w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 cursor-pointer ${
                    isActive ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate min-w-0 flex-1">
                    <span className="text-base shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleTriggerOnDemandHelp(e, item.tourStepIndex, item.id)}
                    className={`ml-2 p-1 rounded-md text-[13px] font-bold font-sans transition-all shrink-0 hover:scale-110 ${
                      isActive 
                        ? "text-indigo-200 hover:text-white hover:bg-indigo-700" 
                        : "text-slate-600 group-hover/nav:text-slate-400 hover:text-indigo-400 hover:bg-slate-950"
                    }`}
                    title={`Learn more about ${item.label}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </nav>

          {/* Clean Real-World Layout for Saved Applications Info Accent */}
          <div id="nav-saved-apps" className="flex-1 min-h-0 flex flex-col justify-start overflow-hidden relative group/saved">
            <div className="px-3 py-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 transition-colors group-hover/saved:text-slate-400">
              <span>Application Vault</span>
              <button
                type="button"
                onClick={(e) => handleTriggerOnDemandHelp(e, 6, "roadmap")}
                className="p-1 rounded text-slate-600 hover:text-indigo-400 hover:bg-slate-950 transition-all cursor-pointer"
                title="Learn more about Saved Applications"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            
            <SidebarWithSavedApps 
              currentResult={result}
              setCurrentResult={setCurrentResult}
              setJd={setJd}
              setJdResult={setJdResult}
              setInterviewData={setInterviewData}
              setRoadmapData={setRoadmapData}
              setActiveTab={setActiveTab}
              setCompletedTasks={setCompletedTasks}
              setSimulatorAnswers={setSimulatorAnswers}
              setActiveApplicationId={setActiveApplicationId}
              refreshApps={refreshApps}
              setCompanyName={setCompanyName}
              setJobTitle={setJobTitle}
              onDeleteApplication={onDeleteApplication}
            />
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-4 mt-auto space-y-2.5 shrink-0">
          {session?.user && (
            <div className="flex items-center space-x-3 px-2 py-1.5 bg-slate-950/40 rounded-xl border border-slate-400/10 select-none">
              <div className="h-10 w-10 rounded-xl bg-slate-800 border border-indigo-500/30 flex items-center justify-center overflow-hidden shrink-0">
                <span className="text-sm font-bold text-indigo-400 uppercase">
                  {session.user.name ? session.user.name.substring(0, 2) : session.user.email?.substring(0, 2)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{session.user.name || "Enterprise User"}</p>
                <p className="text-[10px] text-slate-500 truncate font-mono">{session.user.email}</p>
              </div>
            </div>
          )}

          <button 
            id="sidebar-btn-save"
            onClick={() => {
              onSaveApplication();
              setIsOpen(false);
            }} 
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 hover:text-indigo-300 text-xs font-semibold rounded-xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-150 cursor-pointer"
          >
            <span>{activeApplicationId ? "Save Updates" : "Save Application"}</span>
          </button>

          <button 
            id="sidebar-btn-new"
            onClick={() => {
              onReset();
              setIsOpen(false);
            }} 
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-950/40 hover:bg-slate-950 text-slate-400 hover:text-indigo-400 text-xs font-semibold rounded-xl border border-slate-800/80 hover:border-indigo-500/20 transition-all duration-150 cursor-pointer"
          >
            <span>Create New Application</span>
          </button>

          <button 
            onClick={() => signOut({ callbackUrl: "/auth/signin" })} 
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-950/80 hover:bg-rose-950/20 border border-slate-800 hover:border-rose-900/50 text-slate-400 hover:text-rose-400 text-xs font-semibold rounded-xl transition-all duration-150 group cursor-pointer"
          >
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}