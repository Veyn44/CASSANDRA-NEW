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


---

## 4. Čas, pohyb pawnů a režimy hry — společná ideologie

Tato sekce je koncepční vodítko pro další návrhová okna. Popisuje zamýšlené principy, nikoliv hotovou technickou specifikaci. Při návrhu nových systémů je nutné kontrolovat, zda nejsou v rozporu s těmito pravidly nebo zda nevyžadují jejich vědomou změnu.

### 4.1 Dva herní režimy, dva způsoby práce

CASSANDRA má kombinovat strategickou základnovou hru s real-time expedicí:

- **Základna:** strategický denní cyklus. Pracovní činnosti pawnů jsou omezené profesními AP a vyhodnocují se v rámci dne.
- **Expedice:** real-time top-down akční režim. Hráč přímo prozkoumává prostředí, pohybuje posádkou, bojuje a získává loot. Nepoužívají se zde základnové profesní AP.
- Původní tahová DNA hry se nezahazuje, ale pohyb pawnů na základně nemá působit jako klasický šachový/tile-by-tile tahový pohyb.

### 4.2 Pohyb pawnů na základně

- Pawni se mají pohybovat plynule a průběžně, vizuálně blíže colony simulacím typu RimWorld než čistě tahové hře.
- Plynulý pohyb a vizuální animace nejsou totéž co neomezená pracovní simulace.
- Profesní AP omezují **vykonávání práce**, nikoliv samotnou možnost pohybu.
- Pohyb, přesuny mezi místnostmi a rekreační animace nesmějí spotřebovávat profesní AP, pokud pro konkrétní herní činnost nebude později výslovně stanoveno jinak.
- Pawn může po dokončení práce přejít do rekreační oblasti a vizuálně tam vykonávat nepracovní činnosti.
- Přesná rychlost pohybu, navigace, kolize, pathfinding, rozvrhování a způsob simulace pohybu během strategického dne zůstávají k návrhu.

### 4.3 Pracovní fáze a připravenost dne

- Na začátku pracovního dne mají pawni k dispozici své denní profesní AP.
- Hráč zadává pracovní příkazy; pawn vykonává práci podle příkazů, dostupných AP, požadavků práce a pravidel AI.
- Pracovní fáze je dokončena, když každý pawn buď vyčerpal relevantní pracovní kapacitu, dokončil přidělené úkoly, nebo už nemá dostupnou/platnou práci.
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
3. Nespotřebovává běžný pohyb pawnů profesní AP, které jsou určené pro práci?
4. Nevyžaduje systém specializovaného pawna pro úplně základní přežití, které má zvládnout i základní pawn?
5. Nezaměňuje systém profesní AP, XP a efektivitu?
6. Nepředpokládá systém, že expedice musí trvat přesně jeden herní den? Jeden den zásob je nákladová abstrakce, ne časový limit.
7. Nevyžaduje systém paralelní simulaci základny a expedice, když záměrem je jeden společný strategický den?
8. Respektuje systém možnost, že základna během expedice pouze ambientně žije, aniž by postupoval strategický čas?

Pokud nový návrh některý princip poruší, není automaticky zakázaný, ale konflikt musí být výslovně pojmenován a společně rozhodnut. Tento dokument má sloužit jako společná paměť návrhové ideologie napříč chaty i při budoucím návratu k jednotlivým systémům.


### 1.9 Aktualizace profesního modelu — novější návrh přebíjí starší body výše

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
- Další mastery se získává náhodně podle postupu Pawna; přesná pravidla přidělování a ochrana proti překročení limitu 6 hvězdiček na profesi se dopracují v profesním systému.

#### Profesní XP, levely a efektivita

- Každá profese má vlastní XP a level 1–30. Pawn začíná na levelu 1 v každé profesi.
- Pawn získává XP do každé profese, jejíž činnost skutečně vykoná. XP jsou vedlejším důsledkem vykonané práce, nikoliv cílem, kvůli kterému by Pawn měl vybírat činnost.
- Každý dosažený nový level v libovolné profesi současně zvýší celkový Pawn level o 1. Celkový Pawn level tedy sleduje počet profesních level-upů; není to samostatný XP pool ani průměr/součet aktuálních levelů profesí.
- Každý profesní level přidává +10 % efficiency pro akce dané profese.
- Při levelu 30 má profese +300 % efficiency. Při modelu, kdy se základní cena akce dělí hodnotou (1 + efficiency), stojí akce s původní cenou 1 AP pouze 0,25 AP.
- Efektivita tak umožňuje specialistovi provést více levnějších akcí v rámci jeho profesních AP, případně vykonávat nákladné akce, které jsou pro základního Pawna prakticky nedostupné.
- Ilustrační příklad: Pawn se dvěma počátečními mastery specializacemi má dohromady 6 mastery hvězdiček, tedy 6 AP rozdělených mezi dvě profese. Při levelu 30 v jedné z těchto profesí může efektivita 300 % snížit cenu běžné akce z 1 AP na 0,25 AP; 6 AP tak odpovídá až 24 takovým akcím. Skutečný počet akcí závisí na ceně konkrétních akcí a dostupné Stamině.
- Starší návrh +5 AP za specializaci a starší varianta základního AP pro všechny profese nejsou součástí tohoto aktualizovaného modelu. Přesné zacházení s profesí bez mastery, její dostupnost a případné základní AP je stále potřeba výslovně uzavřít.

#### Získávání dalších mastery

- Další mastery se získává automaticky a náhodně podle celkového profesního postupu Pawna; hráč si konkrétní profesi nevybírá.
- Dřívější pravidlo „každých 10 levelů“ zůstává návrhovým směrem, ale musí být přesně definováno, zda se počítá celkový Pawn level, jak se vybírá cílová profese a jak se postup řeší při dosažení mastery limitu.
- Mastery není totéž co profesní level: level zvyšuje efficiency, mastery poskytuje AP.

#### Stamina jako náklad pracovních a bojových akcí

- Stamina je fyzický zdroj oddělený od profesních AP.
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
- Jaké akce spotřebovávají Stamina, kolik stojí a jak se regeneruje.
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
