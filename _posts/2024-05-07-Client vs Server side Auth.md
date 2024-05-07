---
layout:       post
title:        "Client vs Server side Auth"
author:       "Aug"
header-style: text
catalog:      true
tags:
    - Supabase DB
    - Authentication
    - Google oauth2 social login
    - Magic link auth
---

Current Stack: nextjs 14 (app router) + next-intl + tailwind css + supabase with auth-ui

While implementing social login for [8-Bit Oracle](https://8bitoracle.ai) I learned about the differences between client and server side auth.

For google social login, the login flow is controlled client side, so '@supabase/ssr' createBrowserClient is used to retrieve session info after authentication.

For email that sends a magic link, the link goes to an api confirm route which is in the backend, so you need to use '@supabase/ssr' createServerClient to retrieve session information after the authentication.

The confusing thing is supabase auth-ui can show both logins combined on the same login widget, and the code samples from auth-ui use createClient from '@supabase/supabase-js'.

Some good links for further knowledge/research:

[reddit post with some clarification](https://www.reddit.com/r/Supabase/comments/17hbwqb/question_about_supabasessr_and)

[good article for initial setup](https://ekremsonmezer.substack.com/p/supabase-and-nextjs-14-authentication)

[github sample project](https://github.com/SamuelSackey/nextjs-supabase-example)



