"use client";

import { useState, useEffect } from "react";
import { GlassPanel } from "@/components/GlassPanel";
import { TelemetryCard } from "@/components/TelemetryCard";
import { ShieldAlert, Activity, Move, Waves, Zap, Wifi } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTelemetryStore } from "@/lib/store";

export default function LiveMonitor() {
  const { nodes, globalRisk } = useTelemetryStore();
  const [activeTab, setActiveTab] = useState('Displacement');
  const [chartData, setChartData] = useState<any[]>([]);

  // Calculate aggregates
  const maxDisplacement = Math.max(...nodes.map(n => n.displacement));
  const maxTilt = Math.max(...nodes.map(n => n.tilt));
  const activeNodes = nodes.filter(n => n.status === 'ONLINE').length;

  useEffect(() => {
    // Every time globalRisk changes (or every interval), we push a new data point to the chart
    setChartData(prev => {
      const newData = [...prev.slice(prev.length >= 20 ? 1 : 0)];
      newData.push({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        displacement: maxDisplacement,
        tilt: maxTilt,
        risk: globalRisk
      });
      return newData;
    });
  }, [globalRisk, maxDisplacement, maxTilt]);

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
            <span className="text-sm font-semibold text-primaryText">{activeNodes} / 50</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-mutedText">Network</span>
            <span className="text-sm font-semibold text-status-safe">98.7%</span>
          </div>
        </GlassPanel>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <TelemetryCard
          title="Current Risk"
          value={globalRisk > 70 ? "CRITICAL" : globalRisk > 30 ? "WARNING" : "LOW"}
          subtitle={`Risk score: ${globalRisk.toFixed(1)} / 100`}
          icon={ShieldAlert}
          statusColor={globalRisk > 70 ? "text-status-critical" : globalRisk > 30 ? "text-status-warning" : "text-status-safe"}
        />
        <TelemetryCard
          title="Maximum Tilt"
          value={`${maxTilt.toFixed(3)}°`}
          trend={maxTilt > 0.5 ? "+High" : "Stable"}
          trendUp={maxTilt > 0.5}
          icon={Activity}
          statusColor={maxTilt > 0.5 ? "text-status-warning" : "text-primaryText"}
        />
        <TelemetryCard
          title="Max Displacement"
          value={`${maxDisplacement.toFixed(2)} mm`}
          trend={maxDisplacement > 5 ? "+Rapid" : "Normal"}
          trendUp={maxDisplacement > 5}
          icon={Move}
          statusColor={maxDisplacement > 5 ? "text-status-critical" : "text-primaryText"}
        />
        <TelemetryCard
          title="Vibration Anomaly"
          value="NORMAL"
          icon={Waves}
          statusColor="text-status-info"
        />
        <TelemetryCard
          title="Active Crack Events"
          value="0"
          icon={Zap}
          statusColor="text-primaryText"
        />
        <TelemetryCard
          title="Avg Node Battery"
          value={`${(nodes.reduce((acc, n) => acc + n.battery, 0) / nodes.length).toFixed(0)}%`}
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
              Peak Surface Deformation
            </h2>
            <div className="flex gap-2">
              {['Tilt', 'Displacement', 'Risk'].map((tab) => (
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
              <LineChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
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
                  stroke={activeTab === 'Tilt' ? '#64D2FF' : activeTab === 'Risk' ? '#FF453A' : '#30D158'} 
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        {/* Dynamic Spatial Preview */}
        <GlassPanel className="p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-lg font-semibold tracking-tight text-primaryText uppercase mb-2">
              Spatial Correlation
            </h2>
            <p className="text-sm text-secondaryText">
              {globalRisk > 70 
                ? "CRITICAL: Multiple nodes detecting rapid correlated displacement." 
                : globalRisk > 30 
                ? "WARNING: Localized tilt anomaly detected."
                : "No significant spatial deformation clusters detected."}
            </p>
          </div>
          
          <div className="mt-8 relative h-[200px] w-full rounded-lg border border-white/5 bg-background overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.05)_0%,_transparent_70%)]" />
            
            <div className={`w-32 h-32 rounded-full absolute blur-3xl opacity-20 transition-colors duration-1000 ${
              globalRisk > 70 ? 'bg-status-critical' : globalRisk > 30 ? 'bg-status-warning' : 'bg-status-safe'
            }`} />
            
            <div className="absolute bottom-4 left-4 text-xs text-mutedText">
              Live Network State: {globalRisk.toFixed(0)} Risk
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
