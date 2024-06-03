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

### Magic Link Email Authentication
Conversely, for email authentication that employs a magic link, the link directs the user to an API confirm route located on the backend. This requires using `@supabase/ssr`'s `createServerClient` to retrieve session information after authentication is confirmed.

### Integrated Authentication UI
A potentially confusing aspect is that Supabase's auth-ui can display both types of logins within the same widget. Moreover, the code samples from auth-ui typically use `createClient` from `@supabase/supabase-js`, which can add to the confusion.

## Further Reading and Resources
For those looking to deepen their understanding or set up their own authentication mechanisms, here are some valuable resources:
- [Reddit Post with Clarifications on Supabase Auth](https://www.reddit.com/r/Supabase/comments/17hbwqb/question_about_supabasessr_and)
- [Comprehensive Guide on Supabase and Next.js 14 Authentication](https://ekremsonmezer.substack.com/p/supabase-and-nextjs-14-authentication)
- [GitHub Sample Project Demonstrating Next.js with Supabase](https://github.com/SamuelSackey/nextjs-supabase-example)

Thank you for reading, and I hope this post helps you navigate the complex landscape of web authentication more effectively!
