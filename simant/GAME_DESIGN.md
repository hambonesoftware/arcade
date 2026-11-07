# COLONY: Backyard Dominion
**Game Design Blueprint — v1.0 (November 2026)**

This is the intended end-state design for Hambone Arcade's playable `/simant/` game. It is a roadmap and gameplay contract, **not a claim that all systems are already implemented**.

## One-sentence pitch

**Start with one queen, build a living colony beneath an ordinary backyard, command workers and soldiers through smart pheromone orders, and survive predators, rival ants, weather, and humans long enough to establish a thriving ant civilization.**

Genre: approachable ant-colony RTS and colony-management game with light survival and a persistent territorial campaign.

Target: iPhone and iPad first, desktop fully supported; touch-friendly with deeper selection controls on desktop. Fast-to-learn, strategically meaningful sessions of roughly 10–20 minutes per scenario, with persistent campaign progress.

Identity: A real connected subterranean colony, not just an ant-themed surface game. Surface and nest are two cameras into the **same simulation**. The player controls a colony, not only a scout.

Influences, not content to copy: *SimAnt* (1991), the ant-colony RTS genre, and *Empires of the Undergrowth*. Use original mechanics combinations, artwork, audio and interface.

## Design pillars

1. **The living colony is the hero:** Each ant has a job, state, location, carrying load and relationship to a queen and nest. Eggs mature into real units.
2. **Two layers, one world:** A forager returning to the entrance appears underground, carries food to the granary, then returns to the surface. Attackers enter tunnels and can threaten the actual queen.
3. **Command rather than micromanage:** Workers forage, carry brood and dig on their own if given priorities; the player sets pheromone goals, group behavior, tunnel plans, and army composition.
4. **Every upgrade changes what you see:** A nursery extension is physically excavated, a storage extension accumulates seed piles, and a defensive gate becomes a narrow tunnel with soldiers holding position.
5. **Visible stakes and readable outcomes:** Every mission has one primary objective, one optional opportunity, a clear reason for urgency, and a definitive success or failure event.
6. **Designed for touch:** Large command areas; pinch and pan; context-driven actions; little overlay chrome over the battlefield; no tiny desktop-inspired grid of buttons.

## Game structure

### Campaign: nine yard patches plus final property-edge scenario

Use the existing 3×3 backyard map, but give each tile a unique tactical personality. Tiles have resources, terrain, weather exposure, enemy strength, and connected entrances. Owning a tile can establish outposts and shorten supply lines; newly captured colonies can be linked by trails or breeder expansion. The queen and core colony persist across campaign missions.

| Phase | Experience | Main objective | New mechanical lesson |
| --- | --- | --- | --- |
| 1. Founding | A queen settles below a flowerbed | Establish food stores and hatch the first brood | Forage, incubate, basic tunnel excavation |
| 2. First Burrow | The nest is too small | Excavate a functional nursery and granary | Dig orders, workers physically building |
| 3. The Border | Red scouts encroach on local food | Hold a forage site and fend off a probing raid | Squad selection, pheromone defense, soldier production |
| 4. Spider Season | Predators target exposed supply lines | Protect the queen and deliver food despite predators | Escort, retreat and alternate routes |
| 5. The Red Mound | Rival colony threatens the entrance | Destroy a forward red outpost and seize the patch | Multi-squad tactics, siege, worker/soldier balance |
| 6. Rain and Flood | Storms flood low tunnels and erase trails | Relocate brood and reopen a safe access route | Emergency worker priorities and flood protection |
| 7. The Long March | Food lies far from the core nest | Secure a chain of two connected patches | Supply lines, secondary depots, outposts |
| 8. The Last Colony | Organized rival army attacks | Repel a major assault and disable red brood production | Sustained defense, reserves and counterattacks |
| 9. Backyard Dominion | Control the backyard and adjacent property edge | Hold essential territories while the last rivals collapse | Full combined-arms colony management |
| Final. The House Edge | Optional extended challenge after yard victory | Sustain three mature connected colonies while hazards escalate | Long-term colony resilience and victory epilogue |

Not all tiles should be "kill the red queen." Most should be won by territory control, resource delivery, defensive survival, or destroying a rival outpost. Defeat enemy queens only when it is narratively meaningful.

### Recommended MVP scenario: "First Light"

The player's first complete 10–15-minute playable level should be a vertical slice of all major mechanics, not nine unfinished levels.

**Start state:** 1 queen underground, 4 workers, one small starter tunnel and chamber, 25 stored food, a nearby seed pile, one distant rich resource, and a red scouting route. The scout is an optional unit, not the entire game.

Sequential primary objectives:
1. **Feed the first brood:** Deliver 45 total food to the nest. Reward: 2 free worker eggs and unlock the dig tool.
2. **Room to grow:** Excavate at least 6 connected soil cells and complete one nursery chamber. Reward: +8 brood capacity and unlock soldier production.
3. **The border is contested:** Establish a pheromone gathering zone at the large seed cache and produce 3 soldiers. Reward: reveal the red scout route.
4. **Defend the queen:** Survive a clearly telegraphed red raid. Reward: unlock a fortification or reserve bonus.
5. **Secure the patch:** Destroy the red forward outpost or route the enemy into a retreat, then hold the site for 30 seconds. Reward: first tile claimed, victory screen, campaign map opened.

