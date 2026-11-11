# WHATWEHAVE

Přehled toho, co je v CASSANDRA-NEW skutečně implementováno a jaký to má herní účel. Dokument je orientační mapa aktuální hry, nikoli plán ani historie commitů.

- WHATWEHAVE.md: aktuální stav implementovaných systémů a jejich záměr.
- WHATTODO.md: otevřené návrhy, rozhodnutí a budoucí práce.
- WAHTWEDID.md: stručná historie změn, implementační rozsah a commity.

Při každé změně herních funkcí aktualizovat tento přehled tak, aby odpovídal skutečnému kódu. Nezapisovat sem pouhé nápady ani prezentovat datovou kostru jako hotovou herní mechaniku.

## Aktuální herní prototyp

### Herní režim a čas
- Hra je v současnosti real-time top-down prototyp zaměřený na expedici.
- Herní hodiny podporují pauzu a změnu rychlosti.
- Strategický kalendář zobrazuje den a rok; výchozí datum je Day 1, Year 2084.
- V DEV MODE jsou dostupné nástroje SET DAY a END DAY.
- END DAY posune strategický den a vyhodnotí narozeniny Pawnů. SET DAY mění kalendářní den bez změny věku.
- Plnohodnotný základnový tahový režim a propojení denního cyklu s pracovními operacemi zatím nejsou implementovány.

### Svět, kamera a ovládání
- Svět se vytváří procedurálně přes createWorld.
- Kamera sleduje Commandera; lze ji ručně posouvat a měnit zoom.
- Commander se ovládá v režimu DRAFTED pomocí WASD.
- Posádku lze vybrat v příkazové liště a při pozastavené hře jí nastavit základní command order.
- Renderer zobrazuje svět, moduly a Pawny; lze zapnout mřížku.

### Pawni a personální přehled
- New Game vytváří Commandera a člena posádky Miru.
- Pawni mají identitu, věk a narozeninový den.
- Personální okno obsahuje BIO, BODY & GEAR a PROFESSIONS záložky.
- BIO zobrazuje identifikační a stavové informace.
- BODY zobrazuje šest částí těla: Head, Torso, Left Arm, Right Arm, Left Leg a Right Leg. Každá má vlastní HP.
- Základní anatomie má celkem 150 HP: Head 30, Torso 40, každá končetina 20.
- GEAR zobrazuje Expedition Suit, zbraně, utility a osobní sloty. Jde převážně o datový/přehledový základ; skutečné vybavování a správa slotů nejsou dokončeny.
- PROFESSIONS zobrazuje devět profesních kategorií a jejich současnou XP/level/AP/efficiency strukturu. Tento starší systém je v kódu, ale jeho model byl jako budoucí pracovní návrh odmítnut; nový skill/odbornost systém zatím není implementován.

### Expedition Suit
- Commander i Mira začínají s vlastním Basic Expedition Suit.
- Oblek je samostatná entita s šesti odpovídajícími částmi, vlastními HP a jedním module socketem na část.
- Základní oblek má 75 HP (polovinu základních HP odpovídající anatomie).
- Existuje datový základ Suit Station a operací přiřazení, uložení, vyzvednutí a odložení obleku.
- Suit Station zatím není plnohodnotná stavba ve světě s UI. Poškození obleku není propojeno s kompletním damage/death flow.

### Combat a akce
- Commander má základní melee attack s cooldownem.
- Stisk levého tlačítka myši při DRAFTED režimu spouští stávající přímou útočnou logiku v InputControlleru.
- Nově existuje obecný Action Registry a Action Executor:
  - akce mají unikátní ID, metadata, jeden nebo více kontextů a vlastní execute funkci;
  - registry umožňuje registraci, vyhledání podle ID, filtrování podle kontextu/kategorie a výběr dostupných akcí;
  - validace kontroluje kontext, požadovaný cíl, podmínky akce a volitelnou dostupnost nákladů;
  - executor ověřuje akci, případně odečte deklarované náklady přes kontextové rozhraní a spustí její implementaci;
  - první registrovaná akce je expedition.melee-attack v expedition/common.
- Registry a executor jsou vytvořeny při inicializaci hry a dostupné přes objekt vytvořené hry (actionRegistry, actionExecutor).
- Důležitá hranice: stávající UI/InputController zatím neodesílá melee útok přes Action Executor; přímé ovládání útoku zůstalo zachováno. Akční systém je funkční jako samostatná infrastruktura, ale napojení dalších herních vstupů a budoucích colony operací teprve přijde.
- Adresářová taxonomie colony/common, colony/specialized, expedition/common a expedition/specialized je organizační, nikoli pevný limit registru. Akce mohou deklarovat více kontextů.

## Zásadně nehotové / nepředpokládat jako implementované
- Základnové pracovní operace, společný fond Colony Actions a přepočet z individuální Staminy.
- Nový skill/odbornost systém a odborné operace typu Prospecting.
- Automatické pracovní fronty nejsou součástí zamýšleného modelu.
- Kompletní inventář, vybavování předmětů, moduly obleků a jejich herní efekty.
- Kompletní damage routing přes části těla a obleku, smrt a loot.
- Save/load a persistence navštívených oblastí.
- Plnohodnotná AI, potřeby, logistika a základnová simulace.

Tento soupis popisuje současný stav prototypu podle zdrojového kódu a dosavadního vývojového deníku. Pokud se dokument a kód rozcházejí, rozhodující je aktuální implementace.