import { NextResponse } from "next/server";
import { matchJobDescriptionWithResume } from "@/services/ai/groq";

export async function POST(req: Request) {
  try {
    // Parse JSON instead of FormData
    const body = await req.json();
    const { resumeData, jd } = body;

    if (!resumeData || !jd) {
      return NextResponse.json(
        { success: false, error: "Missing resume data or job description" },
        { status: 400 }
      );
    }

    // Convert the parsed JSON back into a readable string for the AI matching engine
    const resumeText = JSON.stringify(resumeData);
    
    // Simulate API delay for realistic UX during testing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const result = await matchJobDescriptionWithResume(resumeText, jd);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}