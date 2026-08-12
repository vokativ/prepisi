# Privacy policy for Prepiši

Prepiši converts page text locally in the browser. It does not send page text,
browsing activity, settings, or identifiers to a server.

## Permissions

- `activeTab`: temporary access to the page only after the user invokes Prepiši.
- `scripting`: runs the packaged, local converter on that active page.
- `storage`: stores protected-name and foreign-language-span preferences locally.

Chrome, Edge, and Safari request persistent website access only when the user
turns on **Remember on this site**, and scope it to that exact hostname.

Firefox desktop and Android predeclare access to a reviewed catalog of editorial
portals to support automatic application after navigation and browser restarts.
Firefox may expose these permissions at installation, in
add-on settings, or in a first-use request; the temporary Android installer tested
on 2026-08-12 did not enumerate the full batch and requested the explicit RTS
portal aliases on first use. The Firefox event page checks local storage after
navigation and loads the packaged converter only when a Remember rule exists.
A curated portal rule covers
only its explicitly listed aliases (for example, an apex and `www` host). Turning
Remember off deletes the rule and stops automatic conversion; the catalog access
remains part of the installed Firefox manifest and can be managed in Firefox's
add-on permissions. Non-catalog Firefox sites keep the exact-host optional prompt.
The dated catalog and selection policy are documented in
[`research/CURATED_EDITORIAL_PORTALS.md`](research/CURATED_EDITORIAL_PORTALS.md).

Prepiši never requests access to all sites at installation. It makes no network
requests, contains no analytics or advertising, and does not sell or share user
data. Website access changes only when the packaged local converter may inspect
and alter page text; page text never leaves the browser.

## Data retention

Protected-name preferences and explicitly enabled per-site rules remain in the
browser's local extension storage until the user changes them or removes the
extension. Script, pronunciation, and highlight choices otherwise live in the
current page's memory, so each tab reflects its own actual conversion state. A
remembered site stores only the three selected mode values, never page text.
Original and converted page text disappear when the page or tab is closed.
The bundled company-name and dialect vocabularies are static package files; they
do not update themselves or contact their source sites while browsing.

## Scope

The converter changes visible text nodes. It deliberately skips form controls,
editable text, code, scripts, styles, SVG, MathML, and explicitly protected spans.
