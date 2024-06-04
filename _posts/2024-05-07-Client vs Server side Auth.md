---
layout:       post
title:        "Navigating Client vs Server-Side Authentication in Web Development"
author:       "Aug"
header-style: text
catalog:      true
tags:
    - Supabase DB
    - Authentication
    - Google OAuth2 Social Login
    - Magic Link Auth
---

## Current Tech Stack
- **Framework**: Next.js 14 (app router)
- **Internationalization**: next-intl
- **CSS**: Tailwind CSS
- **Backend**: Supabase with Auth-UI

## Introduction
While implementing social login features for [8-Bit Oracle](https://8bitoracle.ai), I encountered the nuanced differences between client-side and server-side authentication. This post explores these distinctions with practical examples and useful resources.

## Client-Side vs Server-Side Authentication
### Google OAuth2 Social Login
For Google social login, the login flow is managed client-side. In this setup, we utilize `@supabase/ssr`'s `createBrowserClient` method to retrieve session information post-authentication.

```code
import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    // options
  );
}
```

### Magic Link Email Authentication
Conversely, for email authentication that employs a magic link, the link directs the user to an API confirm route located on the backend. This requires using `@supabase/ssr`'s `createServerClient` to retrieve session information after authentication is confirmed.
For situations where cookie values need to be set (login, registration, signout) then the component flag should be false (default).

```html
import { type NextRequest, type NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

// server component can only get cookies and not set them, hence the "component" check
export function createSupabaseServerClient(component: boolean = false) {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookieValue = cookieStore.get(name)?.value;          
          console.log(`Getting cookie: ${name} = ${cookieValue}`); // Log the cookie retrieval
          return cookieValue;
        },
        set(name: string, value: string, options: CookieOptions) {
          if (component) return;
          console.log(`Not Setting cookie: ${name} = ${value}, options = ${JSON.stringify(options)}`); // Log the cookie setting
          try {
            cookieStore.set({ name, value, ...options });
            console.log(`Cookie set successfully: ${name}`);
            //return { success: true, message: `Cookie set successfully: ${name}` };
          } catch (error) {
            console.error(`Error setting cookie: ${name}`, error);
            //return { success: false, message: `Error setting cookie: ${name}`, error: error };
          }          
        },
        remove(name: string, options: CookieOptions) {
          if (component) return;
          console.log(`Removing cookie: ${name}, options = ${JSON.stringify(options)}`); // Log the cookie removal
          try {
            cookieStore.delete({ name, ...options });
            console.log(`Cookie removed successfully: ${name}`);
            //return { success: true, message: `Cookie removed successfully: ${name}` };
          } catch (error) {
            console.error(`Error removing cookie: ${name}`, error);
            //return { success: false, message: `Error removing cookie: ${name}`, error: error };
          }
        },
      },
    }
  );
}
```


### Integrated Authentication UI
A potentially confusing aspect is that [Supabase's auth-ui](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui) can display both types of logins within the same widget. Moreover, the code samples from auth-ui use the older `createClient` from `@supabase/supabase-js`, which adds to the confusion.  The view="magic_link" and providers={['google']} are configuring the same Auth widget.


```code
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
        supabaseClient={supabase}
        providers={['google']}
        theme="dark"
        socialLayout="vertical"
        redirectTo={`${siteUrl}/${locale}/beta`}
    />
</div>
```                                            


## Further Reading and Resources
For those looking to deepen their understanding or set up their own authentication mechanisms, here are some valuable resources:
- [Reddit Post with Clarifications on Supabase Auth](https://www.reddit.com/r/Supabase/comments/17hbwqb/question_about_supabasessr_and)
- [Comprehensive Guide on Supabase and Next.js 14 Authentication](https://ekremsonmezer.substack.com/p/supabase-and-nextjs-14-authentication)
- [GitHub Sample Project Demonstrating Next.js with Supabase](https://github.com/SamuelSackey/nextjs-supabase-example)

Thank you for reading, and I hope this post helps you navigate the complex landscape of web authentication more effectively!
