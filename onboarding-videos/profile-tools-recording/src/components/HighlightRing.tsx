import { interpolate, useCurrentFrame } from "remotion";
import { HighlightSpec } from "../beats";
import { TOKENS } from "../tokens";

type Props = {
  highlight?: HighlightSpec;
};

export const HighlightRing: React.FC<Props> = ({ highlight }) => {
  const frame = useCurrentFrame();
  if (!highlight || highlight === "none") return null;

  const fromFrame = highlight.fromFrame ?? 0;
  const toFrame = highlight.toFrame ?? Number.POSITIVE_INFINITY;
  if (frame < fromFrame || frame > toFrame) return null;

  const local = frame - fromFrame;
  const opacity = interpolate(local, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(local, [0, 10], [1.04, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const color = highlight.color ?? TOKENS.green;

  return (
    <div
      style={{
        position: "absolute",
        left: highlight.x,
        top: highlight.y,
        width: highlight.width,
        height: highlight.height,
        borderRadius: 12,
        border: `4px solid ${color}`,
        boxShadow: `0 0 0 6px ${color}22`,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center",
        pointerEvents: "none",
      }}
      aria-label={highlight.label}
    />
  );
};
