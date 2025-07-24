# Algeria VFR EFB

A simple Electronic Flight Bag (EFB) application for VFR flying in Algeria, built with React Native and Expo.

## Features

### 📍 Live Map
- Real-time GPS position tracking
- Live flight path recording
- Speed, altitude, and heading display
- Satellite map view optimized for aviation
- Aircraft icon with heading indicator
- Flight tracking controls

### 🎯 Waypoint Management
- Add, edit, and delete waypoints
- Distance and bearing calculations from current position
- Local storage for waypoint persistence
- Current location auto-fill
- Notes and altitude information

### ✈️ VFR References
- Major Algerian airports with details (ICAO/IATA codes, coordinates, runways)
- Radio frequencies for ATC communications
- VFR rules and procedures
- Emergency information and procedures
- Weather information links
- Search and rescue contacts

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Physical device or emulator

### Quick Start

1. **Clone and install dependencies:**
```bash
cd AlgeriaVFR
npm install
```

2. **Start the development server:**
```bash
npm start
# or
npx expo start
```

3. **Run on device:**
   - **Android:** Press `a` in the terminal or scan QR code with Expo Go app
   - **Web:** Press `w` in the terminal (limited functionality)

### Building for Android

1. **Create development build:**
```bash
npx expo build:android
```

2. **Or create APK:**
```bash
npx expo build:android -t apk
```

## Usage

### Map Screen
- View your current position on satellite map
- Monitor speed, altitude, and heading in real-time
- Toggle flight tracking to record your path
- Clear flight path when needed

### Waypoints Screen
- Tap "+" to add new waypoints
- Use current location or enter coordinates manually
- View distance and bearing to each waypoint
- Edit or delete existing waypoints

### VFR References Screen
- Browse Algeria-specific aviation information
- Access airport details and frequencies
- Review VFR rules and emergency procedures
- Quick links to weather services

## Permissions

The app requires the following permissions:
- **Location (GPS):** For real-time position tracking and navigation
- **Internet:** For map tiles and weather links

## Important Notes

⚠️ **Safety Disclaimer:**
- This app is for reference and training purposes
- Always consult official aeronautical publications
- Check current NOTAMs before flight
- Maintain situational awareness at all times
- Do not rely solely on this app for navigation

## Technical Details

- **Framework:** React Native with Expo
- **Maps:** React Native Maps
- **Location:** Expo Location
- **Storage:** AsyncStorage for waypoint persistence
- **Navigation:** React Navigation
- **Target:** Android (iOS compatible with minor adjustments)

## Development

### Project Structure
```
AlgeriaVFR/
├── App.js                 # Main app with navigation
├── src/
│   ├── screens/
│   │   ├── MapScreen.js   # Live GPS map
│   │   ├── WaypointsScreen.js # Waypoint management
│   │   └── VFRScreen.js   # VFR references
│   ├── components/        # Reusable components
│   ├── data/             # Static data
│   └── utils/            # Utility functions
└── assets/               # Images and icons
```

### Customization

To customize for other regions:
1. Update airport data in `VFRScreen.js`
2. Modify radio frequencies
3. Adjust map center coordinates
4. Update emergency contacts

### Adding Features

Potential enhancements:
- Weather overlay on map
- Flight planning tools
- NOTAM integration
- Offline map support
- Export flight logs

## Support

For issues or feature requests, please check the documentation or create an issue in the project repository.

## License

This project is intended for educational and reference purposes. Please ensure compliance with local aviation regulations.