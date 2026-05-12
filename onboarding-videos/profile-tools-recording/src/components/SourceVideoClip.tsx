import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
  useVideoConfig,
} from "remotion";
import { VideoSpec } from "../beats";

type Props = {
  video: VideoSpec;
};

const DEFAULT_TOP_BAND = 210;

export const SourceVideoClip: React.FC<Props> = ({ video }) => {
  const { width: canvasWidth, height: canvasHeight } = useVideoConfig();
  const placement = video.placement ?? {};
  const frame = {
    x: placement.x ?? 80,
    y: placement.y ?? DEFAULT_TOP_BAND,
    width: placement.width ?? canvasWidth - 160,
    height: placement.height ?? canvasHeight - DEFAULT_TOP_BAND - 80,
  };
  const radius = placement.radius ?? 10;
  const fit = video.fit ?? "contain";
  const muted = video.muted ?? true;

  const shellStyle: React.CSSProperties = {
    position: "absolute",
    left: frame.x,
    top: frame.y,
    width: frame.width,
    height: frame.height,
    overflow: "hidden",
    borderRadius: radius,
    backgroundColor: "#ffffff",
    boxShadow:
      placement.shadow === false
        ? undefined
        : "0 18px 48px rgba(15, 23, 42, 0.18)",
  };

  if (video.crop && video.sourceWidth && video.sourceHeight) {
    const scale = Math.max(
      frame.width / video.crop.width,
      frame.height / video.crop.height
    );
    const scaledWidth = video.sourceWidth * scale;
    const scaledHeight = video.sourceHeight * scale;
    const left =
      -video.crop.x * scale + (frame.width - video.crop.width * scale) / 2;
    const top =
      -video.crop.y * scale + (frame.height - video.crop.height * scale) / 2;

    return (
      <div style={shellStyle}>
        <OffthreadVideo
          src={staticFile(video.source)}
          muted={muted}
          startFrom={video.sourceStartFrame ?? 0}
          endAt={video.sourceEndFrame}
          playbackRate={video.playbackRate ?? 1}
          style={{
            position: "absolute",
            left,
            top,
            width: scaledWidth,
            height: scaledHeight,
          }}
        />
      </div>
    );
  }

  return (
    <div style={shellStyle}>
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile(video.source)}
          muted={muted}
          startFrom={video.sourceStartFrame ?? 0}
          endAt={video.sourceEndFrame}
          playbackRate={video.playbackRate ?? 1}
          style={{
            width: "100%",
            height: "100%",
            objectFit: fit,
          }}
        />
      </AbsoluteFill>
    </div>
  );
};
