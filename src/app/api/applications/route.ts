import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized endpoint interaction blocked." }, { status: 401 });
  }

  try {
    const historicalLogs = await prisma.jobApplication.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(historicalLogs);
  } catch (err: any) {
    return NextResponse.json({ error: `Datastore extraction error exception: ${err.message}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized transaction pipeline blocked." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      companyName,
      jobTitle,
      jobDescription,
      matchScore,
      resumeAnalysisResult,
      matchAnalysis,
      interviewPrep,
      roadmap,
       completedTasks,
  simulatorAnswers,
    } = body;

    const newApplication = await prisma.jobApplication.create({
      data: {
        userId: (session.user as any).id,
        companyName,
        jobTitle,
        jobDescription,
        matchScore: parseInt(matchScore) || 0,
        resumeAnalysisResult: resumeAnalysisResult ?? {},
        matchAnalysis: matchAnalysis ?? {},
        interviewPrep: interviewPrep ?? {},
        roadmap: roadmap ?? {},
        completedTasks: completedTasks ?? [],
  simulatorAnswers: simulatorAnswers ?? {},
      } as any
    });

    return NextResponse.json({ success: true, data: newApplication });
  } catch (err: any) {
  console.error("SAVE ERROR FULL:", err);
  return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
}
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      id,
      companyName,
      jobTitle,
      jobDescription,
      matchScore,
      resumeAnalysisResult,
      matchAnalysis,
      interviewPrep,
      roadmap,
      completedTasks,
      simulatorAnswers,
    } = body;

    const updated = await prisma.jobApplication.update({
      where: { id, userId: (session.user as any).id },
      data: {
        companyName,
        jobTitle,
        jobDescription,
        matchScore: parseInt(matchScore) || 0,
        resumeAnalysisResult: resumeAnalysisResult ?? {},
        matchAnalysis: matchAnalysis ?? {},
        interviewPrep: interviewPrep ?? {},
        roadmap: roadmap ?? {},
        completedTasks: completedTasks ?? [],
        simulatorAnswers: simulatorAnswers ?? {},
      } as any,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    console.error("UPDATE ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized endpoint interaction blocked." }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing application identifier parameters." }, { status: 400 });
    }
    
    // Wipe row entry matched to unique ID and owner session
    await prisma.jobApplication.delete({
      where: { id, userId: (session.user as any).id },
    });
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: `Datastore deletion error exception: ${err.message}` }, { status: 500 });
  }
}