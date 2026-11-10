# CASSANDRA-NEW architecture

## Core principles

1. Simulation is authoritative; rendering and UI are clients of game state.
2. Systems communicate through explicit functions/events, not by reaching into each other's internals.
3. All time-dependent gameplay receives the shared scaled simulation delta.
4. World positions use continuous coordinates; grid coordinates are used for tile-based rules.
5. Entities have identity and state; presentation assets are resolved separately by asset ID.
6. Save data stores persistent state, not transient rendering details.
7. Build one useful vertical slice at a time. A folder does not imply that its system is already implemented.

## System boundaries

- core: lifecycle, clock, game state and event coordination
- world: local maps, locations and world generation
- environment: atmosphere and physical conditions
- entities: pawns, vehicles, structures and items
- ai: autonomous decision-making
- needs: pawn demands
- modules: facilities that provide services
- resources: resource definitions, storage and transfers
- construction: placement and construction workflow
- navigation: movement and pathfinding
- player: direct player control and input mapping
- interaction: selecting, inspecting and commanding world objects
- camera: camera state and movement
- rendering: canvas drawing and visual effects
- assets: asset manifest and loading
- ui: HUD, panels and menus
- save: persistence and version migrations
- devtools: development-only diagnostics and test controls
- audio: sound and ambient presentation

## Art pipeline

- Use transparent PNG for individual sprites and sprite sheets for animations.
- Keep source pixel art at native resolution and use integer scaling where possible.
- Use stable asset IDs in game data; never store image file paths in pawn/module state.
- The asset manifest maps IDs to source files, type and fallback.
- Use temporary procedural shapes until a real asset is available.
- Art replacement must not require changes to simulation logic.

## First playable milestones

1. Movement, camera, pause and local map.
2. Selectable commander and basic world interaction.
3. Pawn entity model and autonomous needs.
4. Module service interfaces and first working habitat/life-support loop.
5. Construction and resource loop.
6. Shuttle movement and local exploration.
7. Save/load and deterministic world persistence.
