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
   - **Účel:** Event Bus je společný infrastrukturní mechanismus pro oznamování skutečností, které už nastaly. Umožňuje volnou komunikaci mezi systémy bez přímých závislostí na jejich interních implementacích.
   - **Schválený formát události (event envelope):**
     - `id`: unikátní identifikátor konkrétní události.
     - `type`: stabilní název události s doménovým prefixem, například `pawn.damaged` nebo `construction.section.created`.
     - `version`: celé číslo verze payload kontraktu; první verze začíná hodnotou 1.
     - `source`: stabilní ID systému, který událost publikoval.
     - `sequence`: monotónně rostoucí pořadové číslo přidělené Event Busem v rámci jeho běhu.
     - `payload`: datový objekt konkrétní události definovaný jejím kontraktem.
   - Povinný timestamp se nepoužívá. Pořadí událostí určuje `sequence`; Event Bus nezavádí druhý zdroj herního času.
   - Po publikování je payload neměnný. Každý typ události má definovaný datový kontrakt a verzi.
   - **Schválené doručování: synchronní fronta.** Publikovaná událost se vloží do fronty. Pokud právě neprobíhá doručování, Event Bus frontu synchronně zpracuje. Událost publikovaná handlerem během doručování se pouze přidá na konec fronty; nezpůsobí vnořené doručování. Vnější doručovací cyklus pokračuje, dokud fronta není prázdná.
   - Při běžném volání `publish()` se tedy událost zpracuje synchronně před návratem volajícího. Při volání uvnitř handleru se nová událost pouze zařadí do fronty a doručí se později v rámci právě probíhajícího cyklu.
   - **Odběry:** systémy se přihlašují ke konkrétnímu typu události a mohou odběr zrušit. Wildcard odběry ani prioritní odběry nejsou součástí první verze.
   - Více odběratelů dostává událost v pořadí registrace odběrů. Toto pořadí je deterministické při stejném pořadí inicializace a registrace.
   - Seznam odběratelů se pro každou událost stanoví v okamžiku zahájení jejího doručování. Změny odběrů provedené během doručování ovlivní až následující události; aktuálně doručovaná událost se dokončí podle původního seznamu.
   - Duplicitní odběr stejného systému na stejný typ události není povolen. Opakované odhlášení je bezpečné a nemá další účinek.
   - **Chyby handlerů:** každý handler se spouští izolovaně. Výjimka se zachytí a zaznamená přes Logger včetně typu události a ID systému; ostatní odběratelé událost přesto obdrží a fronta pokračuje. Automatické opakování handleru se neprovádí. Chyba handleru sama nevytváří další herní událost.
   - **Ochrana proti cyklům:** Event Bus má bezpečnostní limit počtu událostí zpracovaných v jednom vyprazdňování fronty. Při jeho překročení doručování bezpečně přeruší a zaznamená technickou chybu, aby vadný řetězec událostí nezamrazil hru.
   - **Události a příkazy jsou odlišné mechanismy.** Událost oznamuje již nastalou skutečnost a může mít více odběratelů. Příkaz žádá konkrétní systém o provedení akce a volá se přes jeho veřejné API/službu; Event Bus nebude sloužit jako univerzální command bus.
   - **Persistence:** Event Bus je v první verzi pouze běhový mechanismus. Události se automaticky neukládají, nepřehrávají po načtení hry a netvoří historii kampaně. Každý systém ukládá vlastní stav přes Persistence. Případný event journal, audit nebo replay lze doplnit později jako samostatnou funkci.
   - Event Bus ověřuje základní obálku události a platnost ID zdrojového systému. Konkrétní strukturu a význam payloadu definuje a dodržuje systém, který daný typ události publikuje.
   - **Výsledek návrhu:** deterministické synchronní doručování, izolace chyb odběratelů, jasné oddělení příkazů a událostí a žádná automatická persistence událostí. Návrh je uzavřen pro první verzi Core; případné rozšíření se bude řešit až podle skutečné potřeby hry.

