# WHATTODO — CASSANDRA

Pracovní plán dalšího vývoje. Tento dokument určuje pořadí a obsah nejbližších návrhových a implementačních kroků. Nejde o vývojový deník; historii skutečně provedených změn zapisujeme do `WAHTWEDID.md`.

Schválená identita hry a systémové hranice jsou popsány v `SYSTEM_ARCHITECTURE.md`. Pravidla organizace práce a větví jsou v `RULES.md`.

## Hlavní strategie vývoje

Nejdříve vytvoříme společné technické jádro a minimální integrační kostru všech hlavních herních systémů. Teprve když budou systémy používat společné datové modely a rozhraní a budou schopné spolu komunikovat, začneme je jednotlivě rozvíjet do plnohodnotné podoby.

Cílem není mít v `main` dvanáct rozpracovaných herních implementací. Cílem je mít v `main` stabilní společný základ, jasné kontrakty a minimální kostru všech systémů, která umožní jejich bezpečnou spolupráci.

### Zásady

- `main` obsahuje pouze schválený stabilní základ a dokončené, záměrně přijaté části hry.
- Každý subsystém má jasně vymezenou odpovědnost, vlastní datový model a veřejné integrační rozhraní.
- Společná infrastruktura se nesmí duplikovat v jednotlivých systémech.
- Systémy spolu komunikují přes definované kontrakty, sdílený kontext a události; nemají se navzájem pevně svazovat interními závislostmi.
- Existující UI, ovládání, Pawn, Suit a další použitelné části prototypu zachováme a budeme je postupně zapojovat do nové architektury. Nepřepisovat je bez konkrétního důvodu.
- Starší implementace profesí/skillů se později upraví v rámci Pawn Life; nesmí určovat podobu nového společného Core.
- Nejdříve návrh a dohoda o kontraktech, potom implementace. Výjimkou jsou malé průzkumné změny výslovně určené k ověření technického předpokladu.
- Každý krok musí mít ověřitelný výsledek. Prázdné moduly a předstíraná funkčnost nejsou cílem.
- Do `main` se dostane až zkontrolovaný a schválený výsledek. Kombinace rozpracovaných systémů se zkoušejí v `integration/gameplay-test`.

---

## Vývojový postup

### Fáze 1 — Návrh a implementace společného Game Core

První pracovní větev: `feature/core-architecture`.

Nejdříve společně definovat odpovědnosti, datové modely, životní cyklus a integrační kontrakty Core. Teprve po schválení návrhu implementovat základní infrastrukturu.

#### 1.1 Co musí být navrženo

1. **Game Context**
   - Co přesně představuje společný kontext hry.
   - Které služby a registry zpřístupňuje systémům.
   - Jak se kontext vytváří, předává a ukončuje.
   - Jak zabránit tomu, aby se z něj stal globální kontejner všech herních dat.
   - Která data vlastní Core a která pouze zpřístupňuje jejich vlastníkům.
   - **Schválený směr: varianta C – hybridní Game Context.** Kontext přímo zpřístupňuje společné infrastrukturní služby (např. Event Bus, Clock, Entity Registry, World Registry/Context, Persistence a Logger) a zároveň poskytuje přístup k registrovaným herním systémům přes System Registry.
   - Herní systémy nebudou pevně zadrátované jako vlastnosti Game Contextu typu `context.pawnLife` nebo `context.environment`. Získávají se přes registry podle stabilního ID a veřejného kontraktu.
   - Game Context není vlastníkem dat jednotlivých systémů ani univerzálním úložištěm herního stavu. Každý systém zůstává vlastníkem svých dat a zveřejňuje pouze dohodnuté API.
   - Důvod rozhodnutí: konečná podoba hry a její budoucí systémy nejsou dosud známé; architektura proto musí umožňovat přidávání, odebírání a výměnu systémů bez přepisování centrálního kontextu.

