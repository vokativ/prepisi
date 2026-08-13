# Windows desktop browser test — owner-reported

Recorded: 2026-08-13, on the current (post-migration) development machine, from
the project owner's first-hand report. The testing itself was performed earlier
on the previous Windows development machine, in a mix of manual browsing and
AI-agent-assisted testing, before the project moved to the current machine.

## Why this entry looks different from the other dated reports

Every other dated report in this repository (`docs/FIREFOX_ANDROID_TEST.md`,
`docs/APPLE_PLATFORM_TEST_2026-08-12.md`,
`docs/APPLE_PLATFORM_TEST_2026-08-13.md`) was written from a live session with
exact browser/OS build numbers captured at test time. This Windows pass was not
captured that way: no repository commit, working-tree file, or git object (a
full `git fsck --unreachable` sweep was run) records it, and it predates the
current clone. This entry exists to record the owner's attestation honestly,
not to reconstruct evidence that was never written down.

## What is recorded

- Host: Windows (exact edition/build not preserved).
- Browsers covered: Chrome, Microsoft Edge, and Firefox desktop (exact version
  numbers not preserved).
- Method: a mix of manual browsing and AI-agent-assisted testing.
- Result per the owner: all three browsers completed testing successfully.

## What is still missing for this to reach the same standard as the other reports

- Exact Windows edition/build.
- Exact Chrome/Edge/Firefox version numbers used.
- The approximate test date.
- Which items from the shared smoke-test checklist (`docs/RELEASE_COVERAGE.md`
  → "Shared smoke test") were exercised, and whether every one passed or any
  exceptions were observed (the same level of detail recorded for the Pixel 7
  Firefox pass and the macOS Chrome/Firefox/Safari passes).

Once these are available, replace this note with the same structured format
used in `docs/FIREFOX_ANDROID_TEST.md`, and update `docs/RELEASE_COVERAGE.md`
and `research/BROWSER_COMPATIBILITY.md` accordingly if any detail changes the
current "passed" conclusion.

## Firefox Android

Firefox for Android testing from the same earlier Windows-hosted session is
already fully documented with exact device/browser versions in
`docs/FIREFOX_ANDROID_TEST.md` (host: Windows, device: Google Pixel 7, Firefox
153.0.3, 2026-08-12). No further action needed there; it is cross-referenced
here only because the owner's report bundled it with the Windows desktop pass.
