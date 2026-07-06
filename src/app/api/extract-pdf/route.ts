import { NextRequest, NextResponse } from "next/server";
import { extractPdfText } from "@/services/pdf/pdfExtractor";

export async function POST(
  request: NextRequest
) {
  try {
    const formData = await request.formData();

    const file = formData.get("resume") as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          text: "",
          error: "Resume file is required",
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(
      await file.arrayBuffer()
    );

    const extractedText =
      await extractPdfText(buffer);

    return NextResponse.json({
      success: true,
      text: extractedText,
    });
  } catch (error) {
    console.error(
      "PDF extraction failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        text: "",
        error: "Failed to extract PDF text",
      },
      { status: 500 }
    );
  }
}