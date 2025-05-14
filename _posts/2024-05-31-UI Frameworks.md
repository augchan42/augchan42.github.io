---
layout: post
title: "Navigating UI Framework Transitions: From Bootstrap to Shadcn"
author: "Aug"
date: 2024-05-31
header-style: text
catalog: true
description: "A developer's journey through UI framework choices, from Bootstrap to Next.js with Shadcn/ui. Discusses the pros and cons of component libraries like Shadcn (built on Radix UI and Tailwind CSS) versus traditional UI frameworks, and touches on project MVP plans."
tags:
  - ui-frameworks
  - component-libraries
  - shadcn-ui
  - tailwindcss
  - radix-ui
  - nextjs
  - react
  - bootstrap
  - frontend-development
---

## Current Tech Stack

- **Framework**: Next.js 14 (app router)
- **Internationalization**: next-intl
- **CSS**: Tailwind CSS
- **Backend**: Supabase with Auth-UI

## Choosing the Right UI Framework

I think I've decided to use [shadcn](https://ui.shadcn.com), but I'm still learning how to use it effectively.

### Evolution of the Project

My project first used Bootstrap directly. Then, I moved to Create-React-App (which is different from just React), and finally to the Next.js App Router.

### UI Development Challenges

However, building an app from the beginning is a lot of work, especially creating all the needed UI elements (widgets and components). There's a new trend of using component libraries that provide small, individual pieces. These are designed for you to copy and paste their code directly into your project, rather than installing a whole framework with `npm install`.

### Approach to Using Libraries

At first, I thought this was a great way to do things, and shadcn works like this. Because I'm always worried about bugs in open-source libraries, I usually make my own copy (a "fork") of the project. Then, I use components from my copy. This lets me see all the code and fix problems if they come up (if I know how!).

### Component Libraries

Component libraries like shadcn are designed for you to copy and paste components. You don't usually need to `npm install` them (though for shadcn, you do need to `npm install` the basic Radix UI components it's built on).

### Challenges with This Approach

The problem with this, of course, is handling bugs, upgrades, and different versions. Once you copy and paste the code, your version becomes separate and isn't automatically updated with the original library.

## Implementing Accounts and Logins

In addition to this, I'm finally starting to fully implement user accounts and logins. Currently, it works for Beta signups. However, I'll remove that soon because the app will have enough features for the MVP (Minimum Viable Product – a basic version of the app with core functionality).

### The MVP Concept

The MVP will be like creating a character in a game, but that character represents you. You'll answer a personality quiz. Then, the app will figure out your I-Ching trigrams and hexagrams that represent you, and create a profile based on that.

After completing the quiz, you will be able to ask the Oracle a question.

### Dynamic System Learning

The system will learn more about you as you use it. Over time, its recommendations and advice will become more personalized to you.

Thank you for reading!
