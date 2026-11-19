export type ViewMode = "grid" | "two-per-row" | "one-per-row";

interface ViewControlsProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const OPTIONS: { mode: ViewMode; label: string; icon: string }[] = [
  { mode: "grid", label: "Grid View", icon: "⊞" },
  { mode: "two-per-row", label: "Two Per Row", icon: "⚏" },
  { mode: "one-per-row", label: "One Per Row", icon: "▬" },
];

export default function ViewControls({ viewMode, onChange }: ViewControlsProps) {
  return (
    <div className="view-controls" role="group" aria-label="Layout view mode">
      {OPTIONS.map(({ mode, label, icon }) => (
        <button
          key={mode}
          type="button"
          className={`view-control-btn ${viewMode === mode ? "active" : ""}`}
          onClick={() => onChange(mode)}
          title={label}
          aria-label={label}
          aria-pressed={viewMode === mode}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
