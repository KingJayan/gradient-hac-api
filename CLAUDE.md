# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm start                    # Start development server
npm run ios                  # Run on iOS simulator
npm run android              # Run on Android simulator
npm run lint                 # Lint with ESLint
npm run type-check           # Run TypeScript type checking
npm run prebuild             # Expo prebuild (native code generation)
npm run build:ios            # EAS build for iOS App Store
npm run build:ios-simulator  # EAS build for iOS simulator
```

## Tech Stack

- **React Native 0.76.9** with **Expo SDK 52** (iOS-primary; no web)
- **React Navigation 6** (bottom tab navigator + native stack for modals)
- **TypeScript** (strict mode recommended)
- **expo-secure-store** for Keychain credential storage
- **Expo Vector Icons** (Ionicons only)
- **React Hooks** (useReducer for auth, useContext for theme/auth distribution)

## High-Level Architecture

### Root Setup (app.tsx)
- Single `useAuth()` at root; returns `{ state, bootstrapAsync, login, logout }`
- `ThemeProvider` wraps entire app; provides `{ currentTheme, themeName, availableThemes, setTheme }`
- Navigation: `state.isLoggedOut ? <AuthStack /> : <AppTabs />`
- Auth context distributed to all children via `<AuthContext.Provider>`

### Auth Flow (context/auth-context.ts + hooks/use-auth.ts)
- **Student type**: `{ id, username, hacUrl, name, password? }`
  - Password is **ephemeral**; loaded from SecureStore `userPass` key on restore, never serialized into user JSON
  - User JSON persisted to SecureStore `user` key (does NOT include password)
- **useAuth hook** uses `useReducer` with SIGN_IN/SIGN_OUT actions
- **bootstrapAsync()**: Reads 3 SecureStore keys in parallel (`userToken`, `user`, `userPass`); if any missing → SIGN_OUT
- **login(username, password, hacUrl)**: Stores user JSON + password + token separately; creates userToken = `"dummyToken-${Date.now()}"`
- **logout()**: Clears all 3 SecureStore keys

### Credentials Access (hooks/use-creds.ts)
- All API-calling screens must guard with `useCreds()` → returns `Creds | null` if password available
- `Creds = { hacUrl, username, password }`
- Screen pattern: `if (!creds) return` or empty state

### HAC API Service Layer (services/hac-api.ts)
- Exports 7 async functions: `fetchGrades`, `fetchAssignments`, `fetchCourses`, `fetchSchedule`, `fetchTranscript`, `fetchAttendance`, `fetchTeachers`
- All accept `(hacUrl, username, password, ...optionalParams)`
- **Optional params** prevent duplicate network calls:
  - `fetchCourses(hacUrl, username, password, grades?)` — accepts pre-fetched grades
  - `fetchSchedule(hacUrl, username, password, rawClasses?)` — optional pre-fetched classes
  - `fetchTeachers(hacUrl, username, password, rawClasses?)` — optional pre-fetched classes
- **Response adapters**: Uses `WithRawClassName` base interface + `toArray()` helper to normalize HAC's inconsistent field names (`className` vs `class`, wrapped vs bare arrays)
- **BELL_TIMES constant**: Maps period numbers 1–8 to default clock times (HAC doesn't provide these)
- **Attendance graceful empty**: Returns empty array if endpoint unavailable (many districts don't expose it)

### Theme System (context/theme-context.ts)
- **6 built-in themes**: emerald (default), ocean, violet, rose, amber, slate
- Each theme: `{ primary, background, surface, text, textSecondary, border }`
- Persisted to SecureStore `appTheme` key
- `useTheme()` hook provides `currentTheme` object + `setTheme(name)` + `availableThemes` array
- Settings screen iterates `availableThemes` to render theme picker

### Screen Data Pattern
All data-loading screens (`home`, `grades`, `gpa`, `schedule`, `planner`, `transcript`, `attendance`, `email-teachers`) follow same pattern:
```ts
const creds = useCreds();
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<T[]>([]);

useFocusEffect(
  React.useCallback(() => { loadData(); }, [creds])
);

