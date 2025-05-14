---
layout: post
title: "Claude vs GPT4 for Coding"
author: "Aug"
date: 2024-04-19
header-style: text
catalog: true
description: "A developer's comparison of using Claude Opus and GPT-4 (via Cursor.sh) as AI coding assistants, particularly when working with Next.js App Router vs. Pages Router and handling framework updates."
tags:
  - ai-coding-assistants
  - claude
  - gpt-4
  - ai-pair-programming
  - nextjs
  - react
  - cursor-sh
  - llm
  - code-generation
  - developer-tools
---

Some short notes and experiences.

I use the cursor.sh IDE, which includes GPT4, for my project. I also use Claude Opus in a separate browser window.

Overall, Claude seems better at thinking things through, provides higher quality suggestions, and has more current information.

I'm currently migrating my website, 8bitoracle.ai, from using just Webpack to React, then Next.js with Tailwind.

Next.js is currently updating from its old Pages Router to a new App Router. This new router divides parts of the website (components) into client-side (runs in the browser) and server-side (runs on the server), using features from React 18 server components. GPT4 performs very poorly with these recent Next.js changes. It assumes I'm using the old Pages Router, and I have to specifically tell it I need help with the new App Router. It often needs to be reminded of this.

Claude understands what I'm trying to do from the code I provide and gives relevant answers.

Generally, coding assistants struggle when software frameworks (like Next.js or React) have big updates. They tend to work better with fundamental programming languages (like JavaScript, Python, or CSS) than with these frameworks.
