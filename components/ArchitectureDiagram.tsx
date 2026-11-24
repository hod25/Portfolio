// Generic, public-safe view of the home lab: no IPs, hostnames or ports.
// Colours come from CSS variables so it follows the light/dark theme.

const VMS = ["Home Assistant", "TrueNAS + Immich"];
const LXCS = ["Docker stack", "Jellyfin", "Pi-hole DNS", "Cloudflared", "Media"];

export default function ArchitectureDiagram() {
  return (
    <figure className="arch">
      <svg
        viewBox="0 0 720 360"
        role="img"
        aria-labelledby="arch-title arch-desc"
        className="arch-svg"
      >
        <title id="arch-title">Home lab architecture</title>
        <desc id="arch-desc">
          Users reach the Proxmox host through Cloudflare Tunnel and Twingate. The host runs two
          virtual machines and five containers. Backups go to Google Drive and configuration to GitHub.
        </desc>

        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" className="arch-arrowhead" />
          </marker>
        </defs>

        {/* Inbound access */}
        <g>
          <rect x="16" y="64" width="150" height="56" rx="10" className="arch-node arch-edge" />
          <text x="91" y="88" className="arch-label">Cloudflare Tunnel</text>
          <text x="91" y="106" className="arch-sub">public apps</text>

          <rect x="16" y="150" width="150" height="56" rx="10" className="arch-node arch-edge" />
          <text x="91" y="174" className="arch-label">Twingate ZTNA</text>
          <text x="91" y="192" className="arch-sub">admin access</text>

          <rect x="16" y="236" width="150" height="56" rx="10" className="arch-node arch-edge" />
          <text x="91" y="260" className="arch-label">Users</text>
          <text x="91" y="278" className="arch-sub">phones · TVs · PCs</text>
        </g>

        <path d="M166 92 H214" className="arch-line" markerEnd="url(#arrow)" />
        <path d="M166 178 H214" className="arch-line" markerEnd="url(#arrow)" />
        <path d="M91 236 V206" className="arch-line arch-dashed" markerEnd="url(#arrow)" />

        {/* Proxmox host */}
        <rect x="218" y="24" width="300" height="312" rx="14" className="arch-host" />
        <text x="368" y="50" className="arch-label arch-host-label">Proxmox VE host</text>

        <text x="236" y="78" className="arch-group">VIRTUAL MACHINES</text>
        {VMS.map((name, i) => (
          <g key={name}>
            <rect x={236 + i * 140} y="86" width="128" height="40" rx="8" className="arch-node arch-vm" />
            <text x={300 + i * 140} y="111" className="arch-chip">{name}</text>
          </g>
        ))}

        <text x="236" y="152" className="arch-group">LXC CONTAINERS</text>
        {LXCS.map((name, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          return (
            <g key={name}>
              <rect x={236 + col * 140} y={160 + row * 48} width="128" height="38" rx="8" className="arch-node" />
              <text x={300 + col * 140} y={184 + row * 48} className="arch-chip">{name}</text>
            </g>
          );
        })}

        <rect x="376" y="256" width="128" height="38" rx="8" className="arch-node arch-store" />
        <text x="440" y="280" className="arch-chip">ZFS mirror 2×4TB</text>

        {/* Outbound */}
        <path d="M518 110 H566" className="arch-line" markerEnd="url(#arrow)" />
        <path d="M518 250 H566" className="arch-line" markerEnd="url(#arrow)" />

        <g>
          <rect x="570" y="72" width="134" height="76" rx="10" className="arch-node arch-edge" />
          <text x="637" y="100" className="arch-label">Google Drive</text>
          <text x="637" y="118" className="arch-sub">5 sync jobs</text>
          <text x="637" y="134" className="arch-sub">rclone crypt</text>

          <rect x="570" y="212" width="134" height="76" rx="10" className="arch-node arch-edge" />
          <text x="637" y="240" className="arch-label">GitHub</text>
          <text x="637" y="258" className="arch-sub">config as code</text>
          <text x="637" y="274" className="arch-sub">age-encrypted</text>
        </g>
      </svg>
      <figcaption className="arch-caption">
        Simplified architecture. Internal addresses and hostnames are intentionally left out.
      </figcaption>
    </figure>
  );
}
