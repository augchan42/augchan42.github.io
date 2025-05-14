---
layout: post
title: "Implementing Auth and Database for 8-Bit Oracle"
author: "Aug"
date: 2024-05-05
header-style: text
catalog: true
description: "Details on setting up authentication and database for the 8-Bit Oracle project using Next.js, Supabase (with Auth-UI for OAuth2), and Tailwind CSS. Discusses choices like Supabase over Firebase and future consideration of Web3Auth."
tags:
  - supabase
  - authentication
  - oauth2
  - web3auth
  - supabase-auth-ui
  - nextjs
  - postgresql
  - tailwindcss
  - backend-development
  - project-update
  - beta-signup
---

## Current Tech Stack

- **Framework**: Next.js (app router)
- **Internationalization**: next-intl
- **CSS**: Tailwind CSS
- **Backend**: Supabase with Auth-UI

## Overview

With the [website](https://8bitoracle.ai) detailing the app's needs, it's time to set up authentication and beta signups, marking our dive into backend setup.

## Authentication Choices

### Why OAuth2 with Supabase

Chose OAuth2 for its ubiquity. Supabase Auth links directly to PostgreSQL user/profile tables, streamlining user data management.

### Supabase Auth-UI

Implemented [Supabase Auth-UI](https://github.com/supabase-community/auth-ui) for its ease in setting up magic links. Note: no updates since February 2024.

## Web3Auth: Future Considerations

[Web3Auth](https://web3auth.io) is on hold due to its manual database integration requirement.

## OAuth2 Provider Setup

Setting up Google as the OAuth2 provider was essential, ensuring smooth integration with Supabase Auth for automatic database linkage.

## Supabase vs. Firebase

Opted for Supabase over Firebase for its open-source nature and potential for self-hosting.

## Beta Signup Live

The beta signup is live at [8-bit oracle beta signup](https://8bitoracle.ai/en/beta). Check it out.

Thanks for reading.
