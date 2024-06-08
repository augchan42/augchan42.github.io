---
layout:       post
title:        "Integrating with Shadcn: Tips and Insights for Seamless UI Component Integration"
author:       "Aug"
header-style: text
catalog:      true
tags:
    - Shadcn
    - UI Components
    - React
    - Next.js
    - Frontend Development
    - Web Development
    - Design Systems
    - Component Libraries
    - Developer Experience
    - Styling    
---

# Integrating with Shadcn: My Experience and Insights

I wanted to make a blog post talking about my experience integrating with shadcn. Here's what I ran into.

## Opinionated Styling

The shadcn example at [https://ui.shadcn.com/](https://ui.shadcn.com/) is opinionated in that it assumes a dark theme with New York styling. That means your root layout needs to use the theme provider, and with my website colors defaulting to a black background, I needed to use the dark theme for the components to appear properly.

```jsx
<ThemeProvider
  attribute="class"
  defaultTheme="dark"
  enableSystem
  disableTransitionOnChange
>
  {/* Your content */}
</ThemeProvider>
```

## New York Styling

The example components I'm using are using New York styling. So for example, the toast notification that the profile update is using at [https://ui.shadcn.com/examples/forms](https://ui.shadcn.com/examples/forms) requires adding `NewYorkToaster` from `"@/registry/new-york/ui/toaster"` to my root layout above my footer component, for the toast notification updating the profile using the default profile form example to work.

## Root Layout Example

For reference, here's my root layout that incorporates auth, theme provider, next-intl, and the NY styled toaster notification:

```jsx
import { NextIntlClientProvider, useMessages } from 'next-intl';
import type { Metadata } from "next";
import "../globals.css";
import '../../../styles/fonts.css';
import '../../../styles/mystyles.css';
import Footer from '../../components/Footer';
import GoogleAnalytics from '../../components/GoogleAnalytics';
import { AuthProvider } from '../../hooks/Auth';
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster as NewYorkToaster } from "@/registry/new-york/ui/toaster"

export const metadata: Metadata = {
  title: "8-Bit Oracle - Generative I-Ching Fortuneteller",
  description: "Generative I-Ching Fortuneteller",
};

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
      <head>
        <GoogleAnalytics />
      </head>
      <body className="text-green">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <AuthProvider>
              <main>
                {children}
              </main>
              <NewYorkToaster />
              <Footer />
            </AuthProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## Conclusion

Overall, the dev experience of shadcn is decent. But you definitely need to know how to navigate the sample project to see how things are actually done to get the components to work. It's not as simple as copy pasting the component code (despite what they say).