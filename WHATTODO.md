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

Tato sekce je koncepční vodítko pro další návrhová okna. Popisuje zamýšlené principy, nikoliv hotovou technickou specifikaci. Při návrhu nových systémů je nutné kontrolovat, zda nejsou v rozporu s těmito pravidly nebo zda nevyžadují jejich vědomou změnu.

### 4.1 Dva herní režimy, dva způsoby práce

CASSANDRA má kombinovat strategickou základnovou hru s real-time expedicí:

- **Základna:** strategický denní cyklus. Pracovní činnosti pawnů jsou omezené odbornými AP a vyhodnocují se v rámci dne.
- **Expedice:** real-time top-down akční režim. Hráč přímo prozkoumává prostředí, pohybuje posádkou, bojuje a získává loot. Nepoužívají se zde základnové společný fond pracovních akcí.
- Původní tahová DNA hry se nezahazuje, ale pohyb pawnů na základně nemá působit jako klasický šachový/tile-by-tile tahový pohyb.

### 4.2 Pohyb pawnů na základně

- Pawni se mají pohybovat plynule a průběžně, vizuálně blíže colony simulacím typu RimWorld než čistě tahové hře.
- Plynulý pohyb a vizuální animace nejsou totéž co neomezená pracovní simulace.
- Profesní společný fond pracovních akcí omezuje **vykonávání práce**, nikoliv samotnou možnost pohybu.
- Pohyb, přesuny mezi místnostmi a rekreační animace nesmějí spotřebovávat společný fond pracovních akcí, pokud pro konkrétní herní činnost nebude později výslovně stanoveno jinak.
- Pawn může po dokončení práce přejít do rekreační oblasti a vizuálně tam vykonávat nepracovní činnosti.
- Přesná rychlost pohybu, navigace, kolize, pathfinding, rozvrhování a způsob simulace pohybu během strategického dne zůstávají k návrhu.

### 4.3 Pracovní fáze a připravenost dne

- Na začátku pracovního dne mají pawni k dispozici své denní společný fond pracovních akcí.
- Hráč zadává pracovní příkazy; pawn vykonává práci podle příkazů, dostupné společné pracovní kapacity, požadavků práce a pravidel AI.
- Pracovní fáze je dokončena, když každý pawn buď vyčerpal dostupnou pracovní kapacitu, dokončil přidělené úkoly, nebo už nemá dostupnou/platnou práci.
- Pawn, který nemá co dělat, nemá blokovat den jen proto, že mu zůstaly nevyužité AP.
- Po dokončení pracovních povinností se pawni přesunou do rekreačního režimu.
- Stav, kdy jsou všichni pawni mimo pracovní režim a v rekreačním/idle režimu, znamená **READY** – základna je připravena na expedici nebo denní přechod.
- Přesná definice „nemá co dělat“ (žádný příkaz, nedostupný cíl, chybějící surovina, nedostupný nástroj, blokovaná cesta apod.) musí být navržena tak, aby AI nezůstala zaseknutá a hráč rozuměl důvodu.

### 4.4 END TURN

- END TURN je explicitní hráčský synchronizační bod mezi strategickými dny.
- END TURN není dostupný, dokud pracovní fáze není dokončena a pawni nejsou ve stavu READY.
- END TURN není dostupný během aktivní expedice.
- Po potvrzení END TURN proběhne denní vyhodnocení a začne nový strategický den.
- Denní spotřeba základny (například jídlo a voda) se odečítá při denním vyhodnocení podle počtu pawnů a jejich individuálních modifikátorů.
- Denní spotřeba nemá být řešena jako nepřetržité food/drink bary, které by během základnového dne neustále tikaly. Základní záměr je dávkové vyhodnocení při přechodu dne.
- Přesné pořadí denního vyhodnocení, obnovy AP, produkce, spotřeby, stavů pawnů, událostí a dalších systémů není zatím rozhodnuto.
- END TURN a zahájení expedice jsou dvě různé akce: obě mohou být dostupné ve stavu READY, ale zahájení expedice nesmí samo o sobě posunout strategický den.

### 4.5 Rekreační režim („pawn v akváriu“)

- Po dokončení pracovních úkolů pawn přestane vykonávat placenou/pracovní činnost.
- V rekreačním režimu může vizuálně cvičit, číst, tančit, společensky interagovat nebo používat rekreační místnosti.
- Tyto činnosti jsou v první řadě vizuální/ambientní simulace, nikoliv další pracovní úkoly spotřebovávající AP.
- Během expedice mohou pawni, kteří zůstali na základně, pokračovat v těchto ambientních činnostech i dlouhou dobu reálného času.
- Délka reálného času expedice sama o sobě neposouvá strategický den základny.
- Zatím není rozhodnuto, zda a jak budou rekreační činnosti později ovlivňovat morálku, vztahy, regeneraci nebo jiné statistiky. Nesmí se to automaticky předpokládat.

