"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import UploadPanel from "@/components/UploadPanel";
import AnalysisPanel from "@/components/AnalysisPanel";
import InsightsPanel from "@/components/InsightsPanel";
import JobMatchPanel from "@/components/JobMatchPanel";
import InterviewPanel from "@/components/InterviewPanel";
import RoadmapPanel from "@/components/RoadmapPanel";
import OptimizePanel from "@/components/OptimizePanel";
import ApplicationHistory from "@/components/ApplicationHistory";
import { toast } from "sonner";
import SaveApplicationModal from "@/components/SaveApplicationModal";
import ProductTour from "@/components/ProductTour";

type Step = "idle" | "extracting" | "analyzing" | "scoring" | "done";

export default function Home() {
  const [activeTab, setActiveTab] = useState("upload");
  const [file, setFile] = useState<File | null>(null);
  
  const [result, setResult] = useState<any>(null);
  const [jd, setJd] = useState("");
  const [jdResult, setJdResult] = useState<any>(null);
  const [interviewData, setInterviewData] = useState<any>(null);
  const [roadmapData, setRoadmapData] = useState<any>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [step, setStep] = useState<Step>("idle");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [activeApplicationId, setActiveApplicationId] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
const [simulatorAnswers, setSimulatorAnswers] = useState<Record<string, string>>({});
const [refreshApps, setRefreshApps] = useState(0);
const [companyName, setCompanyName] = useState("");
const [jobTitle, setJobTitle] = useState("");
const [isStandaloneInfo, setIsStandaloneInfo] = useState(false);



  const markChecklistItem = (taskId: string) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks(prevTasks => [...prevTasks, taskId]);
    }
  };



  // Hydration Loop on Mount
  useEffect(() => {
    try {
      const savedResult = sessionStorage.getItem("resume_result");
      const savedJd = sessionStorage.getItem("target_jd");
      const savedJdResult = sessionStorage.getItem("match_result");
      const savedInterviewData = sessionStorage.getItem("interview_data");
      const savedRoadmapData = sessionStorage.getItem("roadmap_data");
      const savedTab = sessionStorage.getItem("active_tab");
      const savedAppId = sessionStorage.getItem("active_application_id");
      const savedCompany = sessionStorage.getItem("active_company_name");
    const savedTitle = sessionStorage.getItem("active_job_title");
if (savedAppId) setActiveApplicationId(savedAppId);

      if (savedResult) setResult(JSON.parse(savedResult));
      if (savedJd) setJd(savedJd);
      if (savedJdResult) setJdResult(JSON.parse(savedJdResult));
      if (savedInterviewData) setInterviewData(JSON.parse(savedInterviewData));
      if (savedRoadmapData) setRoadmapData(JSON.parse(savedRoadmapData));
      if (savedTab) setActiveTab(savedTab);
      const savedCompletedTasks = sessionStorage.getItem("roadmap_completed_tasks");
const savedSimulatorAnswers = sessionStorage.getItem("simulator_answers");
if (savedCompletedTasks) setCompletedTasks(JSON.parse(savedCompletedTasks));
if (savedSimulatorAnswers) setSimulatorAnswers(JSON.parse(savedSimulatorAnswers));
if (savedCompany) setCompanyName(savedCompany);
    if (savedTitle) setJobTitle(savedTitle);

    } catch (e) {
      console.warn("Session storage hydration error:", e);
    }
  }, []);

  useEffect(() => {
  if (activeApplicationId) {
    sessionStorage.setItem("active_application_id", activeApplicationId);
  } else {
    sessionStorage.removeItem("active_application_id");
  }
}, [activeApplicationId]);

  // Monitoring Persistence Effects
  useEffect(() => {
    if (result) {
      sessionStorage.setItem("resume_result", JSON.stringify(result));
      if (step !== "done") {
        setStep("done");
        setIsAnalyzing(false);
      }
    }
  }, [result, step]);

  useEffect(() => {
    sessionStorage.setItem("target_jd", jd);
  }, [jd]);

  useEffect(() => {
    if (jdResult) {
      sessionStorage.setItem("match_result", JSON.stringify(jdResult));
    }
  }, [jdResult]);

  useEffect(() => {
    if (interviewData) sessionStorage.setItem("interview_data", JSON.stringify(interviewData));
  }, [interviewData]);

  useEffect(() => {
    if (roadmapData) sessionStorage.setItem("roadmap_data", JSON.stringify(roadmapData));
  }, [roadmapData]);

  useEffect(() => {
    sessionStorage.setItem("active_tab", activeTab);
  }, [activeTab]);

  useEffect(() => {
  if (completedTasks.length > 0)
    sessionStorage.setItem("roadmap_completed_tasks", JSON.stringify(completedTasks));
}, [completedTasks]);

