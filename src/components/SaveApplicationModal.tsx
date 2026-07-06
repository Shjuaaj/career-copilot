"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (company: string, title: string) => void;
}

export default function SaveApplicationModal({ isOpen, onClose, onSave }: SaveModalProps) {
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        />
        <motion.div 
          initial={{ scale: 0.98, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.98, opacity: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 26 }}
          className="relative bg-[#121212] rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-[#222222] text-[#e5e0d8] font-sans"
        >
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#e5e0d8] mb-5">Save Application Log</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-[#707070] uppercase tracking-widest mb-1.5">Company Entity Name</label>
              <input 
                className="w-full bg-[#090909] border border-[#222222] focus:border-[#c5b39a]/40 text-[#e5e0d8] text-xs font-mono rounded-xl px-4 py-3 outline-none transition-colors"
                placeholder="e.g. Google"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold text-[#707070] uppercase tracking-widest mb-1.5">Target Job Title</label>
              <input 
                className="w-full bg-[#090909] border border-[#222222] focus:border-[#c5b39a]/40 text-[#e5e0d8] text-xs font-mono rounded-xl px-4 py-3 outline-none transition-colors"
                placeholder="e.g. Frontend Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-6 text-[11px] font-bold uppercase tracking-wider">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 text-neutral-400 rounded-lg border border-transparent hover:border-[#222222] transition-all cursor-pointer">Cancel</button>
            <button 
              onClick={() => { onSave(company, title); onClose(); }} 
              className="flex-1 px-4 py-2.5 text-[#c5b39a] bg-[#222222] rounded-xl border border-[#333333] hover:bg-[#2a2a2a] transition-all cursor-pointer shadow-md"
            >
              Confirm Save
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}