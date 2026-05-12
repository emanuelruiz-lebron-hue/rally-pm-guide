import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BeatLike, PointerSpec } from "../beats";
import { Pointer } from "../components/Pointer";
import { TopCaption } from "../components/TopCaption";
import { TOKENS } from "../tokens";

type SceneProps = { beat: BeatLike };

const pink = "#d83aa6";
const pinkSoft = "#fff0f7";
const ink = "#1f2430";
const muted = "#697386";
const line = "#e4e6eb";
const blue = "#1f73f1";
const green = "#058f4f";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const Shell: React.FC<{
  beat: BeatLike;
  children: React.ReactNode;
  pointer?: PointerSpec;
}> = ({ beat, children, pointer }) => {
  const spec = pointer ?? (beat.kind === "single" ? beat.pointer : "none");
  return (
    <AbsoluteFill style={{ background: "linear-gradient(140deg, #fff 0%, #fbf8ff 100%)" }}>
      <TopCaption
        text={beat.kind === "single" ? beat.caption : beat.subBeats[0].caption}
        staticEntry={beat.kind === "single" && beat.captionMode === "static"}
      />
      <div
        style={{
          position: "absolute",
          left: 104,
          right: 104,
          top: 232,
          bottom: 92,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
      {spec !== "none" && (
        <Pointer
          centerX={spec.centerX}
          centerY={spec.centerY}
          fadeInFrame={spec.fadeInFrame ?? 12}
          fadeOutFrame={spec.fadeOutFrame ?? 78}
          waypoints={spec.waypoints}
        />
      )}
    </AbsoluteFill>
  );
};

const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      background: "#fff",
      border: `1px solid ${line}`,
      borderRadius: 16,
      boxShadow: "0 24px 80px rgba(25, 20, 45, 0.10)",
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

const SidebarTop: React.FC<{ menuOpen?: boolean }> = ({ menuOpen = false }) => (
  <div
    style={{
      width: 360,
      height: 530,
      borderRight: `1px solid ${line}`,
      background: "#fff",
      position: "relative",
      fontFamily: TOKENS.fontStack,
    }}
  >
    <div
      style={{
        margin: 18,
        height: 48,
        borderRadius: 10,
        background: menuOpen ? "#f2eef7" : "#fff",
        display: "flex",
        alignItems: "center",
        padding: "0 14px",
        gap: 10,
        color: ink,
        fontSize: 22,
      }}
    >
      <div style={{ width: 34, height: 9, background: "#111", borderRadius: 2 }} />
      <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        Procore Techn...
      </span>
      <span style={{ fontSize: 20 }}>⌄</span>
    </div>
    <div
      style={{
        margin: "14px 18px 30px",
        height: 52,
        borderRadius: 10,
        background: pink,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: 22,
      }}
    >
      + Create a study
    </div>
    <NavItem label="Home" active />
    <NavItem label="Notifications" badge="77" />
    <SectionLabel text="Workspace" />
    {["Dashboards", "Studies", "People", "Budgets", "Forms", "Templates"].map((item) => (
      <NavItem key={item} label={item} />
    ))}
    {menuOpen && (
      <div
        style={{
          position: "absolute",
          left: 18,
          top: 66,
          width: 330,
          padding: "18px 0",
          background: "#fff",
          border: `1px solid ${line}`,
          borderRadius: 16,
          boxShadow: "0 24px 70px rgba(15, 23, 42, 0.18)",
        }}
      >
        <MenuRow icon="⚙" label="Settings" />
        <MenuRow icon="▱" label="Getting started guide" />
        <MenuRow icon="✦" label="Support docs" />
      </div>
    )}
  </div>
);

const MenuRow: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <div
    style={{
      height: 48,
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "0 26px",
      fontSize: 21,
      color: ink,
    }}
  >
    <span style={{ width: 22, textAlign: "center", color: "#111827" }}>{icon}</span>
    <span>{label}</span>
  </div>
);

const SectionLabel: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ padding: "28px 26px 10px", color: "#7a7f8d", fontSize: 17, fontWeight: 650 }}>{text}</div>
);

