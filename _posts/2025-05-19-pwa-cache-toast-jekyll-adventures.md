---
layout: post
title: "Cache Me If You Can: Getting Service Worker Update Toasts to Play Nice with New Jekyll Layouts"
date: 2025-05-19 10:00:00 +0800
categories: jekyll PWA javascript debugging
tags: [jekyll, service-worker, pwa, javascript, webdev, caching]
header-style: text
catalog: true
description: "A dive into debugging service worker caching and update notifications for new pages in a Jekyll site, ensuring the 'Content Refresh' toast works as expected."
---

**Abstract:**  
This post details the process of debugging and fixing service worker update notifications for new custom layouts in a Jekyll site using the Hux Blog theme. It covers how to ensure new pages are properly cached, how to handle missing client-side scripts, and how to gracefully fix JavaScript errors in the service worker logic. The article is aimed at developers working with Jekyll, PWAs, or service worker caching strategies.

**Estimated reading time:** _7 minutes_

My Jekyll site, built on the excellent Hux Blog theme, comes with Progressive Web App (PWA) capabilities, including a service worker that handles offline caching and provides a nifty "Content Refresh" toast when new content is deployed. This is great for the blog posts, but when I recently introduced a new portfolio section with custom layouts (`index.html` at the root and an `offerings/index.html` page), I noticed these new pages were serving stale content without the friendly update prompt. Time for a deep dive!

## The Hux Blog Service Worker Setup

The PWA magic in this theme revolves around a few key files:

- `sw.js`: The service worker script itself. It defines caching strategies (pre-caching an app shell, stale-while-revalidate for content) and logic for detecting updates.
- `js/sw-registration.js`: A small script that registers `sw.js` with the browser.
- `js/hux-blog.min.js` and `js/snackbar.js`: Client-side JavaScript that, among other things, listens for messages from the service worker (like "hey, new content here!") and displays the UI, such as the refresh toast.

My goal was to get my new portfolio pages (`index.html` and `offerings/index.html`) to behave like the rest of the site.

## Step 1: Ensuring Client-Side Listeners Were Present

My first check was the new layout file, `_layouts/portfolio.html`. I realized that unlike the default post/page layouts, it was missing the includes for the core JavaScript files responsible for handling the service worker's messages and displaying the toast.

**The Fix:**
I added the following script includes to `_layouts/portfolio.html` just before the closing `</body>` tag:

```html
<script src="{{ '/js/jquery.min.js' | relative_url }}"></script>
<script src="{{ '/js/bootstrap.min.js' | relative_url }}"></script>
<script src="{{ '/js/hux-blog.min.js' | relative_url }}"></script>
<script src="{{ '/js/snackbar.js' | relative_url }}"></script>
```

This ensured that the front-end code to show the toast was actually present on these pages.

## Step 2: Registering the Service Worker

With the client-side scripts in place, the next hurdle was ensuring the service worker itself was actually being registered and thus taking control of these new pages. A quick comparison with other generated pages (like `_site/404.html`) revealed that `_layouts/portfolio.html` was also missing the crucial service worker registration script.

**The Fix:**
I added the registration script to `_layouts/portfolio.html`:

```html
<script src="{{ '/js/sw-registration.js' | relative_url }}"></script>
```

Now the browser would at least _try_ to install and run `sw.js` for these pages.

## Step 3: Debugging the Service Worker Itself

After these changes, testing on `localhost` showed progress: the service worker was activating. However, I encountered a JavaScript error in the service worker's console:

```
TypeError: Cannot read properties of undefined (reading 'headers')
    at sw.js:257:32
```

This error occurred within the `revalidateContent` function in `sw.js`. This function is called for navigation requests to compare the cached version of a page with a freshly fetched one. The error specifically pointed to this line:

```javascript
const cachedVer = cached.headers.get("last-modified");
```

The problem was that on the _first visit_ to a new page (like `offerings/index.html` after clearing the cache), there wouldn't be a `cached` version yet. The `caches.match(event.request)` promise would resolve to `undefined`, and then the code would try to access `undefined.headers`, leading to the TypeError.

**The Fix:**
I modified the `revalidateContent` function in `sw.js` to gracefully handle cases where either the cached response or the fetched response (or both) might be undefined:

```javascript
function revalidateContent(cachedResp, fetchedResp) {
  return Promise.all([cachedResp, fetchedResp])
    .then(([cached, fetched]) => {
      // If there's no cached version, or if the fetched version is missing,
      // we can't determine if an update was found.
      if (!cached || !fetched) {
        console.log(
          "revalidateContent: Cached or fetched response is undefined. Cannot compare."
        );
        return;
      }

      const cachedVer = cached.headers.get("last-modified");
      const fetchedVer = fetched.headers.get("last-modified");
      console.log(
        `Cache check for ${fetched.url}: Cached "${cachedVer}" vs. Fetched "${fetchedVer}"`
      );

      if (cachedVer !== fetchedVer) {
        sendMessageToClientsAsync({
          command: "UPDATE_FOUND",
          url: fetched.url,
        });
      }
    })
    .catch((err) => {
      console.error("Error in revalidateContent:", err);
    });
}
```

This check (`if (!cached || !fetched)`) prevents the error. On the first visit, it correctly logs that it can't compare, and on subsequent visits (after the page is cached), the comparison proceeds as expected.

## How the Update Toast Works (Briefly)

With the fixes in place, the intended flow is:

1.  User visits a page (e.g., `offerings/index.html`).
2.  The service worker (`sw.js`) serves the cached version (if available) and simultaneously fetches a new version from the network (stale-while-revalidate). It uses a cache-busting query parameter (`?cache-bust=<timestamp>`) to help ensure the fetched version is fresh.
3.  The `revalidateContent` function compares the `last-modified` header of the cached page and the newly fetched page.
4.  If the headers differ (indicating new content), `sw.js` uses `client.postMessage()` to send an `UPDATE_FOUND` command to the active page.
5.  The client-side JavaScript (in `hux-blog.min.js` or `snackbar.js`) listens for this message and displays the "Content Refresh" toast, prompting the user to reload.

## Key Takeaways for Jekyll PWA Debugging

- **Layout Consistency:** Ensure all layouts that should have PWA features include _all_ necessary JavaScript (client-side listeners, SW registration script).
- **DevTools are Your Friend:** When testing service workers locally:
  - Use the "Application" tab in Chrome DevTools to "Clear site data" thoroughly.
  - Unregister and re-register the service worker to ensure the latest version is active.
  - Check the "Disable cache" option in the "Network" tab during hard reloads, then uncheck it for normal SW operation.
  - Inspect both the main browser console and the **service worker's dedicated console** for errors.
- **Understand Change Detection:** Know how your service worker detects content changes (e.g., ETag, Last-Modified header comparison, content hashing). Local development servers might not always set these headers as robustly as a production environment. The `sw.js` used here even has a `TODO` about the reliability of this for GitHub Pages.

With these pieces in place, my portfolio pages are now fully integrated into the site's PWA caching and update notification system. Hopefully, this walkthrough helps if you ever find yourself debugging similar service worker shenanigans!
