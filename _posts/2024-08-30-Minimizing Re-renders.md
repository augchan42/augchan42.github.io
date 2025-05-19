---
layout: post
title: "Optimizing React Authentication: Minimizing Re-renders and Improving Performance"
author: "Aug"
date: 2024-08-30
header-style: text
catalog: true
description: "A guide to minimizing re-renders and optimizing performance in React/Next.js applications with authentication. Covers combining state, memoizing context with useMemo, tracking state changes with useRef, debouncing, and optimizing useEffect dependencies."
tags:
  - react
  - nextjs
  - react-performance
  - nextjs-optimization
  - re-renders
  - state-management
  - react-hooks
  - usestate
  - usememo
  - useref
  - useeffect
  - context-api
  - authentication
  - supabase
  - debounce
---

**Abstract:**  
This post offers a guide to minimizing re-renders and optimizing performance in React/Next.js applications, particularly those with authentication. It covers practical techniques such as combining state variables, memoizing context values with `useMemo`, tracking significant state changes with `useRef`, debouncing frequent updates, and carefully managing `useEffect` dependencies to prevent unnecessary operations.

**Estimated reading time:** _3 minutes_

## Current Tech Stack

- **Framework**: Next.js 14 (app router)
- **Internationalization**: next-intl
- **CSS**: Tailwind CSS
- **Backend**: Supabase with Auth-UI

## The Challenge: Minimizing Re-renders

I was noticing every time I tabbed out and tabbed back in to my Divination page, I noticed
6-8 API calls to fetch the same data from a trigram tally table. The divination page has a side
information bar containing the results of a trigram personality quiz (using Voight Kampff style
questions). Only logged in users get this chart shown, anonymous users don't retrieve
this data and so don't have this issue. These were the steps I took to eliminate the issue.

## Combine Multiple State Variables

Instead of keeping track of many pieces of app information (state variables) in different places, put them all into one group (a single state object). This means the app has to update things less often, and the screen won't have to redraw as much (fewer re-renders).

```typescript
const [authState, setAuthState] = useState({
  user: null,
  session: null,
  anonymousUserId: null,
  avatarUrl: null,
  loading: true,
});

// Update state in one go
setAuthState((prevState) => ({
  ...prevState,
  user: newUser,
  session: newSession,
  // ... other updates
}));
```

## Memoize Context Value

Use `useMemo` to stop parts of your app from redrawing when they don't need to. This is helpful for parts that use login information (auth context).

```typescript
const value = useMemo(
  () => ({
    session: authState.session,
    user: authState.user,
    anonymousUserId: authState.anonymousUserId,
    avatarUrl: authState.avatarUrl,
    signOut: handleSignOut,
  }),
  [authState, handleSignOut]
);

return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
```

## Ref-track Significant Auth State Changes

Use a 'ref' to remember what the login information (auth state) used to be. Only update things if there are real, important changes.

```typescript
const prevAuthState = useRef({ userId: null, sessionId: null });

useEffect(() => {
  const { data: listener } = supabaseJSClient.auth.onAuthStateChange(
    async (_event, session) => {
      const currentUserId = session?.user?.id;
      const currentSessionId = session?.id;

      if (
        currentUserId !== prevAuthState.current.userId ||
        currentSessionId !== prevAuthState.current.sessionId
      ) {
        // Tell the app about the login change...
        // Update auth state...
        prevAuthState.current = {
          userId: currentUserId,
          sessionId: currentSessionId,
        };
      }
    }
  );

  return () => listener?.subscription.unsubscribe();
}, []);
```

## Debounce Auth State Changes

Implement debouncing to prevent rapid successive updates, especially useful for handling focus/blur events.
Use 'debouncing' to stop the app from trying to update too many times, very quickly one after another. This is good for when people click in and out of the app window fast (focus/blur events).

```typescript
import { debounce } from "lodash";

const debouncedAuthStateChange = debounce(async (_event, session) => {
  // Deal with the login change here...
  // Handle auth state change...
}, 300);

useEffect(() => {
  const { data: listener } = supabaseJSClient.auth.onAuthStateChange(
    debouncedAuthStateChange
  );

  return () => listener?.subscription.unsubscribe();
}, []);
```

## Optimize useEffect Dependencies

Carefully manage useEffect dependencies to prevent unnecessary effect runs.
Be careful about what you tell `useEffect` to watch (its dependencies). This stops it from running when it doesn't need to.

useEffect(() => {
// Effect logic...
}, [stableAuthState]); // Use stable references or memoized values

```

## Conclusion:

These improvements greatly cut down on screen redrawing that isn't needed. They make React apps with logins work much better and faster.
When we put information together, remember key details (memoizing), watch for big changes, and wait a bit before updating (debouncing), the app works more smoothly and feels quicker to use.
Make sure to test everything well after you make these changes. Check how signing in, signing out, and keeping users logged in (session management) works.
Every app is different, so you might need to change these ideas a little to make them work for your app.
```
