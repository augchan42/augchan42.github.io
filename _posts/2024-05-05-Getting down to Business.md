---
layout:       post
title:        "Getting down to Business"
author:       "Aug"
header-style: text
catalog:      true
tags:
    - Supabase DB
    - Authentication
    - Web3Auth
    - Supabase Auth-UI 
---

Current Stack: nextjs (app router) + next-intl + tailwind css + supabase with auth-ui

The [website](https://8bitoracle.ai) (hosted on netlify currently) is close enough to describing what the app needs to do, now we need to setup
authentication and some kind of beta signup process.  This marks the beginning of setting up the backend - a database and login flow.

For authentication, seems that some form of oauth2 is what people use nowadays.  For oauth2 I went with supabase auth, as I wanted to store user information and supabase has a built in integration between out of the box user/profile tables on postgres and the oauth2 flow from supabase auth.

For auth widget, I went with [supabase auth-ui](https://github.com/supabase-community/auth-ui) - though keep in mind it seems to have gone out of maintenance since Feb 2024.  I also found cofiguring magic link with this widget quite easy.

I will revisit [web3auth](https://web3auth.io) when the time comes.  Reason I didn't do it initially
is it needing manual integration with database (nothing is stored if using default web3auth flows).  

BTW in either scenario, you still need to setup the oauth2 provider itself (which in my case is google).  So there's no escaping that.  Another reason I went with supabase-auth is at least with supabase-auth I get integration to a db automatically.

I went supabase over firebase as supabase is opensource and I could in theory host it myself if supabase hosting went to shit.

You can see the beta signup here:  [8-bit oracle beta signup](https://8bitoracle.ai/en/beta)