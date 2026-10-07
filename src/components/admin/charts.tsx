"use client";

import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Stats } from "@/lib/stats";

const tip = { contentStyle: { background: "#171412", border: "0", color: "#f3eee6" } };

export function TrendChart({ data }: { data: Stats["trend"] }) {
  return (
    <div className="panel" style={{ height: 260 }}>
      <p className="eyebrow">RSVPs · 30 days</p>
      <ResponsiveContainer width="100%" height="86%">
        <AreaChart data={data}>
          <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#b7aea3" />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#b7aea3" width={28} />
          <Tooltip {...tip} />
          <Area dataKey="rsvps" stroke="#72283a" fill="#72283a22" strokeWidth={1.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AgeChart({ data }: { data: Stats["ages"] }) {
  return (
    <div className="panel" style={{ height: 260 }}>
      <p className="eyebrow">Age</p>
      <ResponsiveContainer width="100%" height="86%">
        <BarChart data={data}>
          <XAxis dataKey="age" tick={{ fontSize: 11 }} stroke="#b7aea3" />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#b7aea3" width={28} />
          <Tooltip {...tip} />
          <Bar dataKey="value" fill="#171412" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SourceChart({ data }: { data: Stats["sources"] }) {
  return (
    <div className="panel" style={{ height: 260 }}>
      <p className="eyebrow">How they heard</p>
      <ResponsiveContainer width="100%" height="86%">
        <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
          <XAxis type="number" allowDecimals={false} hide />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="#b7aea3" width={90} />
          <Tooltip {...tip} />
          <Bar dataKey="value" fill="#72283a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
