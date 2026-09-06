"use client";

import { GlassPanel } from "@/components/GlassPanel";
import { BrainCircuit, Cpu, Database, Network, ShieldCheck, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function AIPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primaryText mb-4">
          FROM RAW SIGNALS <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-status-info to-status-safe">
            TO EARLY INTELLIGENCE.
          </span>
        </h1>
        <p className="text-secondaryText text-lg">
          Our Subsidence Risk Engine continuously analyzes temporal and spatial deformation patterns.
        </p>
      </div>

      {/* Model Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <GlassPanel className="p-4 flex flex-col justify-between">
          <span className="text-[10px] text-mutedText uppercase tracking-wider">Model Status</span>
          <div className="text-xl font-semibold text-status-safe flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-status-safe rounded-full animate-pulse" />
            ONLINE
          </div>
        </GlassPanel>
        <GlassPanel className="p-4 flex flex-col justify-between">
          <span className="text-[10px] text-mutedText uppercase tracking-wider">Engine Version</span>
          <div className="text-xl font-semibold text-primaryText mt-2">v1.0 (XGBoost)</div>
        </GlassPanel>
        <GlassPanel className="p-4 flex flex-col justify-between">
          <span className="text-[10px] text-mutedText uppercase tracking-wider">Confidence Level</span>
          <div className="text-xl font-semibold text-primaryText mt-2">91%</div>
        </GlassPanel>
        <GlassPanel className="p-4 flex flex-col justify-between">
          <span className="text-[10px] text-mutedText uppercase tracking-wider">Prediction Horizon</span>
          <div className="text-xl font-semibold text-primaryText mt-2">1H / 6H / 24H</div>
        </GlassPanel>
      </div>

      {/* AI Pipeline Visualization */}
      <GlassPanel className="p-8 mb-8 overflow-hidden relative">
        <h2 className="text-lg font-semibold text-primaryText uppercase mb-8 text-center tracking-widest">
          Inference Pipeline
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-between relative z-10 max-w-5xl mx-auto">
          {/* Decorative connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2 -z-10" />
          
          {[
            { icon: Database, label: "RAW TELEMETRY", color: "text-mutedText" },
            { icon: Cpu, label: "NOISE FILTERING", color: "text-secondaryText" },
            { icon: Network, label: "SPATIAL CLUSTERING", color: "text-status-info" },
            { icon: BrainCircuit, label: "ANOMALY DETECTION", color: "text-status-warning" },
            { icon: ShieldCheck, label: "RISK ESTIMATION", color: "text-status-critical" },
          ].map((step, index) => (
            <motion.div 
              key={step.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="flex flex-col items-center gap-4 bg-background p-4 rounded-xl"
            >
              <div className={`w-16 h-16 rounded-2xl glass-panel flex items-center justify-center ${step.color} shadow-lg shadow-black/50`}>
                <step.icon className="w-8 h-8" />
              </div>
              <div className="text-[10px] font-bold text-primaryText tracking-widest uppercase">
                {step.label}
              </div>
            </motion.div>
          ))}
        </div>
      </GlassPanel>

      {/* Explainable AI Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassPanel className="p-6">
          <h3 className="text-sm font-semibold text-secondaryText uppercase tracking-wider mb-6">Risk Drivers (Explainability)</h3>
          <div className="space-y-4">
            {[
              { factor: "Tilt Increase", weight: "+24%", value: "85", color: "bg-status-warning" },
              { factor: "Displacement Velocity", weight: "+31%", value: "92", color: "bg-status-critical" },
              { factor: "Neighbour Node Correlation", weight: "+18%", value: "65", color: "bg-status-info" },
              { factor: "Vibration Anomaly", weight: "+12%", value: "40", color: "bg-white/20" },
              { factor: "Crack Activity", weight: "+7%", value: "15", color: "bg-white/20" },
            ].map(item => (
              <div key={item.factor} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-primaryText">{item.factor}</span>
                  <span className="text-mutedText">{item.weight} contribution</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full ${item.color} rounded-full`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 flex flex-col justify-center items-center text-center">
           <Activity className="w-12 h-12 text-status-warning mb-4" />
           <h3 className="text-xl font-bold text-primaryText mb-2">Elevated Subsidence Risk</h3>
           <p className="text-secondaryText text-sm max-w-md">
             The AI has detected a spatial cluster of 4 nodes showing correlated deformation, combined with a 31% increase in displacement velocity over the last hour.
           </p>
           <button className="mt-6 px-6 py-2 glass-panel text-xs font-semibold rounded hover:bg-white/10 transition-colors">
             VIEW DETAILED REPORT
           </button>
        </GlassPanel>
      </div>
    </div>
  );
}