2. **System Registry a životní cyklus systémů**
   - **Schválený způsob registrace: varianta A – centrální Bootstrap.** Bootstrap explicitně sestaví seznam systémů a předá jej System Registry; systémy se samy neregistrují při importu a import modulů nesmí mít registrační vedlejší účinky.
   - **Schválené pořadí: automatické odvození z deklarovaných závislostí.** Registry před inicializací sestaví závislostní graf z požadovaných a poskytovaných služeb a automaticky určí platné pořadí (topologické řazení); ruční globální pořadník systémů nebude potřeba.
   - Pořadí je nutné dodržet už při `initialize()`, protože systémy smějí získávat připravené služby během své inicializace. Poskytovatel se proto inicializuje před konzumentem; po úspěšném `initialize()` zpřístupní svou službu.
   - Fáze `start()` proběhne až po úspěšné inicializaci všech systémů a rovněž respektuje závislostní pořadí. `destroy()` probíhá v opačném pořadí, aby se nejprve ukončily konzumenti a až poté poskytovatelé jejich služeb.
   - Pokud graf obsahuje cyklus, chybějící povinnou službu nebo nejednoznačného poskytovatele, Registry odmítne sestavu ještě před inicializací a oznámí konkrétní příčinu.
   - Registry před inicializací ověří unikátnost ID, dostupnost povinných závislostí, konflikty poskytovaných služeb a možnost sestavit platné pořadí inicializace.
   - Registrace a kontrola závislostí proběhnou jako oddělená fáze před spuštěním systémů. Neplatná konfigurace musí skončit srozumitelnou chybou ještě před částečným startem hry.
   - Přesný životní cyklus, pořadí hooků, pravidla volitelných závislostí, chování při selhání a možnost pozdní registrace zůstávají předmětem návrhu a schválení.
   - **Schválený lifecycle kontrakt: varianta C.** Každý systém povinně poskytuje `initialize(context)`, `start()` a `destroy()`. Metody `pause()` a `resume()` jsou volitelné; Registry je volá pouze u systémů, které je implementují.
   - Pozastavení systému je oddělené od jeho aktualizační frekvence a časového režimu. To se navrhne samostatně v bodě Game Clock.
   - Pro první verzi se po dokončení inicializace zakazuje pozdní registrace a odebírání systémů za běhu.
   - **Schválený model závislostí: varianta B – závislosti na veřejných službách.** Systém deklaruje služby, které poskytuje, a požadované služby, které potřebuje; konzument nemusí znát konkrétní systém ani jeho interní implementaci.
   - V první verzi má každá služba právě jednoho poskytovatele. Chybějící požadovaná služba nebo více poskytovatelů stejné služby je validační chyba před inicializací. Volitelné služby mohou chybět.
   - Konkrétní identifikátory a verze kontraktů služeb, způsob jejich zpřístupnění a pravidla kompatibility se dopracují v návrhu veřejného API.
   - **Schválený způsob získávání služeb: varianta B.** Každý systém obdrží při `initialize(context)` pouze Game Context a požadované služby si získá přes System Registry podle ID veřejné služby. Bootstrap nepředává každému systému individuálně sestavený objekt závislostí.
   - Před inicializací musí Registry vyřešit všechny poskytovatele, ověřit závislosti a připravit jejich veřejná API tak, aby konzument při své inicializaci nemohl získat dosud nepřipravenou povinnou službu.
   - Přesný okamžik zpřístupnění služby vůči lifecycle poskytovatele, pravidla pro volitelné služby a ochrana před přístupem k interním implementacím budou součástí detailního API návrhu.
   - **Schválený okamžik zpřístupnění služby: varianta A.** Veřejná služba se zpřístupní po úspěšném dokončení `initialize(context)` jejího poskytovatele. Poskytovatel tím garantuje, že veřejné API je připravené k použití, i když jeho vlastní provoz ještě nezačal.
   - Systémy se inicializují v závislostním pořadí. Teprve po úspěšné inicializaci všech systémů následuje samostatná fáze `start()`; tím se oddělí příprava API od zahájení herní činnosti.
   - **Schválené chování při selhání startu: varianta A – atomické spuštění celé sestavy.** Pokud selže `start()` kteréhokoli systému, Bootstrap zastaví další spouštění, označí start sestavy jako neúspěšný a provede úklid všech systémů, které úspěšně prošly inicializací, v opačném pořadí inicializace. Hra nesmí pokračovat v částečně spuštěném stavu.
   - Stejný princip bezpečného selhání a úklidu se musí přesně definovat také pro chyby během registrace a inicializace. Výjimky pro volitelné systémy se nesmějí zavádět implicitně; případná podpora bude samostatné explicitní rozhodnutí.
   - **Schválený způsob práce s volitelnými službami: varianta B.** Registry poskytne `hasService(serviceId)` pro kontrolu dostupnosti a `getService(serviceId)` pro získání služby. Požadavek na neexistující službu přes `getService()` musí vyvolat srozumitelnou chybu; volitelnou službu je nutné před získáním ověřit.
   - Jak systém deklaruje své ID, závislosti a poskytované služby.
   - Jak se systémy registrují, inicializují, spouštějí, pozastavují, obnovují a ukončují.
   - Pořadí inicializace a bezpečné řešení chyb při startu.
   - Jak se definují povinné a volitelné závislosti.
   - Jak systém získá přístup k jinému systému: přes veřejné API/kontrakt, nikoliv přes jeho interní implementaci.
   - Zda a jak se budou systémy aktualizovat v jednotlivých časových režimech.

