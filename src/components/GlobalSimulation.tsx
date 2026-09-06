"use client";

import { useEffect } from "react";
import { useTelemetryStore } from "@/lib/store";

export function GlobalSimulation() {
  const tick = useTelemetryStore((state) => state.tick);

  useEffect(() => {
    // Run the simulation tick every 2 seconds
    const interval = setInterval(() => {
      tick();
    }, 2000);
    
    return () => clearInterval(interval);
  }, [tick]);

  return null; // This is a headless component just to run the loop globally
}
