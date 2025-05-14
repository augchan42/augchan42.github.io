---
layout: post
title: "Mastering React State and JS Timing: Solving Double Execution in Development Mode"
author: "Aug"
date: 2024-03-09
header-style: text
catalog: true
description: "A quick tip on debugging React useEffect double execution issues in Next.js development mode, often caused by Hot Module Reloading (HMR), and the importance of testing in production mode."
tags:
  - react
  - useeffect
  - nextjs
  - hmr
  - hot-module-reloading
  - debugging
  - react-development
  - javascript
---

While figuring out how to properly animate yin/yang lines for my app, I ran into
some strange behavior.

I basically have an array of lines, and a loop to draw each line in the array.

When using dev mode for next.js (next dev), useEffect() was getting triggered twice and I would display 12 lines instead of 6. I thought I was going nuts, but
then it was explained to me that HMR/hot module reloads (which happens in dev) can cause this behavior.

So word to the wise - if you see double effects on a site you are testing, build and deploy
in production mode to make sure HMR isn't the culprit.