3. **Event Bus**
   - Jak se události pojmenovávají a verzují.
   - Jednotný tvar payloadu: identifikátor události, zdroj, čas/pořadí a vlastní data.
   - Jak se systémy přihlašují k odběru a jak odběr ruší.
   - Pravidla synchronního/asynchronního doručování a pořadí událostí.
   - Jak zabránit nekonečným cyklům událostí a nechtěnému opakovanému zpracování.
   - Jak se předávají chyby handlerů a jak se události ladí/logují.
   - Rozlišit události, které oznamují již nastalou skutečnost, od příkazů, které žádají o provedení akce.
   - Stanovit, které události se ukládají do persistence a které jsou pouze dočasné.

4. **Game Clock a časové režimy**
   - Jeden autoritativní zdroj herního času a jasná definice jeho jednotek.
   - Rozlišit real-time simulaci expedice, strategický čas základny a případné denní/tahové hranice.
   - Definovat pauzu, rychlost simulace, delta time, tick a pořadí aktualizací.
   - Určit, které systémy běží v kterém režimu a jak reagují na pozastavení.
   - Navrhnout synchronizaci základny během expedice; respektovat schválený směr, že základna má pokračovat v autonomní simulaci. Přesná pravidla se nesmějí domyslet bez rozhodnutí.
   - **Schválený směr pro čas expedice: varianta A – společný čas pokračuje i během encounteru.** Délka encounteru se započítává do uplynulého herního času na Cassandře. Pokud hráč stráví na asteroidu 45 minut herního času, na Cassandře uplyne stejných 45 minut herního času.
   - Během encounteru hráč neřídí základnu a nemusí sledovat její obrazovku. Základnová simulace pokračuje autonomně na pozadí; události a následky se vyhodnocují bez vyžadování souběžné pozornosti hráče. Přehled událostí a případné požadavky na reakci hráč obdrží při návratu k řízení Cassandry.
   - Herní čas je zrychlený vůči reálnému času a jeho rychlost ovlivňuje hráčem zvolená rychlost simulace. Expedice může být v reálném čase intenzivní a dlouhá, zatímco odpovídající časový posun na Cassandře může představovat jen krátký úsek reálného času při běžné základnové simulaci. Konkrétní převodní poměr, limity a pravidla změny rychlosti je nutné navrhnout.
   - Let k asteroidu a zpět má definovanou herní dobu (např. 4 hodiny); tato doba se započítává do stejného autoritativního herního času. Po příletu se nabídne encounter; po ukončení mise začne návrat. Přesné chování UI, přerušení a časové rychlosti v jednotlivých stavech mise zůstává k návrhu.
   - Zásada pozornosti hráče: během encounteru se nezobrazuje ani nevyžaduje aktivní řízení základny. To však samo o sobě neznamená zastavení její simulace.
   - Zajistit, aby systémy nevytvářely vlastní nezávislé kalendáře nebo nekonzistentní časovače.
   - Definovat determinismus a pravidla pro ukládání/obnovu časového stavu, pokud budou potřeba.

