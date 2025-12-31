import React from "react";

// --- Dynamic Heatmap Calendar ---
function HeatmapCalendar({ data, title, valueKey }) {
  // data: [{label: '2025-12-25', amount: 800}, ...]
  if (!data || !data.length) return null;

  // Normalize values to 0-1 for color intensity
  const values = data.map(d => d[valueKey] || 0);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  const getColor = (val) => {
    if (maxValue === minValue) return "#93C5FD"; // uniform color if same
    const intensity = (val - minValue) / (maxValue - minValue);
    // Blue gradient
    const alpha = 0.3 + intensity * 0.7; // from 0.3 to 1
    return `rgba(59, 130, 246, ${alpha})`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-10">
      <h2 className="font-black text-slate-900 mb-4">{title}</h2>
      <div className="grid grid-cols-7 gap-2">
        {data.map((d, idx) => (
          <div
            key={idx}
            title={`${d.label}: ${d[valueKey]}`}
            className="h-10 flex items-center justify-center rounded"
            style={{ backgroundColor: getColor(d[valueKey]) }}
          >
            <span className="text-xs font-bold text-white">{d[valueKey]}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-slate-400 mt-2">Darker = higher activity</p>
    </div>
  );
}
