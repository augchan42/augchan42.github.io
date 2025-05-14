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

Now that the [website](https://8bitoracle.ai) explains what the app needs, it's time to set up how users log in (authentication) and sign up for the beta. This marks the beginning of our backend setup.

## Authentication Choices

### Why OAuth2 with Supabase

I chose OAuth2 because it's widely used. Supabase Auth connects directly to the PostgreSQL database's user and profile tables. This makes managing user data simpler.

### Supabase Auth-UI

I used [Supabase Auth-UI](https://github.com/supabase-community/auth-ui) because it makes setting up "magic links" (login links sent via email) easy. Note: this library has not been updated since February 2024.

## Web3Auth: Future Considerations

I've decided to wait on using [Web3Auth](https://web3auth.io) for now because it requires manually connecting it to the database.

## OAuth2 Provider Setup

Setting up Google as an OAuth2 provider was important. This helps it work well with Supabase Auth, which then automatically links to the database.

## Supabase vs. Firebase

I chose Supabase instead of Firebase because Supabase is open-source, and I might be able to host it myself in the future.

## Beta Signup Live

The beta signup is now available at [8-bit oracle beta signup](https://8bitoracle.ai/en/beta). Feel free to sign up.

Thanks for reading.