5. **Entity Registry a identita entit**
   - Jak se přidělují stabilní unikátní ID.
   - Jak se entity registrují, vyhledávají, odpojují a obnovují.
   - Jak se rozlišují typy entit (Pawn, modul, item, loď, asteroid apod.) bez toho, aby Core obsahovalo jejich herní pravidla.
   - Kdo vlastní životní cyklus entity a její data.
   - Jak se řeší reference mezi entitami, odstraněné entity a neplatné reference.
   - Zda registry evidují živé runtime objekty, persistentní identitu, nebo obojí odděleně.

6. **World Context a hranice světů**
   - Jak Core reprezentuje aktuální herní kontext/svět bez znalosti detailů map.
   - Jak se odděluje mapa Cassandry, lokální asteroidový encounter a galaxie.
   - Jak se přepíná aktivní prostředí a jak se zachovávají neaktivní světy.
   - Jaké minimum musí svět poskytnout ostatním systémům (ID, typ, rozměry/adresování, stav/životní cyklus).
   - Jak zajistit, aby Core nebylo závislé na konkrétní velikosti mapy ani konkrétním způsobu generování.

7. **Persistence / Save-Load kontrakt**
   - Co je persistentní stav a co je pouze dočasný runtime stav.
   - Který systém vlastní serializaci svých dat; Core koordinuje ukládání, ale nemá znát vnitřní strukturu každého systému.
   - Jak se definují save participants/providers a jejich stabilní identifikátory.
   - Jak se ukládají verze schémat, verze hry a případné migrace starších uložených dat.
   - Jak se řeší pořadí ukládání a načítání, závislosti mezi systémy a opětovné propojení referencí na entity.
   - Jak se zabrání částečně uloženému nebo nekonzistentnímu save při chybě.
   - Jak se oddělí metadata save (čas, verze, identifikátor kampaně apod.) od dat jednotlivých systémů.
   - Jak se ukládají samostatné světy/encountery a jak se načítají pouze potřebná data.
   - Jak se zachází s dočasnými událostmi, cache, renderovacími objekty a jinými daty, která se ukládat nemají.
   - Zatím definovat a ověřit kontrakt; kompletní uživatelské rozhraní pro správu save slotů není podmínkou prvního Core kroku.

8. **Logování, diagnostika a chyby**
   - Jednotný způsob, jak systémy hlásí chyby a diagnostické informace.
   - Rozlišit očekávané herní stavy od technických chyb.
   - Zajistit dohledatelnost zdroje události a systému.
   - Definovat, co musí být viditelné při vývoji a co může být vypnuté v produkci.

9. **Integrace existujícího prototypu**
   - Zmapovat současný `game.js`, Game Clock, Input Controller, UI, renderer, Pawn, Suit a Action System.
   - Rozhodnout, které části zůstávají samostatnými službami a které se postupně stanou systémy registrovanými v Core.
   - Zachovat současné ovládání a UI; nové Core se jim přizpůsobí přes adaptéry/kontrakty, ne naopak bez důvodu.
   - Rozhodnout, jak Action Registry a Action Executor zapadnou do Core a jak se akce napojují na Input Controller.
   - Ověřit skutečné API Pawnů a odstranit předpoklady o vlastnostech, které nemusí existovat (např. attack cooldown).
   - Neprovádět velký přepis funkčního prototypu jen kvůli organizační čistotě.

#### 1.2 Co má být výsledkem Core

- Spustitelné společné Core s definovaným Game Context.
- Registrace a životní cyklus systémů.
- Funkční Event Bus s jasným kontraktem.
- Jednotný Game Clock a definované časové API.
- Identita a evidence entit.
- Základní World Context oddělující typy světů.
- Persistence kontrakt a koordinace save/load účastníků.
- Diagnostika a konzistentní hlášení chyb.
- Integrační adaptér pro současný prototyp, aby se neztratilo existující UI a ovládání.
- Automatizované testy základních kontraktů a životního cyklu.
- Dokumentace veřejných API a příklad minimálního systému připojeného do Core.

Core nesmí implementovat pravidla konstrukce, atmosféry, Pawn potřeb, boje, těžby, ekonomiky ani navigace. Poskytuje pouze společné mechanismy.

### Fáze 2 — Minimální kostra všech systémů

