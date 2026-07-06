import React from "react";
import type { Metadata } from "next";
import AuthProvider from "@/components/AuthProvider";
import "@/app/globals.css"; // Or your standard Tailwind stylesheet path
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "ResumeAI Enterprise Workspace",
  description: "Advanced multi-user AI engineering application platform",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      <body>
       <Toaster position="bottom-right" richColors />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
