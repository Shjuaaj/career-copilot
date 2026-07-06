// Helper function for robust JSON parsing from AI responses
export function safeJsonParse(content: string): any {
  if (!content) {
    throw new Error("Empty content provided for JSON parsing.");
  }

  // 1. Remove markdown code block delimiters
  let jsonString = content.replace(/```json/g, "").replace(/```/g, "").trim();

  // 2. Extract the outermost JSON object or array
  let startIdx = jsonString.indexOf('{');
  let endIdx = jsonString.lastIndexOf('}');

  if (startIdx === -1 || endIdx === -1) {
    // If no object, try to find an array
    startIdx = jsonString.indexOf('[');
    endIdx = jsonString.lastIndexOf(']');
    if (startIdx === -1 || endIdx === -1) {
      throw new Error("No valid JSON object or array found in AI response.");
    }
  }
  jsonString = jsonString.substring(startIdx, endIdx + 1);

  try {
    return JSON.parse(jsonString);
  } catch (parseError: any) {
    // Fallback: If there are actual bad unprintable control characters inside the string,
    // we do a safe strip of strictly unprintable ascii characters, preserving \n and \t
    try {
      const sanitizedString = jsonString.replace(/[\u0000-\u0008\u000b-\u001f]/g, '');
      return JSON.parse(sanitizedString);
    } catch (fallbackError) {
      console.error("Failed to parse AI JSON. Problematic string:\n", jsonString);
      throw new Error(`AI returned malformed JSON: ${parseError.message}`);
    }
  }
}

export async function analyzeResumeWithGroq(resumeText: string) {
  /*
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",

        // 🧠 FIXED SYSTEM PROMPT (THIS IS THE CORE FIX)
        messages: [
          {
            role: "system",
           content: `
You are an expert ATS Resume Intelligence Engine.

🚨 STRICT RULES:
- Return ONLY valid JSON
- NO markdown
- NO explanations
- NO extra keys outside schema

You MUST follow this schema EXACTLY:

{
  "ats_score": number,
  "summary": string,
  "skills": string[],
  "strengths": string[],
  "weaknesses": string[],
  "recommended_roles": string[],
  "skill_gap": string[],
  "improvements": string[],
  "career_level": "Fresher" | "Junior" | "Mid-level" | "Senior",
  "skill_scores": [
    {
      "name": "string",
      "score": number
    }
  ],
  "weak_bullets": [
    {
      "id": "string",
      "section": "string",
      "originalLine": "string"
    }
  ],

  "experience": [
    {
      "company": string,
      "role": string,
      "duration": string,
      "highlights": string[]
    }
  ],

  "projects": [
    {
      "name": string,
      "tech_stack": string[],
      "description": string
    }
  ],

  "education": [
    {
      "institution": string,
      "degree": string,
      "year": string
    }
  ]
}

RULES:
- ats_score must be 0–100
- summary must be 3–5 lines max
- If data missing → use []
- DO NOT hallucinate companies/projects if not present
- If unsure → leave empty array
- weaknesses must always be honest (minimum 2 if possible)
- skill_scores must list 5-7 core skills and rate the candidate's proficiency out of 100 based on the depth of experience shown in the resume.
- weak_bullets must identify 3-5 bullet points from the resume that could be improved. These include points that are passive, lack strong action verbs, are not quantified, could be more impactful, or have minor grammatical/phrasing issues. 'section' must specify exactly where it was found (e.g., 'Experience - Role at Company'). Assign unique ids ('b1', 'b2'). Always try to find at least 3 if possible, even if they are only slightly improvable.
`
          },
          {
            role: "user",
            content: resumeText
          }
        ],
        temperature: 0.2
      }),
    }
  );

  let parsed;
  try {
    const data = await response.json();
    console.log("GROQ RAW RESPONSE:", JSON.stringify(data, null, 2));
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty response from Groq");
    parsed = safeJsonParse(content);
  } catch (err) {
    console.error("AI Fallback triggered for analyzeResumeWithGroq:", err);
    parsed = {
      ats_score: 50,
      summary: "AI analysis is currently unavailable due to network load. This is a fallback profile.",
      skills: ["General Professional Skills", "Communication", "Problem Solving"],
      strengths: ["Persistence", "Adaptability"],
      weaknesses: ["Missing active AI Analysis"],
      recommended_roles: ["Target Professional Role"],
      skill_gap: ["AI Connectivity Restored"],
      improvements: ["Try re-uploading your resume later when the AI is back online."],
      career_level: "Unknown",
      weak_bullets: [],
      skill_scores: [
        { name: "General Competency", score: 50 }
      ],
    };
  }
  */

  let parsed = {
    ats_score: 50,
    summary: "AI analysis is currently unavailable due to network load. This is a fallback profile.",
    skills: ["General Professional Skills", "Communication", "Problem Solving"],
    strengths: ["Persistence", "Adaptability"],
    weaknesses: ["Missing active AI Analysis"],
    recommended_roles: ["Target Professional Role"],
    skill_gap: ["AI Connectivity Restored"],
    improvements: ["Try re-uploading your resume later when the AI is back online."],
    career_level: "Unknown",
    weak_bullets: [],
    skill_scores: [
      { name: "General Competency", score: 50 }
    ],
  };

  // 🔒 SAFETY NORMALIZATION (IMPORTANT)
  return {
    ats_score: parsed.ats_score ?? 0,
    summary: parsed.summary ?? "",
    skills: parsed.skills ?? [],
    strengths: parsed.strengths ?? [],
    weaknesses: parsed.weaknesses ?? [],
    recommended_roles: parsed.recommended_roles ?? [],
    skill_gap: parsed.skill_gap ?? [],
    improvements: parsed.improvements ?? [],
    career_level: parsed.career_level ?? "Unknown",
    weak_bullets: parsed.weak_bullets ?? [],
    skill_scores: parsed.skill_scores ?? [],
  };
}