### 4.6 Expedice jako real-time fáze

- Expedice je samostatný real-time herní režim, nikoliv další sada základnových tahů.
- Hráč ovládá expedující posádku v top-down prostředí; čas v misi běží plynule.
- Expedice nemá pevný limit délky v reálném čase ani povinný konec po určitém počtu minut.
- Délku mise omezují zásoby a stav posádky/výbavy, například munice, poškození, dostupné zdroje a schopnost bezpečně pokračovat.
- Hráč může expedici ukončit a vrátit se na základnu. Není nutné vyčerpat všechny zásoby ani vylootovat celou oblast.
- Navštívené sektory/oblasti mají uchovávat změny světa a loot, aby se do nich hráč mohl vrátit. Konkrétní persistence (například seed + uložené změny) je samostatné budoucí téma.

### 4.7 Sdílený strategický čas – bez paralelních kalendářů

- Základna a expedice sdílejí jeden strategický kalendář a jeden aktuální den.
- Během expedice se strategický den základny neposouvá. Základna čeká ve stejném dni, ve kterém byla expedice zahájena.
- Nelze na základně provést END TURN, zatímco je expedice aktivní.
- Nejde o dva nezávislé světy, které si každý počítají vlastní dny. Expedice je dočasná real-time fáze uvnitř jednoho společného strategického dne.
- Během expedice může základna nadále zobrazovat ambientní pohyb a rekreační animace pawnů, ale nesmí tím vznikat druhý strategický čas, další pracovní den ani automatická denní spotřeba.
- Po návratu se hráč vrátí do základnového režimu stále ve stejném strategickém dni a může provést END TURN.
- Reálná délka mise (například 20 minut nebo několik hodin) nemá automaticky znamenat stejný posun herního kalendáře.

### 4.8 Zásobování expedice

- Každá expedice dostane při odletu zásobovací balíček odpovídající **jednomu hernímu dni spotřeby celé posádky**.
- Balíček může zahrnovat kyslík, vodu a jídlo; množství se odvodí od počtu pawnů a jejich individuálních modifikátorů.
- Hráč musí před odletem vidět, kolik zásob expedice potřebuje a kolik jich shuttle skutečně veze.
- Při ukončení expedice se celý denní zásobovací balíček odečte, i když posádka část zásob nevyužila.
- Shuttle se vrací bez zbytků tohoto zásobovacího balíčku. Nevyužité zbytky se nepřevádějí zpět do základnového skladu.
- Jeden den zásob není pevný 24hodinový časovač mise. Jde o abstraktní nákladový balíček jedné expedice.
- Munice a další spotřební/technické zdroje mohou mít vlastní průběžnou spotřebu a mohou být důvodem k návratu.
- Přesná pravidla zásob, jejich typy, kapacita shuttle a chování při ztrátě/poškození shuttle zůstávají otevřená.

### 4.9 Délka letu, vzdálenost a motory

- Vzdálenější sektory mohou vyžadovat lepší nebo rychlejší motory shuttle.
- Technologie pohonu tak přirozeně rozšiřuje dostupný dosah expedic.
- Délka letu a způsob jejího zobrazení/řešení musí být sladěny s abstrakcí jednoho zásobovacího balíčku na expedici.
- Zatím není rozhodnuto, zda let mezi sektory bude přímo hratelný, reprezentovaný přechodem, nebo řešený jinou abstrakcí. Nesmí se předpokládat, že samotný let automaticky spotřebovává další strategické dny.

### 4.10 Návrhové invarianty a kolizní kontrola

Při návrhu každého nového systému ověřit:

1. Nepřidává systém druhý nezávislý strategický kalendář?
2. Neposouvá systém denní spotřebu nebo END TURN během aktivní expedice?
3. Nespotřebovává běžný pohyb pawnů společný fond pracovních akcí, které jsou určené pro práci?
4. Nevyžaduje systém specializovaného pawna pro úplně základní přežití, které má zvládnout i základní pawn?
5. Nezaměňuje systém společný fond pracovních akcí, XP a efektivitu?
6. Nepředpokládá systém, že expedice musí trvat přesně jeden herní den? Jeden den zásob je nákladová abstrakce, ne časový limit.
7. Nevyžaduje systém paralelní simulaci základny a expedice, když záměrem je jeden společný strategický den?
8. Respektuje systém možnost, že základna během expedice pouze ambientně žije, aniž by postupoval strategický čas?

Pokud nový návrh některý princip poruší, není automaticky zakázaný, ale konflikt musí být výslovně pojmenován a společně rozhodnut. Tento dokument má sloužit jako společná paměť návrhové ideologie napříč chaty i při budoucím návratu k jednotlivým systémům.


