"use client";

import { GlassPanel } from "@/components/GlassPanel";
import { ShieldAlert, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const alerts = [
  {
    id: 1,
    time: "16:49:12",
    node: "AI ENGINE",
    type: "CRITICAL",
    message: "Spatial correlation detected. Rapid displacement increase across multiple neighbouring nodes.",
    risk: "HIGH (87/100)",
  },
  {
    id: 2,
    time: "16:47:05",
    node: "NODE-023",
    type: "WARNING",
    message: "Displacement acceleration detected.",
    risk: "HIGH",
  },
  {
    id: 3,
    time: "16:42:31",
    node: "NODE-024",
    type: "WATCH",
    message: "Increasing tilt detected.",
    risk: "MEDIUM",
  },
  {
    id: 4,
    time: "15:10:00",
    node: "GATEWAY",
    type: "INFO",
    message: "Routine system calibration completed.",
    risk: "LOW",
  }
];

const getAlertIcon = (type: string) => {
  switch (type) {
    case "CRITICAL": return ShieldAlert;
    case "WARNING": return AlertTriangle;
    case "WATCH": return Info;
    case "INFO": return CheckCircle2;
    default: return Info;
  }
};

const getAlertColor = (type: string) => {
  switch (type) {
    case "CRITICAL": return "text-status-critical border-status-critical/30 bg-status-critical/10";
    case "WARNING": return "text-status-warning border-status-warning/30 bg-status-warning/10";
    case "WATCH": return "text-status-info border-status-info/30 bg-status-info/10";
    case "INFO": return "text-status-safe border-status-safe/30 bg-status-safe/10";
    default: return "text-primaryText border-white/10 bg-white/5";
  }
};

export default function AlertsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primaryText uppercase">
          Early Warning Center
        </h1>
        <p className="text-secondaryText mt-2">
          Real-time incident timeline and risk notifications.
        </p>
      </div>

      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[31px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-white/10">
        {alerts.map((alert, index) => {
          const Icon = getAlertIcon(alert.type);
          const colorClasses = getAlertColor(alert.type);
          
          return (
            <motion.div 
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-background bg-elevated text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Icon className={`w-6 h-6 ${colorClasses.split(' ')[0]}`} />
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl shadow glass-panel">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded border ${colorClasses}`}>
                      {alert.type}
                    </span>
                    <span className="text-xs font-mono text-mutedText">{alert.time}</span>
                  </div>
                  <span className="text-sm font-semibold text-primaryText">{alert.node}</span>
                </div>
                
                <p className="text-sm text-secondaryText leading-relaxed">
                  {alert.message}
                </p>
                
                {alert.risk && (
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
                    <span className="text-xs text-mutedText uppercase">Risk Level:</span>
                    <span className="text-xs font-semibold text-primaryText">{alert.risk}</span>
                  </div>
                )}

                {alert.type === "CRITICAL" && (
                   <div className="mt-4 flex gap-2">
                     <button className="flex-1 py-2 bg-primaryText text-background font-semibold text-xs rounded hover:opacity-90 transition-opacity">ACKNOWLEDGE</button>
                     <button className="flex-1 py-2 glass-panel font-semibold text-xs rounded hover:bg-white/10 transition-colors">VIEW ZONE</button>
                   </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
