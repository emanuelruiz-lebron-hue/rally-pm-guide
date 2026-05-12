import { Composition } from "remotion";
import { FeatureVideo } from "./Composition";
import { BEATS } from "./scenes/beats-config";
import { computeTotalDuration } from "./beats";

// Preserve the source Loom recording's native frame for guide-modal clarity.
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="FeatureVideo"
      component={FeatureVideo}
      durationInFrames={computeTotalDuration(BEATS)}
      fps={30}
      width={1920}
      height={1026}
    />
  );
};
