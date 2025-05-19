---
layout: post
title: "Conditional Rendering in Next.js: Hiding Footer on Specific Pages"
author: "Aug"
date: 2024-06-21
header-style: text
catalog: true
description: "A guide to conditionally rendering components, like a footer, in a Next.js 14 (App Router) application by bridging server and client components using React Context API and usePathname."
tags:
  - nextjs
  - react
  - nextjs-app-router
  - server-components
  - client-components
  - conditional-rendering
  - react-context
  - usepathname
  - react-hooks
  - layout-management
  - frontend-development
---

**Abstract:**  
This post provides a guide to conditionally rendering components, such as a footer, within a Next.js 14 application using the App Router. It details a solution for hiding components on specific pages by bridging server and client components through the React Context API and the `usePathname` hook, addressing challenges posed by Next.js's server/client component architecture.

**Estimated reading time:** _4 minutes_

## Current Tech Stack

- **Framework**: Next.js 14 (app router)
- **Internationalization**: next-intl
- **CSS**: Tailwind CSS
- **Backend**: Supabase with Auth-UI

## The Challenge: Conditional Footer Rendering

In our Next.js application, we faced a common but challenging situation: we needed to hide the footer on certain pages, especially our divination page. This task, which seems simple, became complicated because of how server components and client components work together in Next.js 14's app router.

### The Initial Approach

First, we tried to use client-side hooks (like `usePathname`) directly in our main layout component. However, this caused problems because, in Next.js 14, the layout is a server component by default. Server components cannot directly use client-side hooks like `usePathname`.

## The Solution: Bridging Server and Client Components

After trying a few things, we found a solution that effectively connects server and client components:

1. **Create a Footer Context**: We created a React Context to keep track of whether the footer should be visible or hidden.
2. **Develop a Client Wrapper**: We made a client component that uses this context to decide whether to show or hide the footer.
3. **Update the Layout**: We updated our main layout to use these new components, making sure it could still work as a server component.

### Step 1: The Footer Context

```typescript
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const FooterContext = createContext({ showFooter: true });

export function useFooterContext() {
  const context = useContext(FooterContext);
  if (context === undefined) {
    throw new Error("useFooterContext must be used within a FooterProvider");
  }
  return context;
}

export function FooterProvider({ children }: { children: React.ReactNode }) {
  const [showFooter, setShowFooter] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setShowFooter(!pathname.includes("/divination"));
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
"use client";

import { useFooterContext } from "@/hooks/footerContext";
import Footer from "@/components/Footer";

export default function ClientFooterWrapper() {
  const { showFooter } = useFooterContext();
  if (!showFooter) return null;
  return <Footer />;
}
```

### Step 3: Updating the Layout

```tsx
import { FooterProvider } from "@/hooks/footerContext";
import ClientFooterWrapper from "@/components/ClientFooterWrapper";
// ... other imports like SiteHeader, AuthProvider, ThemeProvider, NextIntlClientProvider, Toaster etc. might be needed here based on the full layout
import SiteHeader from "../../components/SiteHeader"; // Example path, adjust as needed
import { AuthProvider } from "../../hooks/Auth"; // Example path, adjust as needed
import { ThemeProvider } from "@/components/theme-provider"; // Example path, adjust as needed
import { NextIntlClientProvider, useMessages } from "next-intl"; // Assuming useMessages is used as in the original snippet
import { Toaster } from "@/components/ui/toaster"; // Example path, adjust based on your Toaster component (e.g., from shadcn/ui)

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      {/* ... other head elements ... */}
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {" "}
          {/* Example ThemeProvider props, adjust as needed */}
          <NextIntlClientProvider locale={locale} messages={messages}>
            <AuthProvider>
              <FooterProvider>
                <div className="site-container">
                  {" "}
                  {/* Assuming a wrapper class for consistent layout */}
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

This solution effectively connects server and client components:

1. The `FooterProvider` is a client component, so it can detect changes in the page route (URL) using `usePathname`.
2. The `ClientFooterWrapper` is also a client component, which lets it use the `useFooterContext` hook to get the footer's visibility state.
3. By using these client components within our server-rendered layout, we keep the benefits of server-side rendering but also add client-side interaction where we need it for the footer.

## Lessons Learned

This situation showed how important it is to understand the differences and boundaries between server and client components in Next.js 14. It also demonstrated how useful React's Context API is for managing state between different components.

By using a mix of server and client components, we created a solution that works well (is performant) and is adaptable (flexible). This allows us to show or hide components based on the current page route.

Thank you for reading! I hope this helps you in your Next.js journey.