const NavItem: React.FC<{ label: string; active?: boolean; badge?: string }> = ({ label, active, badge }) => (
  <div
    style={{
      margin: "0 18px 4px",
      padding: "0 16px",
      height: 48,
      borderRadius: 10,
      background: active ? pinkSoft : "transparent",
      color: active ? "#e1288a" : ink,
      display: "flex",
      alignItems: "center",
      gap: 14,
      fontSize: 21,
      fontWeight: active ? 700 : 500,
    }}
  >
    <span style={{ width: 18, height: 18, border: `2px solid ${active ? "#e1288a" : ink}`, borderRadius: 4 }} />
    <span style={{ flex: 1 }}>{label}</span>
    {badge && (
      <span style={{ background: "#ffe1e8", color: "#db2f62", padding: "4px 9px", borderRadius: 8, fontSize: 15 }}>
        {badge}
      </span>
    )}
  </div>
);

const SettingsNav: React.FC<{ active: "Profile" | "Connected accounts" }> = ({ active }) => (
  <div
    style={{
      width: 314,
      background: "#fff",
      borderRight: `1px solid ${line}`,
      padding: "20px 18px",
      fontFamily: TOKENS.fontStack,
      color: ink,
    }}
  >
    <div style={{ fontSize: 24, fontWeight: 750, marginBottom: 38 }}>← Settings</div>
    <div style={{ fontSize: 21, fontWeight: 750, marginBottom: 16 }}>User</div>
    {["Profile", "Connected accounts", "Availability", "Email", "Notifications"].map((item) => (
      <div
        key={item}
        style={{
          height: 50,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          borderRadius: 10,
          marginBottom: 6,
          fontSize: 20,
          color: item === active ? "#e1288a" : ink,
          background: item === active ? pinkSoft : "transparent",
          border: item === active ? `3px solid ${blue}` : "3px solid transparent",
          fontWeight: item === active ? 750 : 500,
        }}
      >
        {item}
      </div>
    ))}
    <div style={{ fontSize: 21, fontWeight: 750, margin: "54px 0 18px" }}>Workspace</div>
    {["Account", "Users", "Teams", "Roles", "Integrations", "Billing"].map((item) => (
      <div key={item} style={{ height: 48, display: "flex", alignItems: "center", padding: "0 16px", fontSize: 20 }}>
        {item}
      </div>
    ))}
  </div>
);

const FormField: React.FC<{ label: string; value: string; width?: number }> = ({ label, value, width = 490 }) => (
  <div style={{ marginBottom: 30 }}>
    <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, color: ink }}>{label}</div>
    <div
      style={{
        width,
        height: 50,
        border: "1.5px solid #c9c9d4",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        padding: "0 14px",
        fontSize: 20,
        color: ink,
        background: "#fff",
      }}
    >
      {value}
    </div>
  </div>
);

const GoogleIcon: React.FC = () => (
  <div
    style={{
      width: 54,
      height: 54,
      borderRadius: "50%",
      background: "conic-gradient(#4285f4 0 25%, #34a853 25% 50%, #fbbc05 50% 75%, #ea4335 75% 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#4285f4",
      fontWeight: 900,
      fontSize: 30,
    }}
  >
    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>G</div>
  </div>
);

const ZoomIcon: React.FC = () => (
  <div
    style={{
      width: 54,
      height: 54,
      borderRadius: "50%",
      background: "#4d8cff",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 25,
      boxShadow: "inset 0 0 0 3px rgba(255,255,255,0.65)",
    }}
  >
    ▬▶
  </div>
);

const StatusPill: React.FC<{ connected?: boolean }> = ({ connected }) => (
  <span
    style={{
      background: connected ? "#dff6e9" : "#f0eef3",
      color: connected ? green : "#5f606a",
      borderRadius: 7,
      padding: "7px 12px",
      fontSize: 17,
      fontWeight: 650,
    }}
  >
    {connected ? "Connected" : "Not connected"}
  </span>
);

