---
layout: post
title: "Integrating with Shadcn: Tips and Insights for Seamless UI Component Integration"
author: "Aug"
date: 2024-06-08
header-style: text
catalog: true
description: "A developer's experience integrating Shadcn UI components into a Next.js project. Covers project preparation, handling opinionated styling (dark theme, New York style), managing global CSS, and an example root layout incorporating ThemeProvider and Toaster."
tags:
  - shadcn-ui
  - ui-components
  - react
  - nextjs
  - tailwindcss
  - radix-ui
  - frontend-development
  - component-libraries
  - theme-provider
  - css-styling
  - developer-experience
---

# Integrating with Shadcn: My Experience and Insights

I wanted to make a blog post talking about my experience integrating with shadcn. Here's what I ran into.

## Project Preparation

Before diving into the integration, you need to prepare your project by following the instructions provided in the shadcn documentation: [https://ui.shadcn.com/docs/installation/next](https://ui.shadcn.com/docs/installation/next)

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

## Styling Considerations

The default shadcn project uses slate styling with CSS variable replacement ("cssVariables": true in the components.json). I did not follow their font styling. Instead, I had to move all my global styles to my own /styles/mystyles.css file because the /src/app/globals.css file gets overwritten by shadcn.

## New York Styling

The example components I'm using are using New York styling. So for example, the toast notification that the profile update is using at [https://ui.shadcn.com/examples/forms](https://ui.shadcn.com/examples/forms) requires adding `NewYorkToaster` from `"@/registry/new-york/ui/toaster"` to my root layout above my footer component, for the toast notification updating the profile using the default profile form example to work.

## Root Layout Example

For reference, here's my root layout that incorporates auth, theme provider, next-intl, and the NY styled toaster notification:

```jsx
import { NextIntlClientProvider, useMessages } from "next-intl";
import type { Metadata } from "next";
import "../globals.css";
import "../../../styles/fonts.css";
import "../../../styles/mystyles.css";
import Footer from "../../components/Footer";
import GoogleAnalytics from "../../components/GoogleAnalytics";
import { AuthProvider } from "../../hooks/Auth";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster as NewYorkToaster } from "@/registry/new-york/ui/toaster";

export const metadata: Metadata = {
  title: "8-Bit Oracle - Generative I-Ching Fortuneteller",
  description: "Generative I-Ching Fortuneteller",
};

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode,
  params: { locale: string },
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
              <main>{children}</main>
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
