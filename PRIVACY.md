# Privacy policy for Prepiši

Prepiši converts page text locally in the browser. It does not send page text,
browsing activity, settings, or identifiers to a server.

## Permissions

- `activeTab`: temporary access to the page only after the user invokes Prepiši.
- `scripting`: runs the packaged, local converter on that active page.
- `storage`: stores protected-name and foreign-language-span preferences locally.

By default, these remain the only effective website permissions. If the user
turns on **Remember on this site**, Prepiši asks for optional access to that
hostname over HTTP/HTTPS. That access lets the packaged local converter run on
later pages of the same site without another click. It is never requested for
all sites at installation, does not apply to a different hostname, and is
removed when the switch is turned off.

The extension requests no required persistent website access, makes no network
requests, contains no analytics or advertising, and does not sell or share user
data. Optional site access changes when the local converter may run; it does not
allow page text to leave the browser.

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
