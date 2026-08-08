# Containers New Tab

Firefox new-tab and homepage for [containers](https://addons.mozilla.org/firefox/addon/containers-tab/) — pick a container, open sites where they belong, and edit containers in place.

## Development

**Local**

```bash
npm install
npm run dev     # Vite HMR for the new-tab UI
npm start       # build + web-ext run (needs Firefox + display)
npm run build
```

**Devcontainer**

Rebuild the container, then:

```bash
npm install
npm run test:firefox   # Firefox + noVNC
```

Open forwarded port **6080** → `/vnc.html` → Connect.

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

## License

[MIT](LICENSE)
