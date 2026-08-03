import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations/i18n";
import { Bot, Mic, MicOff, Send, X, Sparkles, Volume2, VolumeX, User, Loader2 } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export const AiAssistantModal: React.FC = () => {
  const { language, isAiModalOpen, setIsAiModalOpen, pets } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "MSG-1",
      sender: "ai",
      text:
        language === "bn"
          ? "হ্যালো! আমি FurCare AI ডাক্তার ও সহায়ক। আপনার পোষা প্রাণীর স্বাস্থ্য, খাবার, আচরণ বা যেকোনো চিকিৎসা প্রশ্নের উত্তর দিতে আমি প্রস্তুত। কীভাবে সাহায্য করতে পারি?"
          : "Hello! I am FurCare AI Doctor & Pet Companion. How can I assist with your pet's healthcare, nutrition, or first aid today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isAiModalOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");

    const userMsg: ChatMessage = {
      id: "MSG-" + Date.now(),
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const activePet = pets[0];
      const res = await fetch("/api/gemini/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userText,
          language,
          petContext: activePet
            ? { name: activePet.name, species: activePet.species, breed: activePet.breed, age: activePet.ageYears }
            : null,
        }),
      });

      const data = await res.json();
      const replyText = data.reply || "I am glad to assist you with your pet's health!";

      const aiMsg: ChatMessage = {
        id: "MSG-" + (Date.now() + 1),
        sender: "ai",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Voice Audio Synthesis Simulation
      if (isVoiceActive && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(replyText);
        utterance.lang = language === "bn" ? "bn-BD" : "en-US";
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error("AI assistant error:", err);
      const fallbackMsg: ChatMessage = {
        id: "MSG-ERR",
        sender: "ai",
        text:
          language === "bn"
            ? "দুঃখিত, সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে আপনার পোষা প্রাণীকে শান্ত রাখুন এবং প্রয়োজনে জরুরি পশু ডাক্তারের সাথে যোগাযোগ করুন।"
            : "Sorry, I encountered a temporary connection issue. Please ensure your pet is comfortable and contact a vet for urgent concerns.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceMode = () => {
    if (isVoiceActive) {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      setIsVoiceActive(false);
      setIsSpeaking(false);
    } else {
      setIsVoiceActive(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[600px] max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Bot className="w-6 h-6 text-emerald-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-wide font-display">
                  {getTranslation(language, "aiAssistantTitle")}
                </h3>
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-400 text-slate-950 rounded-md">
                  Gemini AI
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/80 font-medium">
                {getTranslation(language, "aiAssistantSubtitle")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Voice Mode Toggle */}
            <button
              onClick={toggleVoiceMode}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                isVoiceActive
                  ? "bg-amber-400 text-slate-950 border-amber-300 shadow-sm"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              }`}
              title="Toggle Voice Mode"
            >
              {isVoiceActive ? (
                <>
                  <Volume2 className="w-4 h-4 animate-bounce" />
                  <span className="text-[10px] hidden sm:inline">Voice On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="text-[10px] hidden sm:inline">Voice Off</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsAiModalOpen(false)}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === "user"
                    ? "bg-slate-900 text-white"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-2xs ${
                  msg.sender === "user"
                    ? "bg-slate-900 text-white rounded-tr-none"
                    : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <p
                  className={`text-[9px] mt-1.5 text-right font-mono ${
                    msg.sender === "user" ? "text-slate-400" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200/80 w-max animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>FurCare AI is analyzing your pet request...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Voice Indicator Bar */}
        {isSpeaking && (
          <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-bold flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span>FurCare AI Doctor is speaking...</span>
            </div>
            <span className="text-[10px] uppercase font-extrabold tracking-widest animate-ping">● LIVE</span>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={getTranslation(language, "aiTextMessage")}
              className="flex-1 px-4 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
