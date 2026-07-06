// lib/hydration.ts
export const hydrateAppState = (
  app: any, 
  setJd: (val: string) => void,
  setCurrentResult: (val: any) => void,
  setJdResult: (val: any) => void,
  setInterviewData: (val: any) => void,
  setRoadmapData: (val: any) => void,
  setActiveTab: (val: string) => void
) => {
  // 1. Clear sensitive legacy session data to ensure clean state
  sessionStorage.removeItem("roadmap_completed_tasks");
  
  // 2. Hydrate global states
  setJd(app.jobDescription || "");
  setCurrentResult(app.resumeAnalysisResult || {});
  setJdResult(app.matchAnalysis || {});
  setInterviewData(app.interviewPrep || {});
  setRoadmapData(app.roadmap || {});

  // 3. Persist to sessionStorage so refreshes don't lose the hydrated state
  sessionStorage.setItem("target_jd", app.jobDescription || "");
  sessionStorage.setItem("resume_result", JSON.stringify(app.resumeAnalysisResult || {}));
  sessionStorage.setItem("match_result", JSON.stringify(app.matchAnalysis || {}));
  sessionStorage.setItem("interview_data", JSON.stringify(app.interviewPrep || {}));
  sessionStorage.setItem("roadmap_data", JSON.stringify(app.roadmap || {}));

  // 4. Redirect user to the Analysis tab to see the loaded data
  setActiveTab("analysis");
};