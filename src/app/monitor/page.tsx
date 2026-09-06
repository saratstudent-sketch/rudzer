"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/GlassPanel";
import { TelemetryCard } from "@/components/TelemetryCard";
import { ShieldAlert, Activity, Move, Waves, Zap, Wifi } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Simulated Data
const generateData = () => {
  const now = new Date();
  return Array.from({ length: 20 }).map((_, i) => ({
    time: new Date(now.getTime() - (20 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    displacement: (Math.random() * 2 + 10).toFixed(1),
    tilt: (Math.random() * 0.2 + 0.5).toFixed(2),
  }));
};

export default function LiveMonitor() {
  const [data, setData] = useState(generateData());
  const [activeTab, setActiveTab] = useState('Displacement');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          displacement: (Math.random() * 2 + 10).toFixed(1),
          tilt: (Math.random() * 0.2 + 0.5).toFixed(2),
        });
        return newData;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primaryText">
            LIVE MINE MONITOR
          </h1>
          <p className="text-secondaryText mt-2">
            Continuous surface deformation intelligence.
          </p>
        </div>
        
        <GlassPanel className="flex items-center gap-6 px-6 py-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-mutedText">Mine</span>
            <span className="text-sm font-semibold text-primaryText">Jharia Panel A</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-mutedText">Nodes</span>
            <span className="text-sm font-semibold text-primaryText">48 / 50</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-mutedText">Last Sync</span>
            <span className="text-sm font-semibold text-status-safe">2 sec ago</span>
          </div>
        </GlassPanel>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <TelemetryCard
          title="Current Risk"
          value="LOW"
          subtitle="Risk score: 18 / 100"
          icon={ShieldAlert}
          statusColor="text-status-safe"
        />
        <TelemetryCard
          title="Maximum Tilt"
          value="0.84°"
          trend="+2.3%"
          trendUp={true}
          icon={Activity}
        />
        <TelemetryCard
          title="Max Displacement"
          value="12.8 mm"
          trend="+1.4%"
          trendUp={true}
          icon={Move}
        />
        <TelemetryCard
          title="Vibration Anomaly"
          value="NORMAL"
          icon={Waves}
          statusColor="text-status-info"
        />
        <TelemetryCard
          title="Active Crack Events"
          value="2"
          icon={Zap}
          statusColor="text-status-warning"
        />
        <TelemetryCard
          title="Network Health"
          value="98.7%"
          icon={Wifi}
          statusColor="text-status-safe"
        />
      </div>

      {/* Charts & 3D Map Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Real-time Chart */}
        <GlassPanel className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold tracking-tight text-primaryText uppercase">
              Surface Deformation
            </h2>
            <div className="flex gap-2">
              {['Tilt', 'Displacement', 'Combined'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    activeTab === tab ? "bg-white/10 text-primaryText" : "text-mutedText hover:text-secondaryText"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="rgba(255,255,255,0.2)" 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.2)" 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111214', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#F5F5F7' }}
                />
                <Line 
                  type="monotone" 
                  dataKey={activeTab.toLowerCase()} 
                  stroke={activeTab === 'Tilt' ? '#64D2FF' : '#30D158'} 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#111214', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        {/* 3D Map Placeholder (Will be actual 3D in /map) */}
        <GlassPanel className="p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-lg font-semibold tracking-tight text-primaryText uppercase mb-2">
              Spatial Correlation
            </h2>
            <p className="text-sm text-secondaryText">
              No significant spatial deformation clusters detected in Panel A.
            </p>
          </div>
          
          <div className="mt-8 relative h-[200px] w-full rounded-lg border border-white/5 bg-background overflow-hidden flex items-center justify-center">
            {/* Fake 3D node representation */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.05)_0%,_transparent_70%)]" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="w-4 h-4 rounded-full bg-status-safe shadow-[0_0_20px_rgba(48,209,88,0.8)]"
            />
            <div className="absolute bottom-4 left-4 text-xs text-mutedText">
              Live Network Map Preview
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