const ActionButton: React.FC<{ children: React.ReactNode; muted?: boolean }> = ({ children, muted }) => (
  <button
    style={{
      border: "1px solid #d4d8e2",
      borderRadius: 8,
      height: 44,
      padding: "0 18px",
      background: muted ? "#f6f7f9" : "#fff",
      color: muted ? "#a0a5b2" : "#344054",
      fontFamily: TOKENS.fontStack,
      fontSize: 17,
      fontWeight: 700,
      boxShadow: "0 3px 8px rgba(15, 23, 42, 0.08)",
    }}
  >
    {children}
  </button>
);

const AccountRow: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
  connected?: boolean;
  action: string;
  highlight?: boolean;
  detail?: React.ReactNode;
}> = ({ icon, title, desc, connected, action, highlight, detail }) => {
  const frame = useCurrentFrame();
  const glow = highlight
    ? interpolate(frame, [18, 36, 70], [0, 1, 0.55], { extrapolateRight: "clamp", easing: ease })
    : 0;
  return (
    <div
      style={{
        minHeight: 110,
        display: "grid",
        gridTemplateColumns: "74px 1fr 170px 180px",
        alignItems: "center",
        padding: "20px 20px",
        borderBottom: `1px solid ${line}`,
        position: "relative",
        boxShadow: highlight ? `0 0 0 ${4 * glow}px rgba(216, 58, 166, ${0.16 * glow})` : undefined,
      }}
    >
      {icon}
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: ink, marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 18, color: "#667794", lineHeight: 1.25 }}>{desc}</div>
        {detail}
      </div>
      <div>
        <StatusPill connected={connected} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <ActionButton muted={connected}>{action}</ActionButton>
      </div>
    </div>
  );
};

