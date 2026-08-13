# Personal publisher account guide

Last checked: 2026-08-13. This guide assumes Prepiši will be published by an
individual under their personal name, not through a company account.

## Current release position

- Chrome/Chromium, Edge, Firefox, and Safari source packages are built as
  version 0.9.1.
- The Safari macOS and iOS containing apps, their embedded extensions, and their
  embedded manifests also build as version 0.9.1.
- Browser upload ZIPs are generated locally under ignored `dist/`.
- The repository can supply the project homepage, support page, source archive,
  and privacy-policy URL after it becomes public.
- Public release remains gated on confirming that the Balkan Sans-derived
  raster branding may be distributed, or replacing it with originally licensed
  branding (see `research/BRAND_IDENTITY_ALTERNATIVES.md`). The COMtext.SR
  redistribution decision was resolved 2026-08-13 — CC BY 4.0 International,
  confirmed in the upstream README — and the personal email was sanitized from
  Git history the same day. See `ATTRIBUTIONS.md` and `docs/PROJECT_STATUS.md`.

## Mailbox account check

A read-only search of the connected Gmail mailbox on 2026-08-13 found no
registration, verification, submission, or signing messages for:

- Chrome Web Store developer accounts;
- addons.mozilla.org / Mozilla Add-ons developer accounts; or
- Microsoft Partner Center / Microsoft Edge extension developer accounts.

This is not proof that no account exists: an account may use another email
address, and old messages may have been deleted. Plan for new personal
registrations unless logging into a dashboard shows an existing account.

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
   branches to coordinate with (single-owner, still-private repository).
3. Verified: `git log --format='%ae' origin/main | sort -u` returns only the
   `noreply` address across all 17 commits on `origin/main`.

This was performed while the repository is still private, ahead of the
Balkan Sans branding decision that remains the last public-release gate.

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

After the rights gate is resolved and release files are reviewed:

1. Commit the 0.9.1 release changes and push them.
2. Make the repository public.
3. Tag the exact store source as `v0.9.1`.
4. Use the rendered GitHub privacy page as the initial policy URL:
   `https://github.com/vokativ/prepisi/blob/main/PRIVACY.md`.
5. Use the repository home page as the project and support URL unless a separate
   website is created later.

A public GitHub repository is not required merely to register for the extension
stores. It is useful here because it supplies stable privacy, support, and
GPL-3.0 source links.

## Chrome Web Store

### Account to use

Use a dedicated project Google Account controlled personally. Chrome does not present the same explicit
Individual-versus-Company choice used by Microsoft or Apple; the Google Account
becomes a Chrome Web Store publisher account. Google recommends an address that
will remain available and be monitored because the developer-account identity
cannot simply be changed later. The verified contact email appears under the
extension's contact information.

### Registration

1. Open the Chrome Web Store Developer Dashboard while signed in to the chosen
   personal Google Account.
2. Accept the developer agreement and pay the one-time registration fee shown
   during registration.
3. Set the public publisher name. Use either the personal name or the Prepiši
   project name consistently across the listing and support material.
4. Add and verify the contact email.
5. Declare Trader or Non-Trader status when asked. This is a legal
   classification based on whether the publishing activity relates to a trade,
   business, craft, or profession; choosing a personal account does not decide
   the classification automatically.
6. Upload `dist/prepisi-0.9.1-chromium.zip` and complete the listing, privacy,
   permission-justification, and distribution fields.

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

### Registration

1. Sign in to Partner Center with the personal MSA or personal GitHub account.
2. Open **Account settings → Programs → Microsoft Edge → Get started**.
3. Select the correct country or region and **Individual** account type.
4. Choose the available publisher display name and provide the required private
   account contact information. For the public optional support contact, enter
   the GitHub support URL rather than the login email.
5. Accept the developer agreement and wait for verification.
6. There is no Microsoft Edge extension-program registration fee.
7. Upload `dist/prepisi-0.9.1-edge.zip` only after the deferred Edge runtime pass
   is completed, or publish conservatively without claiming the deferred macOS
   combination as verified.

Official guidance:

- <https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/create-dev-account>
- <https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/manage-settings>

## Firefox Add-ons (AMO)

### Account to use

Use a personal Mozilla Account. AMO does not require selecting a company account
type. After signing in to addons.mozilla.org, set the AMO developer-profile
display name separately; the Mozilla Account display name does not automatically
become the AMO display name.

### Registration and signing

1. Sign in or register at addons.mozilla.org with the personal Mozilla Account.
2. Open the Add-ons Developer Hub and choose **Submit a New Add-on**.
3. Choose **On this site** for a normal public AMO listing.
4. Upload `dist/prepisi-0.9.1-firefox.zip`.
5. If AMO asks whether the submitted extension contains generated or
   preprocessed files, provide the tagged repository source plus reviewer build
   instructions. The target package is produced from repository source by
   `npm run build:all`; generated linguistic files retain their documented
   provenance and review workflow.
6. Complete the listing and wait for Mozilla signing/review.
7. Test the exact Mozilla-signed XPI on Firefox desktop and Android before
   calling the signed package fully supported.

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

1. Resolve the Balkan Sans-derived branding gate (confirm distribution rights
   or replace the icon/wordmark). COMtext.SR is resolved as of 2026-08-13.
2. Reauthenticate the intended personal GitHub account and review the complete
   public-repository contents.
3. Commit, push, make the repository public, and tag `v0.9.1`.
4. Confirm the public privacy and support links work while logged out.
5. Register the Chrome, Mozilla, and Microsoft individual publisher accounts in
   parallel. Confirm the Apple individual membership separately.
6. Prepare consistent descriptions, screenshots, privacy answers, permission
   explanations, and reviewer notes.
7. Submit Chrome first, obtain Firefox signing and retest the signed XPI, submit
   Safari through TestFlight/App Store Connect, and return to Edge after its
   deferred runtime pass.

## Where the account owner must step in

The account owner must personally handle sign-in, two-factor authentication,
identity or trader declarations, legal agreements, fees, tax/banking questions
if presented, and final submission approval. Repository preparation, packages,
store copy, privacy answers, screenshots, reviewer notes, and form navigation
can otherwise be prepared with computer assistance.
