"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Globe, Send, MessageCircle, Twitter } from "lucide-react";

export default function TokenDetailPage({ params }: { params: { mint: string } }) {
  const mint = params.mint;
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/api/token/${mint}`);
        setData(res.data);
      } catch (e: any) {
        setErr(e?.response?.data?.error || "Failed to load token");
      }
    })();
  }, [mint]);

  const meta = data?.user_metadata;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <a href="/" className="text-sm text-muted-foreground hover:underline">← Back</a>

        <h1 className="mt-4 text-xl font-semibold">Token</h1>
        <p className="mt-1 text-sm text-muted-foreground break-all">{mint}</p>

        {err && <p className="mt-4 text-sm text-red-500">{err}</p>}

        <div className="mt-6 grid gap-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Price</div>
            <div className="text-2xl font-semibold tabular-nums">
              {typeof data?.price === "number" ? `$${data.price.toFixed(6)}` : "—"}
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-sm font-medium">Community / Socials</div>
            <div className="mt-3 grid gap-2 text-sm">
              <SocialRow icon={<Globe className="h-4 w-4" />} label="Website" url={meta?.website_url} />
              <SocialRow icon={<Twitter className="h-4 w-4" />} label="X" url={meta?.twitter_url} />
              <SocialRow icon={<Send className="h-4 w-4" />} label="Telegram" url={meta?.telegram_url} />
              <SocialRow icon={<MessageCircle className="h-4 w-4" />} label="Discord" url={meta?.discord_url} />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Missing links? Go back and use “Submit Info”.
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}

function SocialRow({ icon, label, url }: { icon: React.ReactNode; label: string; url?: string | null }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      {url ? (
        <a className="truncate max-w-[60%] text-sm underline" href={url} target="_blank" rel="noreferrer">
          {url}
        </a>
      ) : (
        <span className="text-muted-foreground">—</span>
      )}
    </div>
  );
}
