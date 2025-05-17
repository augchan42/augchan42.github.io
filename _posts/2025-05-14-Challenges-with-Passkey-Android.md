---
layout: post
title: "FIDO2 Passkeys for Android: Backend Challenges in Python"
author: "Aug"
date: 2025-05-14
header-style: text
catalog: true
description: "A developer's journey through the challenges of implementing FIDO2 passkeys for an Android app using Python, covering assetlinks.json, data serialization, and Base64URL encoding."
tags:
  - python
  - fido2
  - passkeys
  - webauthn
  - backend
  - android
  - security
  - fastapi
---

# Implementing FIDO2 Passkeys for Android: A Developer's Journey

Integrating FIDO2 passkeys into an application can significantly enhance security and user experience. However, the journey, especially on the backend, can present subtle challenges. This post is the first of two detailing my experiences implementing passkey support for an Android (Kotlin) frontend with a Python backend. Here, I'll focus on the backend challenges I faced and how I navigated them.

## Key Challenges & Solutions

### 1. Navigating `assetlinks.json`: Verification is Crucial

One of the first and most critical pieces for making passkeys work with an Android app is the Digital Asset Links file (`assetlinks.json`).

**The Problem:** FIDO2 and WebAuthn rely heavily on `assetlinks.json` to verify the association between your web service (the Relying Party ID) and your native Android application. If this isn't configured perfectly, passkey operations like creation will fail, often with unhelpful generic errors on the client, such as "No create options available."

**My Journey:**

- I started by adding the initial `assetlinks.json`.
- Things got tricky when I switched to a new development machine, which meant a new certificate fingerprint. This required an update to `assetlinks.json`, highlighting the need to manage fingerprints for all relevant build and signing configurations (debug, release, different development machines).
- I further refined the file by cleaning up unused entries. It's crucial that only necessary associations are present. A key learning here was that _each specific app variant_ (e.g., `demo.debug` vs. `debug` vs. `release`) needs its own entry if its package name or signing certificate differs.

> Getting `assetlinks.json` right is your first major checkpoint. Test it thoroughly for all app variants and build configurations. Small mistakes here can lead to significant problems later.

You can typically host this file at `/.well-known/assetlinks.json` on your domain.

### Android Passkey Digital Asset Links Setup

To enable seamless passkey authentication between your website (Relying Party) and your Android application, you need to establish a secure association between them. This is achieved using Digital Asset Links (DAL).

This guide will walk you through generating the necessary information for your `assetlinks.json` file, focusing on the `demoDebug` build variant of the PeepsApp.

#### 1. Identify Your Build Variant and Package Name

For passkeys to work, the `package_name` in your `assetlinks.json` file must exactly match the `applicationId` of your Android app build variant that will be handling passkey operations.

- **Target Build Variant:** For development and testing, we are focusing on the `demoDebug` variant.
- **Application ID for `demoDebug`:**
  - The base `applicationId` is `ai.peepsapp.peopleapp`.
  - The `debug` build type adds an `applicationIdSuffix` (e.g., `.debug`).
  - The `demo` product flavor might also influence the final ID (in this project, it uses the `NiaFlavorDimension.contentType`).
  - Based on the project structure (forked from "Now in Android" which uses `buildType.applicationIdSuffix` and flavor dimensions), the `applicationId` for `demoDebug` is typically `ai.peepsapp.peopleapp.demo.debug`. **Always verify this in your `app/build.gradle.kts` or by checking the generated `AndroidManifest.xml` for that specific variant.**

> ℹ️ **Note:** While different `debug` variants (like `prodDebug` if it exists) will use the same debug signing certificate, their `applicationId` might differ if product flavors change it. Ensure the `package_name` in `assetlinks.json` corresponds to the specific `applicationId` you are targeting.

#### 2. Obtain the SHA-256 Certificate Fingerprint

The `assetlinks.json` file requires the SHA-256 fingerprint of the signing certificate used for your Android app.

##### Primary Method: Gradle `signingReport`

This is the recommended way to get the fingerprint.

1.  Open your terminal in the project root directory.
2.  Run the `signingReport` task:
    ```bash
    ./gradlew :app:signingReport
    ```
