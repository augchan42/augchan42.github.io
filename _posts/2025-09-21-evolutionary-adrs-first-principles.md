---
layout: post
title: "Evolutionary ADRs: Writing Architecture Decision Records from First Principles"
date: 2025-09-21
description: "Why creating ADRs during development, not before it, leads to more honest and valuable documentation of your architectural decisions."
tags:
  [
    Architecture,
    ADR,
    Software-Design,
    Documentation,
    Development-Process,
    First-Principles,
    Technical-Writing,
    Software-Engineering,
  ]
---

**Abstract:**  
Traditional guidance on ADRs is often applied as if big decisions must be captured upfront. Reality is messier. This post argues for an evolutionary approach—writing ADRs during development as you discover what actually works, documenting the real decision-making process, including dead ends and pivots.

**Estimated reading time:** _5 minutes_

Architecture Decision Records (ADRs) have become a standard practice for documenting important architectural choices in software projects. The conventional wisdom suggests writing ADRs early—make your big decisions upfront, document them, and let everything flow from there. But what if this approach fundamentally misunderstands how software development actually works?

## The Problem with Upfront ADRs

Traditional ADR guidance encourages you to identify major architectural decisions early and document them before implementation begins. This sounds logical, but it assumes a level of foresight that rarely exists in practice, especially when:

- **Building in unfamiliar domains** — working with technologies or problem spaces you haven't fully mastered  
- **Exploring new patterns** — modern architectural approaches evolve quickly  
- **Facing emergent complexity** — requirements and constraints only become clear through implementation  

The result? ADRs that capture hypothetical decisions based on incomplete understanding, rather than the real reasoning that shaped your final architecture.

## A Real Example: The Workspace Pivot

I once designed a system around "workspaces per user." It looked neat: isolated environments, clean permissions, simple to explain.  

**The initial thinking:**  
- Clear separation of concerns  
- Easy-to-understand user model  
- Straightforward permissions  

**The reality:**  
- Workflows became convoluted  
- Many-to-many relationships appeared naturally  
- "Workspaces" felt arbitrary and restrictive  
- Users really needed **provenance with flexible tags in JSONB columns**  

The final design abandoned rigid workspaces in favor of a tagging system that could represent any structure, while tracking who created or modified what.

## Why AI Makes Evolutionary ADRs Even More Relevant

AI-assisted development has shifted the cost curve of being wrong. In the past, a flawed model or boundary might cost weeks to unwind, so ADRs were written upfront to avoid waste.  

Now, with AI helping scaffold prototypes and surface edge cases rapidly, you hit decision points faster and discover wrong turns sooner. Throwaway experiments are cheaper, both technically and emotionally, so pivots happen earlier and more often.  

This accelerates the rhythm of architectural learning. Instead of a handful of big decisions at project kickoff, you face dozens of micro-decisions as the system evolves. Evolutionary ADRs capture this real process—not risk avoidance through prediction, but knowledge preservation through documenting lessons learned.

## Evolutionary ADRs: A Better Approach

Instead of predicting decisions, I now write ADRs **during development**—after exploring a path and discovering its limitations. This has several advantages:

### 1. Honest Documentation
You capture actual decisions based on experience, not theory. The ADR explains not just what you chose, but what you tried first and why it failed.

### 2. Context for Future Developers
Future team members (including your future self) get the full story: "We tried A, hit these problems, and here's why B solved them better."

### 3. Learning Capture
Each ADR becomes a mini case study in your domain, preserving hard-won insights that would otherwise vanish.

### 4. Less Analysis Paralysis
You can start building without the pressure to make perfect calls upfront. The ADR arrives once you've learned enough to decide confidently.

## The Evolutionary ADR Template

```markdown
# ADR-XXX: [Decision Title]

## Status
Accepted

## Context
Problem we were solving.

## Initial Approach
What we tried first and why it seemed reasonable.

## Problems Discovered
Issues encountered during implementation:
- Problem 1 (with example)
- Problem 2 (with example)

## Decision
What we chose instead and why.

## Implementation Details
Key technical aspects of the new approach.

## Consequences
- Positive outcomes
- Trade-offs accepted
- Areas to monitor

## Lessons Learned
Insights about the domain/technology/problem space.
```

## When to Write Evolutionary ADRs

Not every code change needs one, but write an ADR when:

* You pivot from an initial approach
* You solve a non-obvious problem
* You make a meaningful trade-off
* You learn something surprising

## The Value of Honest Failure Documentation

One of the most valuable aspects of evolutionary ADRs is documenting **why certain approaches didn't work** in your context. That's often more useful than a theoretical analysis.

For example: "Workspaces per user seemed logical but created artificial boundaries that didn't match user workflows." That's gold for anyone revisiting the problem later.

## Balancing Planning and Discovery

This doesn't mean abandoning all upfront architectural thought. Some decisions truly need to be made early (e.g. technology stack, major infrastructure). The key is recognizing which decisions are expensive to change and which can safely evolve.

**Make early:** Decisions that are costly to reverse later
**Defer:** Decisions where implementation will teach you more

## Conclusion

Software development is fundamentally a learning process. Your architecture evolves as your understanding deepens, and your ADRs should reflect that.

By writing ADRs during development, you create documentation that helps future developers see not only what was decided, but how and why it emerged from the messy reality of building software.

The goal isn't perfect foresight—it's capturing the reasoning process, including the valuable lessons from wrong turns. In an AI-accelerated world where wrong paths are cheaper to explore, this kind of honest, evolutionary documentation is more valuable than ever.

---

*Have you tried evolutionary approaches to documenting architectural decisions? I'd love to hear your experiences.* 