A **secondary objective** ("save 80% of workers during the raid") gives a one-time food or brood boost. Optional tasks never obscure the main objective.

**Failure:** Queen dies. Soft-lock recovery: if the colony has no workers and no food but the queen is alive, grant one emergency worker after a recovery interval, with clear UI explanation. Failed missions may be retried without wiping the larger campaign.

## Continuous gameplay loop

1. **Scout** where food, threats, and frontier openings are.
2. **Direct** workers using a gather flag, path, or nest priority—not one click per ant.
3. **Transport and store** real food back to a physical granary.
4. **Excavate and build** connected underground corridors and specialized rooms.
5. **Raise and assign** new workers, scouts and soldiers; protect brood.
6. **Defend and attack** with selected squads, rally points, retreats and garrisons.
7. **Conquer and connect** territory so larger food sources and new hazards become available.
8. Repeat with a stronger but more complex colony.

Every loop creates a strategic choice: food invested in workers accelerates growth but delays defenses; soldiers protect harvesters but consume food and capacity; a large nest is efficient but harder to defend; expansion pays off only if supply lanes remain open.

## Surface mechanics

- Distinct resource nodes: common seeds (safe), insect carcasses (more food but contested), nectar/sugar (temporary boost), rare rich caches (guarded).
- Food must actually be carried by workers. Carrying slows the ant; escorting is useful. Pheromone trails can be damaged by rain or enemy interference.
- Players select individuals or squads; issue **Gather**, **Move**, **Attack**, **Defend**, **Escort**, **Retreat** via a contextual bar. AI handles target acquisition and pathfinding.
- Workers avoid danger unless defending; soldiers engage enemies near a held target; scouts run faster and reveal threats.
- Terrain affects routes and cover. Natural hazards: spiders, beetles, rain, footprints and garden work, introduced gradually and with warnings.
- Red colony AI uses the same food and brood logic at a simplified strategic level. It scouts, raids, retreats and defends its supply routes.

## Underground mechanics

- The underground view is a **playable 2D cutaway** with connected excavatable soil cells or brush-based tunnels, not a static decorative screenshot.
- Underground and surface share one ant entity pool. Crossing the entrance changes an ant's region; no duplicated creatures.
- Workers execute prioritized jobs: emergency brood rescue > imminent queen defense > carrying critical food > digging/building > routine maintenance.
- Players select dig strokes/cells, then place chamber footprints on excavated connected ground. Workers physically clear soil and deliver material.
- Rooms:
  - **Royal chamber:** Queen, initial eggs, last line of defense.
  - **Nursery:** Brood capacity and incubation throughput; actual eggs and larvae.
  - **Granary:** Physical food storage capacity and stockpile visibility.
  - **Soldier gallery:** Rally reserve and defensive readiness.
  - **Barricaded entrance:** Costed choke point, reduces direct queen exposure.
  - **Refuse chamber:** Functional future extension for sanitation / disease, not mandatory MVP.
- Flow matters: long, thin access tunnels become bottlenecks; multiple routes distribute foragers but invite intruders. Layout is a meaningful strategic problem.
- Cameras remain independent, but the time and simulation do **not** pause when switching views.

## Economy and progression

Use few readable resources:
- **Food:** Universal spend and maintenance. Workers gather it; granaries cap storage.
- **Brood slots:** Population capacity built from nursery space.
- **Territory influence:** Earned by holding surface sites; drives patch ownership, not a second currency.
- **Queen health:** Survival objective; clear alerts and emergency defenses.

Soldiers have a higher food and brood cost than workers. Bigger ants consume more upkeep; no endless exponential snowball. Food collection and reproduction are physical processes, with observable hatch timers.

**No tech tree in MVP.** Give players physical colony upgrades (nursery, granary, entrance) with immediate feedback and a clear cost. Add brood caste specialization and advanced species only after the first mission works.

## Goals, feedback, reward

HUD always answers four questions: What do I need to do? What am I short on? What is threatened? What happens if I act?

The main objective stays pinned as one compact two-line instruction, e.g. **"DEFEND THE QUEEN · Survive 1:12"**. Its progress is measured by simulation events, not a fake timer. New objectives appear with a brief environmental cue (red scouts emerging, rainfall approaching, a chamber visually opening).

Player action -> visible ant response -> world consequence -> objective progress -> reward -> next decision.

Victory has an unmistakable state: slowed action, short colony celebration, a patch result (food delivered, population surviving, territory taken), and a **Continue to next patch** control. Failure explains the cause and provides **Retry / Load checkpoint**.

## UI / UX rules