3.  If the above command fails due to a configuration cache issue (you might see an error like `Could not load the value of field dslSigningConfig`), try running it without the configuration cache:
    ```bash
    ./gradlew :app:signingReport --no-configuration-cache
    ```
4.  If you still encounter issues, try cleaning the project first:
    ```bash
    ./gradlew clean
    ./gradlew :app:signingReport --no-configuration-cache # Or without the flag if clean fixed it
    ```
5.  In the output, look for the section corresponding to `Variant: demoDebug`. The debug keystore (`~/.android/debug.keystore`) is typically shared across all debug builds.
    You need the **SHA-256** value. It will look like this:
    `SHA-256: 6B:D3:BC:92:BD:94:4C:9E:5A:D1:75:39:DC:E5:ED:62:05:F1:79:B3:FD:7A:03:1B:8F:54:1B:83:FD:1D:2B:83`

##### Alternative Method: `keytool`

If the Gradle task is problematic, you can use `keytool` (a Java utility) directly. This is for the default debug keystore.

- **On Windows (Command Prompt or PowerShell):**
  ```shell
  keytool -list -v -keystore "%USERPROFILE%\\.android\\debug.keystore" -alias androiddebugkey -storepass android -keypass android
  ```
- **On Linux/macOS or WSL (Terminal):**
  ```bash
  keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
  ```
  (If accessing the Windows keystore from WSL, the path might be `/mnt/c/Users/YourWindowsUser/.android/debug.keystore`)

In the output, find the "Certificate fingerprints" section and copy the `SHA256` value.

#### 3. Create Your `assetlinks.json` File

Create a file named `assetlinks.json` with the following content.

```json
[
  {
    "relation": [
      "delegate_permission/common.handle_all_urls",
      "delegate_permission/common.get_login_creds"
    ],
    "target": {
      "namespace": "android_app",
      "package_name": "ai.peepsapp.peopleapp.demo.debug",
      "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT_HERE"]
    }
  }
]
```

**Important:**

- Replace `"ai.peepsapp.peopleapp.demo.debug"` with the correct `applicationId` for your target build variant if it differs.
- Replace `"YOUR_SHA256_FINGERPRINT_HERE"` with the actual SHA-256 fingerprint you obtained in Step 2 (e.g., `"6B:D3:BC:92:BD:94:4C:9E:5A:D1:75:39:DC:E5:ED:62:05:F1:79:B3:FD:7A:03:1B:8F:54:1B:83:FD:1D:2B:83"`).
- The `relation` array includes:
  - `delegate_permission/common.handle_all_urls`: Standard for app linking.
  - `delegate_permission/common.get_login_creds`: Essential for passkey/credential manager operations.

#### 4. Host the `assetlinks.json` File

Your web server must host this `assetlinks.json` file at the following specific location:

`https://your.domain.com/.well-known/assetlinks.json`