4. **Game Clock, strategický čas, Simulation Scheduler a přechody expedice**
   - **Jediný autoritativní strategický čas:** v celé hře existuje jeden Game Clock, který vlastní strategický čas Cassandry. Nevznikne druhý herní, mission ani encounter clock.
   - Game Clock řídí strategický čas, rychlost, pauzu a předávání strategického delta/ticku. Příprava expedice probíhá v běžném základnovém režimu.
   - **Ověřený stav současného prototypu:** uživatelské ovládání má pauzu a rychlosti 1×, 2×, 3×. Výchozí stav je spuštěný na 1×. Pauzu lze přepínat tlačítkem Pause nebo mezerníkem; rychlost se nastavuje samostatnými tlačítky. `GameClock` uchovává `paused` a `speed` (rozsah 0,25–3), herní smyčka násobí reálný frame delta hodnotou `speed` a při pauze předává simulaci nulový delta. Ovládání Pause/1×/2×/3× je již implementované a otestované; při integraci se zachová, nebude se zbytečně přepisovat.
   - **Ověřený stav kalendáře prototypu:** strategický kalendář eviduje rok a den v rozsahu 1–365; přechod dne aktualizuje narozeniny a věk Pawnů. V současném prototypu je změna dne oddělená od Game Clock a probíhá ručně přes vývojářské nástroje. Automatické odvozování kalendářního dne z uplynulého strategického času zatím není implementováno.
   - **Schválené tempo strategického času:** jeden herní den trvá 12 reálných minut při rychlosti 1× (30 reálných sekund na herní hodinu, 0,5 reálné sekundy na herní minutu). Rychlosti 2×/3× zrychlují strategickou simulaci odpovídajícím poměrem.
   - Kalendář odvozuje dny výhradně z akumulovaného strategického času Game Clocku. Zachovává zlomkový zbytek, aby se při přechodech neztrácel čas. Při dokončení dne vyvolá událost, například `calendar.day.ended`; denní systémy na ni reagují. Kalendář nemá vlastní reálné hodiny ani nezávislý timer.
   - **Schválená rychlost pohybu Pawna:** 4 world units za reálnou sekundu při strategické rychlosti 1×, shodně na Cassandře i v asteroidovém encounteru. Pohyb v encounteru je real-time a není násoben strategickou rychlostí.
   - Fyzické tempo zbraní a akcí může být definováno v reálných sekundách (například interval útoku). Musí zůstat stejné bez ohledu na strategickou rychlost Game Clocku; nejde o strategický cooldown.
   - Strategické časovače herních efektů a cooldowny jsou zakázané. Efekty se řídí stavem, událostí, počtem použití, spotřebou prostředků nebo podmínkou. Consumables mohou mít okamžitý účinek. Detailní pravidla staminy, potřeb a Pawn Life se navrhnou v příslušném systému.
   - Jeden den odpovídá jednomu dennímu cyklu posádky. Běžné potřeby a činnosti mají být svižné; přesné délky a priority se navrhnou později v Pawn Life/Colony Automation.
   - Typický encounter má být dokončitelný přibližně do 30 minut. Jde o měkký designový cíl, nikoliv časovač, limit nebo automatické ukončení mise.
   - **Game Clock a Simulation Scheduler mají oddělené odpovědnosti.** Clock určuje množství a rychlost strategického času. Scheduler rozhoduje, kdy a v jakém kroku jednotlivé systémy provedou simulaci. Systémy mohou mít rozdílné aktualizační frekvence, ale všechny strategické výpočty vycházejí ze stejného autoritativního času.
   - **Pevný simulační krok (fixed timestep):** strategická simulace používá řízené, stabilní kroky místo toho, aby herní logika přímo závisela na nepravidelném FPS. Scheduler akumuluje čas a provádí potřebné kroky. Zbytek času se zachovává; nesmí se svévolně zahazovat.
   - Scheduler může omezit množství simulační práce v jednom vykreslovacím snímku, aby hra nezamrzala při dohánění. Pokud nestíhá, simulace se může dočasně zpomalit vůči reálnému času; nesmí však potichu přeskočit herní čas ani změnit výsledek.
   - **Ochrana proti přetížení:** Scheduler a Event Bus sledují délku fronty, rychlost jejího růstu a zpoždění simulace. Fronta má definovanou kapacitu a vysoký varovný práh. Při dosažení kritického prahu Scheduler pozastaví vytváření dalších simulačních kroků a vstupů, bezpečně dokončí právě rozpracovaný krok a vypořádá již vzniklé události. Hra se následně přepne do automatické nouzové pauzy a zobrazí diagnostickou informaci. Ochrana proti nekonečnému řetězení událostí zůstává jako samostatný tvrdý limit. Běžným řešením přetížení není zahazování nebo slučování herních událostí.
   - **Event Bus zůstává synchronní a sekvenční.** Jeho doručování se v první verzi nebude paralelizovat. Handler dokončí zpracování a následné události se doručí podle schválené fronty. Tím se zachová deterministické pořadí a omezí závody ve sdíleném herním stavu.
   - **Vícejádrový výkon:** architektura Scheduleru má umožnit paralelní provádění nezávislých výpočetních úloh na dostupných jádrech. Závislé úlohy se řídí závislostním grafem; změny společného herního stavu se aplikují v definovaných bezpečných bodech a deterministickém pořadí. Systémy nesmějí předpokládat neomezený výpočetní čas ani vytvářet zbytečnou práci pro každou entitu v každém kroku.
   - Ne každá část hry musí nebo může běžet paralelně. Prioritou je možnost rozdělit nákladné nezávislé výpočty, ne vynucovat paralelismus tam, kde by přinesl závody nebo režii. Plná reprodukovatelnost fyzikálních výpočtů napříč různým hardwarem není požadavkem první verze; požadujeme především deterministické pořadí systémových kroků a konzistentní stav v rámci běhu hry.
   - Simulace a vykreslování jsou oddělené. Renderer není vlastníkem herního stavu a neviditelná oblast se nepřestává simulovat jen proto, že není vykreslená. Dirty tiles/regions mohou omezit překreslování pouze na změněné oblasti.
   - **Událostmi aktivovaná simulace:** nečinné sekce nemusí neustále provádět nákladné environmentální výpočty. Relevantní změna aktivuje podrobnější simulaci dotčené sekce a případně skutečně ovlivněných sousedních/propojených sekcí. Konkrétní prahy a rozsah aktivace patří do Environment Systems.
   - **Herní okna a aktivní svět:** v jednom okamžiku je aktivní pouze jedno herní okno/svět. Input Controller směruje vstupy pouze do aktivního okna. Neaktivní svět nemůže přijímat hráčské příkazy ani měnit stav prostřednictvím UI či klávesových zkratek.
   - **Pauza je lokální pro aktivní herní okno.** Stisknutí ESC vyvolá pauzu aktivní mapy a otevře herní menu. Mimo expedici je aktivní Cassandra; během encounteru je aktivní asteroidová mapa. Mezerník a ostatní ovládací prvky nesmějí omylem odpauzovat nebo ovládat neaktivní svět.
   - Při aktivním encounteru je Cassandra zmrazená, její mapa je neaktivní a interakce s ní jsou deaktivované. Hráč nemůže přepnout zpět na Cassandru, dokud expedici neukončí. Cassandra se neodpouští ani nespouští jako vedlejší okno.
   - Hráčská pauza zastaví další simulační kroky aktivního světa. Právě rozpracovaný simulační krok a jeho synchronní doručování událostí se nejprve bezpečně dokončí; stav se nesmí zastavit uprostřed transakce nebo handleru.
   - **Ukládání kdykoliv:** hráč může uložit hru v libovolné fázi, včetně encounteru a tranzitu. ESC nejprve bezpečně pozastaví aktivní herní okno. Save se vytvoří na konzistentní hranici po dokončení právě rozpracovaného kroku a vypořádání jeho událostí. Po načtení se obnoví stejný svět, fáze expedice, stav simulace a herní situace; hra zůstane pozastavená, aby hráč pokračoval až vědomým odpauzováním.
   - **Režimy světa a simulace:** při běžném provozu Cassandry a během odletového i návratového tranzitu běží základnový Game Clock a simulace Cassandry. Po příletu shuttle do cílové lokality a aktivaci encounteru se základna zmrazí a běží pouze real-time simulace encounteru. Encounter nemá vlastní strategický čas a jeho délka se nikdy nepřičítá do času Cassandry.
   - **Jediný shuttle:** Cassandra má jeden shuttle a nová expedice nemůže začít, dokud se předchozí shuttle nevrátí a není opět připraven. Po návratu následuje kontrola, čištění a údržba použitého vybavení.
   - **Schválený průběh expedice:**
     1. Hráč připraví misi, vybere Pawny, vybavení a zásoby. Příprava může probíhat v běžném čase Cassandry.
     2. Při odletu Pawni a zásoby opustí základnový svět. Cassandra pokračuje v simulaci během odletového tranzitu.
     3. Po dokončení odletového tranzitu se zpřístupní Expedition Ready. Hráč aktivuje Start Encounter; vygeneruje/načte se samostatná asteroidová mapa, Cassandra se zmrazí a encounter se stane jediným aktivním herním oknem.
     4. Během encounteru hráč nemůže přepnout na Cassandru ani s ní interagovat. Cassandra zůstává beze změn. Encounter běží v real-time a lze jej kdykoliv pozastavit a uložit.
     5. Při zahájení encounteru se vytvoří výchozí snapshot expedičního stavu, zejména identita Pawnů, jejich XP/levely/skills, zdraví, vybavení a inventáře, počáteční zásoby a stav shuttle/nákladu. Snapshot umožní určit změny dosažené během mise.
     6. Při stisku End Expedition se encounter uzavře. Dokončí se poslední krok a události, vyhodnotí se výsledek a veškerá hráčská data se bezpečně převedou do expedičního manifestu/shuttle: aktuální stav Pawnů a jejich postup (XP/levely/skills), zdraví, vybavení, inventáře, loot, vytěžené suroviny a zbylé zásoby. Spotřeba se odečte ze zásob Cassandry; nový náklad zůstává na cestě v cargo shuttle a ještě není dostupný v lodním skladu.
     7. Přenos při End Expedition je atomický a idempotentní. Každý encounter/uzavření má jedinečné ID a potvrzení zpracování, aby se při chybě, uložení nebo obnově loot nepřičetl dvakrát, zásoby neodečetly opakovaně a Pawn nebyl duplikován. Cassandra nesmí být odpauzována, dokud není encounter uzavřen a veškerý hráčský stav bezpečně převeden nebo jinak vypořádán.
     8. Shuttle se poté objeví v datech světa Cassandry jako přepravní objekt s nákladem, cílem a časem příletu. Návratový tranzit trvá určenou dobu; přesný vzorec délky cesty a jeho vztah k délce mise se dopracuje v Navigation/Vehicles. Během návratu Cassandra simuluje a shuttle cargo zůstává nedostupný.
     9. Po příletu shuttle se shuttle objeví u doku a vrácení Pawni se spawnou na určených pozicích u doku. Obnoví se jejich aktuální stav, vybavení a inventáře; náklad se převede do lodního cargo systému. Po dokončení bezpečného převzetí se vyvolá Mission Briefing, hra se automaticky pozastaví a zobrazí se Mission Report. Obsah a UI reportu se navrhnou samostatně později.
     10. Teprve po bezpečném dokončení příletu a převzetí nákladu je shuttle zpět k dispozici pro údržbu a přípravu další mise.
   - **Vlastnictví a jediné umístění entit:** identita Pawna se při přesunech nemění, ale aktivní entita nesmí existovat na dvou mapách současně ani být současně v žádném světě a v shuttle. Při End Expedition se Pawn a jeho hráčská data převedou do manifestu/cargo shuttle; při příletu se znovu umístí na Cassandru. Entity Registry/World Context musí hlídat výlučné vlastnictví a bezpečné předání.
   - **Persistentní asteroid a uzavření encounteru:** asteroidová lokalita se nemaže. Zachová se její persistentní stav včetně skutečných trvalých změn způsobených hráčem (například rozbité/zničené zdi, vytěžená ložiska, změněný terén a zničené objekty). Dočasný runtime encounteru a dočasný hráčský vliv se odstraní: aktivní runtime instance Pawnů, projektily, dočasné entity a nepotřebné výpočty/reference. Po uzavření se lokalita dále aktivně nesimuluje; při další návštěvě se načte poslední persistentní stav a vytvoří se nová encounter instance. Co přesně je trvalá změna světa a co dočasný encounter stav musí být definováno kontraktem Mining/Exploration a Persistence.
   - Původní objekty a prostředí asteroidu se zachovávají podle jejich persistentních pravidel; odstraní se pouze dočasné runtime entity a vliv hráče, nikoli skutečné změny světa. Encounter je dočasná herní instance, asteroid je dlouhodobě uložená lokalita.
   - **Kalendář a čas při expedici:** příprava a odletový tranzit spotřebovávají strategický čas Cassandry. Aktivní encounter strategický čas Cassandry zastaví. Návratový tranzit jej znovu rozběhne. Délka encounteru se nikdy nedopočítává do základnového času.
   - **Denní cyklus posádky:** jeden cyklus odpovídá jednomu hernímu dni. Denní události se odvozují z Game Clocku; přesné potřeby, akce a priority se navrhnou v Pawn Life/Colony Automation.
   - **Otevřené implementační detaily:** přesná délka fixed timestepu a frekvence jednotlivých systémů; konkrétní plánovač paralelních úloh a bezpečné hranice pro aplikaci výsledků; kapacita a varovné/kritické prahy fronty Event Busu; pravidla obnovení po nouzové pauze; přesný vzorec návratového tranzitu; detailní datový kontrakt expedičního snapshotu a manifestu; transakční hranice End Expedition a příletu; schéma persistentních změn asteroidu; přesné ukládání runtime/persistentních částí encounteru. Tyto technické detaily navrhne implementace Core a navazujících systémů bez dalšího herního rozhodnutí, pokud nezmění hráčské chování.
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


