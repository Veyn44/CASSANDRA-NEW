# WHATTODO

Pracovní seznam otevřených návrhů a rozhodnutí pro CASSANDRA-NEW.

Tento dokument zachycuje aktuální návrhový stav systémů. Návrhy nejsou automaticky implementační specifikací; před implementací musí být jejich rozsah a návaznosti výslovně dohodnuty.

## Aktuální směr práce

- Nové systémy navrhovat tak, aby odpovídaly hlavní herní smyčce CASSANDRY.
- Preferovat malé, funkční a ověřitelné celky. Jakmile je návrh dostatečně jasný a schválený, implementovat jej jako dokončený celek místo hromadění nefunkčních nebo prázdných modulů.
- Neprovádět implementaci na základě pouhé brainstormovací úvahy. Nejprve uzavřít návrh a rozsah.
- Tento soubor je pracovní návrhová paměť; nenahrazuje vývojový deník `WAHTWEDID.md`.

---

## 1. Práce, kolektivní kapacita a odborné schopnosti — NOVÝ NÁVRH

Tato sekce nahrazuje celý předchozí profesní systém včetně jeho katalogu, AP, mastery stars, profesních levelů a pravidel XP. Starý model se nebude dále používat jako základ. Následující body zachycují nový směr; nejde ještě o finální implementační specifikaci.

### 1.1 Základní princip ovládání práce

- Hráč přímo zadává pracovní operace kliknutím na herní svět nebo příslušný objekt.
- Hra **nevytváří automatickou frontu pracovních úkolů**, která by se sama postupně vykonávala.
- Hra automaticky nepřiděluje jednotlivé pracovní úkoly konkrétním Pawnům.
- Jednotlivé operace se provedou na přímý podnět hráče, pokud má kolonie dostatečnou pracovní kapacitu a splňuje případné odborné požadavky.
- Záměrně se nepoužívá RimWorldový systém pracovních priorit ani ruční zaklikávání, které činnosti smí jednotliví Pawni vykonávat.
- Pracovní operace mají být svižné a přímo ovladatelné; hráč nemá čekat, až Pawn fyzicky dojde na pracoviště a úkon provede.
- Fyzická přítomnost a pohyb Pawnů na základně zůstávají důležité pro živost kolonie, ale běžná práce nemusí být vizuálně simulována jako individuální pracovní animace.

### 1.2 Stamina jako počet akcí kolonie

- Stamina zůstává individuální vlastností každého Pawna, ale její role v základnové práci se mění.
- Stamina se pro základnové pracovní operace **nespotřebovává jednotlivým Pawnům**. Pawnovi se při provedení akce nesnižuje jeho osobní hodnota.
- Na začátku pracovního tahu/koloniálního kroku se sečte Stamina všech Pawnů, kteří se započítávají do pracovní kapacity kolonie.
- Součet tvoří společný fond pracovních akcí kolonie pro daný tah.
- Příklad: pět Pawnů se Staminou 5 poskytuje kolonii celkem 25 akcí.
- Stamina je vyjádřena v jednotkách akcí, nikoliv ve staré škále 0–100. Výchozí hodnota 5 je pouze ilustrativní návrh, nikoliv uzavřený balance.
- Jedna základní operace typicky spotřebuje jednu akci: například vytěžit jedno políčko, připravit jedno jídlo nebo provést jednu jinou definovanou práci.
- Konkrétní operace mohou stát více než jednu akci; ceny a granularita se musí definovat podle skutečného herního významu.
- Počet akcí se odečítá ze společného fondu kolonie, nikoliv z individuální Staminy konkrétního Pawna.
- Obnova a přepočet společné kapacity probíhá v rámci tahového/denního cyklu; přesný okamžik a pravidla jsou otevřené.
- Balanc Staminy je zásadní, protože přímo určuje počet operací, které hráč může v jednom tahu provést.

### 1.3 Kolektivní odborná úroveň