- Replace `your.domain.com` with your actual domain (for this project, it's `stage.peepsapp.ai`).
- The file must be accessible via HTTPS.
- The server should serve this file with the `Content-Type: application/json` HTTP header.

##### Updating in Your `peepsAPI` Server Project

For this project, the `assetlinks.json` file is in the peepsAPI project at `peepsAPI/static/.well-known/assetlinks.json`.

1.  **Edit the file:** Open the `assetlinks.json` file in your `peepsAPI` project.
2.  **Add the new fingerprint:** Your existing file might already have one or more fingerprints. You need to add the SHA-256 fingerprint obtained in Step 2 to the `sha256_cert_fingerprints` array for the `ai.peepsapp.peopleapp.demo.debug` package.

    For example, if your `assetlinks.json` looks like this (as seen on [https://stage.peepsapp.ai/.well-known/assetlinks.json](https://stage.peepsapp.ai/.well-known/assetlinks.json)):

    ```json
    [
      {
        "relation": [
          "delegate_permission/common.handle_all_urls",
          "delegate_permission/common.get_login_creds"
        ],
        "target": {
          "namespace": "android_app",
          "package_name": "ai.peepsapp.peopleapp.demo.debug",
          "sha256_cert_fingerprints": [
            "BA:6E:84:EF:CC:B2:53:8A:49:DE:AD:F0:8A:4B:38:4F:A7:64:3D:09:8D:CD:84:86:3B:CF:95:B8:27:68:7A:EA"
          ]
        }
      }
    ]
    ```

    You would add your new fingerprint (e.g., `"6B:D3:BC:92:BD:94:4C:9E:5A:D1:75:39:DC:E5:ED:62:05:F1:79:B3:FD:7A:03:1B:8F:54:1B:83:FD:1D:2B:83"`) to the array:

    ```json
    [
      {
        "relation": [
          "delegate_permission/common.handle_all_urls",
          "delegate_permission/common.get_login_creds"
        ],
        "target": {
          "namespace": "android_app",
          "package_name": "ai.peepsapp.peopleapp.demo.debug",
          "sha256_cert_fingerprints": [
            "BA:6E:84:EF:CC:B2:53:8A:49:DE:AD:F0:8A:4B:38:4F:A7:64:3D:09:8D:CD:84:86:3B:CF:95:B8:27:68:7A:EA",
            "6B:D3:BC:92:BD:94:4C:9E:5A:D1:75:39:DC:E5:ED:62:05:F1:79:B3:FD:7A:03:1B:8F:54:1B:83:FD:1D:2B:83"
          ]
        }
      }
    ]
    ```

3.  **Commit and Create a Pull Request:** Commit this change to your `peepsAPI` project and create a Pull Request to deploy it to your server environment (e.g., `stage.peepsapp.ai`).

##### Confirming the Update

After your changes to `assetlinks.json` have been deployed to the server:

1.  Open your web browser.
2.  Navigate to `https://stage.peepsapp.ai/.well-known/assetlinks.json`.
3.  Perform a hard refresh (e.g., Ctrl+Shift+R or Cmd+Shift+R) to ensure you're not seeing a cached version.
4.  Verify that the newly added SHA-256 fingerprint is present in the JSON content.

#### 5. Verification (Optional but Recommended)

You can use Google's Digital Asset Links API to verify your setup. Construct a URL like this in your browser:

`https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://your.domain.com&relation=delegate_permission/common.get_login_creds`

(Replace `your.domain.com` with your domain).

If successful, you should see a JSON response that includes the information from your `assetlinks.json` file, confirming the association.

#### Important Considerations

- **Release Builds:** When you create a `release` build of your app, it will be signed with a different (release) keystore. You will need to:
  1.  Obtain the SHA-256 fingerprint of your **release certificate**.
  2.  Add a new entry to your `assetlinks.json` file (or create a separate one for your production domain) with the release `package_name` (e.g., `ai.peepsapp.peopleapp` or `ai.peepsapp.peopleapp.demo` if it has a release suffix) and its corresponding SHA-256 fingerprint.
- **Multiple `applicationId`s:** If you have different product flavors that result in distinct `applicationId`s and you want them all to support passkeys with the same web domain, you'll need to add a separate entry (a new JSON object within the top-level array) in the `assetlinks.json` for each `package_name` and its corresponding certificate fingerprint(s).
- **Caching:** Changes to `assetlinks.json` might take some time to propagate or for Google Play Services to re-fetch, due to caching.

This setup is crucial for the Android Credential Manager to securely associate your app with your website for passkey operations.

### 2. Dealing with `UnicodeDecodeError`: Serializing Binary Data

FIDO2 operations involve a lot of binary data. Getting this data from a Python backend to a JSON-consuming client requires careful handling.

**The Problem:** FIDO2 libraries generate options (for registration and authentication) containing binary data, such as the `challenge` and credential `id`s. When these options are sent as JSON from a Python backend (I was using FastAPI), this binary data _must_ be encoded into a string format. The standard here is Base64URL. If you fail to do this, or use the wrong Base64 variant (e.g., standard Base64 instead of Base64URL), you'll likely encounter `UnicodeDecodeError` when the JSON serializer (like Pydantic in FastAPI) tries to process raw bytes.

**My Journey:**

- I first encountered this issue during the implementation of registration and recovery flows. The fix involved ensuring consistent Base64URL encoding.
- Later, the same problem resurfaced for login flows, emphasizing that this encoding step needs to be applied universally wherever FIDO2 option objects are prepared for API responses.

**The Solution Involved Two Main Parts:**

**Part 1: Converting FIDO2 Objects to Dictionaries**
The Python objects generated by FIDO2 libraries (e.g., `PublicKeyCredentialCreationOptions` or `PublicKeyCredentialRequestOptions` from `python-fido2`) aren't directly serializable to JSON. They need to be converted to Python dictionaries first.

I developed a pattern to robustly convert these objects:

```python
# In my ChallengeService, when creating authentication options:
# auth_data is a PublicKeyCredentialRequestOptions object from self.server.authenticate_begin(...)

auth_data_as_dict: dict
if hasattr(auth_data, "data") and isinstance(auth_data.data, dict):
    auth_data_as_dict = auth_data.data
elif hasattr(auth_data, "_asdict") and callable(auth_data._asdict):
    auth_data_as_dict = auth_data._asdict()
else:
    try:
        # This is often the most direct way for fido2.webauthn objects
        auth_data_as_dict = dict(auth_data)
    except TypeError:
        # Log a warning and process as is, hoping for the best in the next step.
        # It's much better if conversion to dict succeeds here.
        print(
            f"WARN: Could not convert auth_data of type {type(auth_data)} to dict directly. Processing as is."
        )
        auth_data_as_dict = auth_data # Fallback
```

This approach checks for common attributes like `.data` or methods like `._asdict()` and falls back to a direct `dict()` conversion, which often works for `fido2.webauthn` objects.

**Part 2: Recursive Base64URL Encoding**
Once I had a dictionary, I needed to ensure all `bytes` within it (even in nested structures) were Base64URL encoded. I used a helper function for this:

```python
import base64
from typing import Any

def _process_fido_data_for_json(data: Any) -> Any:
    if isinstance(data, bytes):
        # Use Base64URL encoding and remove padding
        return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")
    elif isinstance(data, dict):
        return {k: _process_fido_data_for_json(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [_process_fido_data_for_json(item) for item in data]
    else:
        return data

# Usage in the service:
# auth_data_json = _process_fido_data_for_json(auth_data_as_dict)
# This auth_data_json is now safe to return from a FastAPI endpoint.
```

> **Critical Note:** Always use `base64.urlsafe_b64encode` and `rstrip("=")` for FIDO2. Standard Base64 (`base64.b64encode`) will not work correctly as it can contain characters (`+`, `/`) that are problematic in URLs and some JSON parsers without further escaping.

Serialization is subtle. Converting complex library objects to JSON requires care. Ensure they are fully transformed into basic Python dicts/lists with string-encoded binary data _before_ your web framework's serializer (like FastAPI/Pydantic) sees them.

### 3. Client-Server Communication: Deciphering Error Messages

FIDO2 flows involve multiple interactions between the client and server. Errors can originate on either side, and client-side errors can sometimes be frustratingly cryptic if the root cause is a server-side error.

**My Journey:**

- The aforementioned "No create options available" error on Android was a prime example. This led me back to scrutinizing the `assetlinks.json` file and the server-side challenge generation logic.
- Another instance was encountering a `MissingFieldException` on the Android client. This occurred when the server's response to a verification request wasn't structured exactly as the client expected, highlighting the importance of a clear and consistent API contract. Specifically, ensuring the server response always included a `status` field resolved this.

> Client-side error messages can be misleading. It's vital to dig deep. A client error might be a symptom of a server-side problem. Implementing comprehensive logging for server-side request/response details during FIDO2 operations is invaluable for debugging.

## Key Backend Takeaways

Implementing FIDO2 passkeys was a learning curve, but these were some of my main takeaways for the backend portion:

- **`assetlinks.json` is foundational:** Get it right, test it thoroughly, and understand its implications for different app variants and build configurations.
- **Embrace Base64URL:** Understand when and where to encode and decode. Using binary data directly in JSON will likely cause problems. Always use the URL-safe variant of Base64.
- **Serialization requires diligence:** Ensure FIDO2 library objects are properly converted to JSON-friendly Python dictionaries with all binary data correctly encoded _before_ they hit your API response Pydantic models.
- **Test the full flow relentlessly:** An error in one step (e.g., challenge generation) can manifest in a later step (e.g., during verification).
- **Treat client errors as potential server signals:** Don't just assume the client is wrong. Robust server-side logging and a willingness to investigate server behavior based on client errors are crucial.

In the next post, I'll dive into the Android (Kotlin) frontend challenges of this passkey implementation journey!

\*\*Disclaimer - Google Gemini 2.5 Pro Exp was used to help write this blog post.
