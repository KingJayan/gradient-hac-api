<div align="center">
<h2><code>KingJayan/Gradient</code></h2>
<p>Minimalist iOS app for viewing Home Access Center (HAC) grades. Built with React Native + Expo.</p>
</div>


## Features

- Live grades, GPA (weighted + unweighted), schedule, planner, transcript, attendance
- Personal tasks merged with HAC assignments
- 6 dark themes
- Credentials stored in iOS Keychain, never on a server

## Quick start

```bash
npm install
npm start         # then press `i` for iOS simulator
```

Sign in with your district's HAC URL, username, and password. Four districts are preset; others can be added in [screens/login-screen.tsx](screens/login-screen.tsx).

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Expo dev server |
| `npm run ios` | Launch iOS simulator |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript check |
| `npm run build:ios` | EAS production build |

## Stack

React Native 0.76 · Expo SDK 52 · React Navigation 6 · TypeScript · expo-secure-store

## Layout

```
app.tsx              # providers + navigation
context/             # auth, theme, shared data cache
hooks/               # use-auth, use-creds, use-theme
services/hac-api.ts  # all HAC fetchers
screens/             # feature screens
utils/               # GPA, tasks, schedule, logging
```

See [CLAUDE.md](./CLAUDE.md) for architectural detail and [DEPLOYMENT.md](./DEPLOYMENT.md) for App Store shipping.

## Security

Passwords live only in the iOS Keychain (`expo-secure-store`) and are read on demand via `useCreds()`. They are never written into the persisted user JSON.
