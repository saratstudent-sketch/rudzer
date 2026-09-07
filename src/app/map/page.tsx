"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Line, useGLTF } from "@react-three/drei";
import { GlassPanel } from "@/components/GlassPanel";
import { useTelemetryStore, SensorNode } from "@/lib/store";
import { useState, Suspense, Component, ReactNode } from "react";

// ─── Error Boundary ───────────────────────────────────────────────
class ModelErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// ─── Procedural Fallback Mine (shown if GLB fails to load) ────────
function ProceduralMine() {
  return (
    <group position={[0, -8, 0]}>
      {/* Outer rim */}
      {[0, 1, 2, 3, 4].map((level) => (
        <mesh key={level} position={[0, -level * 1.5, 0]}>
          <torusGeometry args={[18 - level * 3, 1.2, 8, 40]} />
          <meshStandardMaterial color="#1a1a2e" wireframe={level % 2 === 0} />
        </mesh>
      ))}
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -8, 0]}>
        <circleGeometry args={[6, 32]} />
        <meshStandardMaterial color="#0d0d1a" />
      </mesh>
      {/* Haul road spiral suggestion */}
      {[0, 1, 2].map((i) => (
        <mesh key={`road-${i}`} position={[10 - i * 3, -i * 2.5, 0]} rotation={[0, (i * Math.PI) / 3, 0]}>
          <boxGeometry args={[8, 0.2, 2]} />
          <meshStandardMaterial color="#2a2a4a" />
        </mesh>
      ))}
    </group>
  );
}

// ─── Your Custom GLB Model ─────────────────────────────────────────
function CustomMineModel() {
  const { scene } = useGLTF("/mining_quarry.glb");
  return (
    <primitive
      object={scene}
      scale={[0.15, 0.15, 0.15]}
      position={[0, -8, 0]}
    />
  );
}

// ─── Terrain Grid ──────────────────────────────────────────────────
function Terrain() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.5, 0]}>
      <planeGeometry args={[80, 80, 40, 40]} />
      <meshBasicMaterial color="#0A0A0C" wireframe opacity={0.2} transparent />
    </mesh>
  );
}

// ─── Sensor Node Visual ────────────────────────────────────────────
function NodeVisual({ node, onClick }: { node: SensorNode; onClick: () => void }) {
  let color = "#30D158";
  if (node.riskScore > 30) color = "#FFD60A";
  if (node.riskScore > 70) color = "#FF453A";

  return (
    <group
      position={[node.x, node.y + 0.5, node.z]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {/* Line to ground */}
      <Line
        points={[[0, 0, 0], [0, -8, 0]]}
        color={color}
        opacity={0.15}
        transparent
        lineWidth={1}
      />
      {/* Base box */}
      <mesh>
        <boxGeometry args={[0.5, 0.25, 0.5]} />
        <meshStandardMaterial color="#2a2a3a" />
      </mesh>
      {/* Status sphere */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Pulse ring for high-risk */}
      {node.riskScore > 50 && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.9, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────
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
          <span className="flex items-center gap-1.5 text-xs text-status-safe"><span className="w-2 h-2 rounded-full bg-status-safe inline-block" /> Safe</span>
          <span className="flex items-center gap-1.5 text-xs text-status-warning"><span className="w-2 h-2 rounded-full bg-status-warning inline-block" /> Warning</span>
          <span className="flex items-center gap-1.5 text-xs text-status-critical"><span className="w-2 h-2 rounded-full bg-status-critical inline-block" /> Critical</span>
        </div>
      </div>

      {/* Global risk badge */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className={`px-6 py-2 rounded-full text-sm font-bold tracking-widest border backdrop-blur-md ${
          globalRisk > 70
            ? "bg-status-critical/20 border-status-critical/50 text-status-critical"
            : globalRisk > 30
            ? "bg-status-warning/20 border-status-warning/50 text-status-warning"
            : "bg-status-safe/20 border-status-safe/50 text-status-safe"
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
              <div className="flex justify-between">
                <span className="text-mutedText">Risk Score</span>
                <span className={`font-bold ${
                  selectedNode.riskScore > 70 ? "text-status-critical" :
                  selectedNode.riskScore > 30 ? "text-status-warning" : "text-status-safe"
                }`}>{selectedNode.riskScore.toFixed(1)} / 100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mutedText">Tilt</span>
                <span className="text-primaryText">{selectedNode.tilt.toFixed(3)}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mutedText">Displacement</span>
                <span className="text-primaryText">{selectedNode.displacement.toFixed(2)} mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mutedText">Vibration</span>
                <span className="text-primaryText">{selectedNode.vibration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mutedText">Crack</span>
                <span className="text-primaryText">{selectedNode.crack}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mutedText">Battery</span>
                <span className="text-status-safe">{selectedNode.battery.toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mutedText">Status</span>
                <span className="text-status-safe">{selectedNode.status}</span>
              </div>
            </div>
          </GlassPanel>
        ) : (
          <GlassPanel className="p-4 pointer-events-auto" elevated>
            <p className="text-sm text-secondaryText text-center">
              🖱️ Click any glowing sensor to view its real-time telemetry
            </p>
          </GlassPanel>
        )}

        {/* Sensor list mini */}
        <GlassPanel className="p-4 max-h-64 overflow-y-auto pointer-events-auto" elevated>
          <p className="text-xs font-bold uppercase tracking-wider text-mutedText mb-3">Top Risk Sensors</p>
          <div className="space-y-2">
            {[...nodes]
              .sort((a, b) => b.riskScore - a.riskScore)
              .slice(0, 8)
              .map((node) => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="w-full flex justify-between items-center text-xs hover:bg-white/5 px-2 py-1 rounded"
                >
                  <span className="font-mono text-primaryText">{node.id}</span>
                  <span className={`font-bold ${
                    node.riskScore > 70 ? "text-status-critical" :
                    node.riskScore > 30 ? "text-status-warning" : "text-status-safe"
                  }`}>{node.riskScore.toFixed(1)}</span>
                </button>
              ))}
          </div>
        </GlassPanel>
      </div>

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0 cursor-crosshair">
        <Canvas camera={{ position: [0, 30, 45], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[20, 30, 10]} intensity={1.5} color="#ffffff" />
          <pointLight position={[-10, 20, -10]} intensity={0.5} color="#64D2FF" />

          <Stars radius={120} depth={60} count={4000} factor={3} saturation={0} fade speed={1} />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2 + 0.3}
            minDistance={10}
            maxDistance={100}
          />

          <Terrain />

          {/* GLB model with error boundary + procedural fallback */}
          <ModelErrorBoundary fallback={<ProceduralMine />}>
            <Suspense fallback={<ProceduralMine />}>
              <CustomMineModel />
            </Suspense>
          </ModelErrorBoundary>

          {/* 50 Sensor Nodes */}
          {nodes.map((node) => (
            <NodeVisual
              key={node.id}
              node={node}
              onClick={() => setSelectedNode(node)}
            />
          ))}
        </Canvas>
      </div>
    </div>
  );
}

// Preload the model
useGLTF.preload("/mining_quarry.glb");
