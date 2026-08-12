"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const converter = require("../src/converter.js");

const fixtures = JSON.parse(fs.readFileSync(
  path.join(__dirname, "fixtures", "portal-samples.json"), "utf8"
));

test("frozen regional portal headlines remain stable offline", async (suite) => {
  assert.ok(fixtures.length >= 4);
  for (const fixture of fixtures) {
    await suite.test(fixture.portal, () => {
      assert.match(fixture.sourceUrl, /^https:\/\//u);
      assert.equal(converter.convertText(fixture.source, fixture.options), fixture.expected);
    });
  }
});
