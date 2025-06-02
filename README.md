# Explora - Travel Destination Explorer App

React Native travel app with native iOS calendar integration using EventKit framework.

## How to Run the App

### Prerequisites
- Node.js 18+
- **Xcode 16.3+ (tested on 16.4) - Earlier versions will not work**
- iOS Simulator or device
- Yarn

### Setup
```bash
git clone [repository-url]
cd explora
yarn install
yarn ios:release
```

## Testing Calendar Integration

### iOS Testing
1. Navigate to any destination detail screen
2. Tap "Add to Calendar" - grant calendar permissions when prompted
3. Verify event appears in iOS Calendar app
4. Event includes: destination name, travel dates, location, 24-hour reminder
5. Tap "Remove" to delete event from calendar
6. App state persists between sessions

## Thought Process

**Architecture**: Used Zustand for state management, [MMKV](https://github.com/mrousavy/react-native-mmkv) for synchronous persistent storage, and React Navigation's [native stack navigator](https://reactnavigation.org/docs/native-stack-navigator/) over JavaScript stack for true native performance using UINavigationController on iOS. Implemented custom EventKit native module in Objective-C++ using TurboModules for synchronous, type-safe iOS calendar integration. [Unistyles 3.0](https://www.unistyl.es/v3/start/introduction) provides C++ cross-platform styling with no component wrappers and pure JSI bindings. TypeScript throughout for compile-time safety.

**Performance**: [FlashList](https://shopify.github.io/flash-list/) over FlatList for 10x better rendering performance on large datasets. [expo-image](https://docs.expo.dev/versions/latest/sdk/image/) over Image for advanced caching, progressive loading, and memory optimization. MMKV provides synchronous read/write operations vs AsyncStorage's asynchronous overhead. Unistyles guarantees zero re-renders with no hooks/context overhead and consistent C++ parser output across platforms.

**Design**: Manrope typography system, Unistyles for theming with dark/light mode support, Reanimated for smooth animations.

## Trade-offs & Assumptions

**Technical Decisions**:
- iOS-only calendar integration (as specified)
- Static JSON data for simplicity and offline capability  
- MMKV over AsyncStorage for better performance
- Expo dev client for faster iteration
- Considered React Compiler: State management is already optimized with Zustand and Unistyles, making React Compiler overkill for this project scope
- No zoom-in transition from list/grid to detail view: [React Native Reanimated's shared element transitions](https://docs.swmansion.com/react-native-reanimated/docs/shared-element-transitions/overview/#remarks) only support the old Paper architecture, not the new Fabric architecture. Alternative libraries are poorly maintained or incompatible with native stack navigator.

**Bonus**: Map screen, persistent storage, dark mode, advanced typography, performance optimizations.