### 1.9 Aktualizace odbornýho modelu — novější návrh přebíjí starší body výše

Následující upřesnění nahrazují všechny rozporné starší návrhy v sekcích 1.2–1.4 a 1.8. Jde o aktuální návrhový směr, nikoliv ještě kompletní implementační specifikaci.

#### Počáteční mastery a náhodné generování

- Pawn začíná s jednou až třemi náhodně vybranými profesemi, podle rarity:
  - 1 profese: 95 % (Common).
  - 2 profese: 4,5 % (Rare).
  - 3 profese: 0,5 % (Very Rare).
- Každá počáteční specializace přidá **3 mastery hvězdičky** do náhodně vybrané profese.
- Pawn s jednou počáteční specializací má celkem 3 hvězdičky; se dvěma má 6; se třemi má 9.
- Mastery může postupně dosáhnout maximálně 6 hvězdiček v jedné profesi (aktuální pracovní limit).
- Každá mastery hvězdička přidává 1 AP pro danou profesi.
- Další mastery se získává náhodně podle postupu Pawna; přesná pravidla přidělování a ochrana proti překročení limitu 6 hvězdiček na profesi se dopracují v odborným systému.

#### Profesní XP, levely a efektivita

- Každá profese má vlastní XP a level 1–30. Pawn začíná na levelu 1 v každé profesi.
- Pawn získává XP do každé profese, jejíž činnost skutečně vykoná. XP jsou vedlejším důsledkem vykonané práce, nikoliv cílem, kvůli kterému by Pawn měl vybírat činnost.
- Každý dosažený nový level v libovolné profesi současně zvýší celkový Pawn level o 1. Celkový Pawn level tedy sleduje počet odborných level-upů; není to samostatný XP pool ani průměr/součet aktuálních levelů profesí.
- Každý odborný level přidává +10 % efficiency pro akce dané profese.
- Při levelu 30 má profese +300 % efficiency. Při modelu, kdy se základní cena akce dělí hodnotou (1 + efficiency), stojí akce s původní cenou 1 AP pouze 0,25 AP.
- Efektivita tak umožňuje specialistovi provést více levnějších akcí v rámci jeho společných pracovních akcí, případně vykonávat nákladné akce, které jsou pro základního Pawna prakticky nedostupné.
- Ilustrační příklad: Pawn se dvěma počátečními mastery specializacemi má dohromady 6 mastery hvězdiček, tedy 6 AP rozdělených mezi dvě profese. Při levelu 30 v jedné z těchto profesí může efektivita 300 % snížit cenu běžné akce z 1 AP na 0,25 AP; 6 AP tak odpovídá až 24 takovým akcím. Skutečný počet akcí závisí na ceně konkrétních akcí a dostupné Stamině.
- Starší návrh +5 AP za specializaci a starší varianta základního AP pro všechny profese nejsou součástí tohoto aktualizovaného modelu. Přesné zacházení s profesí bez mastery, její dostupnost a případné základní AP je stále potřeba výslovně uzavřít.

#### Získávání dalších mastery

- Další mastery se získává automaticky a náhodně podle celkového odbornýho postupu Pawna; hráč si konkrétní profesi nevybírá.
- Dřívější pravidlo „každých 10 levelů“ zůstává návrhovým směrem, ale musí být přesně definováno, zda se počítá celkový Pawn level, jak se vybírá cílová profese a jak se postup řeší při dosažení mastery limitu.
- Mastery není totéž co odborný level: level zvyšuje efficiency, mastery poskytuje AP.

#### Stamina jako náklad pracovních a bojových akcí

- Stamina je fyzický zdroj oddělený od společných pracovních akcí.
- Některé pracovní a bojové akce budou mít vlastní Stamina cost.
- Příklad: vytěžení jedné tile může stát 10 Stamina.
- Profesní AP určují pracovní kapacitu podle specializace a efektivity; Stamina omezuje, kolik fyzicky náročné práce Pawn zvládne.
- Akce proto mohou skončit na limitu AP nebo na limitu Stamina, podle toho, který zdroj dojde dříve.
- Cena Stamina, regenerace a pravidla vyčerpání se budou definovat pro jednotlivé akce a systémy. Tento bod zatím není implementační specifikací.

---

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

- Stamina zůstává samostatnou součástí Vitality.
- Bude se spotřebovávat při vybraných pracovních a bojových akcích podle jejich individuální ceny.
- Příklad: Mining může stát 10 Stamina za vytěženou tile.
- Profesní AP a Stamina mají odlišné role: AP vyjadřuje profesní pracovní kapacitu, Stamina fyzickou výdrž.
- Konkrétní ceny, regenerace, nulový stav a návazné Conditions se dopracují později.

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



