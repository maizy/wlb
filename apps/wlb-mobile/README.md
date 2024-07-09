# WLB mobile app

```bash
cd apps/wlb-mobile
```

## Dev

1. Install dependencies

```bash
npm install
```

2. Start the app

```bash
npx expo start
```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Build Android APK on macos

1. Install [Android Studio, SDK Platforms & Tools](https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build).

2. Install build tools & JDK

```bash
brew install openjdk@17
npm install -g eas-cli
```

3. Build

```bash
# env
export JAVA_HOME=`/usr/libexec/java_home -v17`
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools

# install dependencies
npm install

# you have to login even for local build 🤷‍
eas login

# build
eas build --platform android --local
```
