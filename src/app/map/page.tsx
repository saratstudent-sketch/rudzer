"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { GlassPanel } from "@/components/GlassPanel";
import { motion } from "framer-motion";

function Terrain() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[50, 50, 32, 32]} />
      <meshBasicMaterial color="#111214" wireframe />
    </mesh>
  );
}

function SensorNode({ position, color }: { position: [number, number, number], color: string }) {
  return (
    <group position={position}>
      {/* Node Base */}
      <mesh>
        <boxGeometry args={[0.2, 0.4, 0.2]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      {/* Glowing Status */}
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Signal Ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.35, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export default function MapPage() {
  return (
    <div className="h-[calc(100vh-80px)] w-full relative bg-background overflow-hidden">
      {/* Overlay UI */}
      <div className="absolute top-6 left-6 z-10">
        <h1 className="text-3xl font-bold tracking-tight text-primaryText uppercase drop-shadow-md">
          3D Subsidence Map
        </h1>
        <p className="text-secondaryText mt-1 drop-shadow-md">
          Jharia Underground Panel A
        </p>
      </div>

      <div className="absolute top-6 right-6 z-10 w-64 space-y-4">
        <GlassPanel className="p-4" elevated>
          <div className="text-xs font-semibold tracking-wider text-mutedText uppercase mb-3">
            Map Layers
          </div>
          <div className="space-y-2">
            {['Surface Terrain', 'Underground Workings', 'Risk Heatmap', 'Sensor Network'].map(layer => (
              <label key={layer} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/20 bg-white/5 accent-status-info" />
                <span className="text-sm text-secondaryText group-hover:text-primaryText transition-colors">{layer}</span>
              </label>
            ))}
          </div>
        </GlassPanel>
        
        <GlassPanel className="p-4 flex justify-between items-center" elevated>
           <span className="text-sm text-secondaryText">Simulate Failure</span>
           <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-xs font-medium rounded transition-colors">RUN</button>
        </GlassPanel>
      </div>

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 10, 20], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2 - 0.1}
          />
          <Terrain />
          
          {/* Mock Nodes */}
          <SensorNode position={[0, -1.8, 0]} color="#30D158" />
          <SensorNode position={[2, -1.8, 2]} color="#30D158" />
          <SensorNode position={[-2, -1.8, 3]} color="#30D158" />
          <SensorNode position={[4, -1.8, -1]} color="#FFD60A" />
          <SensorNode position={[-3, -1.8, -4]} color="#30D158" />
          <SensorNode position={[1, -1.8, -3]} color="#FF453A" />
        </Canvas>
      </div>
    </div>
  );
}
