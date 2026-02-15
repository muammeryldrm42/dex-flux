"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { TokenTable } from "@/components/token/token-table";
import { SubmitInfoDialog } from "@/components/token/submit-info-dialog";
import type { TokenListItem } from "@/types/token";
import { Search } from "lucide-react";

export default function HomePage() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<TokenListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 50;

  const debouncedQ = useDebouncedValue(q, 250);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await axios.get("/api/tokens", {
        params: { q: debouncedQ || undefined, limit, offset },
      });
      if (!mounted) return;
      setItems(data.items);
      setTotal(data.total);
    })().catch(() => {
      if (!mounted) return;
      setItems([]);
      setTotal(0);
    });

    return () => {
      mounted = false;
    };
  }, [debouncedQ, offset]);

  const canPrev = offset > 0;
  const canNext = offset + limit < total;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Dex Flux" className="h-10 w-10 rounded-xl border border-border" />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Dex Flux</h1>
              <p className="text-sm text-muted-foreground">Solana Token Directory — add socials for free.</p>
            </div>
          </div>
          <SubmitInfoDialog />
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tokens (name / symbol / mint)…"
            value={q}
            onChange={(e) => {
              setOffset(0);
              setQ(e.target.value);
            }}
            className="border-0 bg-transparent focus-visible:ring-0"
          />
        </div>

        <div className="mt-6">
          <TokenTable items={items} />
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {Math.min(offset + 1, total)}–{Math.min(offset + limit, total)} of {total}
          </span>
          <div className="flex gap-2">
            <button className="rounded-lg border border-border px-3 py-1 disabled:opacity-40" disabled={!canPrev} onClick={() => setOffset((v) => Math.max(v - limit, 0))}>
              Prev
            </button>
            <button className="rounded-lg border border-border px-3 py-1 disabled:opacity-40" disabled={!canNext} onClick={() => setOffset((v) => v + limit)}>
              Next
            </button>
          </div>
        </div>

        <div className="mt-10 text-xs text-muted-foreground">
          Data: Jupiter token list + Jupiter price. Community links stored in Supabase.
        </div>
      </div>
    </main>
  );
}

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}
