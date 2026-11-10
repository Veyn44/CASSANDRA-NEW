# CASSANDRA-NEW

Browser-first, real-time sci-fi colony and exploration game.

## Technology
- HTML, CSS and modern JavaScript (ES modules)
- HTML5 Canvas for world rendering
- JSDoc for editor-friendly type documentation
- GitHub Pages for browser testing

## Current milestone: movement foundation
- Shared simulation clock with pause and 1× / 2× / 3× speed
- Smooth world-space commander movement
- Grid-based world and obstacles
- Smooth camera follow, middle-mouse panning and wheel zoom
- Separate simulation, input, world, entity, camera and rendering modules

## Architecture rules
- Simulation logic must not depend on rendering or DOM elements.
- UI sends commands; it does not implement game rules.
- World positions are continuous floating-point coordinates.
- Grid coordinates are used for construction, terrain and spatial rules.
- All gameplay systems use the shared simulation delta.
- Keep modules focused and small; do not create placeholder systems before they are needed.

## Controls
- WASD: move commander
- Mouse wheel: zoom
- Middle mouse drag: pan camera
- Space: pause / resume
- Speed buttons: pause, 1×, 2×, 3×
