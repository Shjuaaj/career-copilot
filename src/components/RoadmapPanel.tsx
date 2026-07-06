"use client";

import React, { useState, useEffect, useMemo } from "react";
import { TimelineSkeleton } from "@/components/SkeletonLoader";

import { toast } from "sonner";

interface RoadmapPanelProps {
  result: any;
  jd: string;
  jdResult: any;
  onNavigate: (tab: string) => void;
  roadmapData: any;
  setRoadmapData: (data: any) => void;
  interviewData?: any;
  completedTasks: string[];
  setCompletedTasks: (val: string[]) => void;
  triggerInstantAutosave?: (latestChecklistArray: string[]) => Promise<void>;
}

interface ResourceLink {
  label: string;
  url: string;
}

export default function RoadmapPanel({ result, jd, jdResult, onNavigate, roadmapData, setRoadmapData, interviewData, completedTasks, setCompletedTasks,triggerInstantAutosave }: RoadmapPanelProps) {
  const [loading, setLoading] = useState<boolean>(false);



  const parsed = result?.data || result;

 const toggleTask = (id: string) => {
    const updatedTasks = completedTasks.includes(id)
      ? completedTasks.filter((t) => t !== id)
      : [...completedTasks, id];
      
    setCompletedTasks(updatedTasks);
    
    // Check if an application is active and invoke the background autosave trigger
    if (triggerInstantAutosave) {
      triggerInstantAutosave(updatedTasks);
    }
  };
  
  

  const generateRoadmap = async () => {
  
  if (!parsed) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center shadow-xl max-w-md mx-auto mt-12 font-sans">
        <div className="text-4xl mb-4">⏳</div>
        <h3 className="font-bold text-slate-100 text-lg tracking-tight">Step 1: Setup Your Resume Profile</h3>
        <p className="text-sm text-slate-400 mt-2 mb-6">
          Your custom micro-tasks depend directly on mapping out gaps in your profile. Please process a document template first!
        </p>
        <button
          onClick={() => onNavigate("upload")}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
        >
          Go to Upload Dashboard Step
        </button>
      </div>
    );
  }
    setLoading(true);

    try {
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeData: parsed,
          jobDescription: jd || null,
          matchAnalysis: jdResult || null,
        }),
      });

      const json = await response.json();
      setRoadmapData(json.data); 
      setCompletedTasks([]); // Reset progress when generating a fresh roadmap
    } catch (error) {
      console.error("Error generating roadmap timeline context vectors:", error);
    } finally {
      setLoading(false);
    }
  };

  // 📊 Calculate Global Progress Percentage safely
  const { allTasksCount, progressPercent } = useMemo(() => {
    if (!roadmapData) return { allTasksCount: 0, progressPercent: 0 };
    
    let count = 0;
    
    // Count timeline tasks
    roadmapData.learning_path?.forEach((p: any) => {
      if (p.tasks && p.tasks.length > 0 && typeof p.tasks[0] === 'object') {
        count += p.tasks.length;
      }
    });
    
    // Count capstone checklist tasks
    if (roadmapData.final_project_idea?.checklist) {
      count += roadmapData.final_project_idea.checklist.length;
    }
    
    const percent = count === 0 ? 0 : Math.round((completedTasks.length / count) * 100);
    return { allTasksCount: count, progressPercent: percent };
  }, [roadmapData, completedTasks]);

  // Helper utility function for resource links
  function getResourceLinks(focusTopic: string, topicsInput: any): ResourceLink[] {
    const searchString = `${focusTopic} ${Array.isArray(topicsInput) ? topicsInput.join(" ") : String(topicsInput)}`.toLowerCase();
    const linksCollection: ResourceLink[] = [];

    if (searchString.includes("typescript") || searchString.includes("ts")) {
      linksCollection.push({ label: "TypeScript Documentation", url: "https://www.typescriptlang.org/docs/" });
      linksCollection.push({ label: "TotalTypeScript Learning Track", url: "https://www.totaltypescript.com/" });
    }
    if (searchString.includes("zustand")) {
      linksCollection.push({ label: "Zustand Core Architecture", url: "https://zustand-demo.pmnd.rs/" });
      linksCollection.push({ label: "Pmndrs Flux Management State", url: "https://github.com/pmndrs/zustand" });
    }
    if (searchString.includes("next.js") || searchString.includes("nextjs") || searchString.includes("app router")) {
      linksCollection.push({ label: "Next.js Core Engine Docs", url: "https://nextjs.org/docs" });
    }
    if (searchString.includes("prisma")) {
      linksCollection.push({ label: "Prisma Client ORM Reference", url: "https://www.prisma.io/docs" });
    }
    if (searchString.includes("postgresql") || searchString.includes("postgres")) {
      linksCollection.push({ label: "PostgreSQL Database Manual", url: "https://www.postgresql.org/docs/" });
    }
    if (searchString.includes("tailwind")) {
      linksCollection.push({ label: "Tailwind CSS Layout Utility Guide", url: "https://tailwindcss.com/docs" });
    }
    if (searchString.includes("framer motion") || searchString.includes("framer")) {
      linksCollection.push({ label: "Framer Motion Animation API", url: "https://www.framer.com/motion/" });
    }
    if (searchString.includes("docker") || searchString.includes("container")) {
      linksCollection.push({ label: "Docker Containerization Track", url: "https://docs.docker.com/" });
    }

    if (linksCollection.length === 0) {
      linksCollection.push({ label: "MDN Web Technology Blueprints", url: "https://developer.mozilla.org/" });
      linksCollection.push({ label: "FreeCodeCamp Dev Matrix", url: "https://www.freecodecamp.org/" });
    }

    return linksCollection;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      
      {/* Warning Banner */}
      {!jd && (
        <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center space-x-3">
            <svg className="h-5 w-5 text-amber-600 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-amber-800 font-medium">
              To generate a personalized, targeted career roadmap, consider adding a job description.
            </p>
          </div>
          <button onClick={() => onNavigate("job-match")} className="text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 px-3 py-1.5 rounded-lg transition-all">
            Add Job Description
          </button>
        </div>
      )}

      {/* Success Banner */}
      {jd && (
        <div className="flex items-center space-x-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 animate-fadeIn">
          <svg className="h-5 w-5 text-emerald-600 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p className="font-medium">
            <strong>Targeted Mode Active:</strong> Your roadmap will be tailored directly to bridge the gaps for your target role.
          </p>
        </div>
      )}

      {/* Control / Trigger Card with Progress Bar */}
      <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-5">
        <div className="md:flex md:items-center md:justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Interactive Upskilling Tracker
            </h2>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Complete your custom micro-tasks to close your skill gaps efficiently.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <button
              onClick={generateRoadmap}
              disabled={loading || !parsed}
              className="w-full md:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-slate-950 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white font-semibold text-sm rounded-xl shadow-sm transition-all active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Building Plan...
                </>
              ) : roadmapData ? ( 
                "Regenerate Timeline"
              ) : (
                "Generate Timeline"
              )}
            </button>
           
          </div>
        </div>

        {/* 🚀 Dynamic Global Progress Bar */}
        {roadmapData && !loading && allTasksCount > 0 && (
          <div className="pt-4 border-t border-slate-100 animate-fadeIn">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Completion</span>
              <span className="text-sm font-black text-indigo-600">{progressPercent}% ({completedTasks.length}/{allTasksCount})</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/50">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

    

      {/* Loading State Wrapper */}
      {loading && (
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm">
          <TimelineSkeleton />
        </div>
      )}

      {/* Timeline Output Content Blocks */}
      {!loading && roadmapData && ( 
        <div className="space-y-6 animate-fadeIn">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-5 border border-slate-200/80 rounded-2xl shadow-sm flex flex-col justify-center">
              <span className="text-[10px] font-bold text-indigo-500 tracking-wider uppercase">
                Target Benchmark Role
              </span>
              <h3 className="mt-1 text-base font-bold text-slate-900 tracking-tight">
                {roadmapData.target_role || "Not Specified"}
              </h3>
            </div>

            <div className="bg-white p-5 border border-slate-200/80 rounded-2xl shadow-sm md:col-span-2">
              <span className="text-[10px] font-bold text-indigo-500 tracking-wider uppercase block mb-2">
                Priority Core Skills to Focus
              </span>
              <div className="flex flex-wrap gap-1.5">
                {roadmapData.priority_skills?.map((skill: string, index: number) => ( 
                  <span key={index} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Required Tooling Additions */}
          {roadmapData.tools_to_learn && roadmapData.tools_to_learn.length > 0 && ( 
            <div className="bg-white p-5 border border-slate-200/80 rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold text-amber-600 tracking-wider uppercase block mb-2">
                Required Tooling Additions
              </span>
              <div className="flex flex-wrap gap-1.5">
                {roadmapData.tools_to_learn.map((tool: string, index: number) => ( 
                  <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Vertical Timeline */}
          <div className="bg-white p-6 md:p-8 border border-slate-200/80 rounded-2xl shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-6 tracking-tight">Structured Learning Curricula</h3>
            
            <div className="relative border-l-2 border-slate-100 pl-6 ml-4 space-y-6 my-4">
              {roadmapData.learning_path?.map((block: any, index: number) => { 
                const computedLinks = getResourceLinks(block.focus, block.topics);

                return (
                  <div key={index} className="relative group">
                    <div className="absolute -left-[31px] top-1 bg-white border-2 border-indigo-500 rounded-full h-4 w-4 group-hover:bg-indigo-400 transition-colors duration-150" />
                    
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl transition-all duration-200 hover:border-slate-200/80">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                        <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wide bg-indigo-100/50 border border-indigo-200/50 px-2 py-0.5 rounded-md">
                          {block.phase || `Week ${block.week || index + 1}`}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 flex-1 ml-2 text-left tracking-tight">
                          {block.focus}
                        </h4>
                      </div>

                      <div className="mb-3">
                        <span className="text-xs font-semibold text-slate-500">Core Topics: </span>
                        <span className="text-xs text-slate-700 font-medium">
                          {Array.isArray(block.topics) ? block.topics.join(", ") : block.topics}
                        </span>
                      </div>

                      {/* ✅ Interactive Task Checklist */}
                      {block.tasks && (
                        <div className="pt-3 border-t border-slate-200/80 mt-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">Target Tasks</span>
                          <div className="space-y-2.5">
                            {block.tasks.map((task: any, taskIdx: number) => {
                              // Fallback for legacy string array data in sessionStorage
                              if (typeof task === 'string') {
                                return (
                                  <div key={taskIdx} className="flex items-center font-medium text-xs text-slate-600">
                                    <span className="mx-2 text-slate-400">•</span> {task}
                                  </div>
                                );
                              }

                              const isDone = completedTasks.includes(task.id);
                              return (
                                <label key={task.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                                  isDone ? 'bg-slate-100/50 border-slate-200 opacity-60' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md'
                                }`}>
                                  <div className="mt-0.5 shrink-0">
                                    <input 
                                      type="checkbox" 
                                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                                      checked={isDone}
                                      onChange={() => toggleTask(task.id)}
                                    />
                                  </div>
                                  <div className={`flex-1 text-sm font-medium ${isDone ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                                    {task.text}
                                  </div>
                                  <div className="shrink-0">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${isDone ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                      ⏱️ {task.time}
                                    </span>
                                  </div>
                                </label>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      <div className="pt-3 mt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Verified References:
                        </span>
                        {computedLinks.map((link, lIdx) => (
                          <a key={lIdx} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 text-[11px] font-semibold rounded-lg border border-slate-200 hover:border-indigo-200 transition-all duration-150 cursor-pointer select-none">
                            <span>{link.label}</span>
                            <span className="text-[10px] text-slate-400 font-normal">↗</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Capstone Project Showcase Container */}
          {roadmapData.final_project_idea && (
            <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 text-slate-900 p-6 md:p-8 rounded-2xl shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none text-indigo-500">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2z" /><path d="M4.14 11.52L3 12l9 5 9-5-1.14-.48L12 15.1l-7.86-3.58z" /></svg>
              </div>
              
              <span className="text-[10px] font-bold text-indigo-600 tracking-wider uppercase block mb-1">
                Capstone Milestone
              </span>
              <h3 className="text-lg font-bold tracking-tight text-slate-900 mb-2">
                Portfolio Validation Project
              </h3>

              <p className="text-xs text-slate-700 leading-relaxed font-medium max-w-2xl mb-5">
                {typeof roadmapData.final_project_idea === 'string' 
                  ? roadmapData.final_project_idea 
                  : roadmapData.final_project_idea.description}
              </p>

              {roadmapData.final_project_idea.checklist && (
                <div className="space-y-2.5">
                  {roadmapData.final_project_idea.checklist.map((task: any) => {
                    const isDone = completedTasks.includes(task.id);
                    return (
                      <label key={task.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 relative z-10 ${
                        isDone ? 'bg-white/50 border-slate-200 opacity-60' : 'bg-white border-indigo-200 hover:border-indigo-400 shadow-sm'
                      }`}>
                        <div className="mt-0.5 shrink-0">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                            checked={isDone}
                            onChange={() => toggleTask(task.id)}
                          />
                        </div>
                        <div className={`flex-1 text-sm font-medium ${isDone ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                          {task.text}
                        </div>
                        <div className="shrink-0">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${isDone ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                            ⏱️ {task.time}
                          </span>
                        </div>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}