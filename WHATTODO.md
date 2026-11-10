# WHATTODO

Pracovní seznam otevřených návrhů a rozhodnutí pro CASSANDRA-NEW.

Tento dokument zachycuje aktuální návrhový stav systémů, které jsme probírali, ale **nejsou finální specifikací ani implementačním zadáním**. Zejména profesní systém je pouze placeholder: má dostatečný konceptuální základ, ale před implementací potřebuje další návrh, balancování a ověření návazností.

## Aktuální směr práce

- Profesní systém zatím odložit jako návrhový placeholder.
- Vrátit se k základům hry a pokračovat v definování hlavní herní smyčky a základních systémů.
- Nezačínat implementovat profese, dokud nebudou dohodnuté jejich přesné hranice, pracovní činnosti, AP ekonomika, XP a efektivita.
- Tento soubor je pracovní poznámka; nenahrazuje vývojový deník `WAHTWEDID.md`.

---

## 1. Profesní systém — PLACEHOLDER / NEEDS COMPLETION

### 1.1 Základní princip

Každý pawn je schopen vykonávat základní činnosti všech profesí. Profese není podmínkou pro přístup k běžné práci; představuje odbornou specializaci.

Specialista zná vhodné nástroje, pracovní postupy a techniky, a proto má v dané profesi větší pracovní kapacitu a vyšší efektivitu.

Záměr: i jediný základní pawn musí být teoreticky schopen zajistit základní přežití sám. Specializovaní pawni zvyšují kapacitu a efektivitu kolonie, ale nejsou jedinou cestou k odemčení základních činností.

### 1.2 Akční body jsou oddělené podle profesí

- Neexistuje jeden univerzální fond AP, ze kterého by pawn platil všechny práce.
- Každý typ práce/profese má vlastní denní AP.
- Základní pawn má **1 AP pro každý typ práce**.
- Profesní specializace přidá předběžně **+5 AP do své profese**.
- Profesní AP nelze převádět mezi profesemi.
- Specializovaný Miner tedy nemá 15 univerzálních AP. Má například 6 Mining AP (1 základní + 5 profesních) a nadále jen 1 AP v každé jiné profesi.

Číselná hodnota +5 AP je pracovní návrh a musí být ověřena balancováním.

### 1.3 Profesní XP a levely

- Každá profese má vlastní XP a vlastní level.
- Pracovní činnosti patřící do jedné profese dávají XP této profesi.
- Podřízené činnosti (například prospecting a samotná těžba) nemají vlastní samostatné XP/levely; obě rozvíjejí Mining.
- Profesní level neuděluje další AP.
- Předběžný návrh: každý level přidává **+10 % increased efficiency** pro činnosti dané profese.
- Předběžný maximální profesní level: **30**.
- Efektivita má používat diminishing returns. Zvažovaný model je výsledná cena práce = základní cena / (1 + součet increased efficiency).
- Efektivita má snižovat spotřebu AP nebo zvyšovat množství práce provedené za AP; přesná interpretace a zaokrouhlování zatím nejsou uzavřeny.
- Žádné ruční investování bodů do podřízených činností. Level automaticky zvyšuje efektivitu celé profese.

Hodnoty +10 %, level cap 30 a vzorec jsou návrhové placeholdery, nikoliv finálně schválený balance.

### 1.4 Počáteční pawni a získávání profesí

- Kolonie by neměla začínat pouze s jedním pawnem. Pracovní návrh je začínat se čtyřmi pawny, které si hráč vytvoří/vylosuje podobně jako v colony survival hrách typu RimWorld.
- Počáteční profese by měly vytvářet rozdílné kombinace a nutit hráče plánovat, koho nechá na základně a koho vezme na expedici.
- Dříve diskutovaný návrh: pawn může začínat s jednou až třemi profesemi; více počátečních profesí je vzácnější.
- Dříve diskutovaný návrh: další profese se mohou náhodně odemykat po dosažení určitého součtu profesních levelů, například po každých 10 levelech, s limitem například čtyř profesí na pawna.
- Tyto hodnoty a pravidla je nutné znovu posoudit v kontextu nového modelu základního AP pro všechny profese. Zatím nejsou definitivní.

### 1.5 Leader

- Samostatná Leader profese není rozhodnutá.
- Původní univerzální Leader s přístupem ke všem profesím by mohl znehodnotit specializované pawny.
- Zvažuje se úplné odstranění Leader profese nebo případná nepracovní společenská/organizační funkce.
- Žádná varianta zatím není schválená.

### 1.6 Pracovní činnosti a AI

- Profese může obsahovat více pracovních činností.
- Pawn nemá náhodně vybírat mezi podřízenými činnostmi jen proto, aby získal XP.
- XP jsou vedlejší důsledek vykonané práce; pawn nemá optimalizovat chování kvůli XP.
- Pracovní příkaz, jeho předpoklady a pořadí závislých činností musí být definovány tak, aby pawn nevyčerpal AP na přípravné činnosti a nezanedbal vlastní zadanou práci.
- Příklad k dořešení: těžba může vyžadovat předchozí prospecting, pokud ložisko není známé.
- Musíme rozhodnout, zda se AP utrácí pouze za dokončené úkony, nebo zda lze úkon rozpracovat a pokračovat další den.
- Základní pracovní úkony musí být dostupné i pawnovi bez příslušné specializace, byť s nižší efektivitou.

