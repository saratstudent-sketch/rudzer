"use client";

import dynamic from "next/dynamic";
import { useState, Component, ReactNode } from "react";
import { GlassPanel } from "@/components/GlassPanel";
import { useTelemetryStore, SensorNode } from "@/lib/store";

// ── Outer error boundary (keeps page chrome on ANY 3D failure) ──
class Outer3DErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {
    console.error("/map Outer3DErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-background">
          <div className="text-center space-y-4 max-w-md px-6">
            <div className="text-5xl">⛏️</div>
            <h2 className="text-xl font-bold text-primaryText">3D Engine Unavailable</h2>
            <p className="text-secondaryText text-sm">
              The 3D scene failed to initialize. The sensor dashboard below is
              still fully operational. Please refresh the page to retry.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Dynamically import the 3D scene with SSR disabled ───────────────
const Scene3D = dynamic(() => import("@/components/Scene3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mx-auto" />
        <p className="text-secondaryText text-sm">Loading 3D Mine Model...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const nodes = useTelemetryStore((state) => state.nodes);
  const globalRisk = useTelemetryStore((state) => state.globalRisk);
  const [selectedNode, setSelectedNode] = useState<SensorNode | null>(null);

  return (
    <div className="h-[calc(100vh-80px)] w-full relative bg-background overflow-hidden">

      {/* Top-left overlay */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h1 className="text-3xl font-bold tracking-tight text-primaryText uppercase drop-shadow-md">
          3D Spatial Map
        </h1>
        <p className="text-secondaryText mt-1 drop-shadow-md">
          Jharia Underground Panel A · 50 Sensors Active
        </p>
        <div className="mt-3 flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-status-safe">
            <span className="w-2 h-2 rounded-full bg-status-safe inline-block" /> Safe
          </span>
          <span className="flex items-center gap-1.5 text-xs text-status-warning">
            <span className="w-2 h-2 rounded-full bg-status-warning inline-block" /> Warning
          </span>
          <span className="flex items-center gap-1.5 text-xs text-status-critical">
            <span className="w-2 h-2 rounded-full bg-status-critical inline-block" /> Critical
          </span>
        </div>
      </div>

      {/* Global risk badge */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className={`px-6 py-2 rounded-full text-sm font-bold tracking-widest border backdrop-blur-md ${
          globalRisk > 70
            ? "bg-red-500/20 border-red-500/50 text-red-400"
            : globalRisk > 30
            ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400"
            : "bg-green-500/20 border-green-500/50 text-green-400"
        }`}>
          GLOBAL RISK: {globalRisk.toFixed(1)}
        </div>
      </div>

      {/* Right panel */}
      <div className="absolute top-6 right-6 z-10 w-72 space-y-4">
        {selectedNode ? (
          <GlassPanel className="p-5" elevated>
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
              <h3 className="font-mono text-sm font-bold text-primaryText">{selectedNode.id}</h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-xs font-semibold px-2 py-1 bg-white/10 rounded hover:bg-white/20"
              >
                CLOSE
              </button>
            </div>
            <div className="space-y-3 text-sm">
              {[
                ["Risk Score", `${selectedNode.riskScore.toFixed(1)} / 100`],
                ["Tilt", `${selectedNode.tilt.toFixed(3)}°`],
                ["Displacement", `${selectedNode.displacement.toFixed(2)} mm`],
                ["Vibration", selectedNode.vibration],
                ["Crack", selectedNode.crack],
                ["Battery", `${selectedNode.battery.toFixed(0)}%`],
                ["Status", selectedNode.status],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-mutedText">{label}</span>
                  <span className="text-primaryText font-medium">{value}</span>
                </div>
              ))}
            </div>
          </GlassPanel>
        ) : (
          <GlassPanel className="p-4 pointer-events-auto" elevated>
            <p className="text-sm text-secondaryText text-center">
              🖱️ Click any glowing sensor to view real-time telemetry
            </p>
          </GlassPanel>
        )}

        {/* Top risk sensors */}
        <GlassPanel className="p-4 max-h-64 overflow-y-auto pointer-events-auto" elevated>
          <p className="text-xs font-bold uppercase tracking-wider text-mutedText mb-3">Top Risk Sensors</p>
          <div className="space-y-1">
            {[...nodes]
              .sort((a, b) => b.riskScore - a.riskScore)
              .slice(0, 8)
              .map((node) => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="w-full flex justify-between items-center text-xs hover:bg-white/5 px-2 py-1 rounded transition-colors"
                >
                  <span className="font-mono text-primaryText">{node.id}</span>
                  <span className={`font-bold ${
                    node.riskScore > 70 ? "text-red-400" :
                    node.riskScore > 30 ? "text-yellow-400" : "text-green-400"
                  }`}>{node.riskScore.toFixed(1)}</span>
                </button>
              ))}
          </div>
        </GlassPanel>
      </div>

      {/* 3D Canvas - loaded dynamically, no SSR, outer boundary keeps page chrome on any failure */}
      <div className="absolute inset-0 z-0 cursor-crosshair">
        <Outer3DErrorBoundary>
          <Scene3D
            nodes={nodes}
            onNodeClick={(node) => setSelectedNode(node)}
          />
        </Outer3DErrorBoundary>
      </div>
    </div>
  );
}