- Odbornost kolonie může vycházet z individuálních schopností a zkušeností Pawnů.
- Pracovní oblasti jako Mining, Engineering nebo Medicine mohou zůstat jako kategorie odbornosti, ale nejsou seznamem povolených běžných činností.
- Zvažovaný model: individuální skill Pawnů se agreguje do kolektivní odbornosti kolonie.
- Prostý součet skillů je jednoduchý výchozí model, ale není definitivně rozhodnuto, zda se bude používat prostý součet, průměr, vážený součet nebo jiná agregace.
- Kolektivní odbornost může ovlivňovat efektivitu, kvalitu, výtěžnost nebo dostupnost odborných operací.
- Odbornost a pracovní kapacita jsou dvě oddělené veličiny: skill vyjadřuje znalost/odbornost, Stamina určuje počet dostupných akcí.
- Kolektivní odbornost nesmí automaticky znamenat, že několik nezkušených Pawnů dokáže nahradit konkrétního experta ve všech odborných úkonech.

### 1.4 Běžné práce a odborné operace

- Základní činnosti mají být dostupné celé kolonii bez přiřazení profese konkrétnímu Pawnovi.
- Příklad: těžbu horniny může zadat hráč a může ji provést kolonie i bez specialisty Mining.
- Odborné operace představují samostatné schopnosti, které mohou vyžadovat určitou úroveň individuálního skillu, existenci specialisty nebo jinou odbornou podmínku.
- Příklad: **Prospecting** je odborná operace Mining. Umožní odhalit část skrytého složení horniny před těžbou.
- Základní těžba a odborný průzkum jsou odlišné operace: první odstraňuje materiál, druhá poskytuje hráči informace pro rozhodování.
- Další možné odborné operace (diagnostika, analýza, pokročilé opravy, výzkum apod.) se budou definovat až podle skutečných potřeb hry.
- Odborné operace mají být aktivně zadávané hráčem, nikoliv automaticky spouštěné jako pasivní bonus bez jeho vědomí.
- Přesné požadavky operací, jejich ceny, výstupy a návaznost na individuální či kolektivní skill zůstávají otevřené.

### 1.5 Materiálové složení a průzkum

- Jednotlivá políčka horniny mohou mít skryté materiálové složení tvořené základní horninou a několika příměsemi.
- Bez odborného průzkumu hráč zná pouze základní/viditelnou informaci o hornině.
- Prospecting může odhalit další složky podle odbornosti provádějícího specialisty.
- Příklad návrhu: slabší prospektor odhalí základní horninu a dvě další složky; vyšší odbornost může odhalit více informací nebo přesnější koncentrace.
- Počet složek, jejich distribuce, koncentrace, způsob odhalování a herní ekonomika ložisek nejsou rozhodnuté.
- Průzkum musí mít strategický význam: získané informace mají hráči pomoci rozhodnout, kde se vyplatí těžit.

### 1.6 Automatizace základny a pohyb Pawnů

- Běžné pracovní úkony se mohou vyhodnotit abstraktně/okamžitě po hráčově příkazu, bez fyzického přesunu Pawna.
- Získaný materiál může být po vytěžení automaticky připsán do skladu; samostatné přenášení po základně nemusí být samostatnou pracovní činností.
- Základna nemá být simulátorem každého logistického kroku. Činnosti bez zajímavého rozhodnutí lze abstrahovat nebo úplně odstranit.
- Pawni se přesto mají fyzicky pohybovat mezi moduly a vytvářet dojem živé posádky.
- Ambientní chování může vybírat cílové moduly podle vah, potřeb, dostupnosti a jednoduchých podmínek. Příklad: Social Room s vyšší vahou návštěvy, postel s vahou podmíněnou únavou.
- Pohyb a ambientní chování nemají vytvářet pracovní fronty ani samovolně spotřebovávat společný fond pracovních akcí.
- Některé interakce mohou i nadále vyžadovat fyzickou přítomnost konkrétního Pawna, pokud to má herní význam (například přístup k Bridge Console).

### 1.7 Hlavní otevřená rozhodnutí

- Jak přesně se počítá společná akční kapacita z individuální Staminy a kteří Pawni se do ní započítávají.
- Zda se Stamina obnovuje plně každý tah, nebo se její hodnota mění jiným způsobem.
- Zda základní operace stojí vždy jednu akci, nebo mohou mít různé celočíselné ceny.
- Jak se kolektivní skill agreguje a zda odborná operace vyžaduje konkrétního experta, nebo postačuje kolektivní hodnota.
- Jak se individuální zkušenost získává, ukládá a zobrazuje.
- Zda existují vrozené talenty/aptitude a jak ovlivňují učení.
- Jak se vybírá odborník pro odbornou operaci, pokud je jich v kolonii více.
- Jak se řeší odborná operace, pokud žádný Pawn nesplňuje požadavek.
- Které pracovní činnosti vůbec stojí za samostatnou simulaci a které lze abstrahovat.
- Jaké činnosti mají mít vlastní cenu akce a jaký je jejich balance.
- Jak přesně se hráči zobrazí kolektivní kapacita a odborné schopnosti kolonie.

