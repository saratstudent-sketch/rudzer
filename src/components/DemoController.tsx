"use client";

import { useState } from "react";
import { useTelemetryStore } from "@/lib/store";
import { Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DemoController() {
  const [isOpen, setIsOpen] = useState(false);
  const { scenario, setScenario, globalRisk } = useTelemetryStore();

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 shadow-lg transition-all"
        title="Open Demo Controller"
      >
        <Settings className="w-5 h-5 text-primaryText" />
      </button>

      {/* Controller Panel */}
      <div 
        className={cn(
          "fixed bottom-20 right-6 z-50 w-80 glass-panel-elevated p-6 rounded-2xl transition-all duration-300 transform",
          isOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-10 opacity-0 pointer-events-none"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold tracking-wider uppercase text-primaryText">Simulation Controls</h3>
          <button onClick={() => setIsOpen(false)} className="text-mutedText hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs text-secondaryText mb-2">Select Scenario</p>
            
            <button 
              onClick={() => setScenario('NORMAL')}
              className={cn(
                "w-full text-left px-4 py-2 text-sm rounded border transition-colors",
                scenario === 'NORMAL' ? "bg-status-safe/20 border-status-safe/50 text-status-safe" : "bg-white/5 border-white/10 text-secondaryText hover:bg-white/10"
              )}
            >
              1. Normal Operation
            </button>
            
            <button 
              onClick={() => setScenario('TILT_ANOMALY')}
              className={cn(
                "w-full text-left px-4 py-2 text-sm rounded border transition-colors",
                scenario === 'TILT_ANOMALY' ? "bg-status-warning/20 border-status-warning/50 text-status-warning" : "bg-white/5 border-white/10 text-secondaryText hover:bg-white/10"
              )}
            >
              2. Single Node Tilt Anomaly
            </button>

            <button 
              onClick={() => setScenario('SUBSIDENCE_EVENT')}
              className={cn(
                "w-full text-left px-4 py-2 text-sm rounded border transition-colors",
                scenario === 'SUBSIDENCE_EVENT' ? "bg-status-critical/20 border-status-critical/50 text-status-critical" : "bg-white/5 border-white/10 text-secondaryText hover:bg-white/10"
              )}
            >
              3. Spatial Subsidence Event
            </button>
          </div>

          <div className="pt-4 mt-4 border-t border-white/10">
            <div className="flex justify-between text-xs">
              <span className="text-mutedText">Global Risk Score</span>
              <span className={cn(
                "font-bold",
                globalRisk > 70 ? "text-status-critical" : globalRisk > 30 ? "text-status-warning" : "text-status-safe"
              )}>{globalRisk} / 100</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
