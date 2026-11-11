# CASSANDRA — Development Rules

> This file is the shared working agreement for the CASSANDRA repository.
> Keep it current as new rules and decisions emerge. A new development window
> should read this file before making repository changes.

## 1. Branch roles

- `main` is the stable, authoritative branch. It contains only work that has
  been deliberately approved for the real game.
- `feature/<name>` branches are the original, independent workspaces for
  individual systems or features.
- `integration/gameplay-test` is a disposable integration workspace used to
  combine selected in-progress feature branches and verify that they work
  together.
- Never develop experimental feature work directly on `main`.

## 2. Preserve original feature branches

- To test a feature with other systems, merge its feature branch into
  `integration/gameplay-test`. Do not move, rename, overwrite, or delete the
  source feature branch as part of this process.
- The source feature branch must remain available as the original workstream
  and recovery point.
- Integration changes, conflict resolutions, and test-only fixes belong to
  the integration branch unless a deliberate change is also made to the
  source feature branch.
- If an integration attempt becomes unusable, the integration branch may be
  reset/recreated from the agreed base and the required feature branches
  merged again. Preserve all source feature branches.
- Do not merge the integration branch wholesale into `main`. Select and
  approve the completed feature work that should enter `main`.

## 3. Integration workflow

1. Confirm the current branch and inspect the latest state of `main`, the
   source feature branches, and the integration branch.
2. Choose explicitly which feature branches are needed for the test.
3. Merge those branches into `integration/gameplay-test`, one at a time.
4. Resolve conflicts in the integration branch while respecting each
   subsystem's ownership and architecture contracts.
5. Test the combined behavior and record what was actually verified.
6. Feed necessary improvements back into the appropriate source feature
   branches deliberately; do not assume integration-only fixes are present
   in their originals.
7. Only after review and approval, bring the intended finished work into
   `main` through a controlled merge or selected commits.

A feature branch contains the state of `main` from when it was created, plus
its own changes. Later changes to `main` do not appear automatically in that
feature branch. Update it deliberately by merging or rebasing from `main`
when appropriate, after checking for conflicts.

Likewise, new commits added to a feature branch do not automatically appear
in the integration branch. Merge the updated feature branch into integration
again when a new combined test is needed.

## 4. Protecting main

- Treat `main` as the stable baseline and do not use it as a scratchpad.
- Never force-push or reset `main` as a routine way to fix integration work.
- Do not put unfinished, unreviewed, or integration-only code into `main`.
- Before any write to `main`, inspect the exact diff and confirm that the
  change is intended for the stable game.
- A successful GitHub commit or merge is not proof that the game runs.

## 5. Architecture and scope

- Follow `SYSTEM_ARCHITECTURE.md` for approved high-level architecture and
  subsystem boundaries.
- Use `WHATTODO.md` for planned work and open design questions. It is design
  memory, not a development diary.
- Use `WHATWEHAVE.md` to describe the currently implemented game and
  features.
- Use `WAHTWEDID.md` as the chronological implementation/change history.
- Do not silently reverse an approved design decision. Raise the conflict
  and agree on the change before implementation.
- Keep systems modular and define their data contracts, responsibilities,
  events, and integration points before large implementations.
- Prefer small, coherent, testable increments over broad unverified rewrites.

## 6. Documentation discipline

- Read the current version of a document before editing it. Preserve relevant
  existing content; do not replace a document with a partial rewrite.
- After implementation, update `WAHTWEDID.md` with the change, reason,
  scope, commit reference, and verification status.
- Update `WHATWEHAVE.md` when the actual implemented feature set changes.
- Update `WHATTODO.md` only when plans, decisions, or open tasks change.
- Add newly agreed development rules to this `RULES.md` so future work
  windows follow the same process.
- Keep this file focused on durable rules and workflow, not a duplicate
  commit-by-commit diary.

## 7. Testing and reporting

- Distinguish clearly between code inspection, static checks, automated
  tests, and an actual runtime/browser test.
- Never claim that the game was launched, played, or runtime-tested unless
  that test was actually performed.
- Record what was tested, where it was tested, and what remains unverified.
- Integration success means the selected branches have been combined; it
  does not by itself mean their gameplay systems work correctly.

## 8. Current integration branch

- Integration branch: `integration/gameplay-test`
- Its initial base is the `main` state from which it was created.
- The original feature branches remain independent and are not consumed by
  integration.
- No feature branch is automatically included. Each integration test must
  explicitly select and merge the branches it needs.

## 9. Adding and changing rules

When a new durable rule or workflow decision is agreed during development:

1. State the rule clearly and resolve any ambiguity with the user.
2. Add it to the appropriate section of this file, or create a new section
   if necessary.
3. Preserve existing rules unless the new decision explicitly supersedes
   them.
4. If a rule changes an earlier one, mark the old rule as superseded or
   revise it so future sessions do not follow contradictory instructions.
5. Commit the update to the branch designated for shared development rules.
