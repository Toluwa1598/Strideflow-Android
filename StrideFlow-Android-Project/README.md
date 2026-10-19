# StrideFlow Android

This project packages your original React + Tailwind habit dashboard into a native Android APK using Capacitor. Habit data stays on the device in the WebView's local storage and the app works offline after installation.

## Build an APK using only your phone

1. Download this project ZIP to your phone.
2. Sign in at https://github.com in your phone browser and create a repository named `strideflow-android`.
3. Upload the ZIP itself to the repository using **Add file → Upload files**, then commit the upload.
4. If GitHub Codespaces is available on your account, open **Code → Codespaces** and create a codespace. In its terminal, run these commands to unpack the project into the repository root and push the real project files:

   ```bash
   unzip StrideFlow-Android-Project.zip -d /tmp/strideflow
   cp -R /tmp/strideflow/. .
   rm StrideFlow-Android-Project.zip
   git add -A
   git commit -m "Set up StrideFlow Android project"
   git push
   ```

   The ZIP filename in the command must match the name shown in your repository. If you do not have Codespaces, extract the ZIP on your phone and upload the extracted files while preserving the folder structure. Ensure `.github/workflows/build-apk.yml` is included.
5. Open the repository's **Actions** tab and enable Actions if asked. Select **Build StrideFlow APK** → **Run workflow**. A push to `main` or `master` also starts a build.
6. Wait for the workflow to finish successfully. Open that run, scroll to **Artifacts**, and download `StrideFlow-debug-apk`.
7. Extract the downloaded artifact ZIP and tap `app-debug.apk`. If Android blocks the install, allow your browser/file manager to install unknown apps for this one installation, then retry.
8. Open StrideFlow and test adding a habit, checking it off, closing/reopening the app, and turning on Airplane mode.

## Data and offline behavior

- Habit records use `localStorage` under the key `habit_pulse_v1`, as in the original dashboard.
- No account, server, or internet connection is needed after the APK has been built and installed.
- Data is local to this app installation. Clearing app storage or uninstalling the app can erase it. This starter project does not sync or back up your records.
- To keep data, avoid clearing StrideFlow's app storage. An Android app update installed over the existing app normally preserves its app data.

## Troubleshooting

- **No Actions tab / workflow not running:** open repository Settings → Actions → General and permit actions; then check the workflow file path.
- **Build failed:** open the failed workflow run and inspect the first red step. The full log can be copied and shared for diagnosis.
- **Upload says file too large:** upload files in batches or use GitHub's web editor/another Git client; do not upload `node_modules` or `dist`.
- **APK won't install:** confirm the download was extracted and the file ends in `.apk`; allow installs from the app used to open it.
- **App opens but styles are missing:** check that `src/index.css`, `tailwind.config.js`, and the `content` paths are included.

## Package identity

Application ID: `com.strideflow.habitstudio`

This is a debug APK, suitable for personal testing. A Play Store release requires a signed release build and a separate release process.
