---
layout: post
title: "Trusting Your Instincts: When AI Suggests Complex Solutions"
author: "Aug"
date: 2025-09-14
header-style: text
catalog: true
description: "A debugging session reveals why your gut feeling about 'two sets of items' was right - and how to guide AI toward simpler, better solutions."
tags:
  - ai-assistance
  - react
  - state-management
  - debugging
  - architecture
  - single-source-of-truth
  - ai-guidance
  - software-engineering
---

**Abstract:**  
When debugging a React selection bug, AI suggested syncing two data sources. My instinct said "this feels wrong" - and it was. A quick web search confirmed that maintaining duplicate state violates fundamental React principles. This post explores how to recognize when AI is overcomplicating solutions and trust your architectural instincts.

**Estimated reading time:** _5 minutes_

I had one of those debugging sessions recently that perfectly illustrates why experienced developers need to trust their instincts when working with AI assistants, even when the AI's suggestions seem technically sound.

## The Problem

The issue was straightforward: search and filtering worked correctly (logs showed proper filtering from 20 items down to 2), but clicking on individual content items wasn't being detected. The AI assistant quickly identified the root cause:

> The toggleContentSelection function from useContentSelection hook is looking for items in the contentStore's inputMaterial, but we're displaying items from SimpleContentSearch's inputMaterial. These are two different data sources.

## The AI's Solution

The AI proposed what seemed like a reasonable fix:

> We need to sync the SimpleContentSearch results to the contentStore so both data sources match.

It even provided code examples and explained the technical approach. The solution was technically correct and would have worked.

## The Gut Feeling

But something felt off. I had that nagging feeling developers get when they see architectural patterns that just don't sit right. Specifically, I was wary of having "two sets of items" - one in the contentStore and one from SimpleContentSearch results.

I asked the AI to search for best practices around this pattern, and the results confirmed my suspicion.

## The Web Search Results

The search revealed that maintaining duplicate data sources is explicitly called out as an anti-pattern in React state management:

> "Avoid redundant and duplicate state so that you don't need to keep them in sync" - React Docs

> "There should be a single 'source of truth' for any data that changes in a React application"

> "This issue destroys the single source of truth concept... It is a bad practice and should be avoided"

## Why Two Data Sources is Bad

The search results highlighted exactly why my instinct was right:

1. **Sync Hell**: Updates to one don't automatically update the other
2. **Bug Factory**: Components can display different data from same API
3. **Race Conditions**: User sees stale data while new data loads
4. **Memory Waste**: Duplicate data storage
5. **Mental Overhead**: Developers must track multiple sources

## The Better Solution

Instead of syncing two data sources, the proper 2025 best practice solutions are:

**Option 1: Single Store (Recommended)**
```javascript
// SimpleContentSearch becomes stateless - just triggers store actions
const handleSearch = (query) => {
  contentStore.searchContent(query) // Updates single source
}
```

**Option 2: Derived State**
```javascript
// One source, derive the other
const searchResults = useMemo(() =>
  applyFilters(contentStore.inputMaterial, filters)
, [contentStore.inputMaterial, filters])
```

**Option 3: Event-Driven**
```javascript
// SearchContentSearch emits events, contentStore listens
searchService.on('results', (data) => contentStore.setInputMaterial(data))
```

## The Lesson

This debugging session perfectly illustrates a key principle: **trust your architectural instincts, even when AI provides technically correct solutions.**

The AI was right about the immediate fix, but wrong about the architectural approach. My gut feeling about "two sets of items" was spot-on - this dual-source architecture is exactly what caused the selection bug we were experiencing.

## When to Push Back on AI

Here are the red flags that should trigger your architectural instincts:

- **Duplicate data sources**: If you're maintaining the same data in multiple places
- **Complex sync mechanisms**: When the solution involves keeping things "in sync"
- **State copying**: Moving data from one store to another instead of deriving it
- **Multiple sources of truth**: When different parts of your app use different data sources

## The Meta-Lesson

The most valuable part of this debugging session wasn't fixing the bug - it was learning to recognize when AI is suggesting solutions that work but violate fundamental principles. The AI was focused on the immediate technical problem, while my instinct was focused on the broader architectural health of the system.

Sometimes the best debugging tool isn't a debugger or an AI assistant - it's that nagging feeling that something just doesn't feel right architecturally. Trust that feeling.

**Confidence: 95%** - This is a well-established React pattern, and the web search results from official React documentation confirm the anti-pattern nature of duplicate state sources.
