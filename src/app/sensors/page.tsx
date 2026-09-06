"use client";

import { GlassPanel } from "@/components/GlassPanel";
import { Cpu, Wifi, Battery, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function SensorsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primaryText uppercase">
          Sensor Network
        </h1>
        <p className="text-secondaryText mt-2">
          Low-cost ESP32 hardware designed for continuous mesh sensing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hardware Visual */}
        <GlassPanel className="p-8 lg:col-span-1 flex flex-col items-center justify-center text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(100,210,255,0.05)_0%,_transparent_70%)]" />
           
           <Cpu className="w-24 h-24 text-primaryText/20 mb-6 relative z-10" />
           <h2 className="text-xl font-bold text-primaryText relative z-10">ESP32 Core Node</h2>
           <p className="text-xs text-secondaryText mt-2 relative z-10 mb-6">
             Ultra-low power microcontroller with localized sensor acquisition.
           </p>

           <div className="w-full space-y-3 relative z-10">
             <div className="flex justify-between items-center text-xs p-2 rounded bg-white/5">
               <span className="text-mutedText">Controller</span>
               <span className="text-primaryText font-medium">ESP32 WROOM</span>
             </div>
             <div className="flex justify-between items-center text-xs p-2 rounded bg-white/5">
               <span className="text-mutedText">Radio</span>
               <span className="text-primaryText font-medium">LoRa SX1276</span>
             </div>
             <div className="flex justify-between items-center text-xs p-2 rounded bg-white/5">
               <span className="text-mutedText">Sensors</span>
               <span className="text-primaryText font-medium">IMU + Displacement</span>
             </div>
             <div className="flex justify-between items-center text-xs p-2 rounded bg-white/5">
               <span className="text-mutedText">Power</span>
               <span className="text-primaryText font-medium">LiPo + Solar</span>
             </div>
           </div>
        </GlassPanel>

        {/* Network Status List */}
        <GlassPanel className="p-0 lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-secondaryText uppercase tracking-wider">Active Fleet (Panel A)</h3>
            <button className="text-xs font-semibold px-3 py-1 bg-status-critical/10 text-status-critical rounded">
              SIMULATE FAILURE
            </button>
          </div>
          
          <div className="flex-1 overflow-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-mutedText bg-white/5">
                  <th className="p-4 font-medium">Node ID</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Battery</th>
                  <th className="p-4 font-medium">Signal</th>
                  <th className="p-4 font-medium">Last Seen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[...Array(8)].map((_, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-status-safe" />
                      <span className="text-sm font-medium text-primaryText font-mono">NODE-02{i+1}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-medium text-status-safe">ONLINE</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-secondaryText">
                        <Battery className="w-4 h-4 text-status-safe" />
                        {98 - (i * 3)}%
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-secondaryText">
                        <Wifi className="w-4 h-4" />
                        -{65 + (i * 2)} dBm
                      </div>
                    </td>
                    <td className="p-4 text-xs text-mutedText font-mono">
                      {i === 0 ? 'Just now' : `${i * 2}s ago`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
