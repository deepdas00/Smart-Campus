import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  ReferenceLine,
} from "recharts";
import {
  Users,
  ShieldCheck,
  IndianRupee,
  Star,
  Zap,
  Activity,
  TrendingUp,
  Search,
  ArrowUpRight,
  MessageSquare,
  ClipboardCheck,
  AlertCircle,
  Gauge,
  TrendingDown,
  Target,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

function OfficeIntelligence() {
  const [range, setRange] = useState("weekly");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, [range]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/api/v1/college/admin/statistics?range=${range}`,
        { withCredentials: true }
      );

      console.log(res.data.data);
      
      setStats(res.data.data);
    } catch (err) {
      console.error("Data Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const intelligence = useMemo(() => {
    if (!stats) return null;

    const revData = stats.canteenRevenueGraphData || [];
    const n = revData.length;

    // --- 1. REVENUE LINEAR REGRESSION ENGINE (y = mx + b) ---
    // Calculates the mathematical trend slope
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumXX = 0;
    revData.forEach((d, i) => {
      sumX += i;
      sumY += d.amount;
      sumXY += i * d.amount;
      sumXX += i * i;
    });
    const slope =
      n > 1 ? (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX) : 0;
    const intercept = (sumY - slope * sumX) / n;
    const projectedNext = Math.max(0, slope * n + intercept);
    const revenueVolatility =
      n > 1
        ? Math.max(...revData.map((d) => d.amount)) -
          Math.min(...revData.map((d) => d.amount))
        : 0;

    // --- 2. STUDENT RESOLUTION SATISFACTION ---
    const validRatings =
      stats.rating?.filter((r) => r.rating).map((r) => r.rating) || [];
    const satisfactionScore = validRatings.length
      ? (validRatings.reduce((a, b) => a + b, 0) / validRatings.length).toFixed(
          1
        )
      : 0;

    // --- 3. OPERATIONAL HEALTH RATIOS ---
    const resolutionRate =
      stats.totalReports > 0
        ? (stats.resolvedReports / stats.totalReports) * 100
        : 0;
    const frictionIndex = (100 - resolutionRate).toFixed(1); // Percentage of issues left pending
    const studentEngagement =
      stats.activeStudentsCount > 0
        ? (stats.librarySuccessTransCount / stats.activeStudentsCount).toFixed(
            2
          )
        : 0;

    // --- 4. SYSTEM STATUS ENGINE ---
    const healthStatus =
      resolutionRate > 80 && satisfactionScore > 4
        ? "Optimal"
        : resolutionRate > 50
        ? "Stable"
        : "Critical Warning";

    return {
      revData,
      projectedNext,
      satisfactionScore,
      resolutionRate,
      studentEngagement,
      healthStatus,
      slope,
      frictionIndex,
      revenueVolatility,
      pending: stats.totalReports - stats.resolvedReports,
      ratingCount: validRatings.length,
    };
  }, [stats]);

  if (loading || !stats) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#ffffff] text-slate-900 lg:p-10 font-sans">
      <div className="max-w-[1500px] mx-auto space-y-8">
        {/* --- DYNAMIC HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Intelligence <span className="text-blue-600">Command</span>
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
                <span
                  className={`h-2 w-2 rounded-full ${
                    intelligence.resolutionRate > 50
                      ? "bg-emerald-500"
                      : "bg-rose-500"
                  } animate-pulse`}
                />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  System Health: {intelligence.healthStatus}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-1 rounded-2xl flex shadow-sm">
            {["daily", "weekly", "monthly"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                  range === r
                    ? "bg-slate-900 text-white shadow-xl"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </header>

        {/* --- INTELLIGENCE TILES --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatTile
            title="Gross Revenue"
            value={`₹${stats.totalCanteenRevenue}`}
            sub={`Volatility: ₹${intelligence.revenueVolatility.toFixed(0)}`}
            icon={<IndianRupee />}
            color="blue"
          />
          <StatTile
            title="Resolution Rate"
            value={`${intelligence.resolutionRate.toFixed(1)}%`}
            sub={`${intelligence.pending} Active Cases`}
            icon={<ShieldCheck />}
            color="emerald"
          />
          <StatTile
            title="Student Sentiment"
            value={`${intelligence.satisfactionScore}/5`}
            sub={`From ${intelligence.ratingCount} Resolved Audits`}
            icon={<Star />}
            color="amber"
          />
          <StatTile
            title="Engagement Index"
            value={intelligence.studentEngagement}
            sub="TXN / Student Ratio"
            icon={<Activity />}
            color="indigo"
          />
        </div>

        {/* --- MAIN ANALYTICS CORE --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* AI REVENUE PROJECTION */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm group">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-black tracking-tight">
                  Revenue Velocity Analysis
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Predictive Least Squares Regression
                </p>
              </div>
              <div className="text-right flex items-center gap-4">
                <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                  <p className="text-[9px] font-black text-blue-400 uppercase mb-0.5">
                    Forecasted Next
                  </p>
                  <span className="text-xl font-black text-blue-600">
                    ₹{intelligence.projectedNext.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={intelligence.revData}>
                  <defs>
                    <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#3b82f6"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#c2c5c890"
                  />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 800, fill: "#94A3B8" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 800, fill: "#94A3B8" }}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: "#E2E8F0", strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    fill="url(#areaColor)"
                    stroke="#00078b"
                    strokeWidth={4}
                    isFront={true}
                  />
                  <Bar
                    dataKey="amount"
                    fill="#0088ff9e"
                    barSize={40}
                    radius={[10, 10, 0, 0]}
                  />
                  <ReferenceLine
                    y={intelligence.projectedNext}
                    stroke="#F59E0B"
                    strokeDasharray="10 10"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SYSTEM FRICTION DONUT */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col bg-[#00078b] justify-between">
            <h3 className="text-lg font-black tracking-tight">
              Backlog Saturation
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-6 tracking-widest">
              Efficiency vs Friction
            </p>

            <div className="relative h-64">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-5xl font-black text-slate-900">
                  {intelligence.resolutionRate.toFixed(0)}%
                </p>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">
                  Resolved
                </p>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Efficiency", value: stats.resolvedReports },
                      { name: "Friction", value: intelligence.pending },
                    ]}
                    innerRadius={85}
                    outerRadius={110}
                    paddingAngle={10}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="#3B82F6" cornerRadius={10} />
                    <Cell fill="#F1F5F9" cornerRadius={10} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center">
                <p className="text-[10px] font-black text-blue-400 uppercase">
                  Success
                </p>
                <p className="text-xl font-black text-blue-700">
                  {stats.resolvedReports}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-center">
                <p className="text-[10px] font-black text-rose-400 uppercase">
                  Friction
                </p>
                <p className="text-xl font-black text-rose-700">
                  {intelligence.pending}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- DEEP INFERENCE GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <InferenceCard
            title="Resolution Velocity"
            value={intelligence.resolutionRate > 75 ? "Optimal" : "Slow"}
            desc={`At current speeds, the office clears ${(
              stats.resolvedReports / intelligence.revData.length
            ).toFixed(1)} issues per time interval.`}
            icon={<Target size={20} />}
            color="emerald"
          />
          <InferenceCard
            title="Revenue Volatility"
            value={
              intelligence.revenueVolatility > stats.totalCanteenRevenue * 0.5
                ? "High"
                : "Stable"
            }
            desc={`The variance in daily income suggests a ${
              intelligence.slope > 0 ? "growing" : "contracting"
            } customer spend trend.`}
            icon={<Gauge size={20} />}
            color="blue"
          />
          <InferenceCard
            title="Future Resolution"
            value={`${intelligence.satisfactionScore} Stars`}
            desc={`Projected student satisfaction based on historical resolution quality audits from ${intelligence.ratingCount} students.`}
            icon={<Star size={20} />}
            color="amber"
          />
        </div>
      </div>
    </div>
  );
}

// --- ATOMIC UI COMPONENTS ---

function StatTile({ title, value, sub, icon, color }) {
  const styles = {
    blue: "bg-blue-50 text-blue-600 border-blue-100 shadow-blue-100/50",
    emerald:
      "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/50",
    amber: "bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/50",
    indigo:
      "bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-100/50",
  };
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5 hover:border-blue-300 transition-colors">
      <div className={`p-4 rounded-2xl border ${styles[color]}`}>{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
          {title}
        </p>
        <p className="text-2xl font-black text-slate-900 tracking-tighter">
          {value}
        </p>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">
          {sub}
        </p>
      </div>
    </div>
  );
}

function InferenceCard({ title, value, desc, icon, color }) {
  const theme = {
    emerald: "border-emerald-100 bg-emerald-50/50 text-emerald-700",
    blue: "border-blue-100 bg-blue-50/50 text-blue-700",
    amber: "border-amber-100 bg-amber-50/50 text-amber-700",
  };
  return (
    <div
      className={`p-8 rounded-[2.5rem] border ${theme[color]} flex flex-col justify-between h-64 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex justify-between items-start">
        <div className="p-3 bg-white rounded-xl shadow-sm border border-inherit">
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase opacity-50 tracking-widest">
          Inference Engine
        </span>
      </div>
      <div>
        <p className="text-3xl font-black mb-1">{value}</p>
        <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-3">
          {title}
        </p>
        <p className="text-[11px] font-medium leading-relaxed opacity-70 italic">
          "{desc}"
        </p>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-white/10">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">
          {payload[0].payload.label}
        </p>
        <p className="text-xl font-black">
          ₹{payload[0].value.toLocaleString()}
        </p>
        <div className="h-1.5 w-full bg-blue-500 rounded-full mt-3 overflow-hidden">
          <div className="h-full w-2/3 bg-white/20 animate-pulse" />
        </div>
      </div>
    );
  }
  return null;
};

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10">
      <div className="h-14 w-14 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">
        Processing Analytics
      </p>
    </div>
  );
}

export default OfficeIntelligence;
