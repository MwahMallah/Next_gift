import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  LabelList,
} from "recharts";

export default function HappinessBar() {
  const happinessData = [
    { name: "До тебя", value: 2 },
    { name: "С тобой", value: 1998 },
  ];

  return (<div className="mt-4 h-[180px] w-full rounded-xl border border-white/15 bg-black/20 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={happinessData}>
          <XAxis
            dataKey="name"
            tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 2200]}
            ticks={[0, 500, 1000, 1500, 2000]}
            width={30}
            tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(255,255,255,0.25)" }}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
            contentStyle={{
              background: "rgba(15,18,32,0.95)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "white" }}
          />
          <Bar
            dataKey="value"
            radius={[8, 8, 0, 0]}
            animationDuration={1500}
            animationEasing="ease-in-out"
            fill="rgba(255,255,255,0.85)"
          >
            <LabelList
              dataKey="value"
              position="top"
              fill="rgba(255,255,255,0.85)"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>);
}