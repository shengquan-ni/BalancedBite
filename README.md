# BalancedBite
## Introduction
In modern society, many people struggle in having healthy, balanced meals. For
instance, children love snacks and ice cream because they are sweet and
flavorful, students love instant noodles and fast food because they are
convenient, and dieters love eating little to lose weights.
  
Studies have shown that unhealthy eating can lead to severe conditions such as
nutrient deficiencies or diabetes.
  
BalancedBite provides multiple suggestions of dishes to the users based on their
personal health status, preferences, and social standings (Ex: student).
  
It also provides alternatives to users’ current preference to help them start
eating healthily.

## To start development on android (for windows):
1. install [chotolatey](https://chocolatey.org/)
2. install Node.js python2 JDK8 using `choco install -y nodejs.install python2 jdk8`
3. install React Native CLI using `npm install -g react-native-cli`
4. install [Android Studio](https://developer.android.com/studio/)
5. configure Android Studio: Make sure you installed **Android SDK Platform 27** and **Intel x86 Atom_64 System Image or Google APIs Intel x86 Atom System Image**
6. Configure the ANDROID_HOME environment variable (default path: `c:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk`)
7. Execute the following command at the project file to prevent possible error when executing the android application ```mkdir android/app/src/main/assets```
  
For more detailed infomation, please refer to [React Native Docs](https://facebook.github.io/react-native/docs/getting-started)
## To apply your changes on App.js and run it on android:
copy the following and paste on the command line:
  
```react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/```
