"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function StepAboutYou({ value, onChange }: Props) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-xl text-center space-y-8">
        
        {/* Heading */}
        <div>
          <h2 className="text-3xl font-semibold text-white">
            Tell us about yourself
          </h2>
          <p className="text-neutral-400 mt-2">
            We’d love to know who we’re planning this journey for
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-neutral-900/60 backdrop-blur rounded-2xl p-6 border border-neutral-800">
          <input
            type="text"
            placeholder="What should we call you?"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent border border-neutral-700 rounded-xl px-4 py-4 text-white placeholder:text-neutral-500 text-lg focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {/* Optional Emotional Line */}
        {value && (
          <p className="text-neutral-400 text-sm">
            Nice to meet you, <span className="text-white">{value}</span> ✨
          </p>
        )}
      </div>
    </div>
  );
}