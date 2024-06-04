---
layout:       post
title:        "Navigating UI Framework Transitions: From Bootstrap to Shadcn"
author:       "Aug"
header-style: text
catalog:      true
tags:
    - ui component frameworks
    - shadcn
    - tailwind
    - radix
---

## Current Tech Stack
- **Framework**: Next.js 14 (app router)
- **Internationalization**: next-intl
- **CSS**: Tailwind CSS
- **Backend**: Supabase with Auth-UI

## Choosing the Right UI Framework

I think I've settled on [shadcn](https://ui.shadcn.com), but I'm still getting the hang of it.

### Evolution of the Project
My project started out using plain Bootstrap, then transitioned to Create-React-App (which is distinct from React), and finally to Next.js App Router.

### UI Development Challenges
However, building an app from scratch is a ton of work, especially with all the UI widgets and components required. There's a trend now towards granular component libraries, which are geared towards copying and pasting code directly into your project, instead of npm installing an entire framework.

### Approach to Using Libraries
Initially, I thought this approach was great, and this is how shadcn works. Since I am always concerned about bugs in whatever open source library I use, I usually fork the project, then import stuff from my fork. This gives me full visibility into the code and allows me to fix things as needed (assuming I can do it!).

### Component Libraries
Component libraries like shadcn are geared towards copy-pasting components directly and don't require you to do an npm install (though shadcn does require npm installing the underlying unstyled radix-ui components).

### Challenges with This Approach
The issue, of course, is bugs, upgrades, and versioning. Once you do your copy/paste, you are effectively on your own little branch of the code not tied to anything.

## Implementing Accounts and Logins
On top of this, I'm finally getting around to fully implementing accounts and logins. Right now, I have it working for Beta signups, but I'll be removing that shortly because I will have enough functionality for the MVP.

### The MVP Concept
The MVP will be like building a character, except the character is you. You will fill out a personality quiz, the app will determine your representative trigrams and hexagrams, and from there, we will generate a profile.

After filling out the quiz, you will have earned the right to ask the Oracle a question.

### Dynamic System Learning
The system will learn about you over time, and as you use the system more, the system's recommendations and advice will be more tailored.

Thank you for reading!