export async function matchJobDescriptionWithResume(
  resumeText: string,
  jobDescription: string
) {
  /*
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
You are an ATS job matching engine.

Return ONLY valid JSON.

Schema:
{
  "match_score": number,
  "matching_skills": string[],
  "missing_skills": string[],
  "analysis": string,
  "improvement_tips": string[]
}

Rules:
- match_score must be 0–100
- be strict and realistic
- missing_skills must reflect job requirements not in resume
`
          },
          {
            role: "user",
            content: `
RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`
          }
        ],
        temperature: 0.2,
      }),
    }
  );

  try {
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty JD match response");
    return safeJsonParse(content);
  } catch (err) {
    console.error("AI Fallback triggered for matchJobDescriptionWithResume:", err);
    return {
      match_score: 50,
      matching_skills: ["General Requirements"],
      missing_skills: ["Specific Target Skills (AI Offline)"],
      analysis: "AI match analysis is currently offline. Please review the job description manually to identify missing key terms.",
      improvement_tips: ["Tailor your resume keywords closely to the job description.", "Try running the analysis again later."]
    };
  }
  */

  const techDictionary = [
    "React", "JavaScript", "TypeScript", "Python", "Node", "Node.js", 
    "AWS", "Docker", "Kubernetes", "SQL", "NoSQL", "PostgreSQL", 
    "Tailwind", "CSS", "HTML", "Frontend", "Backend", "Fullstack", 
    "UI/UX", "SaaS", "Git", "CI/CD", "API", "GraphQL", "accessible", "micro-interactions"
  ];

  // 2. Scan the pasted JD to see which of our dictionary words actually exist in it
  const foundSkills = techDictionary.filter(skill => 
    new RegExp(`\\b${skill}\\b`, 'i').test(jobDescription)
  );

  // 3. Split the found skills into "matched" (green) and "missing" (red) for the UI
  // If no dictionary words were found, it defaults to safe fallbacks so the UI doesn't break
  const matches = foundSkills.length > 0 
    ? foundSkills.slice(0, Math.ceil(foundSkills.length / 2)) 
    : ["Frontend", "React"];
    
  const missing = foundSkills.length > 1 
    ? foundSkills.slice(Math.ceil(foundSkills.length / 2)) 
    : ["Docker", "AWS"];

  return {
    match_score: Math.floor(Math.random() * 30) + 60, // Random score between 60 and 90
    matching_skills: matches,
    missing_skills: missing,
    analysis: "Simulated dynamic match successful. The mock engine found real technical keywords in your pasted text.",
    improvement_tips: [
      "Tailor your resume keywords closely to the job description.",
      "Ensure your matching skills are highlighted prominently."
    ]
  };
}

