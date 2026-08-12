(function initialisePrepisiConverter(root) {
  "use strict";

  if (root.PrepisiConverter) return;

  const CYRILLIC_TO_LATIN = Object.freeze({
    "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "ђ": "đ",
    "е": "e", "ж": "ž", "з": "z", "и": "i", "ј": "j", "к": "k",
    "л": "l", "љ": "lj", "м": "m", "н": "n", "њ": "nj", "о": "o",
    "п": "p", "р": "r", "с": "s", "т": "t", "ћ": "ć", "у": "u",
    "ф": "f", "х": "h", "ц": "c", "ч": "č", "џ": "dž", "ш": "š"
  });

  const LATIN_TO_CYRILLIC = Object.freeze({
    "a": "а", "b": "б", "c": "ц", "č": "ч", "ć": "ћ", "d": "д",
    "dž": "џ", "đ": "ђ", "e": "е", "f": "ф", "g": "г", "h": "х",
    "i": "и", "j": "ј", "k": "к", "l": "л", "lj": "љ", "m": "м",
    "n": "н", "nj": "њ", "o": "о", "p": "п", "r": "р", "s": "с", "ś": "с́",
    "š": "ш", "t": "т", "u": "у", "v": "в", "z": "з", "ź": "з́", "ž": "ж"
  });

  let dialectData = root.PrepisiDialectData;
  if (!dialectData && typeof module !== "undefined" && module.exports) {
    // Node-based checks load the same browser data file without bundling.
    dialectData = require("./dialect-data.js");
  }

  let companyData = root.PrepisiCompanyNames;
  if (!companyData && typeof module !== "undefined" && module.exports) {
    companyData = require("./generated/company-names.js");
  }

  // Kept as a compact fallback for one-file embeds. The extension itself loads
  // the reviewed, family-based data file before this converter.
  const LEGACY_DIALECT_GROUPS = Object.freeze([
    ["mleko", "mlijeko", "mliko"], ["mleka", "mlijeka", "mlika"],
    ["mleku", "mlijeku", "mliku"], ["mlekom", "mlijekom", "mlikom"],
    ["mlečni", "mliječni", "mlični"], ["mlečna", "mliječna", "mlična"],
    ["mlečno", "mliječno", "mlično"],
    ["vreme", "vrijeme", "vrime"], ["vremena", "vremena", "vrimena"],
    ["vremenu", "vremenu", "vrimenu"], ["vremenom", "vremenom", "vrimenom"],
    ["reč", "riječ", "rič"], ["reči", "riječi", "riči"],
    ["rečima", "riječima", "ričima"], ["rečnik", "rječnik", "ričnik"],
    ["reka", "rijeka", "rika"], ["reke", "rijeke", "rike"],
    ["reku", "rijeku", "riku"], ["rekom", "rijekom", "rikom"],
    ["mesto", "mjesto", "misto"], ["mesta", "mjesta", "mista"],
    ["mestu", "mjestu", "mistu"], ["mestom", "mjestom", "mistom"],
    ["mesni", "mjesni", "misni"],
    ["uvek", "uvijek", "uvik"], ["zauvek", "zauvijek", "zauvik"],
    ["gde", "gdje", "di"], ["ovde", "ovdje", "ovdi"],
    ["negde", "negdje", "negdi"], ["nigde", "nigdje", "nigdi"],
    ["svugde", "svugdje", "svugdi"],
    ["cvet", "cvijet", "cvit"], ["cveta", "cvijeta", "cvita"],
    ["cvetu", "cvijetu", "cvitu"], ["cvetovi", "cvjetovi", "cvitovi"],
    ["cveće", "cvijeće", "cviće"],
    ["sneg", "snijeg", "snig"], ["snega", "snijega", "sniga"],
    ["snegu", "snijegu", "snigu"],
    ["greh", "grijeh", "grih"], ["greha", "grijeha", "griha"],
    ["grešni", "grješni", "grišni"],
    ["smeh", "smijeh", "smih"], ["smeha", "smijeha", "smiha"],
    ["smešan", "smiješan", "smišan"], ["smešno", "smiješno", "smišno"],
    ["lep", "lijep", "lip"], ["lepa", "lijepa", "lipa"],
    ["lepo", "lijepo", "lipo"], ["lepi", "lijepi", "lipi"],
    ["lepog", "lijepog", "lipog"], ["lepše", "ljepše", "lipše"],
    ["dete", "dijete", "dite"], ["deteta", "djeteta", "diteta"],
    ["detetu", "djetetu", "ditetu"], ["detetom", "djetetom", "ditetom"],
    ["deca", "djeca", "dica"], ["dece", "djece", "dice"],
    ["deci", "djeci", "dici"], ["dečji", "dječji", "dičji"],
    ["čovek", "čovjek", "čovik"], ["čoveka", "čovjeka", "čovika"],
    ["čoveku", "čovjeku", "čoviku"], ["čovekom", "čovjekom", "čovikom"],
    ["čovečji", "čovječji", "čovičji"],
    ["dve", "dvije", "dvi"], ["dvema", "dvjema", "dvima"],
    ["posle", "poslije", "posli"],
    ["nedelja", "nedjelja", "nedilja"], ["nedelje", "nedjelje", "nedilje"],
    ["nedelju", "nedjelju", "nedilju"],
    ["ponedeljak", "ponedjeljak", "ponediljak"],
    ["ponedeljka", "ponedjeljka", "ponediljka"],
    ["sreda", "srijeda", "srida"], ["srede", "srijede", "sride"],
    ["sredu", "srijedu", "sridu"],
    ["levo", "lijevo", "livo"], ["levi", "lijevi", "livi"],
    ["leva", "lijeva", "liva"],
    ["sledeći", "sljedeći", "sljedeći"], ["sledeća", "sljedeća", "sljedeća"],
    ["sledeće", "sljedeće", "sljedeće"],
    ["promena", "promjena", "promina"], ["promene", "promjene", "promine"],
    ["promeniti", "promijeniti", "prominit"],
    ["rešenje", "rješenje", "rišenje"], ["rešenja", "rješenja", "rišenja"],
    ["uspeh", "uspjeh", "uspih"], ["uspeha", "uspjeha", "uspiha"],
    ["vest", "vijest", "vist"], ["vesti", "vijesti", "visti"],
    ["obavest", "obavijest", "obavist"], ["obavesti", "obavijesti", "obavisti"],
    ["izveštaj", "izvještaj", "izvištaj"], ["izveštaja", "izvještaja", "izvištaja"],
    ["razumeti", "razumjeti", "razumit"], ["razumeo", "razumio", "razumija"],
    ["živeti", "živjeti", "živit"], ["živeo", "živio", "živija"],
    ["voleti", "voljeti", "volit"], ["voleo", "volio", "volija"],
    ["videti", "vidjeti", "vidit"], ["video", "vidio", "vidija"],
    ["sedeti", "sjediti", "sidit"], ["sedeo", "sjedio", "sidija"],
    ["sesti", "sjesti", "sist"],
    ["pevati", "pjevati", "pivat"], ["pevao", "pjevao", "piva"],
    ["pesma", "pjesma", "pisma"], ["pesme", "pjesme", "pisme"]
  ]);

  const DIALECT_GROUPS = dialectData?.GROUPS || LEGACY_DIALECT_GROUPS;
  const DIALECT_FAMILIES = dialectData?.FAMILIES || Object.freeze([]);
  const DIALECT_SOURCES = dialectData?.SOURCES || Object.freeze({});
  const DIALECTS = Object.freeze(["ekavian", "ijekavian", "ikavian"]);
  const DIALECT_INDEX = Object.fromEntries(DIALECTS.map((dialect) => [dialect, new Map()]));

  DIALECT_GROUPS.forEach((forms, groupIndex) => {
    forms.forEach((form, dialectIndex) => {
      if (!form) return;
      const map = DIALECT_INDEX[DIALECTS[dialectIndex]];
      const current = map.get(form);
      if (current === undefined || current === groupIndex) map.set(form, groupIndex);
      else map.set(form, null);
    });
  });

  const DEFAULT_PROTECTED_TERMS = Object.freeze([
    "Google", "YouTube", "Facebook", "Instagram", "WhatsApp", "Microsoft",
    "Apple", "Amazon", "Netflix", "Spotify", "Samsung", "Sony", "PlayStation",
    "Xbox", "Nintendo", "Adobe", "Intel", "NVIDIA", "Android", "Chrome",
    "Firefox", "GitHub", "LinkedIn", "TikTok", "Telegram", "Viber", "Zoom",
    "OpenAI", "Coca-Cola", "Pepsi", "IKEA", "Lidl", "Nike", "Adidas", "Rimac",
    "Glovo", "Forbes", "Klix", "N1", "RTS", "HRT", "BBC", "FAZ", "Wwin",
    "Luštica Bay", "City kvart", "Lake Fest"
  ]);
  // These collide with ordinary lowercase words, so only their official casing
  // is protected automatically. Users can still add any casing in settings.
  const DEFAULT_CASE_SENSITIVE_TERMS = Object.freeze(Array.from(new Set([
    "Meta", "X", ...(companyData?.EXACT_CASE_NAMES || [])
  ])).sort((left, right) => right.length - left.length || left.localeCompare(right, "en")));

  const CYRILLIC_RE = /\p{Script=Cyrillic}/u;
  const LATIN_RE = /\p{Script=Latin}/u;
  // Match the whole alphabetic token before deciding whether it belongs to the
  // supported alphabet. Otherwise `quiz` would be seen as `uiz`, producing a
  // broken mixed-script word.
  const WORD_RE = /[\p{Script=Latin}\p{Script=Cyrillic}\p{M}]+/gu;
  const BSH_LATIN_WORD_RE = /^[A-PR-VZČĆŽŠĐŚŹa-pr-vzčćžšđśź]+$/u;
  const LETTER_OR_NUMBER_RE = /[\p{L}\p{N}]/u;
  const CASE_SENSITIVE_TERM_RE = DEFAULT_CASE_SENSITIVE_TERMS.length
    ? new RegExp(DEFAULT_CASE_SENSITIVE_TERMS
      .map((term) => term.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"))
      .join("|"), "gu")
    : null;

  function isAllCaps(value) {
    const letters = Array.from(value).filter((character) => LATIN_RE.test(character) || CYRILLIC_RE.test(character)).join("");
    return letters.length > 0 && letters === letters.toLocaleUpperCase("sr");
  }

  function applyCase(source, target) {
    if (isAllCaps(source)) return target.toLocaleUpperCase("sr");
    const lower = source.toLocaleLowerCase("sr");
    if (source === lower) return target;
    const title = lower.charAt(0).toLocaleUpperCase("sr") + lower.slice(1);
    if (source === title) return target.charAt(0).toLocaleUpperCase("sr") + target.slice(1);
    return target;
  }

  function cyrillicToLatin(value) {
    const allCaps = isAllCaps(value);
    const characters = Array.from(value.normalize("NFC"));
    let output = "";
    for (let index = 0; index < characters.length; index += 1) {
      const character = characters[index];
      const lower = character.toLocaleLowerCase("sr");
      const isMontenegrinAcute = characters[index + 1] === "\u0301" && (lower === "с" || lower === "з");
      const mapped = isMontenegrinAcute
        ? (lower === "с" ? "ś" : "ź")
        : CYRILLIC_TO_LATIN[lower];
      if (!mapped) {
        output += character;
        continue;
      }
      if (character === lower) output += mapped;
      else output += allCaps ? mapped.toLocaleUpperCase("sr") : mapped.charAt(0).toLocaleUpperCase("sr") + mapped.slice(1);
      if (isMontenegrinAcute) index += 1;
    }
    return output.normalize("NFC");
  }

  function separatedDigraphIndexes(lowerWord) {
    const indexes = new Set();
    const patterns = [
      [/injek/g, 1], [/konjug/g, 2], [/konjunk/g, 2],
      [/nadživ/g, 2], [/odživ/g, 1], [/podžanr/g, 2], [/predživot/g, 3]
    ];
    for (const [pattern, offset] of patterns) {
      for (const match of lowerWord.matchAll(pattern)) indexes.add(match.index + offset);
    }
    return indexes;
  }

  function latinToCyrillic(value) {
    const normalized = value.normalize("NFC");
    if (!BSH_LATIN_WORD_RE.test(normalized)) return value;
    const lowerWord = normalized.toLocaleLowerCase("sr");
    const separated = separatedDigraphIndexes(lowerWord);
    let output = "";

    for (let index = 0; index < normalized.length; index += 1) {
      const first = normalized[index];
      const pair = normalized.slice(index, index + 2);
      const lowerPair = pair.toLocaleLowerCase("sr");
      const isDigraph = !separated.has(index) && ["dž", "lj", "nj"].includes(lowerPair);
      const source = isDigraph ? pair : first;
      const mapped = LATIN_TO_CYRILLIC[source.toLocaleLowerCase("sr")];
      if (!mapped) {
        output += source;
      } else if (source === source.toLocaleUpperCase("sr")) {
        output += mapped.toLocaleUpperCase("sr");
      } else if (source[0] === source[0].toLocaleUpperCase("sr")) {
        output += mapped.toLocaleUpperCase("sr");
      } else {
        output += mapped;
      }
      if (isDigraph) index += 1;
    }
    return output;
  }

  function convertDialectLatin(word, targetDialect) {
    if (!DIALECTS.includes(targetDialect)) return word;
    const lower = word.toLocaleLowerCase("sr");
    let groupIndex;
    for (const dialect of DIALECTS) {
      const candidate = DIALECT_INDEX[dialect].get(lower);
      if (candidate !== undefined && candidate !== null) {
        groupIndex = candidate;
        break;
      }
    }
    if (groupIndex === undefined) return word;
    const target = DIALECT_GROUPS[groupIndex][DIALECTS.indexOf(targetDialect)];
    return target ? applyCase(word, target) : word;
  }

  function convertWordDetailed(word, options) {
    const hasCyrillic = CYRILLIC_RE.test(word);
    const hasLatin = LATIN_RE.test(word);
    if (hasCyrillic === hasLatin) return { text: word, dialectChanged: false };

    const sourceScript = hasCyrillic ? "cyrillic" : "latin";
    const latin = hasCyrillic ? cyrillicToLatin(word) : word;
    const dialectLatin = convertDialectLatin(latin, options.targetDialect);

    const outputScript = options.targetScript === "original" ? sourceScript : options.targetScript;
    return {
      text: outputScript === "cyrillic" ? latinToCyrillic(dialectLatin) : dialectLatin,
      dialectChanged: dialectLatin !== latin
    };
  }

  function convertWord(word, options) {
    return convertWordDetailed(word, options).text;
  }

  function rangeOverlaps(ranges, start, end) {
    return ranges.some((range) => start < range.end && end > range.start);
  }

  function findProtectedRanges(text, protectedTerms) {
    const ranges = [];
    const structuralPatterns = [
      /https?:\/\/[^\s<>"']+|www\.[^\s<>"']+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|@[A-Za-z0-9_]+/giu,
      // Product and channel names such as N1, HRT1, A2, and Boom93.
      /(?=[\p{L}\p{N}-]*\p{L})(?=[\p{L}\p{N}-]*\p{N})[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*/gu,
      // Deliberately stylized casing: OpenAI, YouTube, TikToker, iPhone.
      /[\p{L}]*\p{Ll}\p{Lu}[\p{L}\p{N}]*/gu,
      // A capitalized foreign name containing q/w/x/y, with adjacent name parts.
      // This keeps `Harry Kane` together instead of producing `Harry Кане`.
      /(?:\p{Lu}[\p{L}'’]*\s+){0,2}\p{Lu}[\p{L}'’]*[QWXYqwxy][\p{L}'’]*(?:\s+\p{Lu}[\p{L}'’]*){0,2}/gu,
      // Common non-BCMS letter sequences in capitalized Latin names. Preserve
      // Richter rather than producing the invalid character-by-character
      // `Рицхтер`; phonetic Rihter/Рихтер belongs to a separate name layer.
      /(?:\p{Lu}[\p{L}'’]*\s+){0,2}\p{Lu}[\p{L}'’]*(?:ch|sch|sh|th|ph|ck|tz|sz|cz|gy)[\p{L}'’]*(?:\s+\p{Lu}[\p{L}'’]*){0,2}/gu
    ];
    for (const pattern of structuralPatterns) {
      for (const match of text.matchAll(pattern)) {
        const start = match.index;
        const end = start + match[0].length;
        if (!rangeOverlaps(ranges, start, end)) ranges.push({ start, end });
      }
    }

    if (CASE_SENSITIVE_TERM_RE) {
      for (const match of text.matchAll(CASE_SENSITIVE_TERM_RE)) {
        const start = match.index;
        const end = start + match[0].length;
        const leftOkay = start === 0 || !LETTER_OR_NUMBER_RE.test(text[start - 1]);
        const rightOkay = end === text.length || !LETTER_OR_NUMBER_RE.test(text[end]);
        if (leftOkay && rightOkay && !rangeOverlaps(ranges, start, end)) ranges.push({ start, end });
      }
    }

    const lowerText = text.toLocaleLowerCase("sr");
    const terms = Array.from(new Set(protectedTerms.filter(Boolean)))
      .sort((a, b) => b.length - a.length);
    for (const term of terms) {
      const lowerTerm = term.toLocaleLowerCase("sr");
      let from = 0;
      while (from < lowerText.length) {
        const start = lowerText.indexOf(lowerTerm, from);
        if (start < 0) break;
        const end = start + lowerTerm.length;
        const leftOkay = start === 0 || !LETTER_OR_NUMBER_RE.test(text[start - 1]);
        const rightOkay = end === text.length || !LETTER_OR_NUMBER_RE.test(text[end]);
        if (leftOkay && rightOkay && !rangeOverlaps(ranges, start, end)) ranges.push({ start, end });
        from = Math.max(end, start + 1);
      }
    }
    return ranges.sort((a, b) => a.start - b.start);
  }

  function convertUnprotectedTextDetailed(text, options) {
    let cursor = 0;
    let output = "";
    const dialectRanges = [];
    for (const match of text.matchAll(WORD_RE)) {
      output += text.slice(cursor, match.index);
      const converted = convertWordDetailed(match[0], options);
      const start = output.length;
      output += converted.text;
      if (converted.dialectChanged && converted.text.length > 0) {
        dialectRanges.push(Object.freeze({ start, end: output.length }));
      }
      cursor = match.index + match[0].length;
    }
    output += text.slice(cursor);
    return Object.freeze({ text: output, dialectRanges: Object.freeze(dialectRanges) });
  }

  function convertUnprotectedText(text, options) {
    return convertUnprotectedTextDetailed(text, options).text;
  }

  function normaliseOptions(options = {}) {
    const targetScript = ["original", "latin", "cyrillic"].includes(options.targetScript)
      ? options.targetScript : "original";
    const targetDialect = ["original", ...DIALECTS].includes(options.targetDialect)
      ? options.targetDialect : "original";
    const customProtectedTerms = Array.isArray(options.customProtectedTerms)
      ? options.customProtectedTerms.map((term) => String(term).trim()).filter(Boolean)
      : [];
    return { targetScript, targetDialect, customProtectedTerms };
  }

  function convertTextDetailed(text, suppliedOptions = {}) {
    const options = normaliseOptions(suppliedOptions);
    if (options.targetScript === "original" && options.targetDialect === "original") {
      return Object.freeze({ text, dialectRanges: Object.freeze([]) });
    }
    const protectedTerms = [...DEFAULT_PROTECTED_TERMS, ...options.customProtectedTerms];
    const ranges = findProtectedRanges(text, protectedTerms);
    if (ranges.length === 0) return convertUnprotectedTextDetailed(text, options);

    let cursor = 0;
    let output = "";
    const dialectRanges = [];
    function appendConverted(segment) {
      const converted = convertUnprotectedTextDetailed(segment, options);
      const offset = output.length;
      output += converted.text;
      for (const range of converted.dialectRanges) {
        dialectRanges.push(Object.freeze({ start: offset + range.start, end: offset + range.end }));
      }
    }
    for (const range of ranges) {
      appendConverted(text.slice(cursor, range.start));
      output += text.slice(range.start, range.end);
      cursor = range.end;
    }
    appendConverted(text.slice(cursor));
    return Object.freeze({ text: output, dialectRanges: Object.freeze(dialectRanges) });
  }

  function convertText(text, suppliedOptions = {}) {
    return convertTextDetailed(text, suppliedOptions).text;
  }

  const api = Object.freeze({
    cyrillicToLatin,
    latinToCyrillic,
    convertDialectLatin,
    convertTextDetailed,
    convertText,
    normaliseOptions,
    DEFAULT_PROTECTED_TERMS,
    DEFAULT_CASE_SENSITIVE_TERMS,
    DIALECT_GROUPS,
    DIALECT_FAMILIES,
    DIALECT_SOURCES
  });

  root.PrepisiConverter = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
