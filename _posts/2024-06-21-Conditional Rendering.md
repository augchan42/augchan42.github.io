---
layout:       post
title:        "Conditional Rendering in Next.js: Hiding Footer on Specific Pages"
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

## The Challenge: Conditional Footer Rendering

In our Next.js application, we encountered a common but tricky scenario: the need to hide the footer on specific pages, particularly our divination page. This seemingly simple task became complex due to the mix of server and client components in Next.js 14's app router.

### The Initial Approach

Our first attempt involved trying to use client-side hooks directly in the layout component. However, this approach quickly ran into issues as the layout in Next.js 14 is a server component by default, which cannot use client-side hooks like `usePathname`.

## The Solution: Bridging Server and Client Components

After some trial and error, we developed a solution that elegantly bridges the gap between server and client components:

1. **Create a Footer Context**: We implemented a context to manage the footer's visibility state.

2. **Develop a Client Wrapper**: We created a client component to consume the context and conditionally render the footer.

3. **Update the Layout**: We modified the layout to use these new components without compromising its server component status.

### Step 1: The Footer Context

```typescript
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';


const FooterContext = createContext({ showFooter: true });

export function useFooterContext() {
  const context = useContext(FooterContext);
  if (context === undefined) {
    throw new Error('useFooterContext must be used within a FooterProvider');
  }
  return context;
}

export function FooterProvider({ children }: { children: React.ReactNode }) {
  const [showFooter, setShowFooter] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setShowFooter(!pathname.includes('/divination'));
  }, [pathname]);

  return (
    <FooterContext.Provider value={{ showFooter }}>
      {children}
    </FooterContext.Provider>
  );
}
```

### Step 2: The Client Footer Wrapper

```tsx
'use client';

import { useFooterContext } from '@/hooks/footerContext';
import Footer from '@/components/Footer';

export default function ClientFooterWrapper() {
  const { showFooter } = useFooterContext();
  if (!showFooter) return null;
  return <Footer />;
}
```

### Step 3: Updating the Layout

```tsx
import { FooterProvider } from '@/hooks/footerContext';
import ClientFooterWrapper from '@/components/ClientFooterWrapper';

export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      {/* ... other elements ... */}
      <body>
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <AuthProvider>
              <FooterProvider>
                <div className="site-container">
                  <SiteHeader />
                  <main className="flex-1">{children}</main>
                  <Toaster />
                  <ClientFooterWrapper />
                </div>
              </FooterProvider>
            </AuthProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## Why This Works

This solution effectively bridges the gap between server and client components:

1. The `FooterProvider` is a client component that can access and react to route changes.
2. The `ClientFooterWrapper` is also a client component, allowing it to use the `useFooterContext` hook.
3. By wrapping these client components around our server-rendered layout, we maintain the benefits of server-side rendering while allowing for client-side interactivity where needed.

## Lessons Learned

This experience highlighted the importance of understanding the boundaries between server and client components in Next.js 14. It also showcased the power of React's Context API in managing state across component boundaries.

By leveraging a mix of server and client components, we were able to achieve a solution that is both performant and flexible, allowing for conditional rendering based on the current route.

Thank you for reading! I hope this helps you in your Next.js journey.