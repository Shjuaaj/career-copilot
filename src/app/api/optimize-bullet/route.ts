import { NextResponse } from "next/server";
import { optimizeBulletWithGroq } from "@/services/ai/groq";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bullet } = body;

    if (!bullet) {
      return NextResponse.json(
        { error: "Bullet point text is required." },
        { status: 400 }
      );
    }

    // Call the Groq AI service to generate real variations
    const result = await optimizeBulletWithGroq(bullet);

    return NextResponse.json({ 
      variations: result.variations,
      mistakes_found: result.mistakes_found
    }, { status: 200 });
  } catch (error) {
    console.error("Bullet Optimization Error:", error);
    return NextResponse.json({ error: "Failed to process bullet optimization" }, { status: 500 });
  }
}