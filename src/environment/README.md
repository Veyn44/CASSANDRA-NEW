# Environment

World environmental simulation: atmosphere, pressure, temperature, radiation and local environmental hazards.

Rules:
- Environment state belongs to world locations, not to rendering.
- Environmental simulation consumes the shared simulation delta.
- Start with only the variables required by the first playable scenario.
- Do not simulate distant or inactive locations at full detail without a gameplay reason.