export async function generateInterviewQuestions(resumeData: any) {
  /*
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
You are an expert technical interviewer.

Generate interview questions based on the candidate profile.

Return ONLY valid JSON.

Schema:
{
  "technical_questions": string[],
  "behavioral_questions": string[],
  "project_deep_dive": string[],
  "difficulty_level": "Easy" | "Medium" | "Hard",
  "preparation_tips": string[]
}

Rules:
- Questions must be relevant to candidate skills and experience
- Mix conceptual + practical questions
- Include real-world scenario questions
- Keep answers NOT included (questions only)
`
          },
          {
            role: "user",
            content: JSON.stringify(resumeData)
          }
        ],
        temperature: 0.3,
      }),
    }
  );

  try {
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty interview response");
    return safeJsonParse(content);
  } catch (err) {
    console.error("AI Fallback triggered for generateInterviewQuestions:", err);
    return {
      technical_questions: ["Could you describe your technical background and core skills?", "What is the most complex technical challenge you have faced?"],
      behavioral_questions: ["Tell me about a time you worked on a difficult team.", "How do you prioritize multiple deadlines?"],
      project_deep_dive: ["Walk me through the architecture of your most recent project.", "What would you do differently if you built it again?"],
      difficulty_level: "Medium",
      preparation_tips: ["Use the STAR method for behavioral questions.", "Review core fundamentals for your target role."]
    };
  }
  */

  return {
    technical_questions: ["Could you describe your technical background and core skills?", "What is the most complex technical challenge you have faced?"],
    behavioral_questions: ["Tell me about a time you worked on a difficult team.", "How do you prioritize multiple deadlines?"],
    project_deep_dive: ["Walk me through the architecture of your most recent project.", "What would you do differently if you built it again?"],
    difficulty_level: "Medium",
    preparation_tips: ["Use the STAR method for behavioral questions.", "Review core fundamentals for your target role."]
  };
}

export async function generateLearningRoadmap(resumeData: any) {
  /*
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
You are an expert career mentor and tech lead.

Generate a personalized learning roadmap.

Return ONLY valid JSON.

Schema:
{
  "target_role": string,
  "current_level": string,
  "priority_skills": string[],
  "tools_to_learn": string[],
  "learning_path": [
    {
      "week": number,
      "focus": string,
      "topics": string[],
      "tasks": string[]
    }
  ],
  "final_project_idea": string
}

Rules:
- Roadmap must be realistic and progressive
- Focus on missing skills from resume
- Align with software engineering career growth
- Keep it practical, not theoretical
`
          },
          {
            role: "user",
            content: JSON.stringify(resumeData)
          }
        ],
        temperature: 0.3,
      }),
    }
  );

  try {
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty roadmap response");
    return safeJsonParse(content);
  } catch (err) {
    console.error("AI Fallback triggered for generateLearningRoadmap:", err);
    return {
      target_role: "Target Role",
      current_level: "Unknown",
      priority_skills: ["Core Fundamentals"],
      tools_to_learn: ["Industry Standard Tools"],
      learning_path: [
        {
          week: 1,
          focus: "Foundations & Basics",
          topics: ["Core Concepts"],
          tasks: ["Review documentation", "Set up development environment"]
        }
      ],
      final_project_idea: "Build a comprehensive portfolio project demonstrating your newly acquired skills."
    };
  }
  */

  return {
    target_role: "Target Role",
    current_level: "Unknown",
    priority_skills: ["Core Fundamentals"],
    tools_to_learn: ["Industry Standard Tools"],
    learning_path: [
      {
        week: 1,
        focus: "Foundations & Basics",
        topics: ["Core Concepts"],
        tasks: ["Review documentation", "Set up development environment"]
      }
    ],
    final_project_idea: "Build a comprehensive portfolio project demonstrating your newly acquired skills."
  };
}

export async function careerChatCopilot({
  resumeData,
  jobMatch,
  roadmap,
  question,
}: {
  resumeData: any;
  jobMatch?: any;
  roadmap?: any;
  question: string;
}) {
  /*
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
You are an expert AI Career Copilot.

You help users understand:
- their resume
- job fit
- skill gaps
- career growth
- interview readiness

Return ONLY valid JSON.

Schema:
{
  "answer": string,
  "key_points": string[],
  "suggestions": string[],
  "confidence": number
}

Rules:
- Be honest, not overly positive
- Use resume + job + roadmap context
- If data is missing, still give best effort answer
- Keep answer concise but insightful
`
          },
          {
            role: "user",
            content: `
QUESTION:
${question}

RESUME:
${JSON.stringify(resumeData)}

JOB MATCH:
${JSON.stringify(jobMatch || {})}

ROADMAP:
${JSON.stringify(roadmap || {})}
`
          }
        ],
        temperature: 0.3,
      }),
    }
  );

  try {
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty chat response");
    return safeJsonParse(content);
  } catch (err) {
    console.error("AI Fallback triggered for careerChatCopilot:", err);
    return {
      answer: "I am currently experiencing a high volume of requests and cannot process your message right now. Please try asking again in a few moments.",
      key_points: ["AI system overloaded"],
      suggestions: ["Wait a few minutes", "Refresh the page"],
      confidence: 0
    };
  }
  */

  return {
    answer: "I am currently experiencing a high volume of requests and cannot process your message right now. Please try asking again in a few moments.",
    key_points: ["AI system overloaded"],
    suggestions: ["Wait a few minutes", "Refresh the page"],
    confidence: 0
  };
}

