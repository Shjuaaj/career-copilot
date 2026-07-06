"use main-thread";
"use client";

import React from "react";

export function DetailCardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse w-full font-sans">
      <div className="h-4 bg-slate-200 rounded-md w-1/3 mb-6" />
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4 items-start">
            <div className="h-5 w-6 bg-slate-200 rounded-md shrink-0" />
            <div className="space-y-2 w-full">
              <div className="h-4 bg-slate-200 rounded-md w-full" />
              <div className="h-3 bg-slate-100 rounded-md w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TimelineSkeleton() {
  return (
    <div className="space-y-6 animate-pulse w-full font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-20 bg-slate-100 border border-slate-200/80 rounded-xl" />
        <div className="h-20 bg-slate-100 border border-slate-200/80 rounded-xl md:col-span-2" />
      </div>
      
      <div className="h-16 bg-slate-100 border border-slate-200/80 rounded-xl" />

      <div className="relative border-l-2 border-slate-200 pl-6 ml-4 space-y-8 my-8">
        {[1, 2].map((i) => (
          <div key={i} className="relative">
            <span className="absolute -left-[31px] top-1 bg-white border-2 border-slate-200 rounded-full h-4 w-4" />
            <div className="border border-slate-200/80 rounded-xl p-5 space-y-3 bg-slate-50/50">
              <div className="h-4 bg-slate-200 rounded-md w-1/4" />
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 rounded-md w-1/3" />
                <div className="h-3 bg-slate-100 rounded-md w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}