---

## 2. Hlavní herní smyčka — nový pracovní model

### Základna

- Hráč během pracovního tahu přímo zadává jednotlivé operace.
- Každá operace spotřebuje určený počet akcí ze společného fondu kolonie.
- Hra nevytváří automatickou pracovní frontu a nepřiděluje běžné práce jednotlivým Pawnům.
- Jakmile hráč vyčerpá dostupné akce nebo už nechce pokračovat, může přejít k další fázi podle pravidel herního cyklu.
- Pawni na základně se mezitím mohou pohybovat a vykonávat ambientní nepracovní činnosti.
- Základna má být aktivně ovladatelná a zajímavá, nikoliv pouze pasivní obrazovka mezi expedicemi.

### Expedice

- Expedice je real-time top-down akční režim.
- Základnový fond pracovních akcí se nepoužívá pro běžné akce expedice, pokud nebude výslovně navrženo jinak.
- Hráč může misi ukončit a vrátit se na základnu; navštívené oblasti mají do budoucna zachovávat změny a loot.
- Během expedice nelze na základně použít END TURN.
- Základna zůstává ve stejném strategickém dni, zatímco hráč hraje expedici.

### Denní přechod

- END TURN zůstává explicitním hráčským synchronizačním bodem.
- Přesné pořadí denního vyhodnocení (spotřeba, produkce, potřeby, obnova společné pracovní kapacity a události) musí být definováno.
- Společná pracovní kapacita se přepočítává podle pravidel Staminy v rámci tahu/denního cyklu; přesný okamžik je otevřený.

---

## 3. Návrat k základům hry

Nový model práce a kolektivní kapacity je návrhovým směrem, který musí být propojen s hlavní herní smyčkou, časem, pohybem Pawnů a expedicí.

Před implementací každé části ověřit, zda tvoří funkční a dokončený celek. Nezakládat prázdné moduly jen jako příslib budoucího systému. Jakmile je konkrétní rozsah návrhu schválen, implementovat jej a ověřit jeho návaznosti.

## 4. Čas, pohyb pawnů a režimy hry — společná ideologie

Tato sekce zachycuje zamýšlené principy herního času, pohybu a režimů. Musí být čtena společně s novým pracovním modelem v sekcích 1 a 2.

### 4.1 Dva herní režimy

- **Základna:** strategický denní/tahový cyklus. Hráč přímo zadává jednotlivé pracovní operace a spotřebovává společnou pracovní kapacitu kolonie.
- **Expedice:** real-time top-down akční režim. Hráč přímo prozkoumává prostředí, pohybuje posádkou, bojuje a získává loot.
- Základnová pracovní kapacita se nepoužívá pro běžné akce expedice, pokud nebude výslovně rozhodnuto jinak.
- Pohyb Pawnů na základně má být plynulý a vizuálně živý, nikoliv klasický šachový/tile-by-tile tahový pohyb.

### 4.2 Pohyb pawnů na základně

- Pawni se mají pohybovat plynule a průběžně.
- Pohyb, přesuny mezi místnostmi a rekreační animace nespotřebovávají společnou pracovní kapacitu.
- Běžná práce nemusí vyžadovat fyzický přesun Pawna na pracoviště; pracovní operace se mohou vyhodnotit abstraktně po přímém příkazu hráče.
- Pawn může po skončení hráčových pracovních akcí přejít do rekreační oblasti a vizuálně tam vykonávat nepracovní činnosti.
- Přesná rychlost pohybu, navigace, kolize a pathfinding zůstávají samostatnými technickými tématy.

### 4.3 Pracovní fáze a připravenost dne