useEffect(() => {
  if (Object.keys(simulatorAnswers).length > 0)
    sessionStorage.setItem("simulator_answers", JSON.stringify(simulatorAnswers));
}, [simulatorAnswers]);

useEffect(() => {
  if (companyName) sessionStorage.setItem("active_company_name", companyName);
  else sessionStorage.removeItem("active_company_name");
}, [companyName]);

useEffect(() => {
  if (jobTitle) sessionStorage.setItem("active_job_title", jobTitle);
  else sessionStorage.removeItem("active_job_title");
}, [jobTitle]);

  // 🧹 Global Hard Reset Routine
  const handleReset = () => {
    try {
      sessionStorage.clear();
    } catch (e) {
      console.error(e);
    }
    setFile(null);
    setResult(null);
    setJd("");
    setJdResult(null);
    setInterviewData(null);
    setRoadmapData(null);
    setCompletedTasks([]);
setSimulatorAnswers({});
setActiveApplicationId(null);
    setCompanyName("");
  setJobTitle("");
  setStep("idle");
  setActiveTab("upload");
  };
  
const handleSaveApplication = async (company: string, title: string) => {
  try {
    // Prevent company name and job title from dropping to blank on updates
    const finalCompany = company || companyName || sessionStorage.getItem("active_company_name") || "";
    const finalTitle = title || jobTitle || sessionStorage.getItem("active_job_title") || "";

    const payload = {
      companyName: finalCompany,
      jobTitle: finalTitle,
      jobDescription: jd,
      matchScore: jdResult?.match_score || 0,
      resumeAnalysisResult: result, // Explicitly preserves active resume context
      matchAnalysis: jdResult,     // Explicitly preserves active compare data
      interviewPrep: interviewData || {},
      roadmap: roadmapData || {},
      completedTasks: completedTasks || [],
      simulatorAnswers: simulatorAnswers || {},
    };
    
    const isUpdate = !!activeApplicationId;
    const url = "/api/applications";
    const method = isUpdate ? "PATCH" : "POST";
    const body = isUpdate
      ? JSON.stringify({ id: activeApplicationId, ...payload })
      : JSON.stringify(payload);

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(errorData.error || `Server failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!isUpdate && data.data?.id) {
      setActiveApplicationId(data.data.id);
    }

    // Always re-lock names into state and persistence layers
    setCompanyName(finalCompany);
    setJobTitle(finalTitle);
    sessionStorage.setItem("active_company_name", finalCompany);
    sessionStorage.setItem("active_job_title", finalTitle);

    // Alert sidebar to refresh
    setRefreshApps((prev) => prev + 1);

    markChecklistItem("saved");
    toast.success(isUpdate ? "Application updated!" : "Application saved!");
    setIsSaveModalOpen(false);
  } catch (err: any) {
    toast.error(`Save failed: ${err.message}`);
  }
};

const handleSaveButtonClick = () => {
  if (activeApplicationId) {
    // Pass the currently loaded state fields directly for background updates
    handleSaveApplication(companyName, jobTitle);
  } else {
    // Open the entry modal popup for a new application workspace
    setIsSaveModalOpen(true);
  }
};
const handleDeleteApplication = async (id: string, e: React.MouseEvent) => {
  e.stopPropagation(); // Prevents click bubbling from selecting/hydrating the app row
  if (!confirm("Are you sure you want to delete this application permanently?")) return;
  
  try {
    const response = await fetch(`/api/applications?id=${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Server failed to process deletion request.");
    
    toast.success("Application removed successfully.");
    
    // If the open app matches the one deleted, wipe the display workspace cleanly
    if (id === activeApplicationId) {
      handleReset();
    }
    
    // Kick off background list sync refetch hook
    setRefreshApps((prev) => prev + 1);
  } catch (err: any) {
    toast.error(`Delete failed: ${err.message}`);
  }
};

 const handleHistorySelect = (app: any) => {
    setJd(app.jobDescription || "");
    setResult(app.resumeAnalysisResult || null);
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

  // 🚀 PRODUCT TOUR STATES: Manages interactive tour triggers
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Auto-launch guide tour for first-time visitors on dashboard canvas load
 useEffect(() => {
  const hasSeenTour = localStorage.getItem("has_seen_onboarding_tour");
  if (!hasSeenTour) {
    const timer = setTimeout(() => {
      setIsTourOpen(true);
      setTourStep(0);
      setActiveTab("upload");
      localStorage.setItem("has_seen_onboarding_tour", "true");
    }, 1000); // 1 second gentle entrance delay
    
    return () => clearTimeout(timer); // Clean up the timeout if component unmounts
  }
}, []);

  const handleStartHelpTour = () => {
    setTourStep(0);
    setActiveTab("upload");
    setIsTourOpen(true);
  };

  const handleBackgroundAutosave = async (latestChecklistArray: string[]) => {
    if (!activeApplicationId) return;
    try {
      const payload = {
        companyName,
        jobTitle,
        jobDescription: jd,
        matchScore: jdResult?.match_score || 0,
        resumeAnalysisResult: result,
        matchAnalysis: jdResult,
        interviewPrep: interviewData || {},
        roadmap: roadmapData || {},
        completedTasks: latestChecklistArray, 
        simulatorAnswers: simulatorAnswers || {},
      };
      
      await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: activeApplicationId, ...payload }),
      });
    } catch (err) {
      console.warn("Autosave pipeline dropped out:", err);
    }
  };

  return (
    <div className="h-screen flex bg-slate-50 text-slate-900 antialiased font-sans relative">
      
      {/* 🚀 PRODUCT TOUR WINDOW IMPLEMENTATION */}
      <ProductTour 
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tourStep={tourStep}
        setTourStep={setTourStep}
        isStandaloneInfo={isStandaloneInfo}
      />

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onReset={handleReset} 
        hasUploadedResume={!!result}
        result={result}
        setCurrentResult={setResult}
        setJd={setJd}
        setJdResult={setJdResult}
        setInterviewData={setInterviewData} 
        setRoadmapData={setRoadmapData} 
        onSaveApplication={handleSaveButtonClick} 
        setCompletedTasks={setCompletedTasks}
        setSimulatorAnswers={setSimulatorAnswers}
        setActiveApplicationId={setActiveApplicationId}
        refreshApps={refreshApps}
        activeApplicationId={activeApplicationId}
        setCompanyName={setCompanyName}
        setJobTitle={setJobTitle}
        onDeleteApplication={handleDeleteApplication}
        setIsTourOpen={setIsTourOpen}
  setTourStep={setTourStep}
  setIsStandaloneInfo={setIsStandaloneInfo}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-slate-50">
        
        {/* WORKSPACE BANNER */}
        {activeApplicationId && (
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-300 shadow-sm animate-fadeIn">
            <div className="flex items-center space-x-2 truncate">
              <span className="text-indigo-400">📁</span>
              <span className="text-slate-400">Current Application:</span>
              <span className="text-slate-100 font-bold truncate bg-slate-950 px-2 py-1 rounded border border-slate-800/60">
                {companyName} — <span className="text-indigo-400 italic font-medium">{jobTitle}</span>
              </span>
            </div>
            <button 
              onClick={handleReset}
              className="text-[10px] text-slate-400 hover:text-rose-400 uppercase tracking-wider bg-slate-950 px-2.5 py-1 rounded border border-slate-800 hover:border-rose-950 transition-all cursor-pointer"
            >
              Close Application
            </button>
          </div>
        )}

        {isAnalyzing && (
          <div className="bg-slate-950 text-white text-xs py-3 px-6 shadow-md z-50 border-b border-slate-800 transition-all duration-350">
            <div className="max-w-xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span className="font-semibold tracking-wide text-slate-300">PROCESSING RUN</span>
              </div>
              <div className="flex items-center gap-3">
                <StepLabel label="Extract" active={step === "extracting"} done={step !== "idle"} />
                <Divider />
                <StepLabel label="Analyze" active={step === "analyzing"} done={step === "scoring" || step === "done"} />
                <Divider />
                <StepLabel label="Score" active={step === "scoring"} done={step === "done"} />
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="w-full h-full"
            >
              {activeTab === "upload" && (
                <UploadPanel 
                  file={file} 
                  setFile={setFile} 
                  setResult={setResult} 
                  setIsAnalyzing={setIsAnalyzing} 
                  setStep={setStep} 
                  setActiveTab={setActiveTab}
                  activeApplicationId={activeApplicationId}
                  companyName={companyName}
                  jobTitle={jobTitle}
                />
              )}
              {activeTab === "analysis" && (
                <AnalysisPanel result={result} isAnalyzing={isAnalyzing} onNavigate={setActiveTab}/>
              )}
              {activeTab === "insights" && <InsightsPanel result={result} />}
              {activeTab === "optimize" && (
                <OptimizePanel result={result} onNavigate={setActiveTab} />
              )}
              {activeTab === "job-match" && (
                <JobMatchPanel result={result} jd={jd} setJd={setJd} jdResult={jdResult} setJdResult={setJdResult} onNavigate={setActiveTab} />
              )}
              {activeTab === "interview" && (
                <InterviewPanel result={result} jd={jd} jdResult={jdResult} onNavigate={setActiveTab} interviewData={interviewData} setInterviewData={setInterviewData} roadmapData={roadmapData} simulatorAnswers={simulatorAnswers} setSimulatorAnswers={setSimulatorAnswers} />
              )}
              {activeTab === "roadmap" && (
                <RoadmapPanel 
                  result={result} 
                  jd={jd} 
                  jdResult={jdResult} 
                  onNavigate={setActiveTab} 
                  roadmapData={roadmapData} 
                  setRoadmapData={setRoadmapData} 
                  interviewData={interviewData} 
                  completedTasks={completedTasks} 
                  setCompletedTasks={setCompletedTasks}
                  triggerInstantAutosave={handleBackgroundAutosave}
                />
              )}
              {activeTab === "history" && (
                <ApplicationHistory onSelect={handleHistorySelect} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* 🚀 REAL-WORLD UI ENHANCEMENT: FLOATING HELP FAB BUTTON */}
         <div className="fixed bottom-6 right-6 z-40">
  <button
    onClick={() => {
      // Logic executed directly inline to prevent any redeclaration conflicts
      setIsStandaloneInfo(false);
      setTourStep(0);
      setActiveTab("upload");
      setIsTourOpen(true);
    }}
    className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 px-4 py-2.5 rounded-full shadow-2xl transition-all active:scale-[0.97] hover:border-indigo-500/50 group cursor-pointer"
    title="Launch Application Onboarding Guide Walkthrough"
  >
    <span className="text-xs font-bold text-slate-300 group-hover:text-indigo-400 transition-colors"> App Tour Guide</span>
    <div className="h-5 w-5 bg-indigo-600 rounded-full flex items-center justify-center shadow-md shadow-indigo-600/20 text-[10px] text-white font-bold">
      ?
    </div>
  </button>
</div>

        </main>
      </div>

      <SaveApplicationModal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} onSave={(company, title) => handleSaveApplication(company, title)} />
    </div>
  );
}

function StepLabel({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <span
      className={`px-2.5 py-1 rounded-md font-bold tracking-wider text-[10px] uppercase transition-all ${
        active ? "bg-indigo-600 text-white shadow-sm" : ""
      } ${done && !active ? "text-emerald-400" : ""} ${!active && !done ? "text-slate-600" : ""}`}
    >
      {label}
    </span>
  );
}

function Divider() {
  return <span className="text-slate-700 text-xs font-semibold">/</span>;
}