"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Line, Html } from "@react-three/drei";
import { GlassPanel } from "@/components/GlassPanel";
import { useTelemetryStore, SensorNode } from "@/lib/store";
import { useState } from "react";

function Terrain() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
      <planeGeometry args={[60, 60, 64, 64]} />
      <meshBasicMaterial color="#0A0A0C" wireframe opacity={0.3} transparent />
    </mesh>
  );
}

function UndergroundMine() {
  return (
    <group position={[0, -10, 0]}>
      {/* Main Panel Boundary */}
      <mesh>
        <boxGeometry args={[40, 2, 40]} />
        <meshBasicMaterial color="#222" wireframe opacity={0.2} transparent />
      </mesh>
      
      {/* Tunnels (Pillars) representation */}
      {[...Array(5)].map((_, i) => (
        <group key={`tunnel-x-${i}`}>
          <mesh position={[-15 + i * 7.5, 0, 0]}>
            <boxGeometry args={[2, 2, 40]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        </group>
      ))}
      {[...Array(5)].map((_, i) => (
        <group key={`tunnel-z-${i}`}>
          <mesh position={[0, 0, -15 + i * 7.5]}>
            <boxGeometry args={[40, 2, 2]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function NodeVisual({ node, onClick }: { node: SensorNode; onClick: () => void }) {
  // Determine color based on risk
  let color = "#30D158"; // Safe
  if (node.riskScore > 30) color = "#FFD60A"; // Warning
  if (node.riskScore > 70) color = "#FF453A"; // Critical

  return (
    <group 
      position={[node.x, node.y, node.z]} 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {/* Connecting line to underground */}
      <Line 
        points={[[0, 0, 0], [0, -10, 0]]} 
        color={color} 
        opacity={0.2} 
        transparent 
        lineWidth={1}
      />
      
      {/* Node Base */}
      <mesh>
        <boxGeometry args={[0.4, 0.2, 0.4]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Glowing Status sphere */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Pulse ring if high risk */}
      {node.riskScore > 50 && (
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.8, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}

export default function MapPage() {
  const nodes = useTelemetryStore(state => state.nodes);
  const [selectedNode, setSelectedNode] = useState<SensorNode | null>(null);

  return (
    <div className="h-[calc(100vh-80px)] w-full relative bg-background overflow-hidden">
      {/* Overlay UI */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h1 className="text-3xl font-bold tracking-tight text-primaryText uppercase drop-shadow-md">
          3D Subsidence Map
        </h1>
        <p className="text-secondaryText mt-1 drop-shadow-md">
          Jharia Underground Panel A
        </p>
      </div>

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
                  selectedNode.riskScore > 70 ? 'text-status-critical' :
                  selectedNode.riskScore > 30 ? 'text-status-warning' : 'text-status-safe'
                }`}>{selectedNode.riskScore.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mutedText">Displacement</span>
                <span className="text-primaryText">{selectedNode.displacement.toFixed(2)} mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mutedText">Tilt</span>
                <span className="text-primaryText">{selectedNode.tilt.toFixed(3)}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mutedText">Battery</span>
                <span className="text-status-safe">{selectedNode.battery.toFixed(0)}%</span>
              </div>
            </div>
          </GlassPanel>
        ) : (
          <GlassPanel className="p-4 pointer-events-auto" elevated>
            <p className="text-sm text-secondaryText text-center">
              Click any glowing sensor node on the terrain to view its real-time telemetry.
            </p>
          </GlassPanel>
        )}
      </div>

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0 cursor-crosshair">
        <Canvas camera={{ position: [0, 25, 35], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 20, 10]} intensity={1} color="#ffffff" />
          
          <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={1} />
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2 + 0.2}
          />
          
          <Terrain />
          <UndergroundMine />
          
          {nodes.map(node => (
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
