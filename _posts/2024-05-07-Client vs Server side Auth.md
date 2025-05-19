---
layout: post
title: "Navigating Client vs Server-Side Authentication in Web Development"
author: "Aug"
date: 2024-05-07
header-style: text
catalog: true
description: "Explores client-side vs. server-side authentication using Supabase with Next.js 14 (App Router). Covers Google OAuth2 (client-side flow with createBrowserClient) and Magic Link (server-side flow with createServerClient), and clarifies Supabase Auth-UI usage."
tags:
  - supabase
  - nextjs
  - authentication
  - client-side-auth
  - server-side-auth
  - oauth2
  - magic-link
  - supabase-ssr
  - supabase-auth-ui
  - auth-helpers
  - javascript
  - typescript
---

**Abstract:**  
This post explores the differences between client-side and server-side authentication flows when using Supabase with Next.js 14 (App Router). It provides practical examples covering Google OAuth2 social login, which typically uses a client-side flow with `createBrowserClient`, and Magic Link email authentication, which involves a server-side flow using `createServerClient`. The post also clarifies how Supabase's Auth-UI can integrate both types of login methods.

**Estimated reading time:** _3 minutes_

## Current Tech Stack

- **Framework**: Next.js 14 (app router)
- **Internationalization**: next-intl
- **CSS**: Tailwind CSS
- **Backend**: Supabase with Auth-UI

## Introduction

While adding social login features for [8-Bit Oracle](https://8bitoracle.ai), I learned about the detailed differences between client-side and server-side authentication. This post explains these differences with practical examples and useful resources.

## Client-Side vs Server-Side Authentication

### Google OAuth2 Social Login (Client-Side Flow)

For Google social login, the login process is managed on the client-side (in the user's browser). In this setup, we use the `createBrowserClient` method from `@supabase/ssr` to get session information after the user logs in.

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    // options
  );
}
```

### Magic Link Email Authentication (Server-Side Flow)

On the other hand, for email login using a magic link, the link takes the user to a confirmation address (API route) on our server (backend). This means we need to use `createServerClient` from `@supabase/ssr` to get session information after the login is confirmed on the server.

When using `createSupabaseServerClient`, if you need to set cookie values (like for login, registration, or signout), the `component` flag should be `false` (which is its default value). If you are only reading cookies within a server component and not modifying them, set `component: true`.

```typescript
import { type NextRequest, type NextResponse } from "next/server";
import { cookies } from "next/headers";
// import { deleteCookie, getCookie, setCookie } from "cookies-next"; // Not used in this specific function, consider removing if not used elsewhere
import { createServerClient, type CookieOptions } from "@supabase/ssr";

// Server components can only get cookies (component: true) and not set them.
// Server actions or API routes can set cookies (component: false).
export function createSupabaseServerClient(component: boolean = false) {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookieValue = cookieStore.get(name)?.value;
          // console.log(`Getting cookie: ${name} = ${cookieValue}`); // Optional: Log cookie retrieval
          return cookieValue;
        },
        set(name: string, value: string, options: CookieOptions) {
          if (component) return; // Server Components cannot set cookies
          // console.log(`Setting cookie: ${name} = ${value}, options = ${JSON.stringify(options)}`); // Optional: Log cookie setting
          try {
            cookieStore.set({ name, value, ...options });
            // console.log(`Cookie set successfully: ${name}`);
          } catch (error) {
            console.error(`Error setting cookie: ${name}`, error);
          }
        },
        remove(name: string, options: CookieOptions) {
          if (component) return; // Server Components cannot remove cookies
          // console.log(`Removing cookie: ${name}, options = ${JSON.stringify(options)}`); // Optional: Log cookie removal
          try {
            cookieStore.delete({ name, ...options });
            // console.log(`Cookie removed successfully: ${name}`);
          } catch (error) {
            console.error(`Error removing cookie: ${name}`, error);
          }
        },
      },
    }
  );
}
```

### Integrated Authentication UI

It can be confusing that [Supabase's auth-ui](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui) can show both login types (like Google and magic link) in the same UI element (widget). Also, the example code for auth-ui often uses an older function, `createClient` from `@supabase/supabase-js`, which can make things more confusing when you are trying to use the newer `@supabase/ssr` methods.

Settings like `view="magic_link"` (for magic links) and `providers={['google']}` (for Google OAuth) are both used to set up the same Auth widget, allowing it to handle multiple authentication methods.

```tsx
<div className="justify-center w-full max-w-xs animate-in text-foreground">
    <Auth
        view="magic_link"
        appearance={% raw %}{{
            theme: ThemeSupa,
            style: {
                button: {
                    borderRadius: '5px',
                    borderColor: 'rgb(8, 107, 177)',
                },
            },
            variables: {
                default: {
                    colors: {
                        brand: 'rgb(8, 107, 177)',
                        brandAccent: 'gray',
                    },
                },
            },
        }}{% endraw %}
        supabaseClient={supabase} // This should be a Supabase client instance
        providers={['google']}
        theme="dark"
        socialLayout="vertical"
        redirectTo={`${siteUrl}/${locale}/beta`}
    />
</div>
```

## Further Reading and Resources

If you want to understand this better or set up your own login systems, here are some helpful resources:

- [Reddit Post with Clarifications on Supabase Auth](https://www.reddit.com/r/Supabase/comments/17hbwqb/question_about_supabasessr_and)
- [Comprehensive Guide on Supabase and Next.js 14 Authentication](https://ekremsonmezer.substack.com/p/supabase-and-nextjs-14-authentication)
- [GitHub Sample Project Demonstrating Next.js with Supabase](https://github.com/SamuelSackey/nextjs-supabase-example)

Thanks for reading! I hope this post helps you understand web authentication better.
