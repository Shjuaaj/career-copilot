import PDFParser from "pdf2json";

function safeDecode(text: string): string {
  try {
    return decodeURIComponent(text);
  } catch {
    return text;
  }
}

export async function extractPdfText(
  buffer: Buffer
): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errorData) => {
      reject(errorData);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      try {
        let extractedText = "";

        for (const page of pdfData.Pages) {
          for (const text of page.Texts) {
            for (const run of text.R) {
              extractedText += safeDecode(run.T) + " ";
            }
          }
          extractedText += "\n";
        }

        resolve(extractedText);
      } catch (error) {
        reject(error);
      }
    });

    pdfParser.parseBuffer(buffer);
  });
}