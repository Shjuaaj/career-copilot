import { NextResponse } from "next/server";

import { safeJsonParse } from "@/services/ai/groq"; // Import the safe JSON parser

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { action, question, answer, resumeData, jobDescription, matchAnalysis } = payload;
    
    let systemPrompt = "";
    let model = "llama-3.1-8b-instant"; // Default model
    let temperature = 0.3; // Default temperature

    if (action === "evaluate") {
      // Prompt for evaluating an answer
      systemPrompt = `You are an expert technical interviewer and career coach.
You will be provided with an interview question and a candidate's response.
Your task is to evaluate the response based on its technical accuracy, completeness, clarity, and relevance to the question.
Provide constructive feedback, highlighting strengths and areas for improvement.
Suggest how the candidate could have improved their answer, especially by incorporating the STAR method (Situation, Task, Action, Result) or quantifying impact where applicable.

Return ONLY valid JSON.
Schema:
{
  "feedback": "string"
}
`;
      // User message for evaluation
      systemPrompt += `\n\nQuestion: ${question}\nCandidate's Answer: ${answer}`;
      temperature = 0.5; // Slightly higher temperature for more nuanced feedback
    } else {
      // Original prompt for generating questions
      // Fallback support logic in case data was sent via the legacy simple format
      const activeResume = resumeData || payload;

      if (!activeResume) {
        return NextResponse.json({ error: "Missing baseline data payload mapping context." }, { status: 400 });
      }

      // Dynamic prompt injection engineering depending on target context presence
      systemPrompt = `You are an elite corporate interviewer. Analyze the candidate resume profile data schema:
Resume Data: ${JSON.stringify(activeResume)}

Generate an interview preparation kit matching the layout requirement spec exactly.`;

      if (jobDescription) {
        systemPrompt += `\n\nCRITICAL CONTEXT MODE ACTIVE: The candidate is interviewing for a specific role. 
Target Job Description: ${jobDescription}
${matchAnalysis ? `Calculated Gap Vector Analysis: ${JSON.stringify(matchAnalysis)}` : ""}

Tailor your questions to test the exact technical gaps, required tooling proficiencies, and alignment traits specified above. Focus your hard architectural and technical questions primarily around their missing skills to prepare them effectively.`;
      }

      systemPrompt += `\n\nReturn EXACTLY a JSON structure matching this shape:
{
  "data": {
    "technical_questions": ["string", "string", ...],
    "behavioral_questions": ["string", "string", ...],
    "project_deep_dive": ["string", "string", ...],
    "difficulty_level": "string description",
    "preparation_tips": ["string", "string", ...]
  }
}`;
      temperature = 0.3; // Low temperature for focused, professional questions
    }

    /*
    const aiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "system", content: systemPrompt }],
        temperature: temperature,
      }),
    });

    let parsedResponse;
    try {
      const completion = await aiResponse.json();
      const content = completion.choices?.[0]?.message?.content;
      if (!content) throw new Error("Empty interview response from AI");
      parsedResponse = safeJsonParse(content);
    } catch (err) {
      console.error("AI Fallback triggered in interview route:", err);
      if (action === "evaluate") {
        parsedResponse = {
          feedback: "AI Evaluation is currently offline. As general advice: Ensure your response uses the STAR method (Situation, Task, Action, Result) and clearly quantifies your impact."
        };
      } else {
        parsedResponse = {
          technical_questions: ["Could you describe your technical background and core skills?", "What is the most complex technical challenge you have faced?"],
          behavioral_questions: ["Tell me about a time you worked on a difficult team.", "How do you prioritize multiple deadlines?"],
          project_deep_dive: ["Walk me through the architecture of your most recent project.", "What would you do differently if you built it again?"],
          difficulty_level: "Medium",
          preparation_tips: ["Use the STAR method for behavioral questions.", "Review core fundamentals for your target role."]
        };
      }
    }
    */

    // Simulate API Delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    let parsedResponse;
    if (action === "evaluate") {
      parsedResponse = {
        feedback: "📋 AI FEEDBACK: Excellent technical positioning. Your contextual grasp is strong. To optimize this response for top tiers, ensure you anchor performance metrics using the STAR framework (Situation, Task, Action, Result) to explicitly quantify your personal delivery impact."
      };
    } else {
      parsedResponse = {
        technical_questions: jobDescription 
          ? ["Explain how you would bridge your highlighted skill gap relative to the target role specifications.", "Walk me through an optimized production workflow deployment using the tools requested in the JD."]
          : ["Walk me through your preferred client-side component lifecycle strategy.", "How do you manage complex volatile memory states inside distributed data visualizations?"],
        behavioral_questions: ["Describe a time you discovered critical structural performance bottlenecks near a delivery milestone.", "How do you navigate team environments where documentation frameworks are entirely unconfigured?"],
        project_deep_dive: ["In your primary portfolio entry, what were the strict memory consumption implications of your data architecture configurations?"],
        difficulty_level: jobDescription ? "Target Role Specific Advanced Level" : "Standard Core Track Evaluation",
        preparation_tips: ["Anchor your system overview architectural metrics using explicit percentage points.", "Review technical structures mapping across your target position specs prior to screening rounds."]
      };
    }

    return NextResponse.json(
      action === "evaluate" ? parsedResponse : { data: parsedResponse }
    );

  } catch (error: any) {
    console.error("Interview API internal operational malfunction error:", error);
    return NextResponse.json({ error: "Internal runtime server pipeline fault execution error." }, { status: 500 });
  }
}