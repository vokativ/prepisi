"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

class FakeDocument {
  constructor() {
    this.nodeType = 9;
    this.isConnected = true;
    this.documentElement = new FakeElement("html", { lang: "sr-Latn" });
    this.body = new FakeElement("body");
    this.documentElement.parentNode = this;
    this.documentElement.append(this.body);
  }

  createTreeWalker(root) {
    const textNodes = [];
    function collect(node) {
      for (const child of node.children || []) {
        if (child.nodeType === 3) textNodes.push(child);
        else collect(child);
      }
    }
    if (root.nodeType === 9) collect(root.documentElement);
    else collect(root);
    let index = 0;
    return { nextNode: () => textNodes[index++] || null };
  }

  createRange() {
    return {
      startContainer: null, startOffset: 0, endContainer: null, endOffset: 0,
      setStart(node, offset) { this.startContainer = node; this.startOffset = offset; },
      setEnd(node, offset) { this.endContainer = node; this.endOffset = offset; }
    };
  }
}

class FakeElement {
  constructor(tagName, attributes = {}) {
    this.nodeType = 1;
    this.tagName = tagName.toLowerCase();
    this.attributes = { ...attributes };
    this.children = [];
    this.parentNode = null;
  }

  get parentElement() {
    return this.parentNode?.nodeType === 1 ? this.parentNode : null;
  }

  get isConnected() {
    let current = this;
    while (current) {
      if (current.nodeType === 9) return true;
      current = current.parentNode;
    }
    return false;
  }

  append(...children) {
    for (const child of children) {
      child.parentNode = this;
      this.children.push(child);
    }
  }

  getAttribute(name) {
    return this.attributes[name] ?? null;
  }

  matches(selector) {
    const part = selector.trim();
    if (/^[a-z]+$/u.test(part)) return this.tagName === part;
    if (part === "[lang]") return this.attributes.lang !== undefined;
    if (part === ".notranslate") return String(this.attributes.class || "").split(/\s+/u).includes("notranslate");
    if (part === "[data-prepisi-ignore]") return this.attributes["data-prepisi-ignore"] !== undefined;
    if (part === "[translate='no']") return this.attributes.translate === "no";
    if (part.startsWith("[contenteditable]")) {
      return this.attributes.contenteditable !== undefined && this.attributes.contenteditable !== "false";
    }
    return false;
  }

  closest(selectorList) {
    const selectors = selectorList.split(",");
    let current = this;
    while (current) {
      if (selectors.some((selector) => current.matches(selector))) return current;
      current = current.parentElement;
    }
    return null;
  }
}

class FakeText {
  constructor(value) {
    this.nodeType = 3;
    this.nodeValue = value;
    this.parentNode = null;
  }

  get parentElement() {
    return this.parentNode?.nodeType === 1 ? this.parentNode : null;
  }

  get isConnected() {
    return Boolean(this.parentElement?.isConnected);
  }
}

class FakeMutationObserver {
  static instances = [];

  constructor(callback) {
    this.callback = callback;
    this.observing = false;
    FakeMutationObserver.instances.push(this);
  }

  observe() { this.observing = true; }
  disconnect() { this.observing = false; }
  emit(mutations) { if (this.observing) this.callback(mutations); }
}

function element(tagName, text, attributes) {
  const node = new FakeElement(tagName, attributes);
  const textNode = new FakeText(text);
  node.append(textNode);
  return { node, text: textNode };
}

function createController(document, { highlights = false } = {}) {
  FakeMutationObserver.instances.length = 0;
  class FakeHighlight extends Set {}
  const highlightRegistry = new Map();
  const context = vm.createContext({
    document,
    MutationObserver: FakeMutationObserver,
    Node: { TEXT_NODE: 3, ELEMENT_NODE: 1, DOCUMENT_NODE: 9 },
    NodeFilter: { SHOW_TEXT: 4 },
    console,
    Intl,
    Set,
    Map,
    WeakMap,
    Object,
    Array,
    String,
    RegExp
  });
  if (highlights) {
    context.CSS = { highlights: highlightRegistry };
    context.Highlight = FakeHighlight;
  }
  const root = path.resolve(__dirname, "..");
  vm.runInContext(fs.readFileSync(path.join(root, "src/generated/company-names.js"), "utf8"), context);
  vm.runInContext(fs.readFileSync(path.join(root, "src/generated/comtext-pairs.js"), "utf8"), context);
  vm.runInContext(fs.readFileSync(path.join(root, "src/generated/lexicon-pairs.js"), "utf8"), context);
  vm.runInContext(fs.readFileSync(path.join(root, "src/dialect-data.js"), "utf8"), context);
  vm.runInContext(fs.readFileSync(path.join(root, "src/converter.js"), "utf8"), context);
  vm.runInContext(fs.readFileSync(path.join(root, "src/content.js"), "utf8"), context);
  return { controller: context.__PREPISI__, observer: FakeMutationObserver.instances[0], highlightRegistry };
}