- Hráč zadává jednotlivé operace přímo; hra nevytváří automatickou pracovní frontu.
- Každá operace spotřebuje určený počet akcí ze společného fondu kolonie.
- Hráč rozhoduje, kdy už nechce v daném tahu pokračovat a přejde k expedici nebo END TURN podle aktuálního stavu hry.
- Pawni, kteří právě nevykonávají žádnou hráčem zadanou činnost, mohou přejít do ambientního/rekreačního režimu.
- Ambientní režim nesmí sám spotřebovávat pracovní akce ani blokovat další fázi hry.

### 4.4 END TURN

- END TURN je explicitní hráčský synchronizační bod mezi strategickými dny.
- END TURN není dostupný během aktivní expedice.
- Po potvrzení END TURN proběhne denní vyhodnocení a začne nový strategický den.
- Denní spotřeba základny (například jídlo a voda) se vyhodnocuje podle pravidel příslušných systémů.
- Obnova/přepočet společné pracovní kapacity podle individuální Staminy musí být součástí denního cyklu; přesné pořadí vyhodnocení zůstává otevřené.
- Zahájení expedice a END TURN jsou dvě různé akce. Zahájení expedice samo o sobě neposouvá strategický den.

### 4.5 Rekreační režim („pawn v akváriu“)

- Pawni, kteří nevykonávají hráčem zadanou práci, se mohou vizuálně pohybovat po základně a používat rekreační místnosti.
- Mohou cvičit, číst, tančit, společensky interagovat nebo používat jiné moduly.
- Tyto činnosti jsou v první řadě vizuální/ambientní simulace, nikoliv pracovní úkoly spotřebovávající společné akce.
- Během expedice mohou pawni, kteří zůstali na základně, pokračovat v ambientních činnostech.
- Zatím není rozhodnuto, zda a jak rekreační činnosti ovlivňují morálku, vztahy, regeneraci nebo jiné statistiky.

### 4.6 Expedice a sdílený strategický čas

- Expedice je samostatný real-time herní režim, nikoliv další sada základnových tahů.
- Základna a expedice sdílejí jeden strategický kalendář a jeden aktuální den.
- Během expedice se strategický den základny neposouvá; základna čeká ve stejném dni, ve kterém byla expedice zahájena.
- Nelze na základně provést END TURN, zatímco je expedice aktivní.
- Reálná délka mise nemá automaticky znamenat posun herního kalendáře.
- Navštívené sektory/oblasti mají uchovávat změny světa a loot, aby se do nich hráč mohl vrátit.

### 4.7 Zásobování expedice

- Každá expedice dostane při odletu zásobovací balíček odpovídající jednomu hernímu dni spotřeby celé posádky.
- Balíček může zahrnovat kyslík, vodu a jídlo; množství se odvodí od počtu Pawnů a jejich individuálních modifikátorů.
- Hráč musí před odletem vidět, kolik zásob expedice potřebuje a kolik jich shuttle skutečně veze.
- Při ukončení expedice se celý denní zásobovací balíček odečte, i když posádka část zásob nevyužila.
- Jeden den zásob není pevný 24hodinový časovač mise. Jde o abstraktní nákladový balíček jedné expedice.
- Munice a další spotřební/technické zdroje mohou mít vlastní průběžnou spotřebu a mohou být důvodem k návratu.
- Přesná pravidla zásob, kapacita shuttle a chování při ztrátě/poškození shuttle zůstávají otevřená.

### 4.8 Návrhové invarianty a kolizní kontrola

Při návrhu každého nového systému ověřit:

1. Nepřidává systém druhý nezávislý strategický kalendář?
2. Neposouvá systém denní spotřebu nebo END TURN během aktivní expedice?
3. Nespotřebovává běžný pohyb Pawnů společnou pracovní kapacitu?
4. Nevytváří systém automatickou pracovní frontu nebo pracovní priority, kterým se nový model záměrně vyhýbá?
5. Nezaměňuje systém individuální Staminu, společnou pracovní kapacitu a odbornou zkušenost?
6. Respektuje systém možnost, že základna během expedice pouze ambientně žije, aniž by postupoval strategický čas?

Pokud nový návrh některý princip poruší, konflikt musí být výslovně pojmenován a společně rozhodnut.

## 5. Vitality System — návrhový směr / NEEDS DESIGN

Vitality má být společná oblast pro biologický a fyzický stav Pawna. Nejde o jedinou souhrnnou číselnou hodnotu; jde o nadřazené členění několika samostatných subsystémů.