### 1.7 Pracovní katalog profesí — předběžný seznam

Následující seznam je návrhový, ne finální. Profese, jejich názvy, hranice a odpovědnosti se musí postupně projít a schválit.

1. **Miner** — těžba, prospecting, zpřístupňování ložisek a práce s horninami.
2. **Engineer** — konstrukce, stavba, instalace a technické projekty.
3. **Soldier** — bojové činnosti, používání zbraní, taktika a obrana.
4. **Technician** — elektronika, diagnostika, opravy zařízení, kabeláž a údržba.
5. **Medic** — diagnostika, ošetřování, léčba a případně chirurgie.
6. **Scientist** — výzkum, experimenty, analýza a vývoj technologií.
7. **Pilot** — řízení shuttle, navigace a letové systémy.
8. **Logistician** — manipulace s nákladem, skladování, přeprava a distribuce.
9. **Farmer** — pěstování, hydroponie a produkce potravin.

Překryvy k vyřešení:
- Engineer × Technician: konstrukce versus opravy a elektronika.
- Miner × Engineer: těžba versus zpracování a příprava materiálů.
- Scientist × Technician: vývoj/experimenty versus obsluha a údržba zařízení.
- Pilot × Logistician: řízení přepravy versus manipulace s nákladem.

### 1.8 Povinné body k dopracování před implementací

- Kompletní seznam profesí a přesné hranice odpovědností.
- Zda všechny profese mají stejný základní 1 AP, včetně profesí používaných hlavně při expedici.
- Jak přesně funguje +5 profesních AP a zda se hodnota liší podle profese.
- Základní cena práce a jednotky práce pro každou činnost.
- Vzorec efektivity, minimální cena úkonu, desetinné AP a pravidla zaokrouhlování.
- Zda vyšší efektivita snižuje cenu AP, zvyšuje výstup, nebo kombinuje oba efekty.
- XP odměny, XP křivka a maximální level.
- Počáteční počet profesí, jejich generování a pravděpodobnosti.
- Náhodné odemykání dalších profesí a případný limit profesí na pawna.
- Leader: odstranit, nebo ponechat nepracovní funkci.
- Pracovní fronty, závislosti úkonů, priority a chování AI při nedostatku AP.
- Práce přesahující denní AP: dokončitelný úkon versus pokračování další den.
- Balanc sólo pawna: ověřit, že zvládne základní soběstačnost bez specialistů.

---

## 2. Hlavní herní smyčka — návrhové poznámky

Tato část zachycuje související směr, který vznikl při debatě o profesích. I tento celek potřebuje další rozpracování.

### Základna

- Základna používá strategický denní cyklus a profesní AP.
- Hráč přiděluje pawnům práci a plánuje využití jejich oddělených profesních AP.
- Jakmile všichni pawni dokončí práci nebo už nemají dostupnou práci, základna je připravena na další fázi.
- Pawni, kteří zůstávají doma, mohou přejít do vizuálního rekreačního režimu (například cvičení, čtení, tanec). Tento režim nemá posouvat strategický den.

### Expedice

- Expedice je real-time top-down akční režim bez profesních AP.
- Hráč může misi ukončit a vrátit se na základnu; navštívené oblasti mají do budoucna zachovávat změny a loot.
- Expedice se spouští až ve chvíli, kdy je základna připravena (pracovní fáze je dokončena).
- Během expedice nelze na základně použít END TURN.
- Základna zůstává ve stejném strategickém dni, zatímco hráč hraje expedici.

### Zásoby expedice

- Každá expedice si bere zásobovací balíček odpovídající jednomu hernímu dni pro celou posádku (například kyslík, voda a jídlo).
- Při ukončení expedice se celý tento balíček odečte, i když část zásob zůstala nevyužita.
- Shuttle se vrací bez zbylých denních zásob; získaný loot a stav posádky se předají základně.
- Skutečná délka mise může být různá; zásobovací balíček je herní limit, nikoliv pevný časovač 24 hodin.
- Dostupnost vzdálenějších sektorů může vyžadovat rychlejší/lepší motory.
- Nedostatek munice, poškození nebo jiné limity mohou hráče přimět expedici ukončit.

### Denní přechod

- END TURN na základně není dostupný, dokud je aktivní expedice.
- Po návratu hráč dokončí denní přechod.
- Denní spotřeba základny se odečítá při END TURN podle pawnů a jejich modifikátorů.
- Přesné pořadí denního vyhodnocení (spotřeba, produkce, práce, potřeby, obnova AP a události) musí být ještě definováno.

---

## 3. Návrat k základům hry

Po zaznamenání těchto návrhových poznámek se práce vrací k základům CASSANDRA-NEW.

Profesní systém zatím neimplementovat. Nejdříve znovu projít hlavní herní smyčku, základní stav hry, čas, pohyb pawnů, práci a vztah mezi základnou a expedicí. K profesím se vrátit až ve chvíli, kdy bude jasné, jak zapadají do těchto základních systémů.
