"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, useGLTF } from "@react-three/drei";
import {
  Component,
  ReactNode,
  useMemo,
  Suspense,
} from "react";
import * as THREE from "three";
import { SensorNode } from "@/lib/store";

// ── Error Boundary ──────────────────────────────────────────────
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
  componentDidCatch(error: any, errorInfo: any) {
    console.error("Scene3D ErrorBoundary caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// ── Procedural Open-Pit Mine ─────────────────────────────────────
function ProceduralMine() {
  const levels = [
    { r: 22, y: 0, color: "#1a1a2e" },
    { r: 17, y: -2, color: "#16213e" },
    { r: 13, y: -4, color: "#0f3460" },
    { r: 9,  y: -6, color: "#1a1a2e" },
    { r: 5,  y: -8, color: "#0d0d1a" },
  ];
  return (
    <group>
      {levels.map((lvl, i) => (
        <mesh key={i} position={[0, lvl.y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[i === levels.length - 1 ? 0 : levels[i + 1]?.r ?? 0, lvl.r, 64]} />
          <meshStandardMaterial color={lvl.color} roughness={0.9} metalness={0.1} />
        </mesh>
      ))}
      {/* Haul roads */}
      {[0, 90, 180, 270].map((angle, i) => (
        <mesh
          key={`road-${i}`}
          position={[
            Math.cos((angle * Math.PI) / 180) * 13,
            -4,
            Math.sin((angle * Math.PI) / 180) * 13,
          ]}
          rotation={[0, (angle * Math.PI) / 180, 0]}
        >
          <boxGeometry args={[10, 0.1, 2]} />
          <meshStandardMaterial color="#2a2a4a" />
        </mesh>
      ))}
    </group>
  );
}

// ── GLB Model loader (uses drei useGLTF, deep-clones for StrictMode) ──
function MineGLBInner() {
  const { scene } = useGLTF("/mining_quarry.glb");

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child: any) => {
      if (child.isMesh) {
        if (child.geometry) child.geometry = child.geometry.clone();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material = child.material.map((m: THREE.Material) =>
              m.clone()
            );
          } else {
            child.material = child.material.clone();
          }
        }
      }
    });
    return clone;
  }, [scene]);

  return (
    <primitive
      object={clonedScene}
      scale={0.1}
      position={[0, -4, 0]}
      dispose={null}
    />
  );
}

// ── GLB Model (hardened: local ErrorBoundary + Suspense wrapper, never leaks) ──
function MineGLB() {
  return (
    <ErrorBoundary fallback={<ProceduralMine />}>
      <Suspense fallback={<ProceduralMine />}>
        <MineGLBInner />
      </Suspense>
    </ErrorBoundary>
  );
}

// ── Single Sensor Node ───────────────────────────────────────────
function SensorNode3D({
  node,
  onClick,
}: {
  node: SensorNode;
  onClick: () => void;
}) {
  const color =
    node.riskScore > 70
      ? "#FF453A"
      : node.riskScore > 30
      ? "#FFD60A"
      : "#30D158";

  return (
    <group
      position={[node.x, 0.8, node.z]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Sensor base */}
      <mesh>
        <boxGeometry args={[0.5, 0.2, 0.5]} />
        <meshStandardMaterial color="#1e1e2e" roughness={0.8} />
      </mesh>

      {/* Status orb */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Risk ring */}
      {node.riskScore > 40 && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.7, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} side={2} />
        </mesh>
      )}
    </group>
  );
}

// ── Ground plane ─────────────────────────────────────────────────
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[120, 120, 60, 60]} />
      <meshBasicMaterial color="#080810" wireframe opacity={0.12} transparent />
    </mesh>
  );
}

// ── Scene content (inside Canvas) ────────────────────────────────
function SceneContent({
  nodes,
  onNodeClick,
}: {
  nodes: SensorNode[];
  onNodeClick: (node: SensorNode) => void;
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[25, 50, 15]} intensity={1.8} castShadow />
      <pointLight position={[-20, 30, -20]} intensity={0.5} color="#4488ff" />
      <pointLight position={[20, 15, 20]} intensity={0.3} color="#ff8844" />

      {/* Environment */}
      <Stars
        radius={120}
        depth={50}
        count={5000}
        factor={3}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Controls */}
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        maxPolarAngle={Math.PI / 2 + 0.25}
        minDistance={10}
        maxDistance={130}
        autoRotate={false}
      />

      {/* Ground */}
      <Ground />

      {/* Mine: try real GLB, fallback to procedural (handled inside MineGLB wrapper) */}
      <MineGLB />

      {/* 50 Sensor Nodes */}
      {nodes.map((node) => (
        <SensorNode3D
          key={node.id}
          node={node}
          onClick={() => onNodeClick(node)}
        />
      ))}
    </>
  );
}

// ── Fallback scene (no GLB, no fancy drei, minimal deps) ─────────
function FallbackScene({
  nodes,
  onNodeClick,
}: {
  nodes: SensorNode[];
  onNodeClick: (node: SensorNode) => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 35, 55], fov: 48 }}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[25, 50, 15]} intensity={1.8} />
      <pointLight position={[-20, 30, -20]} intensity={0.5} color="#4488ff" />
      <Ground />
      <ProceduralMine />
      {nodes.map((node) => (
        <SensorNode3D
          key={node.id}
          node={node}
          onClick={() => onNodeClick(node)}
        />
      ))}
    </Canvas>
  );
}

// ── Main Scene (outer error boundary) ────────────────────────────
export default function Scene3D({
  nodes,
  onNodeClick,
}: {
  nodes: SensorNode[];
  onNodeClick: (node: SensorNode) => void;
}) {
  return (
    <ErrorBoundary
      fallback={<FallbackScene nodes={nodes} onNodeClick={onNodeClick} />}
    >
      <Canvas
        camera={{ position: [0, 35, 55], fov: 48 }}
        gl={{ antialias: true }}
      >
        <SceneContent nodes={nodes} onNodeClick={onNodeClick} />
      </Canvas>
    </ErrorBoundary>
  );
}