const loadData = async () => {
  if (!creds) { setLoading(false); return; }  // guard
  try {
    setLoading(true);
    setError(null);
    const result = await fetchXxx(creds.hacUrl, creds.username, creds.password);
    setData(result);
  } catch (e: any) {
    setError(e.message ?? 'Failed to load data');
  } finally {
    setLoading(false);
  }
};
```
- Uses `useFocusEffect()` to refetch on screen focus
- Render: loading spinner → error state with retry button → data

### Animations
- All `Animated.Value` instances wrapped in `useRef` to prevent recreation on re-render
- Used in `home-screen`, `login-screen`, `loading-screen` for slide/fade effects

## Important Files

| File | Purpose |
|------|---------|
| `app.tsx` | Root navigator, theme/auth setup |
| `context/auth-context.ts` | Auth types and context creation |
| `context/theme-context.ts` | Theme context, 6 themes, SecureStore persistence |
| `hooks/use-auth.ts` | Auth state logic with useReducer |
| `hooks/use-creds.ts` | Credentials guard hook |
| `hooks/use-theme.ts` | useTheme hook |
| `services/hac-api.ts` | Complete HAC API service layer (7 fetch functions + adapters) |
| `screens/*.tsx` | 11 feature screens (all follow data loading pattern above) |
| `utils/gpa-calculator.ts` | Weighted GPA calculation |
| `utils/task-manager.ts` | Task merging logic (HAC + personal) |
| `utils/schedule-data.ts` | Schedule helpers |

## Common Patterns & Guidelines

### Adding a New Screen
1. Create screen in `screens/new-screen.tsx`
2. Use `useCreds()` guard at top
3. Follow data-loading pattern: `useFocusEffect` → `useEffect` → fetch → loading/error/data states
4. Register in `app.tsx` tabs or stack navigator
5. Use `{ currentTheme }` from `useTheme()` for all StyleSheet colors

### Adding a Fetch Function
1. Add to `services/hac-api.ts`
2. Signature: `async function fetchXxx(hacUrl, username, password, ...optionalParams): Promise<T[]>`
3. Use `apiFetch(endpoint, hacUrl, username, password)` helper for HTTP calls
4. Use `toArray()` to normalize wrapped/bare array responses
5. Return typed array (e.g., `GradeEntry[]`, `Assignment[]`)

### Styling
- All screens use `React.Native.StyleSheet` (not Tailwind or shadcn)
- Define styles at bottom of each screen file
- Reference `currentTheme` colors for dynamic theming (primary, background, surface, text, textSecondary, border)
- Use `SafeAreaView` for root container on iOS

### Error Handling
- Network errors: set error state, show retry button
- Missing credentials: `useCreds()` returns null, render empty/login prompt
- Attendance unavailable: graceful empty state message (not crash)

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for iOS App Store submission.

Quick workflow:
```bash
npm run prebuild        # Generate native code
npm run build:ios       # Build for App Store
eas submit --platform ios  # Submit to Apple
```

EAS project ID in `app.json` extra.eas.projectId (currently placeholder—update before building).

## Security Notes

- All credentials stored in iOS Keychain via `expo-secure-store` (encrypted by OS)
- Password stored separately and never logged
- No credentials in user JSON persisted to SecureStore
- `.env*.local` in `.gitignore` (safe for local secrets)

## Known Limitations / Design Decisions

- **iOS-only**: This is a React Native app, not web. All native APIs (Keychain, Linking, Alert) are iOS/Android
- **No dark mode**: `userInterfaceStyle: "light"` in app.json; system dark mode disabled
- **HAC API assumptions**:
  - Response field names vary (`className` vs `class`); adapters handle this
  - Bell times not exposed; using hardcoded `BELL_TIMES` constant
  - Attendance endpoint may be unavailable; graceful empty state
  - Teacher emails not in HAC; shown as "Email not in HAC"
- **No tests**: No unit/integration test suite yet
- **No OTA updates**: `updates.enabled: false` in app.json (manual App Store updates only)
