[![Badge Release]][Release]
[![Badge License]][License]
[![Badge Mozilla]][Mozilla]

---

<h1 align="center">
<sub>
<img src="assets/icon.svg" height="38" width="38">
</sub>
Containers New Tab
</h1>

![Containers Tab — light and dark themes](assets/screenshot-home-themes.jpg)

[Multi-Account Containers](https://addons.mozilla.org/firefox/addon/multi-account-containers/) is great - until you want a new tab in the right one. Hunting the toolbar icon, misclicking or remembering which sites belong where gets old fast. This extension turns every new tab into a clear overview: open a container in one click, see which sites are already assigned, and create or edit containers, including proxy configurations, without leaving the page.

---

## Installation

Install from [Firefox Add-ons][Mozilla]. You'll want [Multi-Account Containers](https://addons.mozilla.org/firefox/addon/multi-account-containers/) installed too - site assignments are read from MAC.

[![Get the Add-on](assets/get-the-addon.png)](https://addons.mozilla.org/firefox/addon/containers-new-tab/)

## Development

**Local**

```bash
npm install

# Vite HMR for the new-tab UI
npm run dev

# build + web-ext run (needs Firefox + display)
npm start

npm run build
```

**Devcontainer**

Rebuild the container, then:

```bash
npm install

# Firefox + noVNC, runs on port 6080
npm run test:firefox
```

**Lint**

```bash
npm run lint       # prettier + oxlint
npm run lint:fix   # autofix
```

**Test**

```bash
npm test
npm run test:watch
npm run test:coverage
```

**Publish**

```bash
npm run package   # outputs web-ext-artifacts/*.zip
```

Listed releases go out from GitHub Actions on push to `main`.

## License

[MIT](LICENSE)

<!----------------------------------------------------------------------------->

[Release]: https://github.com/shotor/containers-new-tab/actions/workflows/release.yml
[License]: LICENSE
[Mozilla]: https://addons.mozilla.org/addon/containers-new-tab/
[Badge Release]: https://github.com/shotor/containers-new-tab/actions/workflows/release.yml/badge.svg
[Badge License]: https://img.shields.io/badge/License-MIT-blue.svg
[Badge Mozilla]: https://img.shields.io/amo/rating/containers-new-tab?label=Firefox