- Put the simulation first. No large boxes floating over the ants.
- Top: day/time, food/capacity, worker/soldier/brood counts, queen state, one primary objective.
- Bottom: selected unit count and a contextual command tray. Selection is visible on world ants. Tool choice and destination markers are unambiguous.
- One mode toggle: **Surface / Nest**. Backyard appears as a campaign map, not a third constantly-needed tactical view.
- iPhone: tap-select, tap destination, long-press contextual unit actions, one-finger pan when dragging, pinch zoom; larger targets and a collapsible tray.
- Desktop/iPad pointer: marquee select, Shift-add, right-click commands, mouse wheel zoom, keyboard groups.
- Keep a 3–5-second camera movement or focus animation for major alerts, with Skip/Reduce Motion support.
- Maintain a soft soil-and-leaf aesthetic, subtle specular light on segmented ants, warm chamber light and distinctly readable silhouettes.

## Engineering systems

- Fixed-step game simulation (suggested 30 or 60Hz) separate from canvas render scheduling.
- A single authoritative state: ant ID, caste, health, world region, position, target, current task, carried payload; queen and eggs share this state.
- Pathfinding on surface navigation polygons/grid and underground traversable tunnel graph; one graph connects at entrance nodes.
- Worker priority scheduler and pheromone group system; time-limited jobs can be paused or reassigned.
- Save schema version + migration. Persist connected regions, tiles, assigned commands, constructed rooms, food, brood, weather and campaign state. Never drop old saves silently.
- Deterministic seeded scenario layout and optional debug overlays; simulation headless tests for balance and objective completion.
- Render in layered canvases for background, geometry, ants and UI effects; cull/LOD far ants for iPhone.
- All assets original or appropriately licensed.

## Build order and acceptance criteria

### Milestone A: First Light playable mission
- [ ] Introduce persistent mission state machine with 5 real goals and event-based completion.
- [ ] Tune starting population, resources, red scout timing, and food rewards around a successful first-time player session.
- [ ] Add an obvious in-world objective cue and mission transition screens.
- [ ] Use the current selection/recruitment tools instead of replacing them; make commands reliable on touch.
- **Exit criterion:** A new player can reach the first victory without reading external instructions, and can lose and retry predictably.

### Milestone B: Real underground construction
- [ ] Replace decorative chamber rendering with persistent dug geometry and connected pathfinding.
- [ ] Add dig orders; workers travel underground to excavate and build.
- [ ] Connect surface and underground entrances with shared living ants, including carried food and brood.
- [ ] Buildings visually grow with upgrades; path connectivity is enforced.
- **Exit criterion:** One chosen ant can be followed from a surface food resource through the entrance to a granary, deposit food, then return outside, with no despawn/duplicate.

### Milestone C: Meaningful warfare
- [ ] Squad morale and retreat, pheromone rally/escort, soldier positioning.
- [ ] Predator and red-colony raids with warnings, battle readability and difficulty scaling.
- [ ] Real queen-defense and nest-breach gameplay.
- **Exit criterion:** Squad positioning, protecting food lines and fortification change battle outcomes.

### Milestone D: Campaign and balancing
- [ ] Nine differentiated patches, territory influence and campaign persistence.
- [ ] Mission rewards, varied hazards, win/loss summaries, optional house-edge epilogue.
- [ ] Automated seeded combat/economy balance tests and phone/tablet browser playtesting.
- **Exit criterion:** A complete campaign can be won and lost, saved and resumed without dead ends.

## Current implementation versus plan — First Light rebuild (November 7, 2026)

The previous sandbox was intentionally **removed**, not incrementally updated. The live source now implements the first complete *First Light* mission using a new engine and new local save format.

**Implemented in the new game:**
- Exactly one playable scenario, starting with four workers, one scout, a queen and 25 food.
- Five event-based objectives, completion rewards, and clear defeat/victory states.
- One authoritative ant population spanning two environments through a physical portal.
- Surface resource nodes, real food carrying, connected tunnel pathfinding and actual granary delivery.
- Persistent soil excavation marked in the nest and performed by moving workers.
- Nursery construction after six cells are dug, brood queue, soldier training and limited food.
- Player squad selection, surface movement/gather/defend/attack commands and touch camera controls.
- Enemy raid that travels through the surface entrance into the queen's tunnels, and a destructible red outpost.
- Illustrated procedural surface and underground environments, local saves and offline PWA.
- Automated simulation tests, including a start-to-victory First Light playthrough.

**Still to build:**
- Flexible, player-placed room geometries beyond the fixed tutorial nursery.
- Brood handling/transport to alternate chambers and multiple live queen colonies.
- More sophisticated terrain obstacles, weather, predators and enemy strategy.
- The broader differentiated nine-territory campaign, house-edge epilogue and permanent branching upgrades.
- Deep mobile-browser/device playtesting and balance across genuinely different player strategies.

The original design's first-mission values were tuned during implementation: workers cost 18 food, soldiers 30, and the nursery 45. The red raid was reduced to three attackers after automated playthroughs showed the initial five-attacker assault was not survivable for a standard starter army.

## One non-negotiable principle

**Never add a gameplay system that cannot be understood by watching the colony.** When a user presses Dig, ants must dig; when they press Gather, ants must carry resources; when they build a nursery, eggs and workers must actually use it.
