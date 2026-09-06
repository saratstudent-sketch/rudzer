"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Activity, Globe, ShieldAlert } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-background z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondaryBg via-background to-background z-0" />
      
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-primaryText leading-[1.1]">
            SEE THE GROUND <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
              BEFORE IT MOVES.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-secondaryText max-w-2xl mx-auto font-light">
            AI-powered real-time subsidence intelligence for safer underground coal mining.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/monitor"
              className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-background bg-primaryText rounded-full overflow-hidden transition-transform active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                ENTER LIVE MONITOR
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            <Link 
              href="#architecture"
              className="inline-flex items-center justify-center px-8 py-4 font-semibold text-primaryText glass-panel rounded-full hover:bg-white/10 transition-colors active:scale-95"
            >
              EXPLORE THE SYSTEM
            </Link>
          </div>
        </motion.div>

        {/* Telemetry Overlay Example */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {[
            { label: "ACTIVE NODES", value: "48", icon: Activity },
            { label: "NETWORK HEALTH", value: "98.7%", icon: Globe },
            { label: "CURRENT RISK", value: "LOW", icon: ShieldAlert, color: "text-status-safe" },
            { label: "AREA MONITORED", value: "2.8 km²", icon: Activity },
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-2">
              <stat.icon className="w-5 h-5 text-mutedText" />
              <div className={`text-2xl font-semibold tracking-tight ${stat.color || "text-primaryText"}`}>
                {stat.value}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-mutedText font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
