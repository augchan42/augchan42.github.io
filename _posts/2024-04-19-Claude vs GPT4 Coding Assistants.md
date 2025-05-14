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

I use cursor.sh IDE integrated with GPT4 with my project, and I have Claude Opus in a standalone browser window.

Claude in general is better at reasoning, gives better quality output, and is more up-to-date.

I'm in the middle of migrating 8bitoracle.ai from raw webpack to React to Next.js with Tailwind.

Next.js is in the middle of upgrading from their old Pages Router to their new App Router which separates components into client and server (which builds on top of React 18 server components). GPT4 fails miserably at handling recent changes, it assumes you are using the old pages router and has to be told specifically you wish assistance using the app router, and it frequently needs to be reminded.

Claude detects what you are doing from the code you are sending, and gives appropriate responses.

In general coding assistants have problems when frameworks undergo major changes, and they do better when trying to help with raw languages (js, python, css) rather than frameworks (next.js and to a lesser extent React)
