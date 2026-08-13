(function initialisePrepisiPageController(root) {
  "use strict";

  const CONTROLLER_VERSION = "0.9.1";
  if (root.__PREPISI__?.version === CONTROLLER_VERSION) return;
  if (root.__PREPISI__) {
    try { root.__PREPISI__.apply({ targetScript: "original", targetDialect: "original" }); } catch (_) {}
    try { delete root.__PREPISI__; } catch (_) { root.__PREPISI__ = undefined; }
  }
  if (!root.PrepisiConverter) throw new Error("Prepiši converter is not loaded.");

  const EXCLUDED_SELECTOR = [
    "script", "style", "noscript", "textarea", "input", "select", "option",
    "code", "pre", "kbd", "samp", "svg", "math", "canvas", "iframe",
    "[contenteditable]:not([contenteditable='false'])", "[translate='no']",
    ".notranslate", "[data-prepisi-ignore]"
  ].join(",");
  const SUPPORTED_LANGUAGES = new Set(["sr", "hr", "bs", "cnr", "sh", "hbs"]);
  const originalText = new WeakMap();
  const lastOutput = new WeakMap();
  const nodeHighlightRanges = new WeakMap();
  const trackedNodes = new Set();
  const HIGHLIGHT_NAME = "prepisi-dialect-change";
  let dialectHighlight = null;
  let active = false;
  let currentOptions = {
    targetScript: "original",
    targetDialect: "original",
    highlightDialectChanges: false,
    customProtectedTerms: [],
    respectForeignLanguageSpans: true
  };

  function isSupportedLanguage(language) {
    return SUPPORTED_LANGUAGES.has(String(language).toLocaleLowerCase("en").split("-")[0]);
  }

  function isEligible(node) {
    const parent = node.parentElement;
    if (!parent || !node.nodeValue || !node.nodeValue.trim()) return false;
    if (parent.closest(EXCLUDED_SELECTOR)) return false;

    if (currentOptions.respectForeignLanguageSpans) {
      const languageElement = parent.closest("[lang]");
      // A root language is often wrong on news sites; explicit nested spans are
      // much stronger evidence and are therefore preserved.
      if (languageElement && languageElement !== document.documentElement &&
          !isSupportedLanguage(languageElement.getAttribute("lang"))) return false;
    }
    return true;
  }

  function remember(node) {
    if (!originalText.has(node)) {
      originalText.set(node, node.nodeValue);
      trackedNodes.add(node);
    }
  }

  function canHighlight() {
    return Boolean(root.CSS?.highlights && typeof root.Highlight === "function" &&
      typeof document.createRange === "function");
  }

  function ensureHighlight() {
    if (!canHighlight()) return null;
    if (!dialectHighlight) {
      dialectHighlight = new root.Highlight();
      root.CSS.highlights.set(HIGHLIGHT_NAME, dialectHighlight);
    }
    return dialectHighlight;
  }

  function clearNodeHighlights(node) {
    const ranges = nodeHighlightRanges.get(node) || [];
    if (dialectHighlight) {
      for (const range of ranges) dialectHighlight.delete(range);
    }
    nodeHighlightRanges.delete(node);
  }

  function highlightNode(node, offsets) {
    clearNodeHighlights(node);
    if (!currentOptions.highlightDialectChanges || offsets.length === 0) return 0;
    const highlight = ensureHighlight();
    if (!highlight) return 0;
    const ranges = [];
    for (const offset of offsets) {
      const range = document.createRange();
      range.setStart(node, offset.start);
      range.setEnd(node, offset.end);
      highlight.add(range);
      ranges.push(range);
    }
    nodeHighlightRanges.set(node, ranges);
    return ranges.length;
  }

  function renderNode(node, stats) {
    if (!isEligible(node)) return;
    remember(node);
    const original = originalText.get(node);
    const converted = root.PrepisiConverter.convertTextDetailed(original, currentOptions);
    clearNodeHighlights(node);
    lastOutput.set(node, converted.text);
    stats.visitedTextNodes += 1;
    if (node.nodeValue !== converted.text) {
      node.nodeValue = converted.text;
      stats.changedTextNodes += 1;
    }
    stats.highlightedWords += highlightNode(node, converted.dialectRanges);
  }

  function walk(startNode, stats) {
    if (!startNode) return;
    if (startNode.nodeType === Node.TEXT_NODE) {
      renderNode(startNode, stats);
      return;
    }
    if (startNode.nodeType !== Node.ELEMENT_NODE && startNode.nodeType !== Node.DOCUMENT_NODE) return;
    const walker = document.createTreeWalker(startNode, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) renderNode(node, stats);
  }

  function restoreOriginal() {
    let restoredTextNodes = 0;
    observer.disconnect();
    for (const node of trackedNodes) {
      clearNodeHighlights(node);
      if (!node.isConnected) {
        trackedNodes.delete(node);
        continue;
      }
      const original = originalText.get(node);
      if (typeof original === "string" && node.nodeValue !== original) {
        node.nodeValue = original;
        restoredTextNodes += 1;
      }
      lastOutput.delete(node);
    }
    if (dialectHighlight) dialectHighlight.clear();
    active = false;
    return restoredTextNodes;
  }

  function observe() {
    const rootNode = document.documentElement;
    if (rootNode) observer.observe(rootNode, { subtree: true, childList: true, characterData: true });
  }

  const observer = new MutationObserver((mutations) => {
    if (!active) return;
    observer.disconnect();
    const stats = { visitedTextNodes: 0, changedTextNodes: 0, highlightedWords: 0 };
    for (const mutation of mutations) {
      if (mutation.type === "characterData") {
        const node = mutation.target;
        if (node.nodeValue !== lastOutput.get(node)) originalText.set(node, node.nodeValue);
        renderNode(node, stats);
      }
      for (const addedNode of mutation.addedNodes || []) walk(addedNode, stats);
    }
    observe();
  });

  function apply(suppliedOptions = {}) {
    const normalised = root.PrepisiConverter.normaliseOptions(suppliedOptions);
    currentOptions = {
      ...normalised,
      highlightDialectChanges: suppliedOptions.highlightDialectChanges === true,
      respectForeignLanguageSpans: suppliedOptions.respectForeignLanguageSpans !== false
    };

    if (currentOptions.targetScript === "original" && currentOptions.targetDialect === "original") {
      return {
        active: false,
        changedTextNodes: 0,
        restoredTextNodes: restoreOriginal(),
        options: currentOptions
      };
    }

    observer.disconnect();
    active = true;
    const stats = { visitedTextNodes: 0, changedTextNodes: 0, highlightedWords: 0 };
    walk(document.body || document.documentElement, stats);
    observe();
    return { active: true, ...stats, restoredTextNodes: 0, options: currentOptions };
  }

  function getStatus() {
    return { active, options: currentOptions, trackedTextNodes: trackedNodes.size };
  }

  root.__PREPISI__ = Object.freeze({ version: CONTROLLER_VERSION, apply, getStatus });
})(globalThis);
