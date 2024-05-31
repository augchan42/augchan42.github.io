---
layout:       post
title:        "UI Frameworks"
author:       "Aug"
header-style: text
catalog:      true
tags:
    - ui component frameworks
    - shadcn
    - tailwind
    - radix
---

Current Stack: nextjs 14 (app router) + next-intl + tailwind css + supabase with auth-ui

I think I've settled on [shadcn](https://ui.shadcn.com) but I'm still getting the hang of it.

A few things - my project started out as plain bootstrap, then create-react-app (which is distinct from React btw), then Next.js.

However, building an app from scratch is a ton of work, especially with all the UI widgets and components required.  There's a trend now towards granular component libraries which are geared towards copy/pasting code directly into your project, instead of npm installing an entire framework.

Initially I thought this approach was great (and this is how shadcn works).  Since I am always afraid of bugs in whatever open source library I use, I usually forking the project, then imported stuff my fork.  That way I have full visibility into the code and if I need to fix something it's there (assuming I can do it!)

Component libraries like shadcn are geared towards copy pasting components directly, and don't require you to do an npm install (though shadcn does require npm installing underlying unstyled radix-ui components).

The issue with this of course, is bugs, upgrades and versioning.  Once you do your copy/paste, you are effectively on your own little branch of the code not tied to anything.

On top of this I'm finally getting around to fully implementing accounts and logins.  Right now I have it working for Beta signups, but I'll be removing that shortly because I will have enough funtionality for the MVP.

The MVP will be like building a character, except the character is you.  You will fill out a personality quiz, the app will determine your representative trigrams and hexagrams, and from there we will generate a profile.

After filling out the quiz, you will have earned the right to ask the Oracle a question.

The system will learn about you overtime and as you use the system more, the system's recommendations and advice will be more tailored.

That's the vision so far.  Thanks for reading.



