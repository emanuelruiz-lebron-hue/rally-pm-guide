import { BeatLike } from "../beats";
import {
  GoogleScene,
  ProfileScene,
  WorkspaceMenuScene,
  ZoomScene,
} from "./ProfileToolsScenes";

// Replace these with real beats for your feature.
//
// Two kinds of entries are supported:
//
// 1. SingleBeat (kind: "single") — one Sequence, one component, one caption.
//    Use when the visual changes substantially between beats (e.g. toolbar
//    view → modal view → result view).
//
// 2. SceneGroup (kind: "group") — one Sequence wrapping a UI that persists
//    across multiple captioned moments. The group's component reads the
//    local frame and decides what state to render. Captions tick per
//    subBeat. Use when the SAME UI is on screen across multiple cuts and
//    only its internal state changes (e.g. a modal that opens empty → gets
//    typed into → submits — the modal itself never unmounts).
//
// Total duration is computed in Root.tsx via computeTotalDuration(BEATS).

export const BEATS: BeatLike[] = [
  {
    kind: "single",
    id: "workspace-menu",
    durationFrames: 96,
    caption: "Open workspace settings",
    captionMode: "rise",
    pointer: {
      centerX: 284,
      centerY: 450,
      fadeInFrame: 12,
      fadeOutFrame: 84,
      waypoints: [{ x: 252, y: 391, arriveFrame: 42, click: true }],
    },
  },
  {
    kind: "single",
    id: "profile",
    durationFrames: 96,
    caption: "Complete your profile",
    captionMode: "rise",
    pointer: "none",
  },
  {
    kind: "single",
    id: "google",
    durationFrames: 108,
    caption: "Connect Google calendar",
    captionMode: "rise",
    pointer: {
      centerX: 640,
      centerY: 590,
      fadeInFrame: 14,
      fadeOutFrame: 92,
      waypoints: [{ x: 1022, y: 523, arriveFrame: 46, click: true }],
    },
  },
  {
    kind: "single",
    id: "zoom",
    durationFrames: 108,
    caption: "Add Zoom for live calls",
    captionMode: "rise",
    pointer: {
      centerX: 640,
      centerY: 590,
      fadeInFrame: 14,
      fadeOutFrame: 92,
      waypoints: [{ x: 1022, y: 644, arriveFrame: 44, click: true }],
    },
  },
  // Example of a SceneGroup (commented out — uncomment + register a
  // component to use):
  //
  // {
  //   kind: "group",
  //   id: "modal-flow",
  //   durationFrames: 240,
  //   subBeats: [
  //     { fromFrame: 0,   caption: "Open the form",         captionMode: "rise",   pointer: "none" },
  //     { fromFrame: 80,  caption: "Set priority and date", captionMode: "rise",   pointer: "none" },
  //     { fromFrame: 180, caption: "Submit",                captionMode: "static", pointer: "none" },
  //   ],
  // },
];

// Map beat ids to their scene component. For a SceneGroup, the component
// receives subBeats[] via the BeatLike object so it can branch on local
// frame.
//
// Adding a beat or group requires:
//   1. a new entry in BEATS above
//   2. a new component file in src/scenes/
//   3. a new entry here mapping id -> component
export const BEAT_COMPONENTS: Record<string, React.FC> = {
  "workspace-menu": WorkspaceMenuScene,
  profile: ProfileScene,
  google: GoogleScene,
  zoom: ZoomScene,
};
