# CASSANDRA — System Architecture

Status: approved high-level direction / detailed subsystem contracts pending  
Date: 2026-11-11  
Repository: Veyn44/CASSANDRA-NEW

This document defines the current agreed game direction and the boundaries of the planned feature branches. It is a design/architecture document, not evidence that the described gameplay is implemented.

## 1. Product identity

Cassandra is a hard-science-fiction space survival, mining, and combat game. The mothership Cassandra is the colony's mobile home and travels between star systems. A shuttle is used only for local asteroid expeditions inside the current planetary system.

Core loop:
1. Travel with Cassandra to a star system.
2. Inspect planets and their orbiting asteroids.
3. Send the shuttle to an asteroid.
4. Explore, prospect, mine, fight threats, and recover resources or rare discoveries.
5. Return to Cassandra.
6. Maintain the ship and crew, process resources, prepare, and travel onward.

Planets are astronomical/map objects; planetary landings are outside the current scope. Shuttle cannot travel between planets or star systems. Inter-system travel belongs to Cassandra and consumes energy and resources.

## 2. World hierarchy and maps

- Galaxy: 16×16 sectors.
- Each sector: 16×16 regions.
- Each region: 16×16 star systems.
- Each star system: 1–8 planets.
- Each planet: 1..X asteroids.
- The hierarchy must be addressable/generatable without loading the whole galaxy at once.
- Initial playable canvas: 128×128.
- Map architecture must allow canvas dimensions to increase or decrease later without rewriting gameplay systems.
- Every expedition uses a separate asteroid map (initially 128×128), distinct from Cassandra's base map.
- One asteroid is one encounter/map, including its nearby debris.
- Rare encounter content may include modules/remains from other ships or stations.
- No underground mining, underground encounter maps, floors, decks, or multi-level transitions. An asteroid encounter is one map.

## 3. Cassandra / colony construction

- Cassandra is a buildable modular colony ship, with a target construction complexity broadly comparable to RimWorld.
- Colony construction, room/section detection, modules, and airtight/environmental boundaries are related but separable responsibilities.
- Sections are detected automatically from their enclosed boundaries.
- Each section has exactly one primary module, defining its primary purpose.
- Secondary modules provide supporting, utility, or decorative functions.
- A section can have at most one control panel. Its panel owns/displays that section's status, atmosphere, temperature, and pressure.
- Airtight integrity is fundamental to section/environment simulation.
- Construction placement style remains undecided: tile-by-tile pieces or larger modular blocks (for example 4×4 blocks with straight, corner, and center pieces). Architecture must not assume one approach prematurely.
- The previous multi-floor ship model is abandoned. Cassandra is a single base map, with no decks/floors.

## 4. Crew and player role

- Crew Pawns live autonomously aboard Cassandra.
- Their everyday behavior should be simple, predictable, and inexpensive to implement; avoid complex AI planning and RimWorld-style job micromanagement.
- The player directly controls only one main Pawn/protagonist.
- Other crew Pawns are autonomous inhabitants and part of the game world, not additional player-controlled/drafted units.
- During expeditions the player controls the protagonist; companions may receive a small set of simple contextual commands, but are not individually drafted as player units.
- The story is centered on the protagonist.

## 5. Expedition mode and time

- Expeditions are real-time top-down gameplay on a separate asteroid map.
- Shared Pawn, item, material, damage, and action models should be reused between colony and expedition contexts where appropriate.
- Cassandra must continue handling its colony simulation/problems while the player is away on an expedition, but the player must not need to watch two screens or manually micromanage both locations.
- Exact simulation speed, strategic-time synchronization, and critical-event handling during expeditions remain open design questions.
- Do not assume that the base fully pauses during an expedition: that older rule is superseded pending a new explicit decision.

## 6. Feature branch plan

All feature branches are created from the same updated `main` baseline. They are independent work areas, not permission to implement every system at once. Before substantial work, each branch needs a detailed contract: ownership, data model, public API, events, dependencies, persistence, and acceptance tests.

| Branch | Responsibility |
|---|---|
| `feature/core-architecture` | Game core, shared state, time, events, persistence contracts, initialization |
| `feature/colony-construction` | Ship construction, structural pieces, section detection, primary/secondary modules, airtight boundaries |
| `feature/pawn-life` | Pawn identity/data, anatomy, health, needs, skills/professions, autonomous life model |
| `feature/colony-automation` | Simple autonomous colony operations and ambient crew behavior |
| `feature/environment-systems` | Atmosphere, pressure, temperature, vacuum, leaks, environmental hazards |
| `feature/ship-systems` | Power, energy economy, ship functions, propulsion and jump requirements |
| `feature/resources-industry` | Materials, resources, inventory, storage, processing, manufacturing |
| `feature/expedition-gameplay` | Real-time top-down expedition loop, protagonist control, companion commands |
| `feature/combat-damage` | Weapons, hit resolution, damage, armor, enemies and combat |
| `feature/mining-exploration` | Surface mining, prospecting, asteroid exploration, encounter loot; no underground systems |
| `feature/galaxy-world` | Galaxy hierarchy and generation of systems, planets, and asteroids |
| `feature/navigation-vehicles` | Cassandra inter-system travel, shuttle local travel, docking and travel costs |

UI and Input are cross-cutting concerns: shared foundations and interfaces belong in `main`; concrete screens and interactions should be developed with the system they serve. The current Action System foundation remains shared infrastructure, but its final integration contracts must be revisited against the new protagonist-only control model.

## 7. Important open decisions

- Exact autonomous crew work/ambient behavior and how it avoids complex AI.
- Companion command vocabulary and limits during expeditions.
- Base simulation speed and strategic-time synchronization while on an expedition.
- How base emergencies are surfaced/resolved while the player is away.
- Exact construction grid/placement approach.
- Primary/secondary module catalog and section ownership rules.
- Section detection and airtight edge/door rules.
- Procedural generation and persistence of asteroid encounters.
- Galaxy generation, planet/asteroid counts, and discovery information.
- Rare derelict ship/station modules and their encounter rules.

## 8. Development rules

1. `main` contains shared foundations, stable data contracts, interfaces, and integration points—not half-finished gameplay implementations.
2. Each feature branch begins from the updated `main` baseline and owns a clearly defined subsystem.
3. Feature branches may progress in parallel only when shared interfaces are agreed.
4. A branch is integrated through review and testing; GitHub writes alone do not constitute runtime verification.
5. Keep `WHATTODO.md` as the active design memory, `WHATWEHAVE.md` as the truthful implemented-state overview, and `WAHTWEDID.md` as the development/design decision history.
