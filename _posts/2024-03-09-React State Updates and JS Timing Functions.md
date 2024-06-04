---
layout:       post
title:        "Mastering React State and JS Timing: Solving Double Execution in Development Mode"
author:       "Aug"
header-style: text
catalog:      true
tags:
    - React State Updates
    - Javascript Timing
    - Recursion
    - Sequential Execution
    - Ascii Animation
    - React Batching
    - Hot module reload issues
    - React State Management
    - JavaScript Timing Functions
    - Animation in React
    - Next.js Development
    - Hot Module Reloading
    - Debugging React Apps
    - Web Development Best Practices
    - useEffect Issues
    - Sequential Execution in JavaScript
    - Frontend Animation Techniques
---

While figuring out how to properly animate yin/yang lines for my app, I ran into
some strange behavior.

I basically have an array of lines, and a loop to draw each line in the array.

When using dev mode for next.js (next dev), useEffect() was getting triggered twice and I would display 12 lines instead of 6.  I thought I was going nuts, but
then it was explained to me that HMR/hot module reloads (which happens in dev) can cause this behavior.

So word to the wise - if you see double effects on a site you are testing, build and deploy
in production mode to make sure HMR isn't the culprit.