const AccountsPanel: React.FC<{ googleConnected?: boolean; zoomConnected?: boolean; zoomHighlight?: boolean; googleHighlight?: boolean }> = ({
  googleConnected,
  zoomConnected,
  zoomHighlight,
  googleHighlight,
}) => (
  <Card style={{ width: 980, fontFamily: TOKENS.fontStack }}>
    <div
      style={{
        height: 66,
        display: "grid",
        gridTemplateColumns: "1fr 170px 180px",
        alignItems: "end",
        padding: "0 20px 16px",
        borderBottom: `1px solid ${line}`,
        color: "#747b8f",
        fontSize: 15,
        fontWeight: 800,
        letterSpacing: 1,
        textTransform: "uppercase",
      }}
    >
      <div>Account</div>
      <div>Status</div>
      <div />
    </div>
    <AccountRow
      icon={<GoogleIcon />}
      title="Google"
      desc="Send emails with Gmail and sync interviews with Google Calendar"
      connected={googleConnected}
      action={googleConnected ? "Disconnect" : "Connect Google"}
      highlight={googleHighlight}
      detail={
        googleConnected ? (
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {["Calendar", "Conferencing", "Email Sending"].map((chip) => (
              <span
                key={chip}
                style={{
                  background: "#dff6e9",
                  color: green,
                  padding: "5px 9px",
                  borderRadius: 5,
                  fontSize: 15,
                  fontWeight: 800,
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        ) : null
      }
    />
    <AccountRow
      icon={<ZoomIcon />}
      title="Zoom"
      desc="Automatically create Zoom meetings once an interview is scheduled"
      connected={zoomConnected}
      action={zoomConnected ? "Disconnect" : "Connect Zoom"}
      highlight={zoomHighlight}
    />
  </Card>
);

export const WorkspaceMenuScene: React.FC<SceneProps> = ({ beat }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lift = spring({ frame, fps, config: { damping: 18, stiffness: 95 } });
  return (
    <Shell beat={beat}>
      <Card
        style={{
          width: 980,
          height: 540,
          display: "flex",
          transform: `scale(${interpolate(lift, [0, 1], [0.96, 1])})`,
        }}
      >
        <SidebarTop menuOpen />
        <div
          style={{
            flex: 1,
            background: "linear-gradient(140deg, #fff 0%, #fbf8ff 100%)",
            padding: 44,
            fontFamily: TOKENS.fontStack,
          }}
        >
          <div style={{ height: 74, border: "1px solid #ffdd66", borderRadius: 10, padding: 20 }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: ink }}>Ready to start a study?</span>
          </div>
          <div style={{ marginTop: 76, textAlign: "center", color: ink, fontSize: 34, fontWeight: 850 }}>
            Good morning, Emanuel Ruiz-Lebron!
          </div>
          <div style={{ width: 420, height: 54, border: "1px solid #cbc7d4", borderRadius: 10, margin: "28px auto" }} />
        </div>
      </Card>
    </Shell>
  );
};

export const ProfileScene: React.FC<SceneProps> = ({ beat }) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(frame, [16, 42, 82], [0, 1, 0.65], { extrapolateRight: "clamp", easing: ease });
  return (
    <Shell beat={beat}>
      <Card style={{ width: 990, height: 520, display: "flex", fontFamily: TOKENS.fontStack }}>
        <SettingsNav active="Profile" />
        <div style={{ flex: 1, padding: "58px 78px", background: "#fff" }}>
          <div style={{ color: "#6f7380", fontSize: 20, marginBottom: 36 }}>
            This information impacts how your teammates collaborate with you.
          </div>
          <div
            style={{
              borderRadius: 12,
              padding: 16,
              marginLeft: -16,
              width: 560,
              boxShadow: `0 0 0 ${5 * pulse}px rgba(31, 115, 241, ${0.16 * pulse})`,
            }}
          >
            <FormField label="Name" value="Emanuel Ruiz-Lebron" />
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: ink }}>Profile picture</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: "50%",
                  background: "#eef3ff",
                  color: "#4169e1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 800,
                }}
              >
                ER
              </div>
              <ActionButton>Change profile picture</ActionButton>
            </div>
          </div>
          <div style={{ marginTop: 26 }}>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, color: ink }}>Role</div>
            <span style={{ background: "#efedf2", color: "#66636f", padding: "8px 13px", borderRadius: 7, fontSize: 16 }}>Admin</span>
          </div>
        </div>
      </Card>
    </Shell>
  );
};

export const GoogleScene: React.FC<SceneProps> = ({ beat }) => {
  const frame = useCurrentFrame();
  const connected = frame > 54;
  const fade = interpolate(frame, [48, 68], [0, 1], { extrapolateRight: "clamp", easing: ease });
  return (
    <Shell beat={beat}>
      <div style={{ transform: `translateY(${interpolate(frame, [0, 24], [24, 0], { extrapolateRight: "clamp", easing: ease })}px)` }}>
        <AccountsPanel googleConnected={connected} zoomConnected={false} googleHighlight />
        {connected && (
          <div
            style={{
              position: "absolute",
              left: 650,
              top: 222,
              opacity: fade,
              color: green,
              fontFamily: TOKENS.fontStack,
              fontSize: 22,
              fontWeight: 850,
            }}
          >
            Email and calendar are ready
          </div>
        )}
      </div>
    </Shell>
  );
};

export const ZoomScene: React.FC<SceneProps> = ({ beat }) => {
  const frame = useCurrentFrame();
  const connected = frame > 50;
  const done = interpolate(frame, [52, 78], [0, 1], { extrapolateRight: "clamp", easing: ease });
  return (
    <Shell beat={beat}>
      <div style={{ position: "relative" }}>
        <AccountsPanel googleConnected zoomConnected={connected} zoomHighlight />
        <div
          style={{
            position: "absolute",
            right: 28,
            bottom: -58,
            opacity: done,
            transform: `translateY(${interpolate(done, [0, 1], [16, 0])}px)`,
            color: green,
            fontFamily: TOKENS.fontStack,
            fontSize: 23,
            fontWeight: 850,
          }}
        >
          Outreach tools connected
        </div>
      </div>
    </Shell>
  );
};