test("page controller converts eligible text and preserves code and foreign spans", () => {
  const document = new FakeDocument();
  const article = element("p", "Mleko i Његош.");
  const code = element("code", "mleko = vrijeme");
  const english = element("p", "Mleko and vrijeme", { lang: "en" });
  document.body.append(article.node, code.node, english.node);
  const { controller } = createController(document);

  const result = controller.apply({ targetScript: "cyrillic", targetDialect: "ijekavian" });
  assert.equal(result.active, true);
  assert.equal(article.text.nodeValue, "Млијеко и Његош.");
  assert.equal(code.text.nodeValue, "mleko = vrijeme");
  assert.equal(english.text.nodeValue, "Mleko and vrijeme");
});

test("page controller restores exact originals after repeated mode changes", () => {
  const document = new FakeDocument();
  const paragraph = element("p", "Mleko i лијепо мјесто.");
  document.body.append(paragraph.node);
  const { controller } = createController(document);

  controller.apply({ targetScript: "cyrillic", targetDialect: "ijekavian" });
  controller.apply({ targetScript: "latin", targetDialect: "ekavian" });
  assert.equal(paragraph.text.nodeValue, "Mleko i lepo mesto.");
  const restored = controller.apply({ targetScript: "original", targetDialect: "original" });
  assert.equal(restored.restoredTextNodes, 1);
  assert.equal(paragraph.text.nodeValue, "Mleko i лијепо мјесто.");
});

test("each page controller reports only that tab's current choices", () => {
  const firstDocument = new FakeDocument();
  const secondDocument = new FakeDocument();
  firstDocument.body.append(element("p", "Vetar i vreme.").node);
  secondDocument.body.append(element("p", "Vetar i vreme.").node);
  const first = createController(firstDocument).controller;
  const second = createController(secondDocument).controller;

  first.apply({ targetScript: "cyrillic", targetDialect: "ijekavian", highlightDialectChanges: true });
  assert.equal(first.getStatus().active, true);
  assert.equal(first.getStatus().options.targetScript, "cyrillic");
  assert.equal(first.getStatus().options.targetDialect, "ijekavian");
  assert.equal(first.getStatus().options.highlightDialectChanges, true);
  assert.equal(second.getStatus().active, false);
  assert.equal(second.getStatus().options.targetScript, "original");
  assert.equal(second.getStatus().options.targetDialect, "original");
});

test("page controller converts dynamically inserted and externally changed text", () => {
  const document = new FakeDocument();
  const original = element("p", "Mleko je lepo.");
  document.body.append(original.node);
  const { controller, observer } = createController(document);
  controller.apply({ targetScript: "cyrillic", targetDialect: "ijekavian" });

  const dynamic = element("p", "Novo mesto i vreme.");
  document.body.append(dynamic.node);
  observer.emit([{ type: "childList", addedNodes: [dynamic.node] }]);
  assert.equal(dynamic.text.nodeValue, "Ново мјесто и вријеме.");

  original.text.nodeValue = "Dete pije mleko.";
  observer.emit([{ type: "characterData", target: original.text, addedNodes: [] }]);
  assert.equal(original.text.nodeValue, "Дијете пије млијеко.");

  controller.apply({ targetScript: "original", targetDialect: "original" });
  assert.equal(original.text.nodeValue, "Dete pije mleko.");
  assert.equal(dynamic.text.nodeValue, "Novo mesto i vreme.");
});

test("page controller highlights dialect changes without wrapping page content", () => {
  const document = new FakeDocument();
  const paragraph = element("p", "Vetar i lepo mesto.");
  document.body.append(paragraph.node);
  const { controller, highlightRegistry } = createController(document, { highlights: true });

  const result = controller.apply({
    targetScript: "latin", targetDialect: "ijekavian", highlightDialectChanges: true
  });
  assert.equal(result.highlightedWords, 3);
  const highlight = highlightRegistry.get("prepisi-dialect-change");
  assert.equal(highlight.size, 3);
  assert.deepEqual(Array.from(highlight, (range) => paragraph.text.nodeValue.slice(range.startOffset, range.endOffset)),
    ["Vjetar", "lijepo", "mjesto"]);

  controller.apply({ targetScript: "original", targetDialect: "original", highlightDialectChanges: true });
  assert.equal(highlight.size, 0);
  assert.equal(paragraph.text.nodeValue, "Vetar i lepo mesto.");
});
