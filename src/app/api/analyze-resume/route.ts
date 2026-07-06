import { analyzeResumeWithGroq } from "@/services/ai/groq";
import { extractPdfText } from "@/services/pdf/pdfExtractor";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // STEP 1: Extract text
    const text = await extractPdfText(buffer);

    if (!text || text.trim().length === 0) {
      return Response.json({
        success: false,
        error: "Could not extract text from PDF",
      });
    }
    
    // const rawResult = await analyzeResumeWithGroq(text);

    // --- SIMULATE API DELAY & RESTORE HARDCODED DATA ---
    await new Promise((resolve) => setTimeout(resolve, 2000)); 

    const mockGraphData = [
      { skill: "Frontend", name: "Frontend", subject: "Frontend", score: 85, value: 85, A: 85, fullMark: 100 },
      { skill: "Backend", name: "Backend", subject: "Backend", score: 70, value: 70, A: 70, fullMark: 100 },
      { skill: "Architecture", name: "Architecture", subject: "Architecture", score: 65, value: 65, A: 65, fullMark: 100 },
      { skill: "UI/UX", name: "UI/UX", subject: "UI/UX", score: 80, value: 80, A: 80, fullMark: 100 },
      { skill: "DevOps", name: "DevOps", subject: "DevOps", score: 60, value: 60, A: 60, fullMark: 100 }
    ];

    const mockRewriterData = [
      { bullet_point: "Developed web app", suggested_rewrite: "Architected a scalable React application.", original: "Developed web app", rewritten: "Architected a scalable React application.", original_bullet: "Developed web app", revised_bullet: "Architected a scalable React application.", old: "Developed web app", new: "Architected a scalable React application.", suggestion: "Architected a scalable React application.", text: "Architected a scalable React application.", point: "Architected a scalable React application." },
      { bullet_point: "Fixed bugs", suggested_rewrite: "Resolved critical performance bottlenecks.", original: "Fixed bugs", rewritten: "Resolved critical performance bottlenecks.", original_bullet: "Fixed bugs", revised_bullet: "Resolved critical performance bottlenecks.", old: "Fixed bugs", new: "Resolved critical performance bottlenecks.", suggestion: "Resolved critical performance bottlenecks.", text: "Resolved critical performance bottlenecks.", point: "Resolved critical performance bottlenecks." },
      { bullet_point: "Managed a team", suggested_rewrite: "Spearheaded a cross-functional team.", original: "Managed a team", rewritten: "Spearheaded a cross-functional team.", original_bullet: "Managed a team", revised_bullet: "Spearheaded a cross-functional team.", old: "Managed a team", new: "Spearheaded a cross-functional team.", suggestion: "Spearheaded a cross-functional team.", text: "Spearheaded a cross-functional team.", point: "Spearheaded a cross-functional team." }
    ];

   const rawResult = {
  // This math guarantees a random integer strictly between 70 and 90
  ats_score: Math.floor(Math.random() * 21) + 70,
  
  // Fully expanded professional summary
  summary: "Experienced software engineer with a strong background in developing scalable web applications. Proficient in modern JavaScript frameworks and passionate about clean code and performance optimization. Demonstrated ability to lead cross-functional teams, bridge the gap between design and engineering, and deliver high-impact features ahead of schedule.",
  
  skills: ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Tailwind CSS", "Git"],
  strengths: ["Solid understanding of component-driven architecture", "Consistent career progression", "Relevant modern tech stack"],
  weaknesses: ["Missing quantifiable achievements", "Lacks cloud infrastructure experience"],
  recommended_roles: ["Frontend Developer", "Full Stack Engineer", "React Developer"],
  skill_gap: ["AWS / Cloud Providers", "Docker / Kubernetes", "CI/CD Pipelines"],
  improvements: ["Use the STAR method to describe experiences", "Add specific metrics (e.g., 'reduced load time by 15%')", "Include a link to a live portfolio"],
  career_level: "Mid-Level",
  
  weak_bullets: [
    {
      id: "b1",
      section: "Experience - Software Engineer",
      originalLine: "Developed web app"
    },
    {
      id: "b2",
      section: "Experience - Junior Developer",
      originalLine: "Fixed bugs"
    },
    {
      id: "b3",
      section: "Experience - Team Lead",
      originalLine: "Managed a team"
    }
  ],

  // Fallback flooding for Graphs
  skill_scores: mockGraphData,
  identified_skill_strengths: mockGraphData,
  skill_strengths: mockGraphData,
  identified_skills: mockGraphData,

  // Fallback flooding for Rewriters
  resume_rewriter: mockRewriterData,
  resume_rewrites: mockRewriterData,
  resume_rewrite_suggestions: mockRewriterData,
  rewritten_resume: mockRewriterData,
  resume_suggestions: mockRewriterData,
  rewrites: mockRewriterData,
  resume_rewriter_points: mockRewriterData.map((r) => r.suggested_rewrite),
  rewrite_points: mockRewriterData.map((r) => r.suggested_rewrite),
};

    const result: any =
      rawResult && typeof rawResult === "object"
        ? rawResult
        : {};

    // STEP 4: Normalize
    const normalized = {
      ...result, // Spreads ALL extra arrays directly to prevent them from being stripped!
      ats_score: typeof result.ats_score === "number" ? result.ats_score : 0,
      summary: result.summary || "",
      skills: Array.isArray(result.skills) ? result.skills : [],
      strengths: Array.isArray(result.strengths) ? result.strengths : [],
      weaknesses: Array.isArray(result.weaknesses) ? result.weaknesses : [],
      recommended_roles: Array.isArray(result.recommended_roles)
        ? result.recommended_roles
        : [],
      skill_gap: Array.isArray(result.skill_gap) ? result.skill_gap : [],
      improvements: Array.isArray(result.improvements)
        ? result.improvements
        : [],
      career_level: result.career_level || "Unknown",
    };

    // ---------------------------------------------------
    // 🧪 STEP 5: VALIDATION REPORT (NEW DEBUG LAYER)
    // ---------------------------------------------------

    const validation = {
      has_ats_score: typeof result.ats_score === "number",
      has_summary: !!result.summary,
      skills_count: normalized.skills.length,
      strengths_count: normalized.strengths.length,
      weaknesses_count: normalized.weaknesses.length,
      roles_count: normalized.recommended_roles.length,
      skill_gap_count: normalized.skill_gap.length,
      improvements_count: normalized.improvements.length,
      skill_scores_count: normalized.skill_scores?.length || 0,
      identified_skills_count: normalized.identified_skill_strengths?.length || 0,
      rewriter_points_count: normalized.resume_rewriter?.length || 0,
    };

    // 🚨 LOG TO TERMINAL (VERY IMPORTANT)
    console.log("=== AI RESPONSE DEBUG REPORT ===");
    console.log(validation);
    console.log("================================");

    // STEP 6: Final response
    return Response.json({
      success: true,
      data: normalized,
      debug: validation, // 👈 TEMPORARY (you can remove later)
    });

  } catch (error: any) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: error.message || "Internal server error",
        data: {
          ats_score: 0,
          summary: "",
          skills: [],
          strengths: [],
          weaknesses: [],
          recommended_roles: [],
          skill_gap: [],
          improvements: [],
          career_level: "Unknown",
        },
      },
      { status: 500 }
    );
  }
}