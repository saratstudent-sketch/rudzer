"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, useGLTF } from "@react-three/drei";
import { Suspense, Component, ReactNode } from "react";
import { SensorNode } from "@/lib/store";
import * as THREE from "three";

// ─── Error Boundary ───────────────────────────────────────────────
class ErrorBoundary extends Component<
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

// ─── Procedural Open-Pit Mine (fallback) ──────────────────────────
function ProceduralMine() {
  return (
    <group position={[0, -8, 0]}>
      {[0, 1, 2, 3, 4].map((level) => (
        <mesh key={level} position={[0, -level * 1.5, 0]}>
          <torusGeometry args={[18 - level * 3, 1.2, 8, 64]} />
          <meshStandardMaterial
            color={new THREE.Color().setHSL(0.6, 0.3, 0.08 + level * 0.02)}
            roughness={0.9}
          />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -7.6, 0]}>
        <circleGeometry args={[6, 32]} />
        <meshStandardMaterial color="#0d0d1a" />
      </mesh>
    </group>
  );
}

// ─── Your GLB Model ────────────────────────────────────────────────
function MineModel() {
  const { scene } = useGLTF("/mining_quarry.glb");
  return (
    <primitive
      object={scene}
      scale={[0.12, 0.12, 0.12]}
      position={[0, -6, 0]}
    />
  );
}

// ─── Sensor Node ──────────────────────────────────────────────────
function SensorNodeMesh({
  node,
  onClick,
}: {
  node: SensorNode;
  onClick: () => void;
}) {
  const color =
    node.riskScore > 70 ? "#FF453A" : node.riskScore > 30 ? "#FFD60A" : "#30D158";

  const points: [number, number, number][] = [
    [node.x, node.y + 0.5, node.z],
    [node.x, -7, node.z],
  ];

  return (
    <group onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* Drop line */}
      <line>
        <bufferGeometry
          attach="geometry"
          {...{
            attributes: {
              position: new THREE.BufferAttribute(
                new Float32Array(points.flat()),
                3
              ),
            },
          }}
        />
        <lineBasicMaterial attach="material" color={color} opacity={0.15} transparent />
      </line>

      {/* Base */}
      <mesh position={[node.x, node.y + 0.5, node.z]}>
        <boxGeometry args={[0.5, 0.2, 0.5]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* Status orb */}
      <mesh position={[node.x, node.y + 0.9, node.z]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Pulse ring for high risk */}
      {node.riskScore > 50 && (
        <mesh
          position={[node.x, node.y + 0.52, node.z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.6, 0.8, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.35} />
        </mesh>
      )}
    </group>
  );
}

// ─── Ground Grid ──────────────────────────────────────────────────
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[100, 100, 50, 50]} />
      <meshBasicMaterial color="#0A0A0C" wireframe opacity={0.15} transparent />
    </mesh>
  );
}

// ─── Scene3D Component ────────────────────────────────────────────
export default function Scene3D({
  nodes,
  onNodeClick,
}: {
  nodes: SensorNode[];
  onNodeClick: (node: SensorNode) => void;
}) {
  return (
    <Canvas camera={{ position: [0, 30, 50], fov: 50 }} shadows>
      <ambientLight intensity={0.5} />
      <directionalLight position={[20, 40, 10]} intensity={1.5} castShadow />
      <pointLight position={[-15, 25, -15]} intensity={0.4} color="#4488ff" />

      <Stars radius={120} depth={60} count={4000} factor={3} saturation={0} fade speed={1} />

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        maxPolarAngle={Math.PI / 2 + 0.3}
        minDistance={8}
        maxDistance={120}
      />

      <Ground />

      {/* Your GLB → fallback to procedural if it fails */}
      <ErrorBoundary fallback={<ProceduralMine />}>
        <Suspense fallback={<ProceduralMine />}>
          <MineModel />
        </Suspense>
      </ErrorBoundary>

      {/* 50 Sensor Nodes */}
      {nodes.map((node) => (
        <SensorNodeMesh
          key={node.id}
          node={node}
          onClick={() => onNodeClick(node)}
        />
      ))}
    </Canvas>
  );
}
