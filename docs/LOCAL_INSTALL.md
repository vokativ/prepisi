# Local installation and test handoff

Build the current browser folders first:

```powershell
npm run build:all
```

For development, load the generated folder rather than a ZIP from `dist/`. After
source changes, rebuild and use the browser's **Reload** control.

## Chrome

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Choose **Load unpacked**.
4. Select `build/chromium`.
5. Pin **Prepiši** from the extensions menu.

After a rebuild, return to `chrome://extensions` and click the reload icon on the
Prepiši card. Reload any article tab that was already open.

These steps are the same on Windows, macOS, and Linux. Chrome on Android does
not load WebExtensions.

## Edge

1. Open `edge://extensions`.
2. Turn on **Developer mode**.
3. Choose **Load unpacked**.
4. Select `build/edge`.
5. Pin **Prepiši** from the extensions menu.

After a rebuild, click **Reload** on the extension card and reload the article tab.
The Edge and Chromium folders currently contain the same runtime by design; the
separate folder makes packaging and store validation explicit.

The desktop steps are the same on Windows, macOS, and Linux. Edge on Android and
iOS distributes approved extensions through Microsoft Edge Add-ons; there is no
documented arbitrary-file sideload path equivalent to **Load unpacked**.

## Firefox desktop

1. Open `about:debugging#/runtime/this-firefox`.
2. Select **This Firefox** in the left column.
3. Choose **Load Temporary Add-on…**.
4. Select `build/firefox/manifest.json`.
5. Pin Prepiši to the toolbar if Firefox places it in the extensions menu.

After a rebuild, use **Reload** on the Prepiši entry on the `about:debugging`
page, then reload the article tab. Temporary add-ons disappear when Firefox
closes; this is expected. Ordinary Firefox release builds require Mozilla signing
for a persistent installation.

The desktop flow is the same on Windows, macOS, and Linux.

Mozilla's command-line development runner is another option:

```powershell
npx --yes web-ext run --source-dir build/firefox --firefox "C:\Program Files\Mozilla Firefox\firefox.exe"
```

It opens a separate temporary Firefox profile and removes the add-on when that
test session ends.

## Firefox for Android

Use the same `build/firefox` source and declared Android minimum. For development,
Mozilla documents `web-ext run -t firefox-android` with an Android device exposed
through ADB. For a normal device install, sign the package through AMO first;
Firefox Android can then install the signed add-on from a file or an AMO listing.

Official instructions:

- https://extensionworkshop.com/documentation/develop/developing-extensions-for-firefox-for-android/
- https://extensionworkshop.com/documentation/publish/install-self-distributed/

Firefox for iOS and Firefox Focus do not load WebExtensions.

## Safari on macOS, iOS, and iPadOS

On macOS, Safari can temporarily load `build/safari` or its ZIP from **Safari →
Settings → Developer → Add Temporary Extension…** after unsigned extensions are
enabled. Safari removes a temporary extension after 24 hours or when Safari quits.

iOS and iPadOS require the web extension inside an Apple app for device testing.
Use Apple's Safari Web Extension packaging flow and TestFlight/App Store Connect;
the raw source ZIP is an input, not an installable iPhone/iPad extension.

Official instructions:

- https://developer.apple.com/documentation/safariservices/running-your-safari-web-extension
- https://developer.apple.com/safari/extensions/

## Handing a browser to Codex for a smoke test

1. Load or reload the appropriate generated folder using the steps above.
2. Leave the browser open with the Prepiši toolbar icon visible.
3. Open one of the URLs in `docs/RELEASE_COVERAGE.md`.
4. Tell Codex which browser is ready and whether it may operate the visible test
   window. Do not close the browser until the test pass is complete.

Chrome can normally be inspected directly through its connected browser session.
Firefox and Edge may require visible Windows-app control, so keep unrelated private
tabs in another window or close them before handing over the test window.