### 5.1 Food

- Pawn má vlastní Food ukazatel.
- Food se spotřebovává průběžně během lokální simulace, nikoliv jednorázovým odečtem při END DAY.
- Pawn na základně může automaticky sáhnout do dostupných zásob, když jeho Food klesne pod stanovený práh.
- Příklad k balancování: při poklesu pod 20 % si Pawn vezme konzervu, která doplní 60 % Food; konzerva se odečte ze skladu.
- Práh, velikost doplnění, spotřeba, přístup ke skladům a pravidla pro Pawn mimo základnu zůstávají otevřené.
- Při nedostatku jídla musí vznikat odpovídající Condition; konkrétní stupně a následky se navrhnou později.

### 5.2 Water

- Water má vlastní ukazatel oddělený od Food.
- Voda se rovněž spotřebovává průběžně a doplňuje se z dostupných zásob podle vlastních pravidel.
- Mechanika doplňování, spotřeby, zásobování na expedici a Conditions při nedostatku vody zůstává otevřená.

### 5.3 Health a anatomie

- Health zůstává propojené s anatomickými částmi těla; nemá vzniknout druhý nezávislý pool HP.
- Do anatomie chceme doplnit základní vnitřní orgány.
- Předběžný seznam orgánů: brain, heart, lungs, liver, stomach a kidneys. Seznam není uzavřený.
- Orgány budou mít vlastní stav/funkčnost a případně vlastní HP; jejich přesná datová struktura a vztah k HP vnějších částí těla se musí navrhnout.
- Poškození orgánů má v budoucnu umožnit specifické následky a medicínské zásahy. Nyní se pouze připravuje architektonický prostor; simulace orgánů ani chirurgie se zatím neimplementují.

### 5.4 Stamina

- Stamina je individuální vlastnost každého Pawna.
- V základnovém pracovním modelu se individuální Stamina nespotřebovává při každé akci; její hodnota přispívá do společné pracovní kapacity kolonie.
- Společná kapacita se získá součtem Staminy započítávaných Pawnů a určuje počet dostupných pracovních operací v tahu.
- Příklad: pět Pawnů se Staminou 5 poskytuje 25 společných pracovních akcí.
- Stamina má být vyjádřena v jednotkách akcí; výchozí hodnota 5 je pouze ilustrativní návrh.
- Přesný přepočet, obnova, vliv zdravotního stavu a zacházení s Pawnem mimo základnu zůstávají otevřené.
- Stamina a odborná zkušenost jsou oddělené veličiny: Stamina určuje množství práce, skill její odbornost/efektivitu.

### 5.5 Vyčerpání a Conditions

- Při poklesu Vitality na 0 se zvažuje **Catatonic** stav jako projev úplného vyčerpání.
- Přesná definice hodnoty Vitality, která může klesnout na 0, a její vztah k dílčím ukazatelům Food, Water, Health a Stamina nejsou rozhodnuté.
- Catatonic zatím není finální Condition ani schválené pravidlo; je to návrh k dalšímu rozpracování.
- Conditions budou vznikat z konkrétních herních situací a budou se postupně doplňovat. Nyní je potřeba připravit pouze obecnou strukturu Conditions, nikoliv celý katalog stavů.
- AI Behavior, která bude na Conditions reagovat, se bude řešit později.

### 5.6 Otevřené otázky Vitality

- Zda Vitality bude mít vlastní agregovanou hodnotu, nebo bude pouze kontejnerem pro Food, Water, Health a Stamina.
- Jak přesně funguje průběžná spotřeba Food a Water, včetně expedice a nedostupnosti zásob.
- Jak se řeší rozdělování omezených zásob mezi více Pawnů.
- Jak se vyhodnocuje stav při nulovém Food nebo Water a zda mohou dílčí hodnoty přecházet pod nulu.
- Jak se definuje Catatonic a zda vychází z jedné hodnoty, kombinace více hodnot, nebo konkrétních Conditions.
- Jak se individuální Stamina převádí na společnou pracovní kapacitu, jak se obnovuje a jak ji ovlivňují zdravotní stavy.
- Jak budou orgány začleněny do anatomie a jak jejich poškození ovlivňuje Health a Conditions.
