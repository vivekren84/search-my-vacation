"use client";

import { useEffect, useMemo, useState } from "react";

interface DestinationEntry {
  id: string;
  canonical_name: string;
  aliases: string[];
  country: string;
  category: string;
}

interface DestinationAutocompleteProps {
  value: string;
  onChange: (nextValue: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

let cachedCatalog: DestinationEntry[] | null = null;

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export function DestinationAutocomplete({
  value,
  onChange,
  placeholder = "Search destination (e.g. Sri Lanka, Kashmir, Dharamshala)...",
  required = false,
  className = "",
}: DestinationAutocompleteProps) {
  const [catalog, setCatalog] = useState<DestinationEntry[]>(cachedCatalog || []);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (cachedCatalog) return;
    fetch("/api/portal/destinations")
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok && Array.isArray(d.destinations)) {
          cachedCatalog = d.destinations;
          setCatalog(d.destinations);
        }
      })
      .catch(() => {});
  }, []);

  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return catalog.slice(0, 12);
    return catalog
      .filter(
        (d) =>
          d.canonical_name.toLowerCase().includes(q) ||
          (d.aliases || []).some((a) => a.toLowerCase().includes(q))
      )
      .slice(0, 10);
  }, [value, catalog]);

  const fuzzyWarning = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (q.length < 3 || catalog.length === 0) return null;

    // Exact canonical match -> no warning
    if (catalog.some((d) => d.canonical_name.toLowerCase() === q)) return null;

    // Alias match -> direct suggestion
    const aliasHit = catalog.find((d) => (d.aliases || []).some((a) => a.toLowerCase() === q));
    if (aliasHit) return aliasHit.canonical_name;

    // Fuzzy edit distance <= 2 for single-token queries
    if (!/[,/|&]/.test(q)) {
      let best: { name: string; dist: number } | null = null;
      for (const d of catalog) {
        const dist = levenshtein(q, d.canonical_name.toLowerCase());
        if (dist > 0 && dist <= 2 && (!best || dist < best.dist)) {
          best = { name: d.canonical_name, dist };
        }
      }
      if (best) return best.name;
    }
    return null;
  }, [value, catalog]);

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        required={required}
        className={
          className ||
          "w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-xs text-[#0F172A] dark:text-white focus:border-[#F5951C] focus:outline-none"
        }
      />

      {fuzzyWarning && (
        <div className="mt-1 flex items-center justify-between gap-2 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-800 dark:text-amber-300">
          <span>
            Did you mean <strong>&ldquo;{fuzzyWarning}&rdquo;</strong>?
          </span>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onChange(fuzzyWarning);
              setOpen(false);
            }}
            className="px-2 py-0.5 rounded bg-[#F5951C] text-[#0F172A] font-bold text-[10px]"
          >
            Use {fuzzyWarning}
          </button>
        </div>
      )}

      {open && suggestions.length > 0 && (
        <div className="absolute z-40 left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] shadow-xl">
          {suggestions.map((d) => (
            <button
              key={d.id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(d.canonical_name);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#F8FAFC] dark:hover:bg-white/5 flex items-center justify-between"
            >
              <span className="font-semibold text-[#0F172A] dark:text-white">{d.canonical_name}</span>
              <span className="text-[10px] text-[#64748B] dark:text-zinc-400">
                {d.country} • {d.category}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
