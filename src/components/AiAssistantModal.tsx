import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations/i18n";
import {
  Bot,
  Send,
  X,
  Volume2,
  VolumeX,
  User,
  Loader2,
  AlertTriangle,
  Trash2,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

interface PetContext {
  name?: string;
  species?: string;
  breed?: string;
  age?: number;
  ageYears?: number;
  gender?: string;
  weight?: number;
}

const createMessageId = () =>
  `MSG-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const getTime = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const getWelcomeMessage = (language: string): string => {
  if (language === "bn") {
    return `আসসালামু আলাইকুম! 🐾

আমি FurCare AI Doctor। আপনার পোষা প্রাণীর স্বাস্থ্য, খাবার, আচরণ, সাধারণ সমস্যা এবং প্রাথমিক যত্ন সম্পর্কে আপনাকে গাইড করতে পারি।

আপনার পোষা প্রাণীর কী সমস্যা হচ্ছে তা বিস্তারিতভাবে বলুন। যেমন:
• কখন থেকে সমস্যা হচ্ছে
• কী কী লক্ষণ দেখা যাচ্ছে
• খাবার ও পানি খাচ্ছে কি না
• বমি/ডায়রিয়া আছে কি না
• আচরণে কোনো পরিবর্তন হয়েছে কি না

⚠️ গুরুতর বা জরুরি অবস্থায় অবশ্যই একজন qualified veterinarian-এর সাহায্য নিন।

কীভাবে সাহায্য করতে পারি?`;
  }

  return `Hello! 🐾

I am FurCare AI Doctor. I can guide you about your pet's health, nutrition, behavior, common problems, and basic first aid.

Tell me what is happening with your pet. Helpful details include:
• When the problem started
• What symptoms you noticed
• Whether your pet is eating and drinking
• Any vomiting or diarrhea
• Any changes in behavior

⚠️ For serious or emergency situations, please contact a qualified veterinarian.

How can I help you today?`;
};

const getErrorMessage = (language: string): string => {
  if (language === "bn") {
    return "দুঃখিত, এই মুহূর্তে AI Doctor-এর সাথে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন। যদি আপনার পোষা প্রাণীর অবস্থা গুরুতর হয়, দ্রুত একজন পশু চিকিৎসকের সাথে যোগাযোগ করুন।";
  }

  return "Sorry, I could not connect to the AI Doctor right now. Please try again in a moment. If your pet's condition is serious, contact a veterinarian promptly.";
};

export const AiAssistantModal: React.FC = () => {
  const {
    language,
    isAiModalOpen,
    setIsAiModalOpen,
    pets,
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "MSG-WELCOME",
      sender: "ai",
      text: getWelcomeMessage(language),
      timestamp: getTime(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activePet = pets?.[0] as PetContext | undefined;

  /*
   * Keep the latest language inside the welcome message.
   * Existing conversation is preserved when language changes.
   */
  useEffect(() => {
    if (!isAiModalOpen) return;

    inputRef.current?.focus();
  }, [isAiModalOpen]);

  /*
   * Automatically scroll to the newest message.
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  /*
   * Stop speech if modal is closed/unmounted.
   */
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isAiModalOpen) {
    return null;
  }

  const speakText = (text: string) => {
    if (!isVoiceActive || !("speechSynthesis" in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      utterance.lang =
        language === "bn"
          ? "bn-BD"
          : "en-US";

      utterance.rate = 0.95;
      utterance.pitch = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Speech synthesis error:", error);
      setIsSpeaking(false);
    }
  };

  const handleSend = async () => {
    const userText = input.trim();

    if (!userText || loading) {
      return;
    }

    setInput("");

    const userMessage: ChatMessage = {
      id: createMessageId(),
      sender: "user",
      text: userText,
      timestamp: getTime(),
    };

    /*
     * Save the conversation BEFORE making the request.
     */
    const conversationForRequest = [
      ...messages,
      userMessage,
    ];

    setMessages(conversationForRequest);
    setLoading(true);

    try {
      const response = await fetch(
        "/api/gemini/assistant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: userText,

            /*
             * Send previous conversation so Gemini
             * understands follow-up questions.
             */
            history: conversationForRequest
              .filter(
                (message) =>
                  message.id !== "MSG-WELCOME"
              )
              .map((message) => ({
                role:
                  message.sender === "user"
                    ? "user"
                    : "assistant",
                text: message.text,
              })),

            language,

            /*
             * Give the AI information about the
             * currently selected/registered pet.
             */
            petContext: activePet
              ? {
                  name: activePet.name,
                  species: activePet.species,
                  breed: activePet.breed,
                  age:
                    activePet.ageYears ??
                    activePet.age,
                  gender: activePet.gender,
                  weight: activePet.weight,
                }
              : null,
          }),
        }
      );

      let data: any = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            `Request failed with status ${response.status}`
        );
      }

      const replyText =
        typeof data.reply === "string" &&
        data.reply.trim()
          ? data.reply.trim()
          : getErrorMessage(language);

      const aiMessage: ChatMessage = {
        id: createMessageId(),
        sender: "ai",
        text: replyText,
        timestamp: getTime(),
      };

      setMessages((previous) => [
        ...previous,
        aiMessage,
      ]);

      speakText(replyText);
    } catch (error) {
      console.error(
        "❌ AI Doctor chat error:",
        error
      );

      const errorMessage: ChatMessage = {
        id: createMessageId(),
        sender: "ai",
        text: getErrorMessage(language),
        timestamp: getTime(),
      };

      setMessages((previous) => [
        ...previous,
        errorMessage,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceMode = () => {
    if (isVoiceActive) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      setIsVoiceActive(false);
      setIsSpeaking(false);
      return;
    }

    setIsVoiceActive(true);
  };

  const clearChat = () => {
    if (loading) {
      return;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);

    setMessages([
      {
        id: "MSG-WELCOME-NEW",
        sender: "ai",
        text: getWelcomeMessage(language),
        timestamp: getTime(),
      },
    ]);
  };

  const handleClose = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
    setIsAiModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[680px] max-h-[92vh]">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 p-4 text-white flex items-center justify-between shrink-0">

          <div className="flex items-center gap-3 min-w-0">

            <div className="relative w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
              <Bot className="w-6 h-6 text-emerald-200" />
            </div>

            <div className="min-w-0">

              <div className="flex items-center gap-2 flex-wrap">

                <h3 className="font-bold text-sm tracking-wide font-display">
                  {getTranslation(
                    language,
                    "aiAssistantTitle"
                  )}
                </h3>

                <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-400 text-slate-950 rounded-md">
                  Gemini AI
                </span>

              </div>

              <p className="text-[11px] text-emerald-100/80 font-medium">
                {getTranslation(
                  language,
                  "aiAssistantSubtitle"
                )}
              </p>

              {activePet?.name && (
                <p className="text-[10px] text-white/70 mt-0.5">
                  {language === "bn"
                    ? `পোষা প্রাণী: ${activePet.name}`
                    : `Pet: ${activePet.name}`}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">

            {/* Clear Chat */}
            <button
              type="button"
              onClick={clearChat}
              disabled={loading}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40"
              title={
                language === "bn"
                  ? "চ্যাট পরিষ্কার করুন"
                  : "Clear chat"
              }
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Voice */}
            <button
              type="button"
              onClick={toggleVoiceMode}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                isVoiceActive
                  ? "bg-amber-400 text-slate-950 border-amber-300 shadow-sm"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              }`}
              title={
                language === "bn"
                  ? "ভয়েস চালু/বন্ধ করুন"
                  : "Toggle voice"
              }
            >
              {isVoiceActive ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              title={
                language === "bn"
                  ? "বন্ধ করুন"
                  : "Close"
              }
            >
              <X className="w-5 h-5" />
            </button>

          </div>
        </div>

        {/* =====================================================
            SAFETY NOTICE
        ====================================================== */}
        <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-100 flex items-start gap-2 shrink-0">

          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />

          <p className="text-[10px] leading-relaxed text-amber-800">
            {language === "bn"
              ? "AI Doctor সাধারণ তথ্য ও গাইডলাইন দেয়। এটি একজন licensed veterinarian-এর বিকল্প নয়। জরুরি অবস্থায় দ্রুত পশু চিকিৎসকের সাহায্য নিন।"
              : "AI Doctor provides general guidance and is not a replacement for a licensed veterinarian. Seek veterinary care promptly for emergencies."}
          </p>

        </div>

        {/* =====================================================
            MESSAGE AREA
        ====================================================== */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">

          {messages.map((message) => {

            const isUser =
              message.sender === "user";

            return (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  isUser
                    ? "flex-row-reverse"
                    : "flex-row"
                }`}
              >

                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? "bg-slate-900 text-white"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  {isUser ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[84%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                    isUser
                      ? "bg-slate-900 text-white rounded-tr-none"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">
                    {message.text}
                  </p>

                  <p className="text-[9px] mt-1.5 text-right font-mono text-slate-400">
                    {message.timestamp}
                  </p>
                </div>

              </div>
            );
          })}

          {/* Loading */}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200/80 w-fit animate-pulse">

              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />

              <span>
                {language === "bn"
                  ? "FurCare AI আপনার প্রশ্ন বিশ্লেষণ করছে..."
                  : "FurCare AI is analyzing your question..."}
              </span>

            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* =====================================================
            VOICE INDICATOR
        ====================================================== */}
        {isSpeaking && (
          <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-bold flex items-center justify-between shrink-0">

            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 animate-pulse" />

              <span>
                {language === "bn"
                  ? "FurCare AI Doctor কথা বলছে..."
                  : "FurCare AI Doctor is speaking..."}
              </span>
            </div>

            <span className="text-[10px] uppercase font-extrabold tracking-widest">
              ● LIVE
            </span>

          </div>
        )}

        {/* =====================================================
            INPUT
        ====================================================== */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">

          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              disabled={loading}
              placeholder={
                language === "bn"
                  ? "আপনার পোষা প্রাণীর সমস্যা লিখুন..."
                  : getTranslation(
                      language,
                      "aiTextMessage"
                    )
              }
              className="flex-1 px-4 py-3 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={
                loading ||
                !input.trim()
              }
              className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-sm"
              title={
                language === "bn"
                  ? "পাঠান"
                  : "Send"
              }
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>

          </form>

          <p className="text-[9px] text-slate-400 mt-2 text-center">
            {language === "bn"
              ? "উদাহরণ: আমার কুকুর খাচ্ছে না এবং অলস হয়ে গেছে।"
              : "Example: My dog is not eating and seems unusually tired."}
          </p>

        </div>

      </div>
    </div>
  );
};
