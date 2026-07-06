"use client";

import { useState, useEffect } from "react";
import { DetailCardSkeleton } from "@/components/SkeletonLoader";

import { toast } from "sonner";

interface InterviewPanelProps {
  result: any;
  jd: string;
  jdResult: any;
  onNavigate: (tab: string) => void;
  interviewData: any;
  setInterviewData: (data: any) => void;
  roadmapData: any;
  simulatorAnswers: Record<string, string>;
  setSimulatorAnswers: (val: Record<string, string>) => void;
}

export default function InterviewPanel({ result, jd, jdResult, onNavigate, interviewData, setInterviewData, roadmapData, simulatorAnswers, setSimulatorAnswers }: InterviewPanelProps) {
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>("technical");
  
  // 🎙️ Simulator UI State Engines
  const [mode, setMode] = useState<"list" | "simulator">("list");
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const answerKey = `${activeSection}-${currentQuestionIdx}`;
  const [feedback, setFeedback] = useState<string | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  


  // ⏱️ Gamification State: Pressure Timer
  const [timeLeft, setTimeLeft] = useState(120);

  const parsed = result?.data || result;

  // Timer Countdown Engine
  useEffect(() => {
    let interval: NodeJS.Timeout;
    // Only run timer if in simulator mode, not currently evaluating, and no feedback is present
    if (mode === "simulator" && interviewData && !evaluating && !feedback) {
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, interviewData, currentQuestionIdx, evaluating, feedback]);

 const resetSimulatorState = (nextSection?: string, nextIdx?: number) => {
  const key = `${nextSection ?? activeSection}-${nextIdx ?? currentQuestionIdx}`;
  setUserAnswer(simulatorAnswers[key] || "");
  setFeedback(null);
  setTimeLeft(120);
};

useEffect(() => {
  setUserAnswer(simulatorAnswers[`${activeSection}-${currentQuestionIdx}`] || "");
  setFeedback(null);
}, [activeSection, currentQuestionIdx]);

  

  const generateQuestions = async () => {
    if (!parsed) return;
    setLoading(true);
    setFeedback(null);
    setCurrentQuestionIdx(0);
    setTimeLeft(120);

    const res = await fetch("/api/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resumeData: parsed,
        jobDescription: jd || null,
        matchAnalysis: jdResult || null
      }),
    });

    const json = await res.json();
    setInterviewData(json.data);
    setLoading(false);
  };

  // 🤖 Interactive Response Evaluation Handler
  const handleEvaluateAnswer = async (question: string) => {
    if (!userAnswer.trim()) return;
    setEvaluating(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate", 
          question,
          answer: userAnswer,
        }),
      });

      const json = await res.json();
      setFeedback(json.feedback); 
    } catch (e) {
      console.error(e);
    } finally {
      setEvaluating(false);
    }
  };

  // Compile active simulator pool matrices safely
  const activeQuestionPool = interviewData ? (
    activeSection === "technical" ? (interviewData.technical_questions || []) :
    activeSection === "behavioral" ? (interviewData.behavioral_questions || []) :
    activeSection === "project" ? (interviewData.project_deep_dive || []) : []
  ) : [];

  // Format time for UI display
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* ⚠️ Dynamic Warning Callout if JD is missing */}
      {!jd && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex justify-between items-center gap-4 animate-fadeIn">
          <div className="flex gap-3 items-start">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="text-sm font-semibold text-amber-800">Want hyper-targeted questions?</h4>
              <p className="text-xs text-amber-700 mt-0.5">
                You haven't pasted a Job Description yet. Generating questions now will be based generally on your resume. For tailored preparation, add a target role first.
              </p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate("job-match")}
            className="text-xs font-bold bg-amber-800 text-white px-3 py-2 rounded-lg hover:bg-amber-900 transition-all whitespace-nowrap"
          >
            + Add Target JD
          </button>
        </div>
      )}

      {/* ✅ Context Indicator Banner if JD exists */}
      {jd && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-xs text-emerald-800 animate-fadeIn">
          <span>🎯</span>
          <span>
            <strong>Targeted Mode Active:</strong> Your interview preparation matrix will target your skill gaps regarding the provided job specifications.
          </span>
        </div>
      )}

      {/* Control Card Frame Layout */}
      <div className="bg-white p-6 border border-slate-200/80 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">AI Interview Simulator</h2>
          <p className="text-sm text-slate-500">
            Generate behavioral, technical, and deep-dive architectural queries customized to your target application tier.
          </p>
        </div>

        <div className="flex gap-3 items-center shrink-0">
          {interviewData && (
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button 
                onClick={() => setMode("list")} 
                className={`px-3 py-1.5 rounded-lg transition-all ${mode === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
              >
                List View
              </button>
              <button 
                onClick={() => {
                  setMode("simulator");
                  resetSimulatorState();
                }} 
                className={`px-3 py-1.5 rounded-lg transition-all ${mode === "simulator" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
              >
                Simulator Deck
              </button>
            </div>
          )}
          
  

          <button
            onClick={generateQuestions}
            disabled={!parsed || loading}
            className="px-5 py-2.5 bg-slate-950 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all disabled:bg-slate-100 disabled:text-slate-400 shadow-sm whitespace-nowrap"
          >
            {loading ? "Generating custom questions..." : "Generate Practice Questions"}
          </button>
        </div>
      </div>

     

      {/* Loading & Result Render Arena */}
      {(loading || interviewData) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start animate-fadeIn">
          
          {/* Left Hand Navigation Side deck */}
          <div className="space-y-2">
            {[
              { id: "technical", label: "Technical Prep", icon: "💻" },
              { id: "behavioral", label: "Behavioral Core", icon: "🤝" },
              { id: "project", label: "Project Deep Dive", icon: "🚀" },
              { id: "tips", label: "Strategy & Tips", icon: "💡" },
            ].map((section) => {
              const isSelected = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  disabled={loading}
                  onClick={() => {
                    setActiveSection(section.id);
                    setCurrentQuestionIdx(0);
                    resetSimulatorState();
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                      : "bg-white text-slate-600 border border-slate-200/60 hover:bg-slate-50 disabled:opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span>{section.icon}</span>
                    <span>{section.label}</span>
                  </div>
                </button>
              );
            })}

            {/* Difficulty Gauge Badge */}
            <div className="bg-slate-900 text-white p-4 rounded-xl shadow-sm space-y-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">Assessed Tier</span>
              {loading ? (
                <div className="h-4 bg-slate-700 rounded w-2/3 animate-pulse mt-1" />
              ) : (
                <p className="text-sm font-semibold text-indigo-300">{interviewData?.difficulty_level || "Standard Mid-Level"}</p>
              )}
            </div>
          </div>

          {/* Right Hand Active Content View Switching Node */}
          <div className="md:col-span-2 bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 min-h-[360px] flex items-start justify-center">
            {loading ? (
              <DetailCardSkeleton />
            ) : mode === "list" || activeSection === "tips" ? (
              /* 📋 TRADITIONAL LIST LAYOUT MODE */
              <>
                {activeSection === "technical" && <QuestionList title="Technical Competency Screening" questions={interviewData?.technical_questions} bulletColor="text-indigo-500" />}
                {activeSection === "behavioral" && <QuestionList title="Behavioral & Cultural Adaptability" questions={interviewData?.behavioral_questions} bulletColor="text-emerald-500" />}
                {activeSection === "project" && <QuestionList title="Architecture & System Deep Dive" questions={interviewData?.project_deep_dive} bulletColor="text-violet-500" />}
                {activeSection === "tips" && <QuestionList title="Strategic Core Delivery Advice" questions={interviewData?.preparation_tips} bulletColor="text-amber-500" useCheckmark />}
              </>
            ) : (
              /* 🎴 INTERACTIVE FLIP INTERFACE SLIDE DECK SIMULATOR MODE */
              <div className="w-full space-y-6 animate-fadeIn">
                
                {/* Simulator Header & Gamification Timer */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Time Remaining ({activeSection}):
                    </h3>
                    {/* Timer UI Pill */}
                    {!feedback && !evaluating && (
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold font-mono transition-colors duration-300 ${timeLeft <= 15 ? "bg-rose-100 text-rose-700 animate-pulse" : "bg-slate-100 text-slate-600"}`}>
                        ⏱️ {formatTime(timeLeft)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                    {activeQuestionPool.length > 0 ? `${currentQuestionIdx + 1} / ${activeQuestionPool.length}` : "0/0"}
                  </span>
                </div>

                {activeQuestionPool.length > 0 ? (
                  <div className="space-y-5">
                    {/* Active Question Anchor Panel */}
                    <div className="p-6 bg-slate-50 border border-indigo-100/50 shadow-inner rounded-2xl">
                      <p className="text-base font-semibold text-slate-900 leading-relaxed">
                        {activeQuestionPool[currentQuestionIdx]}
                      </p>
                    </div>

                    {/* Answer Inputs Terminal */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                          Formulate Your Response
                        </label>
                        
                        {/* Audio Wave Visualizer Simulation */}
                        {userAnswer.length > 0 && !evaluating && !feedback && (
                          <div className="flex items-center gap-1 opacity-70">
                            {[1, 2, 3, 4].map((i) => (
                              <div 
                                key={i} 
                                className="w-1 bg-indigo-500 rounded-full animate-pulse" 
                                style={{ height: `${Math.random() * 12 + 6}px`, animationDelay: `${i * 150}ms` }} 
                              />
                            ))}
                            <span className="text-[10px] text-indigo-500 font-bold ml-1 tracking-wider uppercase">AI Listening</span>
                          </div>
                        )}
                      </div>
                      
                      <textarea
                        className="w-full bg-white border border-slate-200 rounded-xl p-4 h-28 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all leading-relaxed shadow-sm"
                        value={userAnswer}
                        onChange={(e) => {
  setUserAnswer(e.target.value);
  setSimulatorAnswers({ ...simulatorAnswers, [answerKey]: e.target.value });
}}
                        placeholder="Draft your engineering approach response details here..."
                        disabled={evaluating || feedback !== null}
                      />
                      
                      {!feedback && (
                        <button
                          onClick={() => handleEvaluateAnswer(activeQuestionPool[currentQuestionIdx])}
                          disabled={evaluating || !userAnswer.trim()}
                          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all disabled:bg-slate-100 disabled:text-slate-400 shadow-sm flex items-center justify-center w-full sm:w-auto"
                        >
                         {evaluating ? (
    <span className="flex items-center gap-2">
      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
        {/* ... svg circle rows ... */}
      </svg>
      Reviewing your answer...
    </span>
  ) : "Submit My Answer"}
</button>
                      )}
                    </div>

                    {/* Dynamic Evaluation Critic Callouts */}
                    {feedback && (
                      <div className="p-5 bg-indigo-50 border border-indigo-200 rounded-2xl text-sm text-indigo-900 leading-relaxed shadow-sm animate-fadeIn">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">✨</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">AI Feedback</span>
                        </div>
                        {feedback}
                      </div>
                    )}

                    {/* Navigation Deck Footer */}
                    <div className="flex justify-between pt-3 border-t border-slate-100">
                      <button
                        disabled={currentQuestionIdx === 0}
                        onClick={() => {
                          setCurrentQuestionIdx(prev => prev - 1);
                          resetSimulatorState();
                        }}
                        className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-50 disabled:opacity-40 transition-all shadow-sm"
                      >
                        ← Previous
                      </button>
                      <button
                        disabled={currentQuestionIdx === activeQuestionPool.length - 1}
                        onClick={() => {
                          setCurrentQuestionIdx(prev => prev + 1);
                          resetSimulatorState();
                        }}
                        className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-transparent transition-all shadow-sm"
                      >
                        Next Question →
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic font-medium">No practice questions loaded for this category yet. Click "Generate Practice Questions" above to get started!</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function QuestionList({ title, questions, bulletColor, useCheckmark = false }: any) {
  return (
    <div className="space-y-4 animate-fadeIn w-full">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">{title}</h3>
      <ul className="space-y-4">
        {questions?.map((q: string, i: number) => (
          <li key={i} className="flex gap-4 items-start text-sm text-slate-700 leading-relaxed">
            <span className={`${bulletColor} font-bold mt-0.5`}>{useCheckmark ? "✓" : `0${i + 1}.`}</span>
            <span>{q}</span>
          </li>
        )) || <p className="text-xs text-slate-400">No parameters identified for this metric block.</p>}
      </ul>
    </div>
  );
}