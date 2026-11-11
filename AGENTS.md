# Prepiši agent handoff

Read [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md) before changing code. It is the concise source of truth for the verified baseline, blockers, and release work. Platform/browser test details live in dated reports; do not substitute assumptions for observed results.

## Working rules

- **Privacy boundary:** Local-only. Never add telemetry, browsing data storage, remote executable code, or browsing-time network requests.
- **Verification & lint:** Run `npm run check` and `npm run build:all` after runtime/manifest changes. Run `npx --yes web-ext lint --source-dir build/firefox` for Firefox changes.
- **Generated files & assets:** Change `src/generated/` files only through the documented build workflow ([`CONTRIBUTING.md`](CONTRIBUTING.md)). Never commit `build/`, `dist/`, corpus caches, lexicon archives, signing keys, private Balkan Sans font files, or logs with private content.
- **Platform packaging:** Firefox desktop and Android share one generated MV3 package. Chromium/Edge must retain their minimal manifest without inheriting Firefox host access or event pages.
- **Synchronous event page:** Firefox event-page handling follows Mozilla's documented synchronous top-level `webNavigation.onCompleted` pattern. Do not replace with timers or persistent backgrounds without empirical evidence.
- **Git workflow:** Preserve existing user changes in dirty worktrees; avoid destructive git commands. Remote is `origin` (`github.com:vokativ/prepisi.git`); verify branch state before committing.
