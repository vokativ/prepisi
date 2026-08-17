# Personal publisher account guide

Last checked: 2026-08-17. Publisher identity: `hepsesus@gmail.com`. Public
display name: `Nemanja G`.

## Current release position

- Version 0.9.1 packages were submitted on 2026-08-17.
- Chrome Web Store: **Pending review** (auto-publish). Item
  `lgcbhfgbbjdhglmomlgkbeikcngjhikb`.
- Firefox AMO: validated, 0 errors, in review, Firefox for Android enabled.
  Slug `prepisi-converter`.
- Microsoft Edge: **In review**. Product
  `0575918a-bf45-4fee-9f26-f28fcdf02398`, Store ID `0RDCK9XMTNZC`.
- Apple paid membership is postponed. The free Apple ID is enough for local
  Xcode/iPhone testing only.
- GitHub `vokativ/prepisi` is public. Privacy:
  `https://github.com/vokativ/prepisi/blob/main/PRIVACY.md`.
- Check-back dates, reviewer IDs, and social drafts:
  [`docs/LAUNCH_AND_SOCIAL.md`](LAUNCH_AND_SOCIAL.md).
- Branding audit: toolbar icons are original, but `assets/wordmark.png` remains
  Balkan Sans-derived. Confirm its raster-output right or replace it before
  treating the public-release branding gate as closed.

## Account status (2026-08-17)

1. Dedicated project mailbox `hepsesus@gmail.com` is the login and Chrome
   public contact email.
2. Apple ID under that mailbox is a **free** developer account (`Enroll today`
   still shown). Not in the paid program.
3. Chrome Web Store: $5 paid, Non-Trader declared, contact email **verified**,
   publisher name `Nemanja G`.
4. Mozilla AMO: agreement accepted, display name `Nemanja G`, first add-on
   submitted.
5. Microsoft Partner Center: Individual enrollment complete (Singapore), Edge
   package verified and listing submitted.

## Email privacy and public exposure

Use one durable, project-only mailbox for public publisher and support contact,
for example an address dedicated to Prepiši. Do not use a disposable address:
stores require verification and send security, policy, review, and account
recovery messages long after the first release. The private login address and
the public support address can be different on some platforms, but Chrome's
developer identity is difficult to change later, so beginning with a dedicated
Google Account is the safest approach.

| Surface | Is the account/login email public? | Privacy-safe setup |
| --- | --- | --- |
| GitHub | The profile email can be hidden, but every Git commit stores an author email that becomes readable when the repository is public. | Enable GitHub email privacy, use the GitHub-provided `@users.noreply.github.com` commit address, and enable push protection for commits that expose an email. |
| Chrome Web Store | The verified developer/contact email is displayed under an extension's contact information. Trader verification can additionally publish verified contact details at the bottom of the listing. | Create the dedicated Google Account before paying the registration fee and use the project mailbox for public contact. |
| Edge Add-ons | The Microsoft Account sign-in address is not itself the listing contact. The publisher name is public; the optional support field is also public if it contains an email. | Keep the login private and provide the public GitHub support URL instead of an email. If trader/contact verification is required for the chosen markets, use dedicated public contact details. |
| Firefox AMO | The Mozilla Account login email is returned only to authenticated account access; the public author identity is the AMO display name. A separately supplied add-on support email is public. | Keep the login email private, use a project display name, and use the public GitHub support URL rather than a support email. |
| Apple App Store | An Individual membership publicly shows the account holder's legal name as seller, but the Apple Account login email is not ordinarily the product-page support address. If the developer declares trader status and distributes in the EU, Apple publishes the verified address or P.O. Box, phone number, and email on the product page. | Keep the Apple login private. Use dedicated public contact details for trader information and a GitHub support/privacy URL. |

**Resolved 2026-08-13.** The Git history previously contained the personal
Gmail address in 12 commits, and the repository-level Git setting used that
address too.

1. The repository-local commit identity now uses the GitHub-provided
   `noreply` address, `vokativ@users.noreply.github.com` (already used by 3
   commits before this cleanup).
2. The repository history was rewritten with `git filter-repo`, replacing the
   personal address with the `noreply` address in every commit's author and
   committer metadata, and the sanitized history was force-pushed. A pre-
   rewrite backup bundle was made first; there were no other collaborators or
   branches to coordinate with (single-owner repository).
3. Verified: `git log --format='%ae' origin/main | sort -u` returns only the
   `noreply` address across commits on `origin/main`.

The repository is public as of 2026-08-17. Toolbar icons are original `PRE` /
`ПРЕ` lockups, but the popup wordmark still uses a Balkan Sans-derived raster.
OTF/ZIP font files remain uncommitted. Confirm the wordmark's raster-output
right or replace it before treating the branding gate as closed.

Official privacy references:

- <https://docs.github.com/en/account-and-profile/concepts/email-addresses>
- <https://developer.chrome.com/docs/webstore/set-up-account>
- <https://developer.chrome.com/docs/webstore/program-policies/trader-verification-faq>
- <https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension>
- <https://mozilla.github.io/addons-server/topics/api/v4_frozen/accounts.html>
- <https://developer.apple.com/help/app-store-connect/manage-compliance-information/manage-european-union-digital-services-act-trader-requirements/>

## GitHub

