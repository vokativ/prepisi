# Optional on-device name recognition

Status: feasibility note only, researched 2026-08-11. This is explicitly not a
current development target.

## Short answer

Windows NPUs and Apple's Neural Engine could run a local named-entity recognition
(NER) model without sending page text to a server. A browser extension cannot,
however, call Windows ML or Core ML directly from ordinary extension JavaScript.
It would need a signed native companion application and a native-messaging bridge.

NER would answer “which spans are probably people, organisations, or places?” It
could therefore prevent inconsistent output such as converting `Taron Egerton`
while preserving `Toma Hardyja`. It would not decide the correct Serbian/Croatian
transcription of a foreign name; transcription remains a separate linguistic task.

## Windows route

Windows ML runs ONNX models locally and can select CPU, GPU, or NPU execution
providers. Microsoft's current hardware-managed execution-provider catalog needs
Windows 11 24H2 or newer for accelerated providers, while CPU inference remains a
fallback.

Chrome, Edge, and Firefox would communicate with a locally installed Windows host
through WebExtension native messaging. That host would receive a small text span,
run the NER model, and return only character ranges and entity classes. This adds:

- a Windows installer and registered native-host manifest;
- a new `nativeMessaging` extension permission;
- separate Chrome/Edge and Firefox host registration metadata;
- signing, updates, architecture-specific binaries, and substantially more QA;
- an explicit privacy explanation that text leaves the browser sandbox but stays
  on the user's machine.

This would no longer be a self-contained ZIP-only extension. A compact multilingual
model may also be fast enough on CPU, so NPU acceleration should be treated as an
optimization rather than a requirement.

## macOS route

Apple's Natural Language framework already exposes named-entity categories for
people, places, and organisations. Its accuracy and coverage for Serbian,
Croatian, Bosnian, Montenegrin, mixed scripts, and inflected foreign surnames would
need a dedicated benchmark; API availability is not evidence of adequate language
quality.

For a custom model, Core ML can schedule inference on the CPU, GPU, and Apple
Neural Engine. Safari is the most natural integration because every Safari Web
Extension already has a containing Apple application, and Apple documents native
messaging between that app and the extension. Chrome, Edge, and Firefox on macOS
would need a separately registered native-messaging host, similar to Windows.

## Privacy-preserving experiment design

If this is prototyped later:

1. Keep the present deterministic heuristics as the default and offline fallback.
2. Make native name recognition an explicit optional feature.
3. Send only candidate title-case windows and nearby sentence context, not the
   entire page or DOM.
4. Bundle the model or use only an OS-provided model; make no network request.
5. Return protected character ranges, not rewritten text.
6. Do not log page text, entity results, URLs, or usage telemetry.
7. Benchmark precision and recall separately on Serbian Latin/Cyrillic, Croatian,
   Bosnian, Montenegrin, English names, and locally inflected foreign names.
8. Prefer false negatives over freezing ordinary words and local names, and always
   retain the user's custom protected-name list.

## Decision checkpoint

The native approach is justified only if a reviewed offline name vocabulary plus
better structural heuristics still leaves enough visible inconsistencies to offset
the installer size, new permission, native code, and multi-store maintenance. The
first research step should be a standalone corpus benchmark, not integration into
the extension.

## Primary sources

- Windows ML overview and local CPU/GPU/NPU inference:
  https://learn.microsoft.com/en-us/windows/ai/new-windows-ml/overview
- Windows ML setup and acceleration requirements:
  https://learn.microsoft.com/en-us/windows/ai/new-windows-ml/get-started
- Chrome native messaging:
  https://developer.chrome.com/docs/extensions/develop/concepts/native-messaging
- Firefox native messaging:
  https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_messaging
- Apple Natural Language named-entity recognition:
  https://developer.apple.com/documentation/naturallanguage
- Apple Core ML compute devices:
  https://developer.apple.com/documentation/coreml
- Safari app/extension native messaging:
  https://developer.apple.com/documentation/safariservices/messaging-between-the-app-and-javascript-in-a-safari-web-extension
