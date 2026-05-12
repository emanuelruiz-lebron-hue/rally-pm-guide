import { AbsoluteFill } from "remotion";
import { TOKENS } from "../tokens";
import { TopCaption } from "../components/TopCaption";
import { SceneProps } from "../Composition";
import { SourceVideoClip } from "../components/SourceVideoClip";
import { HighlightRing } from "../components/HighlightRing";
import { Pointer } from "../components/Pointer";

// Replace this with the real SOP beat. The pattern for a recording beat:
// 1. AbsoluteFill with the canvas background
// 2. TopCaption (rise on first beat with this text; staticEntry on continuations)
// 3. SourceVideoClip — trim/crop/zoom the supplied screen recording
// 4. HighlightRing when the reader needs help spotting the control/result
// 5. Pointer only if the source recording's cursor is missing or unclear
//
// For a SceneGroup, see ExampleGroup.tsx.
export const ExampleBeat: React.FC<SceneProps> = ({ beat }) => {
  if (beat.kind !== "single") {
    throw new Error(
      `ExampleBeat is a single-beat component. Got beat.kind="${beat.kind}".`
    );
  }
  return (
    <AbsoluteFill style={{ backgroundColor: TOKENS.bg }}>
      {beat.caption && (
        <TopCaption
          text={beat.caption}
          staticEntry={beat.captionMode === "static"}
        />
      )}
      {beat.video && <SourceVideoClip video={beat.video} />}
      <HighlightRing highlight={beat.highlight} />
      {beat.pointer !== "none" && (
        <Pointer
          fadeInFrame={beat.pointer.fadeInFrame ?? 0}
          fadeOutFrame={beat.pointer.fadeOutFrame ?? beat.durationFrames - 12}
          centerX={beat.pointer.centerX}
          centerY={beat.pointer.centerY}
          waypoints={beat.pointer.waypoints}
        />
      )}
    </AbsoluteFill>
  );
};
