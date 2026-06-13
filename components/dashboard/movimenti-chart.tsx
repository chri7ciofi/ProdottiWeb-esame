"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type Punto = { mese: string; ingressi: number; uscite: number };

function etichettaMese(m: string) {
  const [, mm] = m.split("-");
  const mesi = ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];
  return mesi[Number(mm) - 1] ?? m;
}

export function MovimentiChart({ dati }: { dati: Punto[] }) {
  const data = dati.map((d) => ({ ...d, label: etichettaMese(d.mese) }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10a37f" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#10a37f" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9aa0a8" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#9aa0a8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ededf0" vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: "#8e9097" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: "#8e9097" }}
          width={48}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #ededf0",
            fontSize: 13,
            boxShadow: "0 8px 24px -12px rgba(17,17,19,0.18)",
          }}
          labelStyle={{ color: "#27282c", fontWeight: 600 }}
          formatter={(v: number, n: string) => [
            v,
            n === "ingressi" ? "Ingressi" : "Uscite",
          ]}
        />
        <Area
          type="monotone"
          dataKey="ingressi"
          stroke="#0f766e"
          strokeWidth={2}
          fill="url(#gIn)"
        />
        <Area
          type="monotone"
          dataKey="uscite"
          stroke="#6b6d75"
          strokeWidth={2}
          fill="url(#gOut)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
