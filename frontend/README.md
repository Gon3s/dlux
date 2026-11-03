# Frontend DLux

Interface web Angular 21 du projet v2. Elle consomme le backend FastAPI via
`/api/v1/*` et les WebSockets `/ws/*`.

## Stack

- Angular 21
- Tailwind CSS 3.4
- RxJS
- Standalone components et lazy routes par feature

## Développement

```bash
cd frontend
npm ci
npm run start -- --port 4200
```

Le proxy Angular redirige les appels API vers le backend local `:8000`.

## WSL

Ne pas utiliser le `npm` Windows depuis WSL. Installer Node 22.22.3 ou une
version compatible plus récente dans WSL :

```bash
node --version
npm --version
```

## Build

```bash
cd frontend
npm run build
```

Le build de production sort dans `frontend/dist/frontend/`. FastAPI sert ensuite
`frontend/dist/frontend/browser/` sur le port `8000`.

## Tests

```bash
cd frontend
npm test
```
