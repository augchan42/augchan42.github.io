---
layout:       post
title:        "Optimizing React Authentication: Minimizing Re-renders and Improving Performance"
author:       "Aug"
header-style: text
catalog:      true
tags:
    - Next.js
    - React
    - Server Components
    - Client Components
    - Context API
---

## Current Tech Stack
- **Framework**: Next.js 14 (app router)
- **Internationalization**: next-intl
- **CSS**: Tailwind CSS
- **Backend**: Supabase with Auth-UI

## The Challenge: Minimizing Re-renders
I was noticing every time I tabbed out and tabbed back in to my Divination page, I noticed
6-8 API calls to fetch the same data from a trigram tally table.  The divination page has a side
information bar containing the results of a trigram personality quiz (using Voight Kampff style
questions).  Only logged in users get this chart shown, anonymous users don't retrieve
this data and so don't have this issue.  These were the steps I took to eliminate the issue.


## Combine Multiple State Variables

Instead of managing several state variables separately, combine them into a single state object. This reduces the number of state updates and subsequent re-renders.

```typescript
const [authState, setAuthState] = useState({
  user: null,
  session: null,
  anonymousUserId: null,
  avatarUrl: null,
  loading: true,
});

// Update state in one go
setAuthState(prevState => ({
  ...prevState,
  user: newUser,
  session: newSession,
  // ... other updates
}));
```

## Memoize Context Value

Use useMemo to prevent unnecessary re-renders of components consuming the auth context.

```typescript
const value = useMemo(() => ({
  session: authState.session,
  user: authState.user,
  anonymousUserId: authState.anonymousUserId,
  avatarUrl: authState.avatarUrl,
  signOut: handleSignOut
}), [authState, handleSignOut]);

return (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
);
```

## Ref-track Significant Auth State Changes

Use a ref to track the previous auth state and only update when there are meaningful changes.

```typescript
const prevAuthState = useRef({ userId: null, sessionId: null });

useEffect(() => {
  const { data: listener } = supabaseJSClient.auth.onAuthStateChange(async (_event, session) => {
    const currentUserId = session?.user?.id;
    const currentSessionId = session?.id;

    if (currentUserId !== prevAuthState.current.userId || currentSessionId !== prevAuthState.current.sessionId) {
      // Update auth state...
      prevAuthState.current = { userId: currentUserId, sessionId: currentSessionId };
    }
  });

  return () => listener?.subscription.unsubscribe();
}, []);
```

## Debounce Auth State Changes

Implement debouncing to prevent rapid successive updates, especially useful for handling focus/blur events.

```typescript
import { debounce } from 'lodash';

const debouncedAuthStateChange = debounce(async (_event, session) => {
  // Handle auth state change...
}, 300);

useEffect(() => {
  const { data: listener } = supabaseJSClient.auth.onAuthStateChange(debouncedAuthStateChange);

  return () => listener?.subscription.unsubscribe();
}, []);

## Optimize useEffect Dependencies

Carefully manage useEffect dependencies to prevent unnecessary effect runs.

useEffect(() => {
  // Effect logic...
}, [stableAuthState]); // Use stable references or memoized values
```

## Conclusion:
These optimizations significantly reduce unnecessary re-renders and improve the overall performance of React applications with authentication. By combining state, memoizing values, tracking significant changes, and debouncing rapid updates, we create a more efficient and responsive user experience.
Remember to test thoroughly after implementing these changes, especially around login, logout, and session management flows. Every application is unique, so some tweaking might be necessary to fit your specific use case.