### Návrhový podklad: modulární konstrukce Cassandry (před implementací)

Následující směr je schválený jako základ dalšího návrhu systému feature/colony-construction. Nejde o implementační specifikaci; přesné datové kontrakty, validační pravidla a edge cases je nutné dopracovat před psaním systému.

- Cassandra se staví na gridu jako modulární vesmírná stanice složená z funkčních sekcí a spojovacích chodeb/přechodových prefabs. Cílový vzhled je přehledná modulární konstrukce (volně inspirovaná stanicemi typu ISS), nikoli volné skládání jednotlivých stěn jako v RimWorldu.
- Sekce jsou samostatné prefaby s předdefinovaným půdorysem, vnější konstrukcí, vnitřním prostorem, Control Panelem a jedním hlavním pracovním modulem. Hlavní modul určuje funkci a název sekce. Každá sekce má právě jeden hlavní modul; další vybavení může být podpůrné/dekorativní. Detailní pravidla umisťování vybavení se dopracují později.
- Schválené základní rozměry sekcí (vnější rozměry včetně obvodové stěny):
  - Small: 6×6, vnitřní prostor 4×4.
  - Medium: 8×8, vnitřní prostor 6×6.
  - Large: 10×10, vnitřní prostor 8×8.
  - XL: 16×8, vnitřní prostor 14×6.
