---
layout: post
title: "Android Passkeys: Frontend Adventures with CredentialManager and Jetpack Compose"
author: "Aug"
date: 2025-05-16
header-style: text
catalog: true
description: "Building the Android frontend for FIDO2 passkeys: tackling CredentialManager, migrating DataStore, and the joys of debugging in Jetpack Compose."
tags:
  - android
  - kotlin
  - jetpack compose
  - passkeys
  - fido2
  - webauthn
  - datastore
  - credentialmanager
  - frontend
  - nia
---

**Abstract:**  
This post details the journey of building the Android frontend for FIDO2 passkey authentication. It covers tackling the `CredentialManager` API, migrating local data storage from Proto DataStore to Preferences DataStore, and the debugging strategies employed, including Logcat and in-app debug displays, all within a Jetpack Compose environment.

**Estimated reading time:** _5 minutes_

# Android Passkeys: Frontend Adventures with CredentialManager and Jetpack Compose

Following up on my [previous post about backend challenges with FIDO2 passkeys](/2025/05/14/Challenges-with-Passkey-Android/), this time I\'m diving into the Android frontend. Building the UI and logic for passkey authentication in our "People App" (a fork of Google\'s "Now In Android" sample) was an interesting journey, especially when wrestling with Jetpack Compose, the `CredentialManager` API, and a necessary data storage overhaul.

## Starting Point: The "Now In Android" Scaffold

We kicked off by forking the "Now In Android" (NIA) app. It\'s a fantastic resource, showcasing modern Android development best practices, including a sophisticated build system using `build-logic`, convention plugins, and version catalogs. This gave us a solid foundation but also meant an initial learning curve (as seen in commits like `d11f29c0` and `ed9761de` where we were renaming packages and stripping out NIA-specifics).

One of the first significant architectural decisions we made was around local data storage.

## DataStore Decisions: Proto vs. Preferences

NIA uses Proto DataStore for user preferences (like theme settings or whether onboarding has been completed), managed via `NiaPreferencesDataSource.kt` and `UserPreferencesSerializer.kt`. This is powerful, offering type safety and structured data.

However, for the simpler key-value settings we anticipated for People App\'s UI state, Proto DataStore felt a bit like overkill. We decided to switch to **Jetpack Preferences DataStore**.

This involved:
1.  Creating a new `PeepsPreferencesDataSource.kt`.
2.  Removing the Proto DataStore files and its serializers/migrations.
3.  Updating our `DataStoreModule.kt` (Hilt/Dagger) to provide the new `PeepsPreferencesDataSource` instead of the old one.
4.  Adjusting `UserDataRepository` (and its test doubles like `TestUserDataRepository.kt`) to use the new Preferences DataStore.

The `core/datastore/build.gradle.kts` file reflected this change clearly:

```diff
// Example changes in core/datastore/build.gradle.kts
- implementation(libs.androidx.datastore.core) // Or similar if it was specifically for Proto
- implementation(libs.protobuf.javalite)
+ implementation(libs.androidx.datastore.preferences)
```

This shift simplified how we handled simple UI flags, making the code a bit more straightforward for those specific use cases.

## Building the Passkey UI with Jetpack Compose

With the data layer reconfigured, the main event was building the passkey authentication screens: `LoginScreen.kt` and its corresponding `LoginViewModel.kt`.

**Key Frontend Responsibilities:**

*   **Initiating `CredentialManager` operations:** The ViewModel became the orchestrator for `getCredential` (for sign-in) and `createPublicKeyCredential` (for registration) requests.
*   **Managing UI State:** This was crucial. We needed to handle various states in Compose:
    *   Idle (ready for user input).
    *   Loading (while `CredentialManager` or our backend is working).
    *   Success (leading to navigation, e.g., to `PeopleScreen.kt`).
    *   Error (displaying issues like no passkeys found, network errors, or `GetCredentialException` subtypes).
*   **Handling System Dialogs:** A lot of the passkey UX is handled by system-provided dialogs. Our job on the frontend was to correctly trigger these via `PendingIntent` and then gracefully process the results returned in `onActivityResult` (or its modern equivalents).

## The Joys of Debugging `CredentialManager`

Ah, `CredentialManager`. Powerful, but sometimes opaque. When passkey operations failed, especially with generic errors like `NoCredentialException` (or `TYPE_NO_CREDENTIAL` as it sometimes manifests), it was time to get friendly with debugging tools.

**1. Logcat, My Old Friend:**

   Logcat was indispensable. For those new to Android development or needing a quick reminder, Logcat is typically found at the bottom of Android Studio, as shown here:

   ![Location of Logcat tab in Android Studio with Logcat output visible]( {{ site.baseurl }}/img/logcat_screenshot.png)
   *Fig 1: The Logcat tab in Android Studio, your window into the device\'s soul (and your app\'s chatter).*

   Filtering for tags like `CredentialManager`, `Passkey`, or even broader system service tags often provided clues. Were there underlying Play Services issues? Was the `rpId` subtly mismatched between what the server expected and what the client was configured with? Logcat often held the answers, even if they were buried in verbose output. This was particularly key when the backend challenges around `assetlinks.json` were still being ironed out, as client errors were the first sign of trouble.

**2. The Invaluable In-App Debug Display:**
   To get a clearer real-time picture of what was happening, especially with the data being exchanged, I ended up building a simple on-screen debug overlay within the app. This temporary UI would display:
    *   The current `rpId` being used for the request.
    *   The raw challenge string received from our server (before Base64URL decoding).
    *   The `credentialId`(s) being sent in `allowCredentials` during login attempts.
    *   The status or error code from the last `CredentialManager` operation.

   This immediate visual feedback was a lifesaver. It allowed us to quickly spot discrepancies in the JSON request options being prepared for `CredentialManager` calls, verifying data before it went into the "black box" of the system API or off to our backend. It saved countless hours that would have otherwise been spent stepping through the debugger or just staring at Logcat.

## Looking Back

Migrating the NIA scaffold, making key architectural choices like the DataStore switch, and then building the passkey UI with Jetpack Compose was a significant effort. The `CredentialManager` API, while a huge step forward for Android authentication, requires careful handling on the frontend to manage its asynchronous nature and provide a clear, robust user experience. And never underestimate the power of good old Logcat and a quick-and-dirty debug overlay when you\'re in the trenches!

\*\*Disclaimer - Google Gemini 2.5 Pro Exp was used to help write this blog post. 