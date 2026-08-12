import { buildLexiconData } from "./build-lexicon-data.mjs";
import { applyJatReviews } from "./apply-jat-reviews.mjs";
import { discoverJatCandidates } from "./discover-jat-candidates.mjs";
import { withLexiconArchives } from "./lib/lexicon-utils.mjs";

await applyJatReviews();
await withLexiconArchives(async (archives) => {
  await discoverJatCandidates(archives);
  await buildLexiconData(archives);
});
