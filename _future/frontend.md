Okay, this sounds like a great blog post topic! Reflecting on the development journey is really valuable.

Based on our interactions, here's a bullet-point summary of the difficulties and challenges we've encountered. I'll also run a `git log` for your commits to see if that provides any more specific context or reminds me of other areas.

First, I'll attempt to get the git log for "Augustin Chan".

```bash
git log --author="Augustin Chan" --pretty=format:"%h - %s (%ad)" --date=short | cat
```

The git log gives a good overview of the areas you've been working on: README updates, build/deployment clarifications, passkey registration and recovery, login screen, environment setup scripts, and migration from NIA. This aligns well with the challenges we've discussed.

Here's a bullet-point summary of the difficulties and challenges, incorporating insights from the log:

**I. Jetpack Compose Environment & General Android Setup:**

- **Java Environment Configuration (`JAVA_HOME`, `PATH`):**
  - `sdkmanager.bat` failing due to `JAVA_HOME` not being set or `java` not being in the `PATH`.
  - Identifying the correct JDK to use (e.g., Android Studio's JBR for Windows command line, openjdk 17 for WSL) and correctly configuring environment variables for it.
  For Android Studio 
  - Creating a batch file (`run_sdkmanager.bat`) as a workaround for users who may not want to alter system-wide environment iiivariables, adding another layer of setup.
- **Build & Deployment Nuances:**
  - README updates needed to clarify build and deployment for emulated devices (Commit `84c8420f`).
  - Initial observation that builds worked but required `adb install` from the command line (Commit `f6d8df32`), suggesting potential Android Studio integration or deployment configuration hurdles early on.
- **Tooling and Shell Environment (Dual Android Studio/WSL):**
  - Confusion when running terminal commands, as some were executed in a Windows context (`cmd.exe`) and others in WSL (`bash`). This led to:
    - Errors like `'cat' is not recognized` when trying to use Linux commands in a Windows context.
    - Path interpretation issues (Windows paths vs. Linux paths in WSL).
  - Needing to refine setup scripts (`setup-android-tools.sh`) for environment variable management (`f6da239c`, `df84e033`, `302e0528`), possibly to better handle the dual environment or ADB configurations.
  - Specific ADB server socket configurations needed attention (Commits `df84e033`, `d9056187`).

**II. Passkey Authentication (Registration, Login, Recovery):**

- **Firebase Project Integration:**
  - Initial errors due to missing or incorrect `google-services.json` (placeholder values like "Your:App:Id").
  - The need to understand that different build variants/flavors (e.g., `ai.peepsapp.peopleapp.demo.debug`) require specific package name registration in the Firebase project console.
  - Forgetting to (or needing guidance to) download the _new_ `google-services.json` after adding new package names or SHA-1 fingerprints to Firebase.
  - Process of obtaining and adding the Debug SHA-1 fingerprint to the Firebase project.
- **Backend API Connectivity:**
  - Encountering `java.net.UnknownHostException` for your custom backend (`stage.peepsapp.ai`), indicating DNS or network resolution problems for the app to reach its own servers, separate from Firebase.
- **Passkey Credential Management (Client-Side):**
  - Successfully registering passkeys (including recovery passkeys) after initial setup hurdles.
  - The core challenge of `TYPE_NO_CREDENTIAL` error during login attempts, even after confirming:
    - The server correctly provided the `rpId` ("stage.peepsapp.ai").
    - The server's login challenge included the `credential ID` of the recently registered passkey in the `allowCredentials` list.
  - This pointed to issues with the passkey not being fully available, synced, or recognized by the Android `CredentialManager` / Google Password Manager on the specific test device/emulator, despite a seemingly successful registration UI flow.
  - Debugging involved checking Google Account settings for passkey sync and considering emulator/device state.
- **Passkey Flow Complexity:**
  - Implementing multiple distinct flows: initial registration (WIP in `01f75b83`), login (`b21702fb`), and recovery (`b5c29ab4`). Each has its own challenge-response cycle and interacts with `CredentialManager` differently.
  - Ensuring the `rpId` consistency across all flows and between the app and the backend.

**III. Migration from "Now In Android" (NIA) Skeleton:**

- **Initial Uncertainty:** You expressed uncertainty about this choice.
- **Build System Complexity:** While powerful, NIA's build system (using `build-logic`, convention plugins, version catalogs like `libs.versions.toml`) presented an initial learning curve, especially when we tried to:
  - Locate and modify Firebase dependencies (our attempt to comment them out and then revert). The abstraction layers made it less direct than editing a simple module-level `build.gradle` file.
- **Refactoring and Renaming:**
  - Post-fork, there was effort in migrating/renaming packages (Commit `d11f29c0`) and removing legacy NIA files/configurations (`ed9761de`). This is standard for adopting a template but requires careful execution.
- **Adapting to a New Codebase:** Understanding the existing navigation, state management (`PeepsAppState`), and overall architecture of NIA to then build "People App" features on top.

**IV. Dual Android Studio/WSL Setup:**

- **User Uncertainty:** You expressed uncertainty about this setup.
- **Tooling and Path Issues:** As mentioned in section I, this was a recurring theme when interacting with the command line for SDK tools or Git. The assistant (me) sometimes defaulted to WSL context for `run_terminal_cmd`, while the problem or user's context might have been Windows-native.
- **Environment Consistency:** Requires careful management of environment variables (`ADB_SERVER_SOCKET`, `JAVA_HOME`, `PATH`) across both environments, or at least being aware of which environment a particular command needs to run in. Your work on `setup-android-tools.sh` points to this.

This list should give you a solid foundation for your blog post. The `git log` definitely helped pinpoint specific areas like README updates and script refinements that were part of the overall setup challenge. Good luck with your writing!