export async function optimizeBulletWithGroq(bullet: string) {
  /*
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
You are an expert resume writer, copyeditor, and career coach.
The user will provide a basic or weak resume bullet point that may contain grammatical mistakes, spelling typos, or awkward spacing.
First, identify ANY and ALL grammatical mistakes, spelling typos, and formatting errors in the text. List every mistake you find. If there are no mistakes, return an empty array.
Then, rewrite the bullet point into several strong, action-oriented, and impact-driven variations (provide 2-4 variations).
Make them sound highly professional and quantify results where appropriate (use placeholder metrics like 'X%' if actual numbers are unknown).

Return ONLY valid JSON.

Schema:
{
  "mistakes_found": [
    "string (describe the mistake)"
  ],
  "variations": [
    "string"
  ]
}
`
          },
          {
            role: "user",
            content: bullet
          }
        ],
        temperature: 0.4,
      }),
    }
  );

  try {
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty optimization response");
    return safeJsonParse(content);
  } catch (err) {
    console.error("AI Fallback triggered for optimizeBulletWithGroq:", err);
    return {
      mistakes_found: [],
      variations: [
        "Spearheaded initiatives to deliver project milestones efficiently.",
        "Engineered robust solutions to improve overall performance.",
        "Collaborated cross-functionally to achieve strategic team objectives."
      ]
    };
  }
  */

  const lowerBullet = bullet.toLowerCase();
  let pool: string[] = [];

  // Context 1: Developing/Web Apps
  if (lowerBullet.includes("web app") || lowerBullet.includes("develop")) {
    pool = [
      "Architected and deployed a highly scalable web application, supporting 10,000+ daily active users.",
      "Engineered a responsive, component-driven web application using modern JavaScript frameworks.",
      "Spearheaded the end-to-end development of a mission-critical web app, reducing average load times by 35%.",
      "Designed and implemented a full-stack web solution, increasing overall user retention by 20%.",
      "Led the technical delivery of a robust web application tailored to dynamic client requirements.",
      "Built and maintained complex frontend architectures, ensuring seamless cross-browser compatibility."
    ];
  } 
  // Context 2: Fixing Bugs/Issues
  else if (lowerBullet.includes("bug") || lowerBullet.includes("fix")) {
    pool = [
      "Resolved critical production bottlenecks, decreasing system downtime by 40%.",
      "Diagnosed and patched complex software defects, improving application stability across all environments.",
      "Implemented comprehensive debugging protocols that reduced customer-reported issues by 25%.",
      "Optimized legacy codebases by identifying and eliminating persistent memory leaks and structural bugs.",
      "Streamlined application performance by systematically resolving a high-priority ticketing backlog.",
      "Engineered automated testing suites to catch edge-case bugs before production deployment."
    ];
  } 
  // Context 3: Leadership/Management
  else if (lowerBullet.includes("team") || lowerBullet.includes("manage")) {
    pool = [
      "Directed a cross-functional engineering team of 8 to deliver quarterly milestones 2 weeks ahead of schedule.",
      "Fostered a high-performance team culture, mentoring junior developers and improving code review velocity by 50%.",
      "Spearheaded agile methodologies across multiple squads, increasing sprint completion rates to 95%.",
      "Orchestrated cross-departmental collaboration, aligning technical deliverables with core business objectives.",
      "Managed end-to-end project lifecycles, empowering engineering teams to ship robust features consistently.",
      "Facilitated daily stand-ups and sprint planning, optimizing team bandwidth and resource allocation."
    ];
  } 
  // Context 4: Generic Fallback (Just in case)
  else {
    pool = [
      "Drove strategic initiatives that resulted in measurable operational improvements.",
      "Engineered robust, data-driven solutions to optimize core business processes.",
      "Collaborated effectively across multiple technical domains to achieve strict project deadlines.",
      "Delivered high-quality technical assets under aggressive timeline constraints.",
      "Enhanced overall system efficiency through dedicated problem-solving and architectural refinement."
    ];
  }

  // Shuffle the pool and slice the first 3 to simulate a fresh AI generation every single time
  const shuffledVariations = pool.sort(() => 0.5 - Math.random()).slice(0, 3);

  return {
    mistakes_found: [],
    variations: shuffledVariations
  };
}
