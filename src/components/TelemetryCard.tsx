import { LucideIcon } from "lucide-react";
import { GlassPanel } from "./GlassPanel";

interface TelemetryCardProps {
  title: string;
  value: string | React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  statusColor?: string;
  subtitle?: string;
}

export function TelemetryCard({
  title,
  value,
  trend,
  trendUp,
  icon: Icon,
  statusColor = "text-primaryText",
  subtitle
}: TelemetryCardProps) {
  return (
    <GlassPanel className="p-5 flex flex-col justify-between min-h-[140px] relative overflow-hidden group hover:border-white/20">
      <div className="flex items-start justify-between">
        <div className="text-xs font-semibold tracking-wider text-secondaryText uppercase">
          {title}
        </div>
        <Icon className="w-5 h-5 text-mutedText group-hover:text-secondaryText transition-colors" />
      </div>
      
      <div className="mt-4">
        <div className={`text-3xl md:text-4xl font-bold tracking-tight ${statusColor}`}>
          {value}
        </div>
        
        {subtitle && (
          <div className="text-sm text-secondaryText mt-1">
            {subtitle}
          </div>
        )}

        {trend && (
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                trendUp === true
                  ? "bg-status-critical/10 text-status-critical"
                  : trendUp === false
                  ? "bg-status-safe/10 text-status-safe"
                  : "bg-white/5 text-secondaryText"
              }`}
            >
              {trend}
            </span>
            <span className="text-xs text-mutedText">vs previous hour</span>
          </div>
        )}
      </div>

      {/* Subtle background glow based on status */}
      {statusColor !== "text-primaryText" && (
        <div
          className={`absolute -bottom-10 -right-10 w-32 h-32 blur-3xl opacity-10 rounded-full ${statusColor.replace('text-', 'bg-')}`}
        />
      )}
    </GlassPanel>
  );
}