The current remote is `https://github.com/vokativ/prepisi.git`. If `vokativ` is
the intended personal GitHub account, keep that remote and reauthenticate the
GitHub CLI as that user. Otherwise, create or transfer the repository to the
intended personal account before publishing it.

Done 2026-08-17: `vokativ/prepisi` is the public personal repository, tagged
`v0.9.1`. Privacy and support URLs:

- `https://github.com/vokativ/prepisi/blob/main/PRIVACY.md`
- `https://github.com/vokativ/prepisi`

Keep using the GitHub `noreply` commit address. A later store-URL update to the
README is enough after Chrome, Firefox, or Edge publish.

## Chrome Web Store

### Account to use

Use the dedicated project Google Account `hepsesus@gmail.com`. Note that Google
Play Console and Chrome Web Store are separate developer programs; signing in to
the Chrome Web Store Developer Dashboard initiates the extension registration flow.

Completed 2026-08-17 under `hepsesus@gmail.com`: Non-Trader declaration, $5
fee, publisher name `Nemanja G`, verified contact email, and upload of
`dist/prepisi-0.9.1-chromium.zip`. Item
`lgcbhfgbbjdhglmomlgkbeikcngjhikb` is pending review with auto-publish.

Official guidance:

- <https://developer.chrome.com/docs/webstore/register/>
- <https://developer.chrome.com/docs/webstore/set-up-account>
- <https://developer.chrome.com/docs/webstore/prepare>
- <https://developer.chrome.com/docs/webstore/program-policies/trader-verification-faq>

## Microsoft Edge Add-ons

### Account to use

Use a personal Microsoft Account (MSA), not a work or school account. Microsoft
also permits signing in with a personal GitHub account, which creates or links
the required MSA. In Partner Center, enroll in the **Microsoft Edge program**
and choose **Individual** as the account type.

The Individual/Company choice and account country cannot be changed after
enrollment. Individual matches publication as a genuinely personal, non-business
project. Microsoft treats publishing related to a trade, profession, freelance
work, or business differently, so confirm that characterization during signup.

### Submission status

Completed 2026-08-17: Individual enrollment in Singapore, publisher profile,
public GitHub support URL, package validation, Productivity category, privacy
disclosures, English listing, real screenshots, and certification notes. The
public Edge listing is **In review**; Microsoft quoted 7 business days. Edge
runtime testing on macOS remains deferred, so do not claim that combination as
verified.

There is no Microsoft Edge extension-program registration fee.

Official guidance:

- <https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/create-dev-account>
- <https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/manage-settings>

## Firefox Add-ons (AMO)

### Account to use

Use a personal Mozilla Account. AMO does not require selecting a company account
type. After signing in to addons.mozilla.org, set the AMO developer-profile
display name separately; the Mozilla Account display name does not automatically
become the AMO display name.

### Submission status

Completed 2026-08-17: AMO agreement accepted, public listing selected, Firefox
desktop and Android compatibility enabled, `dist/prepisi-0.9.1-firefox.zip`
validated with 0 errors or warnings, metadata and reviewer notes completed, and
a tagged source archive uploaded. AMO slug: `prepisi-converter`.

Next real gate: after Mozilla signs the XPI, test that exact file on Firefox
desktop and Android before describing the signed package as fully supported.

Official guidance:

- <https://extensionworkshop.com/documentation/publish/developer-accounts/>
- <https://extensionworkshop.com/documentation/publish/submitting-an-add-on/>
- <https://extensionworkshop.com/documentation/publish/>

## Apple Safari

Use an **Individual** Apple Developer Program membership. Apple displays the
individual account holder's legal name as the App Store seller name. Confirm
the personal membership, agreements, payment, and two-factor authentication,
then select that personal team in Xcode for every target.

Before archiving, replace the temporary `com.vokativ.prepisi.dev` bundle family
with permanent identifiers registered to the personal team, such as:

- `com.vokativ.prepisi`
- `com.vokativ.prepisi.Extension`

The reverse-DNS bundle identifier does not determine the public seller name.
After signing, use TestFlight to verify the exact build before App Store review.
The Apple Account login email is not ordinarily exposed as the listing support
address. However, an EU trader declaration causes Apple to publish the verified
contact email, phone number, and address or P.O. Box on the product page. Trader
status is a legal classification independent of choosing an Individual Apple
membership.

Official guidance:

- <https://developer.apple.com/programs/enroll/>
- <https://developer.apple.com/documentation/safariservices/distributing-your-safari-web-extension>
- <https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy>

## Recommended order

Done for 0.9.1: branding replacement, public GitHub repo, `v0.9.1` tag, privacy
URL, Chrome/Firefox/Edge individual accounts, and store submissions. See
[`docs/LAUNCH_AND_SOCIAL.md`](LAUNCH_AND_SOCIAL.md) for review wait dates.

Still open:

1. Wait for Chrome, Firefox, and Edge review; retest the Mozilla-signed XPI.
2. Apple paid membership remains postponed.
3. After a store URL exists, add it to the README and a follow-up social post.

## Where the account owner must step in

The account owner must personally handle sign-in, two-factor authentication,
identity or trader declarations, legal agreements, fees, tax/banking questions
if presented, and final submission approval. Repository preparation, packages,
store copy, privacy answers, screenshots, reviewer notes, and form navigation
can otherwise be prepared with computer assistance.