Po dokončení a ověření Core postupně připravíme v každé feature větvi minimální systém, který používá společné kontrakty. Kostra není prázdný soubor: musí se registrovat, respektovat životní cyklus, deklarovat vlastnictví dat a mít základní integrační test. Nemá však předčasně implementovat kompletní gameplay.

Pořadí větví:

1. `feature/pawn-life` — identita Pawna, základní datový model, napojení na Entity Registry.
2. `feature/colony-construction` — konstrukční entity, hranice/sekce a veřejné rozhraní konstrukce.
3. `feature/environment-systems` — environmentální stav a rozhraní pro sekce.
4. `feature/ship-systems` — energetický stav a rozhraní lodních systémů.
5. `feature/resources-industry` — materiály, položky, inventář a skladovací kontrakty.
6. `feature/colony-automation` — rozhraní autonomních činností a jejich aktualizace.
7. `feature/expedition-gameplay` — kontext expedice, protagonista a režim ovládání.
8. `feature/combat-damage` — cíle, akce a rozhraní poškození.
9. `feature/mining-exploration` — asteroidový encounter, prospecting a těžební kontrakty.
10. `feature/galaxy-world` — adresování a datový model galaxie, soustav, planet a asteroidů.
11. `feature/navigation-vehicles` — navigace Cassandry, shuttle a cestovní kontrakty.

Pořadí je výchozí závislostní plán; pokud návrh odhalí skutečnou technickou závislost, upraví se výslovně a zapíše do dokumentace.

### Fáze 3 — Integrační ověření kostry

V `integration/gameplay-test` postupně spojíme vybrané větve a ověříme, že jejich kontrakty spolu fungují.

Minimální demonstrační scénář:

1. Core vytvoří Game Context a inicializuje registrované systémy.
2. Construction vytvoří jednoduchou uzavřenou sekci.
3. Environment k sekci připojí environmentální stav.
4. Pawn Life zaregistruje Pawna.
5. Combat vyvolá událost poškození cíle.
6. Event Bus doručí událost odběratelům.
7. Resources zpřístupní testovací materiál.
8. Ship Systems poskytne minimální energetický stav.
9. Persistence uloží a obnoví stav účastníků a zachová jejich identifikátory/reference.

Cílem je ověřit komunikaci, vlastnictví dat, životní cyklus a obnovu stavu. Nejde ještě o kompletní hratelnost ani finální balance.

### Fáze 4 — Rozvoj jednotlivých systémů

Jakmile bude společný základ a kostra ověřená, budeme jednotlivé feature větve rozvíjet do funkčních herních celků.

- Každý systém se vyvíjí ve své původní feature větvi.
- Rozpracované kombinace se testují v integrační větvi.
- Změny veřejných kontraktů se koordinují s ostatními systémy.
- Dokončený a ověřený systém se po kontrole přenese do `main`.
- `main` nebude obsahovat nedokončené experimenty ani náhodně sloučené integrační změny.
- Při změně schválené architektury se nejprve upraví návrh a dokumentace.

---

## První konkrétní pracovní úkol

Začínáme pouze návrhem **Game Core** ve větvi `feature/core-architecture`.

Nejdříve podrobně navrhnout a společně schválit body 1.1 až 1.9. Neimplementovat je všechny najednou. Návrh rozdělit na malé části, u každé určit:

- odpovědnost a hranice,
- vlastněná data,
- veřejné API a datové kontrakty,
- závislosti na ostatních částech Core,
- chybové a okrajové stavy,
- způsob automatického ověření,
- návaznost na existující prototyp.

Po schválení návrhu implementovat Core po malých ověřitelných krocích. Každý krok kontrolovat proti `SYSTEM_ARCHITECTURE.md` a `RULES.md`.

## Pravidla průběžné aktualizace tohoto plánu

- Tento dokument obsahuje aktuální plán a otevřené návrhové úkoly, ne historii commitů.
- Po uzavření návrhového rozhodnutí aktualizovat příslušný bod a odstranit neplatné alternativy.
- Při změně pořadí nebo rozsahu uvést důvod a dopad na návazné systémy.
- Nová obecná pravidla práce zapisovat do `RULES.md`.
- Provedené implementace a jejich skutečný stav zapisovat do `WAHTWEDID.md`; aktuálně existující funkce popisovat v `WHATWEHAVE.md`.
