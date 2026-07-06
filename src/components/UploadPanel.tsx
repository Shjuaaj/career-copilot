"use client";
import { useState } from "react";

type Step = "idle" | "uploading" | "extracting" | "analyzing" | "finalizing";

export default function UploadPanel({ 
  file, 
  setFile, 
  setResult, 
  setIsAnalyzing, 
  setStep, 
  setActiveTab,
  // ＋ ADD THESE PROPS RIGHT HERE:
  activeApplicationId,
  companyName,
  jobTitle
}: any) {
  const [loading, setLoading] = useState(false);
  const [localStep, setLocalStep] = useState<Step>("idle");

  const handleUpload = async () => {
    if (!file || loading) return;
    try {
      setLoading(true);
      setIsAnalyzing(true);
      setStep("extracting");
      setLocalStep("uploading");
      setTimeout(() => setLocalStep("extracting"), 400);
      setTimeout(() => setLocalStep("analyzing"), 900);
      setTimeout(() => setLocalStep("finalizing"), 1500);
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/analyze-resume", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
      if (setActiveTab) setActiveTab("analysis");
    } finally {
      setLoading(false);
      setIsAnalyzing(false);
      setLocalStep("idle");
    }
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
  };

 
  if (activeApplicationId) {
    return (
      <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl text-center space-y-6">
        <div className="h-14 w-14 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto border border-indigo-500/20">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">Your Workspace is Ready!</h2>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            We've saved your resume review for <span className="text-indigo-400 font-bold">{companyName || "this company"}</span> ({jobTitle || "Target Role"}). You can explore your tailored preparation track below or update your file at any time.
          </p>
        </div>
        <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 inline-block text-xs font-medium text-slate-400">
          💡 Head over to the <span className="text-indigo-400 font-bold">Resume Analysis</span> or <span className="text-indigo-400 font-bold">Preparation Roadmap</span> tabs in the sidebar to view your custom plan.
        </div>
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setActiveTab("analysis")}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            See My Resume Score
          </button>
          <button
            onClick={() => {
              document.getElementById("fileInput")?.click();
            }}
            className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Upload a Different Resume
          </button>
        </div>
        <input id="fileInput" type="file" accept="application/pdf" hidden onChange={(e) => {
          setFile(e.target.files?.[0] || null);
          handleUpload();
        }} />
      </div>
    );
  }

  // Fallback default landing view container markup
  return (
    <div className="max-w-2xl mx-auto bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm space-y-6">
      {/* ... keeping your exact original Upload panel layout if active ID is null ... */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Upload your Resume</h2>
        <p className="text-sm text-slate-500 mt-1">Our AI engine parses and grades your resume structure in real-time.</p>
      </div>
      <div className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all relative ${file ? "border-indigo-500 bg-indigo-50/30" : "border-slate-300 hover:border-slate-400 hover:bg-slate-50/50"}`} onClick={() => document.getElementById("fileInput")?.click()}>
        {file && !loading && (
          <button onClick={handleClearFile} className="absolute top-3 right-3 h-7 w-7 flex items-center justify-center rounded-full bg-slate-900/10 hover:bg-rose-100 text-slate-700 hover:text-rose-600 font-bold transition-all text-sm shadow-sm" title="Remove file" />
        )}
        <div className="text-3xl mb-3">{file ? "📄" : "📁"}</div>
        <p className="font-medium text-slate-700 text-sm max-w-md mx-auto truncate px-4">{file ? file.name : "Drag & drop PDF here, or click to browse"}</p>
        <p className="text-xs text-slate-400 mt-1">Supports PDF files up to 10MB</p>
        <input id="fileInput" type="file" accept="application/pdf" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>
      <button onClick={handleUpload} disabled={!file || loading} className="w-full py-3.5 bg-slate-950 text-white font-medium rounded-xl hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 transition-all shadow-sm">
        {loading ? "Analyzing Document..." : "Analyze Resume"}
      </button>
    
{/* ✅ REPLACE IT WITH THIS: */}
{loading && (
  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
    <StepItem active={localStep === "uploading"} label="Uploading your resume securely..." />
    <StepItem active={localStep === "extracting"} label="Reading and sorting your resume text..." />
    <StepItem active={localStep === "analyzing"} label="Identifying your unique skills and achievements..." />
    <StepItem active={localStep === "finalizing"} label="Setting up your custom prep dashboard..." />
  </div>
)}
    </div>
  );
}

function StepItem({ active, label }: { active: boolean; label: string }) {
  return (
    <div className="flex gap-3 items-center text-sm transition-all duration-300">
      <span className={`h-2 w-2 rounded-full ${active ? "bg-indigo-600 animate-ping" : "bg-slate-300"}`} />
      <span className={active ? "text-slate-900 font-medium" : "text-slate-500"}>{label}</span>
    </div>
  );
}