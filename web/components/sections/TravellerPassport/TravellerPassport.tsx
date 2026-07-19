"use client";

import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  emotion?: string;
}

export default function TravellerPassport({ isOpen, onClose, emotion }: Props) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    group: "",
    time: "",
    budget: "",
  });

  const totalSteps = 3;

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setAnswers({ group: "", time: "", budget: "" });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const select = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    next();
  };

  const progress = Math.min(step, totalSteps) / totalSteps * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl px-4">

      <div className="relative w-full max-w-3xl rounded-[32px] bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-white/30 overflow-hidden">

        {/* Progress */}
        <div className="h-[3px] w-full bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-[#E6B980] to-[#EACDA3] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <div className="px-12 py-14 min-h-[480px] flex flex-col justify-between">

          {/* Heading */}
          <div className="text-center max-w-xl mx-auto">

            {step <= 3 && emotion && (
              <p className="text-sm text-gray-500 mb-2">
                Planning your <span className="font-medium">{emotion}</span> journey
              </p>
            )}

            <h2 className="text-3xl font-semibold leading-snug">
              {step === 1 && "Who’s joining you on this journey?"}
              {step === 2 && "When would you like to travel?"}
              {step === 3 && "What kind of experience are you looking for?"}
              {step === 4 && "Perfect. We’re designing your journey."}
            </h2>
          </div>

          {/* STEP CONTENT */}
          <div key={step} className="transition-all duration-500">

            {/* STEP 1 */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-6 mt-10">
                {[
                  { label: "Solo", desc: "Time for yourself" },
                  { label: "Couple", desc: "Romantic escape" },
                  { label: "Family", desc: "Memories together" },
                  { label: "Friends", desc: "Fun & bonding" },
                ].map((item) => {
                  const isSelected = answers.group === item.label;

                  return (
                    <button
                      key={item.label}
                      onClick={() => select("group", item.label)}
                      className={`group p-6 rounded-2xl border transition-all text-left relative overflow-hidden
                        ${
                          isSelected
                            ? "bg-black text-white border-black shadow-xl scale-[1.04]"
                            : "bg-white/70 border-gray-200 hover:bg-white hover:shadow-md hover:scale-[1.02]"
                        }
                      `}
                    >
                      {/* Subtle Glow */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-[#E6B980]/10 to-transparent transition" />

                      <div className="relative z-10">
                        <div className="font-semibold text-lg">{item.label}</div>
                        <div className="text-xs opacity-70 mt-1">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="grid gap-5 mt-10">
                {[
                  { label: "Next 1 month", hint: "Spontaneous plans" },
                  { label: "1–3 months", hint: "Ideal planning window" },
                  { label: "3–6 months", hint: "Well planned journey" },
                  { label: "Just exploring", hint: "No rush, just ideas" },
                ].map((item) => {
                  const isSelected = answers.time === item.label;

                  return (
                    <button
                      key={item.label}
                      onClick={() => select("time", item.label)}
                      className={`p-5 rounded-2xl border text-left transition-all
                        ${
                          isSelected
                            ? "bg-black text-white border-black"
                            : "bg-white/70 border-gray-200 hover:bg-white hover:shadow-sm"
                        }
                      `}
                    >
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs opacity-70 mt-1">{item.hint}</div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="grid gap-5 mt-10">
                {[
                  {
                    label: "Flexible",
                    desc: "Open to premium & unique experiences",
                  },
                  {
                    label: "Moderate",
                    desc: "Comfort with value balance",
                  },
                  {
                    label: "Premium",
                    desc: "Luxury, exclusivity & curated stays",
                  },
                ].map((item) => {
                  const isSelected = answers.budget === item.label;

                  return (
                    <button
                      key={item.label}
                      onClick={() => select("budget", item.label)}
                      className={`p-5 rounded-2xl border text-left transition-all
                        ${
                          isSelected
                            ? "bg-black text-white border-black"
                            : "bg-white/70 border-gray-200 hover:bg-white hover:shadow-sm"
                        }
                      `}
                    >
                      <div className="font-semibold">{item.label}</div>
                      <div className="text-xs opacity-70 mt-1">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* FINAL */}
            {step === 4 && (
              <div className="text-center mt-10">
                <p className="text-gray-600 mt-4">
                  Sit back — we’ll craft something beautiful for you.
                </p>

                <button
                  onClick={onClose}
                  className="mt-6 bg-gradient-to-r from-[#E6B980] to-[#EACDA3] text-black px-10 py-4 rounded-full hover:scale-105 transition shadow-lg"
                >
                  Continue
                </button>
              </div>
            )}

          </div>

          {/* NAV */}
          {step <= totalSteps && (
            <div className="flex justify-between mt-10 text-sm">

              <button
                onClick={back}
                disabled={step === 1}
                className={step === 1 ? "text-gray-300" : "text-gray-600 hover:text-black"}
              >
                ← Back
              </button>

              <button
                onClick={next}
                disabled={
                  (step === 1 && !answers.group) ||
                  (step === 2 && !answers.time) ||
                  (step === 3 && !answers.budget)
                }
                className="font-medium text-black disabled:text-gray-300"
              >
                Next →
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}