# WAHTWEDID

Stručný vývojový deník CASSANDRA-NEW. Zachycuje nejen změny v kódu, ale také jejich herní a architektonický záměr, který samotný diff nemusí vysvětlit.

## Záznamy

### 2026-11-10 — Expedition Suit foundation
- **Implementační commit:** [64e134c64f0566f3ac584d587b625da32cb5f497](https://github.com/Veyn44/CASSANDRA-NEW/commit/64e134c64f0566f3ac584d587b625da32cb5f497)
- **Kód:** samostatný datový model Expedition Suit, šest částí s HP a sloty pro moduly, factory, datový model Expedition Suit Station a operace pro přiřazení, uložení, vyzvednutí a odložení/záchranu obleku.
- **New Game:** Commander začíná s jedním základním oblekem, aby mohl vyrazit mimo základnu.
- **Ideologie / herní pravidla:**
  - Oblek je samostatná entita; pawn je jeho vlastník, nikoli jeho datový kontejner.
  - Oblek vlastní moduly a jejich konfiguraci. Stanice oblek pouze skladuje a obsluhuje.
  - Jedna stanice je přiřazena jednomu pawnovi; oblek může být uložený, oblečený nebo odložený ve světě.
  - Smrt pawna v obleku oblek nezničí: zůstane u těla. Po návratu do oblasti jej lze získat zpět; konkrétní ukládání oblasti bude řešit budoucí Persistence systém.
  - Každá ze šesti anatomických částí obleku má právě jeden modulový slot. Konkrétní moduly a jejich účinky zatím nejsou součástí implementace.
- **Hranice implementace:** stanice má zatím datový model a správu; není ještě umístěna/renderována jako stavba ve světě a nemá UI. Smrt/loot zatím nejsou napojeny na herní combat/death flow. Nový model obleku zatím nenahrazuje starý pawn health systém.
- **Ověření:** změny byly zapsány do GitHubu. Runtime/browser test nebyl proveden.

### 2026-11-10 — Explicit module slots
- **Implementační commit:** [90e71d676957afe4f9c9ad53acbc5321e848a2aa](https://github.com/Veyn44/CASSANDRA-NEW/commit/90e71d676957afe4f9c9ad53acbc5321e848a2aa)
- **Kód:** každá ze šesti částí obleku nyní obsahuje vlastní prázdný slot `module`.
- **Ideologie:** slot je součástí anatomické části obleku, ne samostatným inventářem stanice nebo pawna. Jeden slot na část; obsah a účinky modulů budou definovány později.
