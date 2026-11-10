# WAHTWEDID

Stručný vývojový deník CASSANDRA-NEW. Zachycuje nejen změny v kódu, ale také jejich herní a architektonický záměr, který samotný diff nemusí vysvětlit.

## Záznamy

### 2026-11-10 — Pawn Core: struktura a základní anatomie
- **Implementační commity:**
  - [8a252e6 — identity](https://github.com/Veyn44/CASSANDRA-NEW/commit/8a252e6722beb37012d1054b92efd05737265dff)
  - [5d9e59f — physical](https://github.com/Veyn44/CASSANDRA-NEW/commit/5d9e59f16373fab0e69aa9d8198b54206c8337c0)
  - [a7fe92e — professions](https://github.com/Veyn44/CASSANDRA-NEW/commit/a7fe92ee33bc3cb0d33c4279f142305be454b9d8)
  - [a4dadfc — progression](https://github.com/Veyn44/CASSANDRA-NEW/commit/a4dadfc6da5966076974b0014bf0b7f7db6a8f89)
  - [1cc9a9e — vitals](https://github.com/Veyn44/CASSANDRA-NEW/commit/1cc9a9ed6c0c91a6b3de792c4881f8e17bfd8217)
  - [800ee66 — equipment](https://github.com/Veyn44/CASSANDRA-NEW/commit/800ee668fefe25aae446a067970a095195626c80)
  - [1c834b6 — inventory](https://github.com/Veyn44/CASSANDRA-NEW/commit/1c834b6c0569c26035ece817334eb07a9bd18ebf)
  - [5fdcee8 — needs](https://github.com/Veyn44/CASSANDRA-NEW/commit/5fdcee8e3ebc1d62ea0bb0bdea4bfbb449ce8481)
  - [8565c6c — conditions](https://github.com/Veyn44/CASSANDRA-NEW/commit/8565c6c2ec61b3932cacb2bb709a83e422b3726b)
  - [4c0ac27 — behavior](https://github.com/Veyn44/CASSANDRA-NEW/commit/4c0ac276aa7cd0724f5ccac409a67bb25dbd8499)
  - [2f0b16a — pawn-factory](https://github.com/Veyn44/CASSANDRA-NEW/commit/2f0b16aeb44cdc5b739ef8ba911a8e1c9bc210a6)
  - [c4d624c — pawn body part HP](https://github.com/Veyn44/CASSANDRA-NEW/commit/c4d624c671c95a4535ffbeb39dddc69710461052)
- **Kód:** připravena modulární adresářová struktura Pawn Core; přidán datový základ šesti částí těla a jejich HP.
- **Ideologie / herní pravidla:**
  - Pawn je složený z oddělených oblastí odpovědnosti (identita, fyzické tělo, profese, postup, vitals, výbava, inventář, potřeby, stavy, chování a factory). Systémy se mají rozvíjet samostatně, ne hromadit v jednom souboru.
  - Anatomie má přesně šest částí: Head, Torso, Left Arm, Right Arm, Left Leg, Right Leg. Zatím se části dále nedělí.
  - Každá část má vlastní HP. Základní hodnoty: Head 30, Torso 40, každá ruka a noha 20; celkem 150 HP.
  - Každá část má také `bodyType` a `status`. Konkrétní enumerace a efekty zůstávají otevřené; zatím nezavádíme typy poškození ani detailnější anatomii.
  - Human je první implementovaný typ; budoucí Robot/Cyborg a změny těla mají být řešitelné rozšířením modelu.
  - Oblek je oddělená výbava s vlastními částmi a HP, nikoli další část těla pawna.
- **Hranice implementace:** adresáře jsou v této fázi pouze připravená struktura; většina zatím obsahuje jen `.gitkeep`. Nová anatomie není integrována do starého health/combat systému pawna. Profese, věk, levelování a jejich přesné efekty se budou dopracovávat samostatně.

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

### 2026-11-10 — UI cleanup: left command rail
- **Implementační commity:** [0db8fc7 — remove control hints](https://github.com/Veyn44/CASSANDRA-NEW/commit/0db8fc7749bb45b647accc24e33c49d6e14c7008), [7479b75 — hide left scrollbar](https://github.com/Veyn44/CASSANDRA-NEW/commit/7479b7578caac1b44eca9d4de12840b0c93fb88a)
- **Kód:** odstraněna sekce CONTROL s klávesovými nápovědami; karta pawna a DRAFT ON/OFF zůstávají. Scrollbar levého panelu je skrytý.
- **Ověření:** změny zapsány do GitHubu; runtime/browser test této úpravy zatím neproveden.
### 2026-11-10 — Pawn birthdays and developer day controls
- **Implementační commity:**
  - [2cae611 — pawn identity age and birthday](https://github.com/Veyn44/CASSANDRA-NEW/commit/2cae611c0554c5d8be61cdfe6099ba5e75f24052)
  - [4b5bfee — strategic calendar](https://github.com/Veyn44/CASSANDRA-NEW/commit/4b5bfee59c872ec9a37e153e52af7ba26753a161)
  - [77dd127 — commander identity integration](https://github.com/Veyn44/CASSANDRA-NEW/commit/77dd1271df37c3e8d673ea18287322904dddcfdb)
  - [14a21b6 — crew identity integration](https://github.com/Veyn44/CASSANDRA-NEW/commit/14a21b661a272239a4b5cbaf78db5afea89e8439)
  - [8034762 — game calendar integration](https://github.com/Veyn44/CASSANDRA-NEW/commit/8034762119e7b2e291e05947953f12868e8e3a8f)
  - [23ccd30 — calendar and dev controls UI](https://github.com/Veyn44/CASSANDRA-NEW/commit/23ccd308a02c15ca8c949b533c850983848f44c9)
  - [a604180 — dev controls styling](https://github.com/Veyn44/CASSANDRA-NEW/commit/a604180d975f24311feda2a73d7e6aa7b3defb80)
  - [a9527c0 — shared END DAY transition](https://github.com/Veyn44/CASSANDRA-NEW/commit/a9527c0df1fea56dabf69bf3bf2ae281a3998b80)
- **Kód:** každý pawn dostává počáteční věk 18–50 let a narozeninový den 1–365. Strategický kalendář začíná dnem 1 roku 2084 a zobrazuje se v horní liště. ESC menu obsahuje DEV MODE ON/OFF; po zapnutí zpřístupní SET DAY a END DAY.
- **Herní pravidlo:** SET DAY mění pouze kalendářní den a nikdy věk. END DAY posune den (včetně přechodu 365 → 1 a zvýšení roku) a poté jednou vyhodnotí narozeniny všech pawnů. Věk se zvýší pouze tehdy, když nově nastavený den odpovídá birthdayDay. Reálný čas, rychlost simulace ani načtení hry věk nemění.
- **Hranice implementace:** věk a narozeniny jsou nyní součástí runtime dat pawnů a zobrazují se v personnel info. Repo zatím nemá implementovaný save/load systém, takže persistence přes restart hry není součástí této změny. Ostatní systémy stárnutí ani efekty věku nebyly přidány.
- **Ověření:** změny zapsány do GitHubu. Runtime/browser test nebyl proveden.
