(function exposeUIStrings(global) {
  "use strict";

  const STRINGS = Object.freeze({
    latin: Object.freeze({
      popupTitle: "Prepiši",
      productName: "Prepiši",
      tagline: "Čitaj kako ti odgovara.",
      switchInterface: "Prikaži interfejs ćirilicom",
      scriptHeading: "Pismo",
      twoWay: "obostrano",
      targetScriptLabel: "Ciljno pismo",
      scriptOriginal: "Izvorno",
      scriptLatin: "Latinica",
      scriptCyrillic: "Ćirilica",
      dialectHeading: "Izgovor jata",
      lexicalTwoWay: "rečnički · obostrano",
      targetDialectLabel: "Ciljni izgovor",
      dialectOriginal: "Izvorni",
      dialectEkavian: "Ekavski",
      dialectIjekavian: "Ijekavski",
      dialectIkavian: "Ikavski",
      beta: "beta",
      dialectHelpPrefix: "Menja istorijski jat:",
      dialectHelpJatExample: "vetar ↔ vjetar",
      dialectHelpMiddle: ". Pisanje stranih imena, npr.",
      dialectHelpNameExample: "Richter ↔ Rihter",
      dialectHelpSuffix: ", zasebno je pravilo.",
      highlightWords: "Istakni promenjene reči",
      highlightHelp: "Samo promene izgovora, ne pisma",
      rememberSite: "Zapamti na ovom sajtu",
      rememberSiteHelp: "Isti izbor se primenjuje posle otvaranja linka",
      restore: "Vrati izvorni tekst",
      initialStatus: "Izbor se primenjuje odmah · tekst ostaje u tvom pregledaču.",
      settings: "Zaštićeni nazivi i podešavanja",
      localOnly: "bez slanja podataka",
      noActivePage: "Nema aktivne stranice.",
      tabConfigured: "Prikazana su podešavanja ove kartice · izbor se primenjuje odmah.",
      tabOriginal: "Ova kartica je još izvorna · izbor se primenjuje odmah.",
      rewriting: "Prepisujem vidljivi tekst…",
      highlightedCount: " · istaknuto reči: {count}",
      conversionDone: "Gotovo — promenjeno tekstualnih delova: {count}{highlighted}.",
      restoredDone: "Vraćen je izvorni tekst ({count} delova).",
      restrictedPage: "Ova sistemska stranica ne dozvoljava rad dodataka. Otvori običnu web-stranicu i pokušaj ponovo.",
      applyFailed: "Nije uspelo: {message}",
      siteRemembered: "Zapamćeno za {site}. Pristup važi samo za taj sajt.",
      siteForgotten: "Automatska primena je isključena za {site}.",
      sitePermissionDenied: "Bez dozvole za ovaj sajt izbor ostaje samo na trenutnoj stranici.",
      sitePersistenceUnsupported: "Ovaj pregledač ne podržava automatsku primenu posle navigacije.",
      settingsLoadFailed: "Podešavanja nisu učitana: {message}",

      optionsTitle: "Podešavanja — Prepiši",
      protectedNames: "Zaštićeni nazivi",
      protectedIntro: "Dodaj brendove, firme, lična imena ili stručne izraze koje dodatak nikad ne treba da prepisuje.",
      onePerLine: "Jedan naziv po redu",
      termsPlaceholder: "Moja Firma\nNaziv Proizvoda\nime.example",
      termsHelp: "Poređenje ne razlikuje velika i mala slova. URL adrese, e-adrese i @nalozi zaštićeni su automatski.",
      respectLanguages: "Sačuvaj posebno označene strane jezike",
      respectLanguagesHelp: "Ako stranica označi deo teksta kao engleski ili drugi strani jezik, taj deo ostaje netaknut.",
      builtInNames: "Ugrađeni zaštićeni nazivi",
      companySummary: "Uz to se čuva {uniqueNames} naziva firmi ({positions} mesta na listama): Fortune 500, FTSE 100, CAC 40, DAX 40 i IBEX 35. Nazivi firmi razlikuju velika i mala slova.",
      diagnosticsHeading: "Firefox Android dijagnostika",
      diagnosticsHelp: "Privremeno beleži samo tehničke faze za jedan test domen. Ne beleži tekst stranice ni punu URL adresu.",
      diagnosticsEnable: "Uključi lokalni dijagnostički dnevnik",
      diagnosticsHost: "Test domen",
      diagnosticsSave: "Sačuvaj dijagnostiku",
      diagnosticsClear: "Obriši dnevnik",
      diagnosticsEmpty: "Dnevnik je prazan.",
      diagnosticsHostRequired: "Unesi jedan test domen pre uključivanja dijagnostike.",
      diagnosticsSaved: "Dijagnostika je sačuvana lokalno.",
      diagnosticsCleared: "Dijagnostički dnevnik je obrisan.",
      diagnosticsTemporary: "Instalacija: privremena (web-ext)",
      diagnosticsSignedUnknown: "Instalacija: potpisana ili vrsta još nije zabeležena",
      saveSettings: "Sačuvaj podešavanja",
      savedLocally: "Sačuvano lokalno na ovom uređaju.",
      loadError: "Greška: {message}",
      privacyHeading: "Privatnost po dizajnu",
      privacyBody: "Prepiši obrađuje tekst lokalno. Nema naloga, analitike ni servera; trajni pristup postoji samo za sajt koji izričito zapamtiš."
    }),
    cyrillic: Object.freeze({
      popupTitle: "Препиши",
      productName: "Препиши",
      tagline: "Читај како ти одговара.",
      switchInterface: "Прикажи интерфејс латиницом",
      scriptHeading: "Писмо",
      twoWay: "обострано",
      targetScriptLabel: "Циљно писмо",
      scriptOriginal: "Изворно",
      scriptLatin: "Латиница",
      scriptCyrillic: "Ћирилица",
      dialectHeading: "Изговор јата",
      lexicalTwoWay: "речнички · обострано",
      targetDialectLabel: "Циљни изговор",
      dialectOriginal: "Изворни",
      dialectEkavian: "Екавски",
      dialectIjekavian: "Ијекавски",
      dialectIkavian: "Икавски",
      beta: "бета",
      dialectHelpPrefix: "Мења историјски јат:",
      dialectHelpJatExample: "ветар ↔ вјетар",
      dialectHelpMiddle: ". Писање страних имена, нпр.",
      dialectHelpNameExample: "Richter ↔ Rihter",
      dialectHelpSuffix: ", засебно је правило.",
      highlightWords: "Истакни промењене речи",
      highlightHelp: "Само промене изговора, не писма",
      rememberSite: "Запамти на овом сајту",
      rememberSiteHelp: "Исти избор се примењује после отварања линка",
      restore: "Врати изворни текст",
      initialStatus: "Избор се примењује одмах · текст остаје у твом прегледачу.",
      settings: "Заштићени називи и подешавања",
      localOnly: "без слања података",
      noActivePage: "Нема активне странице.",
      tabConfigured: "Приказана су подешавања ове картице · избор се примењује одмах.",
      tabOriginal: "Ова картица је још изворна · избор се примењује одмах.",
      rewriting: "Преписујем видљиви текст…",
      highlightedCount: " · истакнуто речи: {count}",
      conversionDone: "Готово — промењено текстуалних делова: {count}{highlighted}.",
      restoredDone: "Враћен је изворни текст ({count} делова).",
      restrictedPage: "Ова системска страница не дозвољава рад додатака. Отвори обичну веб-страницу и покушај поново.",
      applyFailed: "Није успело: {message}",
      siteRemembered: "Запамћено за {site}. Приступ важи само за тај сајт.",
      siteForgotten: "Аутоматска примена је искључена за {site}.",
      sitePermissionDenied: "Без дозволе за овај сајт избор остаје само на тренутној страници.",
      sitePersistenceUnsupported: "Овај прегледач не подржава аутоматску примену после навигације.",
      settingsLoadFailed: "Подешавања нису учитана: {message}",

      optionsTitle: "Подешавања — Препиши",
      protectedNames: "Заштићени називи",
      protectedIntro: "Додај брендове, фирме, лична имена или стручне изразе које додатак никад не треба да преписује.",
      onePerLine: "Један назив по реду",
      termsPlaceholder: "Моја Фирма\nНазив Производа\nime.example",
      termsHelp: "Поређење не разликује велика и мала слова. URL адресе, е-адресе и @налози заштићени су аутоматски.",
      respectLanguages: "Сачувај посебно означене стране језике",
      respectLanguagesHelp: "Ако страница означи део текста као енглески или други страни језик, тај део остаје нетакнут.",
      builtInNames: "Уграђени заштићени називи",
      companySummary: "Уз то се чува {uniqueNames} назива фирми ({positions} места на листама): Fortune 500, FTSE 100, CAC 40, DAX 40 и IBEX 35. Називи фирми разликују велика и мала слова.",
      diagnosticsHeading: "Firefox Android дијагностика",
      diagnosticsHelp: "Привремено бележи само техничке фазе за један тест домен. Не бележи текст странице ни пуну URL адресу.",
      diagnosticsEnable: "Укључи локални дијагностички дневник",
      diagnosticsHost: "Тест домен",
      diagnosticsSave: "Сачувај дијагностику",
      diagnosticsClear: "Обриши дневник",
      diagnosticsEmpty: "Дневник је празан.",
      diagnosticsHostRequired: "Унеси један тест домен пре укључивања дијагностике.",
      diagnosticsSaved: "Дијагностика је сачувана локално.",
      diagnosticsCleared: "Дијагностички дневник је обрисан.",
      diagnosticsTemporary: "Инсталација: привремена (web-ext)",
      diagnosticsSignedUnknown: "Инсталација: потписана или врста још није забележена",
      saveSettings: "Сачувај подешавања",
      savedLocally: "Сачувано локално на овом уређају.",
      loadError: "Грешка: {message}",
      privacyHeading: "Приватност по дизајну",
      privacyBody: "Препиши обрађује текст локално. Нема налога, аналитике ни сервера; трајни приступ постоји само за сајт који изричито запамтиш."
    })
  });

  function normaliseScript(script) {
    return script === "cyrillic" ? "cyrillic" : "latin";
  }

  function format(template, values = {}) {
    return template.replace(/\{([a-zA-Z]+)\}/gu, (_, key) => String(values[key] ?? ""));
  }

  function translate(script, key, values) {
    return format(STRINGS[normaliseScript(script)][key] || key, values);
  }

  function applyStaticText(document, script) {
    const selectedScript = normaliseScript(script);
    const strings = STRINGS[selectedScript];
    document.documentElement.lang = selectedScript === "cyrillic" ? "sr-Cyrl" : "sr-Latn";
    for (const element of document.querySelectorAll("[data-i18n]")) {
      element.textContent = strings[element.dataset.i18n] || element.dataset.i18n;
    }
    for (const attribute of ["aria-label", "title", "placeholder"]) {
      const dataName = `i18n${attribute.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("")}`;
      for (const element of document.querySelectorAll(`[data-${dataName.replace(/[A-Z]/gu, (letter) => `-${letter.toLowerCase()}`)}]`)) {
        const key = element.dataset[dataName];
        element.setAttribute(attribute, strings[key] || key);
      }
    }
  }

  global.PrepisiUI = Object.freeze({
    DEFAULT_SCRIPT: "latin",
    STRINGS,
    normaliseScript,
    translate,
    applyStaticText
  });
})(globalThis);
