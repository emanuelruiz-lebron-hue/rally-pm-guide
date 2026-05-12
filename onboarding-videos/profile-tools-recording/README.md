# SOP video scaffold

Remotion project for turning supplied screen recordings into short, readable SOP onboarding clips.

Default output is an MP4 at 1280x960, muted, quality-first. Use the source recording as the visual base; trim, crop, zoom, caption, and highlight it instead of rebuilding UI unless the recording is incomplete or unclear.

## First-time setup

```bash
# 1. Pin actual latest Remotion version.
npm view remotion version
# Edit package.json and replace "latest" with the printed version on all Remotion entries.

# 2. Install
npm install

# 3. Live preview
npm start
```

## Authoring loop

1. Put recordings in `public/recordings/`.
2. Edit `src/scenes/beats-config.ts`.
3. For each SOP step, set `caption`, `durationFrames`, and `video.sourceStartFrame`.
4. Add `crop` + `sourceWidth/sourceHeight` when the clip needs a readable zoom.
5. Add `highlight` only when the reader needs help spotting a control or result.
6. Add `Pointer` only when the original recording cursor is missing or unclear.
7. Render stills around important frames before the final render.

## Render

```bash
npm run render        # preflight + MP4
npm run render:all    # preflight + MP4 + WebM
npm run render:still -- --frame=120
```

## Ship

```bash
SHIP_DEST=/path/to/docs/videos npm run ship
```

## File map

```text
src/
  index.ts                         Remotion entry point
  Root.tsx                         Single FeatureVideo composition
  Composition.tsx                  Renders BEATS as crossfaded sequences
  beats.ts                         Beat, video, highlight, and timing types
  components/
    SourceVideoClip.tsx            Loads and crops source recordings
    HighlightRing.tsx              Optional focus rectangle
    TopCaption.tsx                 Step caption
    Pointer.tsx                    Optional synthetic cursor
    DebugCrosshair.tsx             Authoring-time coordinate verification
  scenes/
    beats-config.ts                Single source of timing/edit truth
    ExampleBeat.tsx                Recording-based beat pattern
public/
  recordings/                      Source videos live here
```
