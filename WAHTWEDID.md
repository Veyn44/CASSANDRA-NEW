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
  - [14a21b6 — crew identity integration](https://github.com/Veyn44/CASSANDRA-NEW/commit/14a21b661a2722394b5e9f2b4c5f7a5d6d3a1e0a)
  - [8034762 — game calendar integration](https://github.com/Veyn44/CASSANDRA-NEW/commit/8034762119e7b2e291e05947953f12868e8e3a8f)
  - [23ccd30 — calendar and dev controls UI](https://github.com/Veyn44/CASSANDRA-NEW/commit/23ccd308a02c15ca8c949b533c850983848f44c9)
  - [a604180 — dev controls styling](https://github.com/Veyn44/CASSANDRA-NEW/commit/a604180d975f24311feda2a73d7e6aa7b3defb80)
  - [a9527c0 — shared END DAY transition](https://github.com/Veyn44/CASSANDRA-NEW/commit/a9527c0df1fea56dabf69bf3bf2ae281a3998b80)
- **Kód:** každý pawn dostává počáteční věk 18–50 let a narozeninový den 1–365. Strategický kalendář začíná dnem 1 roku 2084 a zobrazuje se v horní liště. ESC menu obsahuje DEV MODE ON/OFF; po zapnutí zpřístupní SET DAY a END DAY.
- **Herní pravidlo:** SET DAY mění pouze kalendářní den a nikdy věk. END DAY posune den (včetně přechodu 365 → 1 a zvýšení roku) a poté jednou vyhodnotí narozeniny všech pawnů. Věk se zvýší pouze tehdy, když nově nastavený den odpovídá birthdayDay. Reálný čas, rychlost simulace ani načtení hry věk nemění.
- **Hranice implementace:** věk a narozeniny jsou nyní součástí runtime dat pawnů a zobrazují se v personnel info. Repo zatím nemá implementovaný save/load systém, takže persistence přes restart hry není součástí této změny. Ostatní systémy stárnutí ani efekty věku nebyly přidány.
- **Ověření:** změny zapsány do GitHubu. Runtime/browser test nebyl proveden.
### 2026-11-10 — Full Unit Details: BIO profile
- **Implementační commity:** [303374a — expanded personnel BIO markup](https://github.com/Veyn44/CASSANDRA-NEW/commit/303374a9766b23650163f38d3d0426993802680f), [250e6a5 — live pawn data binding](https://github.com/Veyn44/CASSANDRA-NEW/commit/250e6a59a2e633b6ef273ef86fa71883619220e8), [12ad46a — BIO profile styling](https://github.com/Veyn44/CASSANDRA-NEW/commit/12ad46a79f3415ca103c844e3a70f23cf276e0c5).
- **Kód:** původní malé INFO okno bylo rozšířeno na velký personnel BIO profil s identifikačním panelem, osobními údaji, prostorem pro budoucí biografii a živým přehledem stavu.
- **Hranice:** implementována pouze obrazovka BIO. BODY, Expedition Suit, Equipment, Conditions a History zůstávají mimo tento krok; neznámý původ a biografie se zobrazují jako nezadané, nevymýšlí se.
- **Ověření:** změny zapsány do GitHubu; runtime/browser test nebyl proveden.
### 2026-11-10 — Full Unit Details: BIO / GEAR navigation
- **Implementační commity:** [9ee1c9a — BIO and GEAR tab markup](https://github.com/Veyn44/CASSANDRA-NEW/commit/9ee1c9a72c448273e668a44e54745e218ce24ba3), [c91c9af — tab switching and live gear summary](https://github.com/Veyn44/CASSANDRA-NEW/commit/c91c9afbe2c99cd48e28a1e8ff635cb1cc70f65f), [4e84f9c — tab and GEAR styling](https://github.com/Veyn44/CASSANDRA-NEW/commit/4e84f9cf35451c95373efc92865d0ac5b4d849c9).
- **Kód:** vedle jména pawna jsou navigační záložky BIO a GEAR. BIO zachovává dosavadní profil; GEAR ukazuje aktuální zbraň a informaci o přiřazení Expedition Suit. Přepínání probíhá uvnitř stejného personnel panelu.
- **Hranice:** GEAR je zatím přehledová kostra; správa inventáře, jednotlivých částí obleku a modulů není implementována. Další záložky nebyly přidány.
- **Ověření:** změny zapsány do GitHubu; runtime/browser test nebyl proveden.
### 2026-11-10 — BODY & GEAR: anatomy, suit integrity and loadout slots
- **Implementační commity:** [9a9595c — anatomy HP definition](https://github.com/Veyn44/CASSANDRA-NEW/commit/9a9595ce718ae84e396d29aac814a365af08b989), [b24e79b — independent suit HP definition](https://github.com/Veyn44/CASSANDRA-NEW/commit/b24e79bd2b76487e60335658ff29142fa9387999), [0e8001a — commander body and loadout data](https://github.com/Veyn44/CASSANDRA-NEW/commit/0e8001a97556c5f160dddc5b897700b4cd1290c0), [0929c9c — crew body and loadout data](https://github.com/Veyn44/CASSANDRA-NEW/commit/0929c9c9d56e1999148918c12ab914ce551d15e2), [9a58268 — BODY & GEAR UI](https://github.com/Veyn44/CASSANDRA-NEW/commit/9a58268daa8630dedf223b50a8fbb125d0695d7d), [c8b2f53 — tab rename](https://github.com/Veyn44/CASSANDRA-NEW/commit/c8b2f53315d70b790aaec29d40a971bac1ca6296), [9e158f7 — live body/suit and item bindings](https://github.com/Veyn44/CASSANDRA-NEW/commit/9e158f74ab5f1ea9fc8361d69d30b800cc7b0def), [1dfade9 — BODY & GEAR styling](https://github.com/Veyn44/CASSANDRA-NEW/commit/1dfade971f162f17e571e465bd115f074a218e13).
- **HP pravidla:** pawn má 150 základních HP rozdělených na HEAD 30, TORSO 40, LEFT/RIGHT ARM 20 každá, LEFT/RIGHT LEG 20 každá. Základní Expedition Suit má přesně 50 % odpovídající hodnoty: HEAD 15, TORSO 20, každá končetina 10; celkem 75 HP. HP jednotlivých částí obleku jsou samostatné pooly a nikdy se nepřepočítávají podle aktuálního HP těla.
- **Loadout UI/data:** BODY & GEAR obsahuje levou anatomickou a pravou suit část se šesti odpovídajícími segmenty; každý suit segment má jeden modulový socket. Pod nimi jsou PRIMARY a SECONDARY WEAPON, Q / UTILITY a šest osobních slotů. Commander i crew dostávají anatomická data, sekundární weapon slot, utility slot a šest prázdných osobních slotů.
- **Hranice:** jde o datový základ a zobrazení. Damage routing mezi suit/body, skutečné osazování modulů, weapon equip interakce a item management nejsou v tomto kroku implementovány. Stávající globální health je inicializován na 150; propojení jeho změn s dílčí anatomií je samostatná mechanika.
- **Ověření:** změny zapsány do GitHubu; runtime/browser test nebyl proveden.
### 2026-11-10 — BODY & GEAR UI runtime confirmation
- **Související implementace:** [9a58268 — BODY & GEAR layout](https://github.com/Veyn44/CASSANDRA-NEW/commit/9a58268daa8630dedf223b50a8fbb125d0695d7d), [9e158f7 — anatomy/suit/item data bindings](https://github.com/Veyn44/CASSANDRA-NEW/commit/9e158f74ab5f1ea9fc8361d69d30b800cc7b0def), [1dfade9 — BODY & GEAR styling](https://github.com/Veyn44/CASSANDRA-NEW/commit/1dfade971f162f17e571e465bd115f074a218e13).
- **Výsledek:** uživatel potvrdil, že BODY & GEAR rozložení a jeho zobrazení funguje správně v runtime. Záložka obsahuje šest anatomických částí, odpovídající části Expedition Suit se sockety, PRIMARY/SECONDARY WEAPON, Q / UTILITY a šest osobních slotů.
- **Rozsah potvrzení:** potvrzeno funkční zobrazení a současný datový základ. Damage routing, skutečné vybavování a interakce se sloty zůstávají neimplementované.

### 2026-11-10 — Mira: Basic Expedition Suit / target dummy
- **Implementační commity:**
  - [34c3c2f — crew pawn suit fields](https://github.com/Veyn44/CASSANDRA-NEW/commit/34c3c2f96e41794189fa754a30498a28ab33994a)
  - [6fd2d20 — equip Mira with basic suit](https://github.com/Veyn44/CASSANDRA-NEW/commit/6fd2d20cd65d823f0608163347aaeaa8eaf9907e)
- **Kód:** crew pawn model nyní explicitně obsahuje `expeditionSuit` a `expeditionSuitStationId`. Mira při vytvoření nové hry dostane vlastní Basic Expedition Suit přes existující suit factory; oblek je ve stavu `equipped` a jeho umístění ukazuje na Miru.
- **Herní důvod:** Mira slouží jako první target dummy pro budoucí testování zbraní, zásahů, poškození obleku a anatomie.
- **Hranice:** jde pouze o přiřazení existujícího obleku. Damage System, armor hodnoty, zbraňové balancování a runtime test nebyly součástí této změny.


### 2026-11-10 — Pawn professions foundation
- **Implementační commity:**
  - [ecace22 — profession definitions](https://github.com/Veyn44/CASSANDRA-NEW/commit/ecace22171fbcdcffd10716549aff6f457de85f7)
  - [d228bb2 — profession progression](https://github.com/Veyn44/CASSANDRA-NEW/commit/d228bb2d8f52fc522803a43efc1f4b9f838016d4)
  - [044dc2f — crew profession initialization](https://github.com/Veyn44/CASSANDRA-NEW/commit/044dc2f9f0aa62ffe8821ca0aea139a4010272f8)
  - [b451512 — commander profession initialization](https://github.com/Veyn44/CASSANDRA-NEW/commit/b451512476863ea4e0266f331a3ae40a34acdc93)
  - [b64b550 — WHATTODO profession model](https://github.com/Veyn44/CASSANDRA-NEW/commit/b64b550c2a4b3f4cf2dbaf89a14e42429aff477a)
  - [7fd1303 — WAHTWEDID entry](https://github.com/Veyn44/CASSANDRA-NEW/commit/7fd130389c7bd0106aa3345c7585793191643c8d)
  - [1c5709a — mastery AP constant](https://github.com/Veyn44/CASSANDRA-NEW/commit/1c5709a8d5a4a9cee8d2e126cd862382a4ace6a6)
- **Kód:** připraven katalog devíti profesních tagů (Mining, Engineering, Material Science, Technician, Science, Fabrication, Soldier, Medicine, Operator), výchozí profesní progression pro Commander i crew Pawny a pomocné funkce pro XP, level, efficiency a AP.
- **Výchozí stav profese:** Level 1, XP 0/100, base AP 1, masteryStars 0. Každých 100 XP zvyšuje level, přebytečné XP se přenášejí, maximum je Level 30. Efficiency je odvozena jako 10 % za Level (Level 1 = 10 %, Level 30 = 300 %). AP se počítá odděleně jako base AP + mastery stars.
- **Herní důvod:** všechny pracovní úkony budou mít právě jeden profesní tag; XP rozvíjí pouze odpovídající profesi. Operator sjednocuje budoucí hauling/transport/transportní robotiku; Pilot zatím není samostatná profese.
- **Hranice implementace:** nepřidávají se konkrétní pracovní akce, XP odměny, denní AP reset/spotřeba, náhodné mastery, celkový Pawn level, UI ani AI. Carry capacity se tímto commitem nemění.
- **Ověření:** změny zapsány do GitHubu; runtime/browser test nebyl proveden.


### 2026-11-10 — Profession mastery XP curve and personnel UI
- **Kód:** opraven výchozí stav všech profesí na 1 mastery star = 1 AP. Potřebné XP pro další level se odvozují od mastery stars: 100 × počet hvězdiček. Každý Pawn tak může vykonávat všechny profese už od začátku.
- **UI:** do personnel detailu přidána záložka PROFESSIONS se všemi devíti profesními kartami, Level, XP progress barem, efficiency, AP a mastery stars. Data se vykreslují z vybraného Pawna.
- **Hranice:** nebyly přidány pracovní úkony, XP odměny, mastery progression ani denní AP ekonomika. UI pouze zobrazuje aktuální stav.
- **Ověření:** změny zapsány do GitHubu; runtime/browser test nebyl proveden.
