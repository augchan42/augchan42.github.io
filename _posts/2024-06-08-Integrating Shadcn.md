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

**Abstract:**  
This post shares a developer's experience integrating Shadcn UI components into a Next.js project. It covers essential aspects such as initial project preparation, adapting to Shadcn's opinionated styling (including dark theme and "New York" style), managing global CSS to avoid conflicts, and provides an example root layout that incorporates `ThemeProvider` and the Shadcn Toaster component.

**Estimated reading time:** _3 minutes_

# Integrating with Shadcn: My Experience and Insights

I want to share my experience integrating Shadcn UI components. Here are some things I encountered.

## Project Preparation

Before starting the integration, prepare your project by following the official Shadcn documentation: [https://ui.shadcn.com/docs/installation/next](https://ui.shadcn.com/docs/installation/next)

## Opinionated Styling

The Shadcn example at [https://ui.shadcn.com/](https://ui.shadcn.com/) has strong default settings (it's "opinionated"). It assumes you're using a dark theme and their "New York" visual style. This means your main layout file needs to use their theme provider. Since my website has a black background by default, I had to use the dark theme for the Shadcn components to look right.

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

The standard Shadcn setup uses a "slate" color style and replaces CSS variables (this is set with `"cssVariables": true` in the `components.json` file). I didn't use their font styling. Instead, I had to move all my main CSS styles to my own file (`/styles/mystyles.css`) because Shadcn overwrites the usual `/src/app/globals.css` file.

## New York Styling

The example components I'm using have the "New York" style. For instance, to use the toast notification shown in the profile update example at [https://ui.shadcn.com/examples/forms](https://ui.shadcn.com/examples/forms), I had to add the `NewYorkToaster` component (from `"@/registry/new-york/ui/toaster"`) to my main layout file, just above my footer. This was necessary for the profile update toast notification to work correctly with their example form.

## Root Layout Example

For reference, here is my main layout file. It includes authentication, the theme provider, internationalization (next-intl), and the New York styled toaster notification:

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

Overall, the developer experience with Shadcn is quite good. However, you definitely need to explore their sample project to understand the actual implementation details to get the components working correctly. It's not always as simple as just copying and pasting the component code, even though their documentation might suggest that.
