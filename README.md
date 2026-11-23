# Dr. Ahmed Amer | Website backup and recovery

Static bilingual dental portfolio and medical library. No build step is required.

- Live website: https://dr-ahmed-amer.github.io/
- Mirror: https://dr-ahmed-amer.surge.sh/
- Repository: https://github.com/dr-ahmed-amer/dr-ahmed-amer.github.io
- Source ZIP: use **Code > Download ZIP** on the repository page.

## Restore in about 5 minutes

These steps assume you can sign in to your own hosting account and already have the ZIP or a local copy. Uploading takes only a few minutes; the hosting provider may take longer to finish deployment. This is not a guaranteed recovery-time promise.

### Option A: Restore GitHub Pages

1. Download the source ZIP and extract it. Open the extracted folder that contains `index.html`.
2. Open the repository above in your GitHub account. If needed, create a replacement repository named exactly `dr-ahmed-amer.github.io` under the `dr-ahmed-amer` account. A different account name produces a different website address.
3. Upload the extracted contents to the `main` branch at the repository root. Do not upload the outer ZIP folder as an extra nested directory. Include the hidden `.nojekyll` file and all assets.
4. In **Settings > Pages**, choose **Deploy from a branch**, branch **main**, folder **/(root)**, then save. These were the verified settings on 23 November 2026.
5. Wait for GitHub's deployment to finish, open the website and check the home page, medical library, CV and admin sign-in page. Also check the live reviews and case images.

If you use Git instead of browser uploads, clone the repository, copy the backed-up source files into its root, review the changes, commit them and push to `main`. Do not force-push or delete history just to restore website files.

### Option B: Restore the Surge mirror

You need Node.js and access to the existing Surge account/domain.

```sh
npm install --global surge
cd path/to/extracted-website
surge . dr-ahmed-amer.surge.sh
```

Sign in when asked. Run this from the folder containing `index.html`. If Surge asks for email verification, complete it in your own inbox. Do not put passwords or deployment tokens into source files, command examples or this README.

## What the ZIP contains

- `index.html`: visitor portfolio and shared frontend code.
- `admin.html`: owner editing interface.
- `library.html` and `ai-topics.js`: medical library and bilingual educational catalogue.
- `topics-cache.js`: topic-cache service worker.
- `cv.html`, `cv.png` and `assets/`: CV and bundled images.
- CSS/JavaScript files: layout, interaction, motion and performance styling.
- `404.html`, `robots.txt`, `sitemap.xml` and `.nojekyll`: hosting/search support.
- `worker/ai-search.js`: optional AI proxy source. Its presence does not mean the proxy is deployed or configured.

The standard GitHub ZIP contains the current source tree, not the repository's full Git history. To preserve history too, keep a separate local Git clone.

## What a source backup does NOT restore

A source ZIP is not a complete backup of externally hosted data or account settings:

- Firebase Authentication users, owner account access, Firestore data and security rules.
- Live cases, comments, reviews and visit counters held in Firestore.
- Images hosted externally on Cloudinary rather than inside `assets/`.
- External form/email notification service settings.
- Hosting account access, domain ownership or email verification.
- Any independently deployed Worker, its bindings or private API secret.
- The admin PIN stored in a particular browser's local storage.

Restoring to the same hosts with the same existing backend can reconnect these features. If the external services or their data are lost, restoring the HTML alone will not bring that data back. Exporting those services is a separate backup task. No claim is made here that those exports have been completed.

## Public browser configuration and secrets

This repository is public. The HTML includes Firebase web-app configuration, including a browser API key and project identifiers. Firebase documents these as public project/app identifiers, not owner login credentials. Access must be protected by Firebase Security Rules, Authentication and appropriate key restrictions. This recovery work did not audit or change those settings.

Never commit an owner password, admin PIN, GitHub token, Surge token, private service-account key or Gemini API secret. The optional Worker expects its private secret to be configured separately by its owner, never hardcoded into its source.

The admin page's local PIN is a convenience gate tied to a browser, not server-side authorization. Live publishing uses the owner's separate account sign-in. Use the original browser and hostname to access an already saved PIN.

## Recovery check

After any restore:

- Open home, library and CV on a phone-sized and desktop-sized screen.
- Switch English/Arabic and test library search, including a query with no results.
- Check bundled images, CV download and WhatsApp links.
- Check that expected cases and approved reviews load from the existing backend.
- Open the admin page and sign in yourself. Do not share credentials in chat.
- Keep a dated ZIP on your own device and another copy in storage you control.

Backup and deployment settings checked: 23 November 2026.

## Official recovery references

- GitHub Pages publishing source: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- Surge getting started: https://surge.sh/docs/getting-started
- Firebase API key guidance: https://firebase.google.com/docs/projects/api-keys
