"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TourStep {
  title: string;
  description: string;
  tab: string;
  elementId: string;
  position: "right" | "left" | "bottom" | "center";
}

interface ProductTourProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tourStep: number;
  setTourStep: (step: number) => void;
  isStandaloneInfo?: boolean;
}

export default function ProductTour({
  isOpen,
  onClose,
  setActiveTab,
  tourStep,
  setTourStep,
  isStandaloneInfo = false,
}: ProductTourProps) {
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [arrowY, setArrowY] = useState(46);

  const steps: TourStep[] = [
    {
      title: "Upload Resume",
      description: "Upload your current resume PDF to instantly analyze your career profile features.",
      tab: "upload",
      elementId: "nav-upload",
      position: "right",
    },
    {
      title: "Resume Analysis",
      description: "Review your comprehensive ATS metric score overview and identified core skill strengths.",
      tab: "analysis",
      elementId: "nav-analysis",
      position: "right",
    },
    {
      title: "Resume Rewriter",
      description: "Transform plain background achievements into high-impact, professional milestones instantly.",
      tab: "optimize",
      elementId: "nav-optimize",
      position: "right",
    },
    {
      title: "Job Description Match",
      description: "Compare your resume against any target job posting to identify critical technical skill gaps.",
      tab: "job-match",
      elementId: "nav-job-match",
      position: "right",
    },
    {
      title: "Interview Simulation",
      description: "Practice personalized technical and behavioral interview questions with an active AI evaluation coach.",
      tab: "interview",
      elementId: "nav-interview",
      position: "right",
    },
    {
      title: "Preparation Roadmap",
      description: "Follow a tailored upskilling curriculum structured with custom milestone tracker checklists.",
      tab: "roadmap",
      elementId: "nav-roadmap",
      position: "right",
    },
    {
      title: "Saved Applications",
      description: "Access and switch between your historically managed workspaces and application track logs easily.",
      tab: "roadmap",
      elementId: "nav-saved-apps",
      position: "right",
    },
    {
      title: "Save Application",
      description: "Persist your customized workspace parameters, checklist goals, and interview answer inputs safely.",
      tab: "roadmap",
      elementId: "sidebar-btn-save",
      position: "right",
    },
    {
      title: "Create New Application",
      description: "Clear your active workspace instantly to focus on a brand-new target role target.",
      tab: "roadmap",
      elementId: "sidebar-btn-new",
      position: "right",
    }
  ];

  const current = steps[tourStep];

  // Isolated post-paint effect hook safely updates layout state values without crashing 
  useEffect(() => {
    if (!isOpen || !current) return;
    
    const measureElement = () => {
      const element = document.getElementById(current.elementId);
      if (element) {
        const rect = element.getBoundingClientRect();
        const calcTop = rect.top + window.scrollY;
        const calcLeft = rect.left + window.scrollX;

        setCoords({
          top: calcTop,
          left: calcLeft,
          width: rect.width,
          height: rect.height,
        });

        // Safe evaluation inside side effect cycle block
        const popoverHeight = 140; 
        const idealBottomViewportPos = (calcTop - window.scrollY + (rect.height / 2)) + (popoverHeight / 2);
        const windowSafetyMargin = window.innerHeight - 20;

        if (idealBottomViewportPos > windowSafetyMargin) {
          const overhangingDelta = idealBottomViewportPos - windowSafetyMargin;
          setArrowY(46 + overhangingDelta);
        } else {
          setArrowY(46);
        }
      } else {
        setCoords({
          top: window.innerHeight / 2 - 50,
          left: window.innerWidth / 2 - 144,
          width: 0,
          height: 0,
        });
        setArrowY(46);
      }
    };

    measureElement();
    window.addEventListener("resize", measureElement);
    window.addEventListener("scroll", measureElement);
         
    return () => {
      window.removeEventListener("resize", measureElement);
      window.removeEventListener("scroll", measureElement);
    };
  }, [tourStep, isOpen, current?.elementId]);

  if (!isOpen || !current) return null;

  const handleNext = () => {
    if (tourStep < steps.length - 1) {
      const nextStep = tourStep + 1;
      setTourStep(nextStep);
      setActiveTab(steps[nextStep].tab);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (tourStep > 0) {
      const prevStep = tourStep - 1;
      setTourStep(prevStep);
      setActiveTab(steps[prevStep].tab);
    }
  };

  const isRealElement = coords.width > 0 && coords.height > 0;
  let popoverStyle: React.CSSProperties = { position: "absolute", zIndex: 100 };

  if (isRealElement && current.position === "right") {
    const popoverHeight = 140; 
    const idealTop = coords.top + (coords.height / 2) - (popoverHeight / 2);
    
    const currentViewportOffsetTop = coords.top - window.scrollY;
    const idealBottomViewportPos = (currentViewportOffsetTop + (coords.height / 2)) + (popoverHeight / 2);
    const windowSafetyMargin = window.innerHeight - 20;

    if (idealBottomViewportPos > windowSafetyMargin) {
      const overhangingDelta = idealBottomViewportPos - windowSafetyMargin;
      popoverStyle.top = idealTop - overhangingDelta;
    } else {
      popoverStyle.top = idealTop;
    }
    popoverStyle.left = coords.left + coords.width + 24;
  } else {
    popoverStyle.position = "fixed";
    popoverStyle.top = "40%";
    popoverStyle.left = "50%";
    popoverStyle.transform = "translate(-50%, -50%)";
  }

  const progressPercent = Math.round(((tourStep + 1) / steps.length) * 100);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none select-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/10 pointer-events-auto backdrop-blur-[0.5px]" 
          onClick={onClose}
        />
        
        {isRealElement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              top: coords.top - 3,
              left: coords.left - 3,
              width: coords.width + 6,
              height: coords.height + 6,
            }}
            className="rounded-xl border-2 border-indigo-500/80 shadow-[0_0_12px_rgba(99,102,241,0.25)] bg-indigo-500/5 z-50"
          />
        )}

        <motion.div
          style={popoverStyle}
          initial={{ opacity: 0, scale: 0.96, y: 3 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 3 }}
          className="bg-white border border-slate-200/80 rounded-[24px] p-5 w-[290px] shadow-[0_20px_40px_-15px_rgba(15,23,42,0.12),0_4px_12px_rgba(15,23,42,0.03)] pointer-events-auto text-slate-800 z-50 flex flex-col space-y-3"
        >
          {isRealElement && current.position === "right" && (
            <div 
              style={{ top: `${arrowY}px` }}
              className="absolute left-[-5px] h-0 w-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[5px] border-r-white drop-shadow-[-1px_0_0_rgba(226,232,240,0.8)] transition-all duration-300" 
            />
          )}

          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold tracking-wide text-indigo-600 uppercase">
              {current.title}
            </span>
            {!isStandaloneInfo && (
              <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md">
                {tourStep + 1}/{steps.length}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            {current.description}
          </p>

          {!isStandaloneInfo && (
            <div className="w-full bg-slate-100 h-0.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
            </div>
          )}

          <div className="flex items-center justify-end pt-0.5">
            {isStandaloneInfo ? (
              <button 
                onClick={onClose}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg transition-all active:scale-95 shadow-sm shadow-indigo-600/10 cursor-pointer"
              >
                Close Info
              </button>
            ) : (
              <div className="flex items-center justify-between w-full">
                <button 
                  onClick={onClose} 
                  className="text-[10px] font-medium text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  Skip
                </button>
                
                <div className="flex space-x-1">
                  {tourStep > 0 && (
                    <button 
                      onClick={handleBack} 
                      className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold rounded-md transition-all cursor-pointer"
                    >
                      Back
                    </button>
                  )}
                  <button 
                    onClick={handleNext} 
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-md transition-all shadow-sm cursor-pointer active:scale-95"
                  >
                    {tourStep === steps.length - 1 ? "Finish" : "Next"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}