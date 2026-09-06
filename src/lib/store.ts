import { create } from 'zustand';

export type SensorNode = {
  id: string;
  x: number;
  y: number; // Vertical displacement/position
  z: number;
  tilt: number;
  displacement: number;
  vibration: 'NORMAL' | 'ANOMALY';
  crack: 'NONE' | 'DETECTED';
  battery: number;
  status: 'ONLINE' | 'OFFLINE';
  riskScore: number;
};

type Scenario = 'NORMAL' | 'TILT_ANOMALY' | 'SUBSIDENCE_EVENT';

interface TelemetryState {
  nodes: SensorNode[];
  scenario: Scenario;
  globalRisk: number;
  setScenario: (scenario: Scenario) => void;
  tick: () => void;
}

// Generate 50 nodes in a grid pattern roughly over the "mine panel"
const generateInitialNodes = (): SensorNode[] => {
  const nodes: SensorNode[] = [];
  let count = 1;
  for (let x = -20; x <= 20; x += 8) {
    for (let z = -20; z <= 20; z += 8) {
      if (count > 50) break;
      nodes.push({
        id: `NODE-${count.toString().padStart(3, '0')}`,
        x: x + (Math.random() * 2 - 1),
        y: 0,
        z: z + (Math.random() * 2 - 1),
        tilt: Math.random() * 0.2,
        displacement: Math.random() * 2,
        vibration: 'NORMAL',
        crack: 'NONE',
        battery: 100 - Math.random() * 15,
        status: 'ONLINE',
        riskScore: Math.random() * 10
      });
      count++;
    }
  }
  return nodes;
};

export const useTelemetryStore = create<TelemetryState>((set) => ({
  nodes: generateInitialNodes(),
  scenario: 'NORMAL',
  globalRisk: 15,
  setScenario: (scenario) => set({ scenario }),
  tick: () => set((state) => {
    let newGlobalRisk = 0;
    
    const newNodes = state.nodes.map(node => {
      let newTilt = node.tilt;
      let newDisp = node.displacement;
      let newRisk = node.riskScore;

      // Base random fluctuation
      newTilt += (Math.random() * 0.04 - 0.02);
      newDisp += (Math.random() * 0.2 - 0.1);

      if (newTilt < 0) newTilt = 0;
      if (newDisp < 0) newDisp = 0;

      // Scenario Logic
      if (state.scenario === 'TILT_ANOMALY' && node.id === 'NODE-024') {
        newTilt += 0.15;
      }

      if (state.scenario === 'SUBSIDENCE_EVENT') {
        // Create a subsidence bowl in the center (x:0, z:0)
        const dist = Math.sqrt(node.x * node.x + node.z * node.z);
        if (dist < 15) {
          const intensity = (15 - dist) / 15;
          newDisp += 0.8 * intensity;
          newTilt += 0.05 * intensity;
        }
      }

      // Risk calculation for this node
      newRisk = (newTilt * 40) + (newDisp * 5);
      if (newRisk > 100) newRisk = 100;

      newGlobalRisk = Math.max(newGlobalRisk, newRisk);

      return {
        ...node,
        tilt: Number(newTilt.toFixed(3)),
        displacement: Number(newDisp.toFixed(2)),
        riskScore: Number(newRisk.toFixed(1))
      };
    });

    return { 
      nodes: newNodes,
      globalRisk: Number(newGlobalRisk.toFixed(1))
    };
  })
}));
