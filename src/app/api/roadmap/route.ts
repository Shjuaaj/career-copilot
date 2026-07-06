import { NextResponse } from "next/server";

// Import your pipeline tools here if applicable (e.g., groq or alternative sdk services)
import { safeJsonParse } from "@/services/ai/groq"; // Import the safe JSON parser

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    // Extract shared structured variables from the upgraded UI panel context wrapper
    const { resumeData, jobDescription, matchAnalysis } = payload;

    // Graceful backward compatibility fallback mapping layer
    const activeResume = resumeData || payload;

    if (!activeResume) {
      return NextResponse.json({ error: "Missing core background profile data asset mappings." }, { status: 400 });
    }

    // Dynamic prompt engineering layer injection based on active context state tracking
    let systemPrompt = `You are a strategic career advisor and engineering coach. 
Analyze the candidate profile metadata structural metrics:
Resume Analysis Data: ${JSON.stringify(activeResume)}

Design a personalized upskilling blueprint that matches the requested output schema exactly.`;

    if (jobDescription) {
      systemPrompt += `\n\nCRITICAL CONTEXT SPECIFICATIONS DETECTED: 
The candidate is aiming for a specific career transition.
Target Role Description: ${jobDescription}
Calculated Matrix Gaps: ${JSON.stringify(matchAnalysis || {})}

Ensure your milestone tracking curriculum focuses heavily on building proficiency in their missing skills and required tooling structures. Shape the curriculum sequentially so they directly resolve these deficiencies.`;
    }

    // UPDATED PROMPT: Instructs the AI to generate tasks with IDs and time estimates (max 1 day)
    systemPrompt += `\n\nReturn EXACTLY a pure JSON structure conforming to this explicit layout format:
{
  "data": {
    "target_role": "string position name",
    "priority_skills": ["string", "string", ...],
    "tools_to_learn": ["string", "string", ...],
    "learning_path": [
      {
        "phase": "Task Block 1",
        "focus": "string tracking theme",
        "topics": ["string", "string"],
        "tasks": [
          { "id": "unique_string_id", "text": "string specific task", "time": "string estimated time (e.g., '2 Hours', max 1 day)" }
        ]
      }
    ],
    "final_project_idea": {
      "description": "string description of validation capstone",
      "checklist": [
         { "id": "unique_project_step_id", "text": "string project step", "time": "string estimated time" }
      ]
    }
  }
}`;

    /*
    // Call Groq API to generate the real gap-driven roadmap
    const aiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "system", content: systemPrompt }],
        temperature: 0.3,
      }),
    });

    let parsedResponse;
    try {
      const completion = await aiResponse.json();
      const content = completion.choices?.[0]?.message?.content;
      if (!content) throw new Error("Empty roadmap response from AI");
      parsedResponse = safeJsonParse(content);
    } catch (err) {
      console.error("AI Fallback triggered in roadmap route:", err);
      parsedResponse = {
        data: {
          target_role: "Target Role",
          priority_skills: ["Core Fundamentals", "System Architecture"],
          tools_to_learn: ["Industry Standard Tools"],
          learning_path: [
            {
              phase: "Task Block 1",
              focus: "Foundations & Strategy",
              topics: ["Reviewing basics", "Tooling setup"],
              tasks: [
                { id: "fallback_t1", text: "Set up development environment", time: "1 Hour" },
                { id: "fallback_t2", text: "Review core concepts", time: "3 Hours" }
              ]
            }
          ],
          final_project_idea: {
            description: "Build a comprehensive portfolio project demonstrating your newly acquired skills.",
            checklist: [
              { id: "fallback_p1", text: "Initialize project and structure folders", time: "1 Hour" },
              { id: "fallback_p2", text: "Build core features", time: "8 Hours" }
            ]
          }
        }
      };
    }
    */

    // --- EXECUTE LOCAL LLM COMPILATION CALL HERE ---
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API Delay

    // UPDATED MOCK DATA: Structured for interactive checklists with time estimates
    const mockData = {
      data: {
        target_role: jobDescription ? "Target Role Specified Benchmark" : "Standard Advanced Stack Generalization",
        priority_skills: jobDescription && matchAnalysis?.missing_skills
          ? matchAnalysis.missing_skills.slice(0, 3)
          : ["System Architecture", "Advanced Component Context Optimization", "State Hydration Sync"],
        tools_to_learn: jobDescription 
          ? ["Zustand State Engines", "Vector Embeddings Tools", "Server Actions Middleware"]
          : ["TypeScript Strict Typing Modules", "Tailwind Theme Layers"],
        
        learning_path: [
          {
            "phase": "Task Block 1",
            "focus": jobDescription ? "Addressing Immediate Technical Gaps" : "Core Framework Mechanics Optimization",
            "topics": jobDescription ? ["State Partitioning", "Asynchronous Edge Streaming"] : ["Advanced Lifecycle Tuning", "Hydration Error Resolving"],
            "tasks": [
              { "id": "t1", "text": "Configure a sandbox workspace testing engine implementation.", "time": "2 Hours" },
              { "id": "t2", "text": "Build an inline layout component consuming complex data matrices safely.", "time": "4 Hours" },
              { "id": "t3", "text": "Review architecture documentation for newly introduced tooling.", "time": "1 Hour" }
            ]
          },
          {
            "phase": "Task Block 2",
            "focus": "System Deployment and Integration Testing",
            "topics": ["Type-Safe Form Parameters Processing", "Performance Auditing Tools"],
            "tasks": [
              { "id": "t4", "text": "Run custom latency benchmarks across local network layers.", "time": "3 Hours" },
              { "id": "t5", "text": "Deploy a validated validation pipeline snapshot environment.", "time": "2 Hours" }
            ]
          }
        ],

        final_project_idea: {
          description: jobDescription 
            ? "Build a mock SaaS dashboard incorporating the role's requested toolkit and integrating live streaming data layers to showcase gap remediation." 
            : "Architect an end-to-end modular document parsing platform using deep async processing queues.",
          checklist: [
            { "id": "p1", "text": "Initialize Monorepo architecture and configure strict routing.", "time": "1 Hour" },
            { "id": "p2", "text": "Implement backend services and integrate the required API layers.", "time": "6 Hours" },
            { "id": "p3", "text": "Deploy to staging environment and run final audits.", "time": "2 Hours" }
          ]
        }
      }
    };

    return NextResponse.json(mockData);

  } catch (error: any) {
    console.error("Roadmap API operational validation processing fault:", error);
    return NextResponse.json({ error: "Internal runtime server pipeline fault execution error." }, { status: 500 });
  }
}