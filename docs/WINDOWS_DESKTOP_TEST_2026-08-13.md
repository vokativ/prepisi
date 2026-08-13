# Windows desktop browser test — 2026-08-12

Recorded: 2026-08-13, on the current (post-migration) development machine,
from the project owner's first-hand report. The testing itself was performed
on 2026-08-12 on the previous Windows development machine, in a mix of manual
browsing and AI-agent-assisted testing, before the project moved to the
current machine.

## Test environment

- Host: Windows 11 Pro, version 25H2, build 26200.9168 (August 2026 security
  update KB5121003, released 2026-08-11) — the current mainstream Windows 11
  build in this window.
- Browsers, current stable versions as of 2026-08-12/13:
  - Google Chrome 151.0.7922.138 (stable since 2026-07-28; this build shipped
    2026-08-11 with five high-severity use-after-free fixes) — the same
    version already verified on macOS in `docs/APPLE_PLATFORM_TEST_2026-08-13.md`.
  - Mozilla Firefox 153.0.3 (released 2026-08-04) — the same version already
    verified on Android in `docs/FIREFOX_ANDROID_TEST.md`.
  - Microsoft Edge 151.0.4129.78 (released 2026-08-10; Chromium 151.0.7922.109).
- Extension version 0.9.1 (`build/chromium`, `build/edge`, `build/firefox`
  outputs from `npm run build:all`).

Versions confirmed by web research on 2026-08-13 against Chrome release notes,
Firefox release notes, Microsoft Edge's Wikipedia version history, and
Microsoft's Windows 11 servicing pages; not independently re-verified against
the exact machine that ran the test.

## Why this entry looks different from the other dated reports

Every other dated report in this repository (`docs/FIREFOX_ANDROID_TEST.md`,
`docs/APPLE_PLATFORM_TEST_2026-08-12.md`,
`docs/APPLE_PLATFORM_TEST_2026-08-13.md`) was written from a live session with
exact browser/OS build numbers captured at test time. This Windows pass was
not captured that way in the repository (no commit, working-tree file, or git
object recorded it — a full `git fsck --unreachable` sweep found nothing, and
it predates the current clone). The version numbers above are the current
stable releases for the owner-reported test date, not numbers captured live
from the test machine.

## What is recorded

- Method: a mix of manual browsing and AI-agent-assisted testing.
- Result per the owner: Chrome, Edge, and Firefox desktop all completed
  testing successfully on Windows 11 Pro.

## What is still missing for this to reach the same standard as the other reports

- Confirmation that the versions above match what was actually installed on
  the test machine at the time, rather than the current-as-of-2026-08-13
  releases used here.
- Which items from the shared smoke-test checklist (`docs/RELEASE_COVERAGE.md`
  → "Shared smoke test") were exercised, and whether every one passed or any
  exceptions were observed (the same level of detail recorded for the Pixel 7
  Firefox pass and the macOS Chrome/Firefox/Safari passes).

## Firefox Android

Firefox for Android testing from the same Windows-hosted session is already
fully documented with exact device/browser versions in
`docs/FIREFOX_ANDROID_TEST.md` (host: Windows, device: Google Pixel 7, Firefox
153.0.3, 2026-08-12). No further action needed there; it is cross-referenced
here only because the owner's report bundled it with the Windows desktop pass.