- U sekcí se zvažují oříznuté rohy pro vzhled; zatím není rozhodnuto, zda je bude mít i Small. První verze může začít s jednoduchými čtvercovými/obdélníkovými půdorysy.
- Sekce nemají vlastní konektory ani předem umístěné dveře. Připojení vzniká umístěním spojovací chodby k obvodové stěně sekce.
- Spojovací chodby jsou samostatné prefaby a samy definují své připojovací konektory. Při platném připojení se v obvodové stěně sekce automaticky vytvoří otvor odpovídající šířce chodby. Příklad: chodba s půdorysem 4×2 vytvoří průchod široký 4 pole. Průchod je skutečná změna konstrukční mapy, nikoli pouze grafický otvor; po odstranění chodby musí být možné otvor konstrukčně uzavřít.
- Katalog chodeb má být rozšiřitelný o různé tvary: základní rovný/čtvercový spojovací díl, T, L a čtyřsměrný (+) uzel; později další délky, šířky a tvary. Pro první hratelný test stačí několik základních prefabs.
- Sekce i chodby musí mít datově definované vlastnosti, aby později mohly nést například konstrukční integritu, spotřebu atmosféry a další parametry. Konkrétní environmentální a ekonomické atributy se nyní nenavrhují.
- Prefab katalog má být datově rozšiřitelný, přednostně přes JSON definice. Engine nesmí mít jednotlivé typy sekcí a chodeb natvrdo zakódované jako jediné povolené tvary. Budoucí interní prefab editor může vytvářet stejné JSON definice, které se načtou do herního katalogu; editor není součástí první implementace.
- Architektura má umožnit pozdější vlastní prefaby a případně nepravidelné půdorysy, ale první verze se může omezit na předdefinované čtvercové a obdélníkové sekce a malý katalog chodeb.
- Otevřené otázky před implementací konstrukce: přesná pravidla připojování a validace kolizí; orientace/rotace prefabů; jak chodba identifikuje a mění dotčené obvodové dlaždice sekcí; pravidla pro více spojení na jedné straně; vlastnictví a lifecycle vzniklých dveří/otvorů; odpojování a opravy; JSON schema/verzování; umisťování hlavního modulu a Control Panelu; limity a pravidla vlastních prefabů.

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