### 1.10 Profesní tagy a datová struktura — aktuální rozhodnutí

Tato aktualizace přebíjí rozporné části staršího katalogu v sekcích 1.7–1.9. Jde o schválený základ datového modelu; konkrétní pracovní akce a jejich XP odměny se budou doplňovat samostatně.

#### Profesní katalog

Každý pracovní úkon bude mít právě jeden profesní tag. Pawn může vykonávat základní činnosti všech profesí; profesní úroveň ovlivňuje efektivitu, nikoliv samotnou dostupnost běžné práce.

Aktuální katalog obsahuje devět profesí:
1. **Mining** — prospecting a jakékoliv získávání surovin.
2. **Engineering** — infrastruktura, stavba bloků, nábytku, podlah a konstrukcí.
3. **Material Science** — zpracování surovin a případný vývoj slitin/kompozitů. Samostatný tag je odůvodněný, pokud bude zpracování materiálů rozsáhlým procesem vyžadovaným příslušnými stroji.
4. **Technician** — diagnostika, opravy, údržba, elektronika a robotika.
5. **Science** — analýza na místě, laboratorní výzkum, experimenty a zkoumání nových prvků/technologií.
6. **Fabrication** — výroba předmětů z již zpracovaných materiálů, například modulů, nábojů, zbraní a obleků.
7. **Soldier** — bojová efektivita, zacházení se zbraněmi, reakce, taktika, čištění zbraní a příprava výstroje po boji.
8. **Medicine** — diagnostika, ošetřování, léčba, chirurgie a péče o orgány.
9. **Operator** — přeprava, hauling, manipulace s nákladem a obsluha transportních prostředků/robotických transportérů. Přesný katalog činností zůstává otevřený.

Pilot se jako samostatná profese zatím nepoužije; řízení shuttle má být převážně automatizované/AI. Logistics se nahrazuje univerzálnějším názvem **Operator**. Robotika při opravách zůstává Technician; ovládání/obsluha transportních jednotek spadá pod Operator.

#### Výchozí data každé profese u nového Pawna

- Každý Pawn má od vytvoření záznam pro všech devět profesí.
- Každá profese začíná na **Level 1**, **XP 0/100** a **base AP 1**.
- Každá profese má vlastní XP a vlastní Level; XP z činnosti se připisují výhradně tagu daného úkonu.
- Každých 100 XP zvýší danou profesi o jeden Level. Po level-upu se XP dalšího levelu začínají od 0; přebytečné XP se přenášejí.
- Maximální Level je 30. Na Levelu 30 už další XP nepřibývají.
- Každý Level odpovídá +10 % efficiency; Level 1 tedy začíná na 10 % a Level 30 dosahuje +300 %. Přesné napojení efficiency na cenu jednotlivých akcí se řeší v pracovním systému.
- **AP a mastery jsou oddělené od XP/Levelu.** Každá profese má základní 1 AP. Mastery stars budou později přidávat další AP; nyní se připravuje pouze datové pole a žádné hvězdičky se negenerují.
- Základní osobní carry capacity, bonus z Expedition Suit a malý bonus za Soldier level jsou samostatné modifikátory nosnosti. Operator bude mít vlastní profesní přínos k transportu; konkrétní výpočet zatím není součástí tohoto základu.

#### Hranice aktuálního návrhu

- Nyní se připravuje pouze katalog, výchozí profesní data a pomocné operace pro XP/level/efficiency/AP.
- Neimplementuje se výběr počátečních specializací, náhodné mastery, denní reset/čerpání AP, pracovní příkazy, přiřazování tagů jednotlivým akcím, XP odměny konkrétních akcí, AI ani UI.
- Celkový Pawn level a jeho vztah k profesním level-upům zůstává zachován jako dřívější návrh, ale není součástí této implementační vrstvy.


### 1.11 Výchozí mastery a XP křivka — oprava a UI

Každý Pawn má všech devět profesí dostupných. Žádná profese není zamčená a žádná nemá nulové AP. Výchozí stav každé profese je **1 mastery star = 1 AP**. Mastery stars současně určují XP potřebné pro další profesní level:

- 1 star: 100 XP na level.
- 2 stars: 200 XP na level.
- 3 stars: 300 XP na level.
- Obecně: `XP required = 100 × masteryStars`.

Level 1–30 a +10 % efficiency za level zůstávají beze změny. Mastery ovlivňuje AP a tempo dalšího levelování; level ovlivňuje efficiency. Všechny profese jsou dostupné každému Pawnovi a lze je rozvíjet jejich vykonáváním.

Personnel UI obsahuje samostatnou záložku **PROFESSIONS** se všemi devíti profesemi, Level, XP progress barem, efficiency, AP a mastery stars. Konkrétní pracovní úkony, jejich tagy a XP odměny se doplní později.
