# Security policy

Prepiši is designed to convert visible page text locally with temporary
`activeTab` access. It does not intentionally send page contents, browsing
activity, settings, or identifiers to a server. Security reports that threaten
that promise are especially important.

## Supported versions

Security fixes are made on the latest development branch and, once public store
releases exist, the latest released version. Older development archives and
superseded store versions are not separately supported.

## Reporting a vulnerability

Use GitHub's **Report a vulnerability** private-reporting form for this repository.
If private vulnerability reporting is temporarily unavailable, contact a
maintainer through a private channel listed on the maintainer's GitHub profile.
Do not open a public issue containing an exploit, private browsing data, or an
unpatched vulnerability.

Include, where possible:

- the affected commit or extension version and browser version;
- a concise impact statement;
- minimal reproduction steps or a harmless proof of concept;
- which permission, page context, or generated package is involved;
- any suggested mitigation;
- whether you believe page text or other private information left the device.

Redact unrelated page content, account identifiers, cookies, tokens, and URLs.
The project does not need real private data to reproduce a report.

Maintainers will acknowledge reports on a best-effort basis, investigate them
privately, coordinate a fix and release when confirmed, and credit reporters who
want attribution. Please allow a reasonable remediation period before public
disclosure.

## In scope

- page-text, browsing-data, or settings disclosure;
- unexpected network requests or telemetry;
- script injection or execution caused by converted page content;
- extension-origin cross-site scripting;
- privilege escalation or access beyond the active page;
- bypasses of skipped editable, script, style, SVG, MathML, or protected content;
- denial of service caused by adversarial page text;
- restoration bugs that expose text from another tab or page;
- malicious or tampered data-build inputs entering a packaged extension;
- package contents that accidentally include private fonts, corpora, credentials,
  source archives, or development-only files.

Ordinary linguistic inaccuracies, missing vocabulary, brand-name conversion, and
browser-compatibility bugs are normally public issue reports rather than security
reports, unless they also create one of the impacts above.

## Security expectations for changes

- Keep conversion local and dependency-free unless a reviewed design explicitly
  changes that architecture.
- Avoid `innerHTML`, remote code, dynamically fetched rules, broad host
  permissions, and persistent access to browsing history.
- Treat page text as hostile input and preserve the existing skipped-node and
  protected-span boundaries.
- Pin, integrity-check, and attribute networked research inputs. Source corpora
  are build-time inputs and must never be fetched while users browse.
- Inspect `dist/` contents before release. The current package is expected to
  contain only the manifest, runtime source, raster assets, privacy and attribution
  notices, and the project license.

