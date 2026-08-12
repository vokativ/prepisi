# Prepiši agent handoff

Read [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md) before changing code. It
is the concise source of truth for the verified baseline, current blockers, and
next release work. Browser/device details live in the linked dated test reports;
do not replace observed results with assumptions from vendor documentation.

## Working rules

- Preserve the local-only privacy boundary: no page text, browsing data,
  telemetry, remote executable code, or browsing-time network requests.
- Run `npm run check` and `npm run build:all` after runtime or manifest changes.
  Run `npx --yes web-ext lint --source-dir build/firefox` for Firefox changes.
- Do not commit `build/`, `dist/`, corpus caches, lexicon archives, signing keys,
  private Balkan Sans font files, or device logs containing private content.
- Generated language files under `src/generated/` must be changed through their
  documented build/review workflow; see [`CONTRIBUTING.md`](CONTRIBUTING.md).
- Firefox desktop and Android share one generated MV3 package. Chromium/Edge
  must retain their minimal manifest and must not inherit Firefox host access or
  its event page.
- Keep existing user changes in a dirty worktree and avoid destructive Git
  operations.

## Current browser handoff

- Firefox Android manual conversion passed on a Pixel 7 with Firefox 153.0.3.
  Automatic remembered navigation failed in the unsigned `web-ext` session.
- The Firefox event-page implementation follows Mozilla's documented
  synchronous top-level `webNavigation.onCompleted` pattern. Do not replace it
  with timers or a persistent-background workaround without new evidence.
- Firefox options now contain an opt-in, single-host diagnostic log. It is
  bounded to 40 technical entries and stores no page text or full URLs. The next
  Android pass should enable it for the explicit test domain before navigating.
- The decisive Android comparison is a clean temporary install versus a clean
  Mozilla-signed XPI, preferably also Firefox Nightly. See
  [`research/FIREFOX_MV3_ANDROID_EVENT_PAGES.md`](research/FIREFOX_MV3_ANDROID_EVENT_PAGES.md)
  and [`docs/FIREFOX_ANDROID_TEST.md`](docs/FIREFOX_ANDROID_TEST.md).
- macOS desktop testing is still pending for Chrome, Edge, Firefox, and Safari.
  Follow [`docs/LOCAL_INSTALL.md`](docs/LOCAL_INSTALL.md) and
  [`HUMAN_TEST.md`](HUMAN_TEST.md); record exact browser/macOS versions and
  results in a new dated document rather than rewriting the Android report.

The primary remote is `origin` (`github.com:vokativ/prepisi.git`). Check branch
and worktree state before committing; do not assume a branch name.
