"use client";

import React, { useState } from "react";
import { Send, Bot, User as UserIcon, Loader2, Sparkles } from "lucide-react";

interface ChatEntry {
  role: "user" | "assistant";
  content: string;
  model?: string;
}

const STARTER_PROMPTS = [
  "What practical project should I build next to close my missing skills?",
  "How do I turn my AI-mapped skills into assessor-validated proof?",
  "Prepare me with 5 interview questions for my target role.",
  "Which apprenticeships or remote internships fit my current skills?",
];

export function CareerChatbot() {
  const [messages, setMessages] = useState<ChatEntry[]>([
    {
      role: "assistant",
      content:
        "Hello! I am your SkillSync Career Assistant. Ask me about closing skill gaps, choosing practical portfolio projects, preparing for interviews, or finding relevant pathways.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const nextHistory: ChatEntry[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextHistory);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: nextHistory.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.ok
            ? data.reply
            : data.error || "Unable to reach the Career Assistant right now.",
          model: data.aiPowered ? `Groq (${data.model})` : "Fallback",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error while contacting Career Assistant." },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-[560px]">
      <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Bot size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">AI Career Assistant</h2>
            <p className="text-[11px] text-slate-500">Fast career guidance grounded in your SkillSync profile</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
          <Sparkles size={11} className="text-blue-600" /> Groq Engine
        </span>
      </div>

      {/* Starter prompts */}
      <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50 flex flex-wrap gap-1.5">
        {STARTER_PROMPTS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => sendMessage(q)}
            disabled={sending}
            className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={15} />
              </div>
            )}
            <div
              className={`max-w-[82%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                m.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-800 border border-slate-200"
              }`}
            >
              {m.content}
              {m.model && (
                <div className="text-[10px] text-slate-400 mt-1.5">Source: {m.model}</div>
              )}
            </div>
            {m.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                <UserIcon size={14} />
              </div>
            )}
          </div>
        ))}
        {sending && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Loader2 size={14} className="animate-spin" /> Thinking...
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="p-3 border-t border-slate-200 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about skill gaps, projects, interviews, or career steps..."
          className="flex-1 px-3.5 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold inline-flex items-center gap-1.5 disabled:opacity-50"
        >
          <Send size={15} /> Send
        </button>
      </form>
    </div>
  );
}
