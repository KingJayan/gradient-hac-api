# Gradient - Your Grades, Visualized

A React Native + Expo iOS app for viewing and managing academic grades from Home Access Center (HAC).

## Features

- **Authentication**: Secure login with HAC credentials (stored in iOS Keychain)
- **Home Dashboard**: GPA stats, date, and quick navigation
- **Grades**: View all grades with color-coded assignments
- **GPA Calculator**: Calculate weighted/unweighted GPA with what-if scenarios
- **Planner**: Manage HAC assignments and personal tasks
- **Schedule**: View A-Day/B-Day class schedules with current class info
- **Transcript**: Historical grades organized by year
- **Attendance**: Track attendance with weekly breakdown
- **Settings**: Account info, dark mode toggle, app info

## Tech Stack

- **Framework**: React Native 0.76 with Expo 52
- **Navigation**: React Navigation (Bottom Tabs + Native Stack)
- **Storage**: expo-secure-store (Keychain)
- **State**: React Hooks (useReducer, useContext)
- **Type Safety**: TypeScript
- **Icons**: Expo Vector Icons (Ionicons)

## Project Structure

\`\`\`
├── App.tsx                 # Main entry point
├── app.tsx                 # Root navigator
├── screens/                # Screen components
│   ├── home-screen.tsx
│   ├── grades-screen.tsx
│   ├── gpa-calculator-screen.tsx
│   ├── planner-screen.tsx
│   ├── schedule-screen.tsx
│   ├── transcript-screen.tsx
│   ├── attendance-screen.tsx
│   ├── login-screen.tsx
│   ├── settings-screen.tsx
│   └── loading-screen.tsx
├── context/                # React Context
│   └── auth-context.ts
├── hooks/                  # Custom hooks
│   └── use-auth.ts
├── utils/                  # Utilities
│   ├── gpa-calculator.ts
│   ├── schedule-data.ts
│   └── task-manager.ts
├── services/               # API integrations
│   └── hac-api.ts
├── app.json               # Expo config
├── eas.json               # EAS Build config
└── tsconfig.json          # TypeScript config
\`\`\`

## Getting Started

### Install Dependencies
\`\`\`bash
npm install
\`\`\`

### Start Development Server
\`\`\`bash
npm start
\`\`\`

### Run on iOS Simulator
\`\`\`bash
npm run ios
\`\`\`

### Run on Physical Device
1. Install Expo Go from App Store
2. Scan QR code with iPhone camera

## Building for Production

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed iOS App Store deployment instructions.

### Quick Build
\`\`\`bash
# Build for iOS App Store
eas build --platform ios

# Submit to App Store
eas submit --platform ios
\`\`\`

## HAC Integration

Supports multiple school districts:
- RRISD
- Austin ISD
- Frisco ISD  
- Cypress ISD

Easily add more districts by updating DISTRICTS in `screens/login-screen.tsx`.

## Security

- Credentials stored in iOS Keychain
- No credentials logged or persisted to disk
- Uses HTTPS for all API calls
- Complies with iOS security best practices

## Dependencies

### Core
- react-native 0.76
- expo 52
- react 18.2
- @react-navigation/native 6.1
- @react-navigation/bottom-tabs 6.5

### Utilities
- date-fns 4.1
- zod 3.25

### Storage
- expo-secure-store 13.0

## License

Private - Gradient App

## Author

KingJayan

## Support

For issues and feature requests, contact the development team.
