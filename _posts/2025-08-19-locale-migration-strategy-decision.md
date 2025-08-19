---
layout: post
title: "Locale Migration Strategy: When Adding Beats Replacing"
author: "Aug"
date: 2025-08-19
header-style: text
catalog: true
description: "A technical deep-dive into how we avoided a risky database migration by choosing an additive strategy for adding Simplified Chinese support to our Traditional Chinese implementation."
tags:
  - internationalization
  - database-migration
  - risk-management
  - production-deployment
  - locale-strategy
  - technical-decision-making
---

**Abstract:**  
When adding new language support to a production system, the choice between migration and additive strategies can make the difference between a smooth rollout and a potential disaster. Here's how we avoided a risky database migration by choosing to extend rather than replace our existing Traditional Chinese implementation.

**Estimated reading time:** _6 minutes_

# Locale Migration Strategy: When Adding Beats Replacing

I recently faced a classic engineering dilemma: how to add Simplified Chinese support to a system that already had Traditional Chinese implemented as `zh`. The obvious approach was to migrate everything to proper locale codes (`zh-TW` for Traditional, `zh-CN` for Simplified), but that would have required a database migration across 8 tables with production data.

Instead, we chose an additive strategy that kept the existing `zh` implementation intact while adding `zh-CN` as a new locale. This decision saved us from potential data loss, service disruption, and the complexity of rolling back a migration gone wrong.

---

## The Initial Approach: Full Migration Strategy

We started down the migration path with what seemed like the "correct" approach:

1. **Update locale configuration** from `["en", "zh", "th"]` to `["en", "zh-TW", "th"]`
2. **Rename all prompt files** from `*_zh.ts` to `*_zh-TW.ts`
3. **Update variable names** throughout the codebase from `zh` to `zhTW`
4. **Modify pathnames** to use `zh-TW` keys
5. **Update TypeScript interfaces** and switch statements

The migration script would have touched 8 database tables:

- `ai_provider_requests` (AI interaction logs)
- `classroom_sessions` (user sessions)
- `divination_sessions` (core app functionality)
- `group_divination_chat_messages` (collaboration data)
- `group_divination_readings` (shared results)
- `group_divination_requests` (group activities)
- `group_divination_topics` (content management)
- `scenario_responses` (user interactions)

**This was the moment we realized the scope of what we were attempting.**

---

## When Reality Hit: The Testing Error

During testing, a user encountered this error:

```
[GET TOPIC BY SLUG] Action called for slug: simulation-hypothesis-reality, locale: zh-TW
No active topic found for slug: simulation-hypothesis-reality, locale: zh-TW
```

The root cause was obvious: the database still contained `zh` records, but our code was now looking for `zh-TW` records. This mismatch would have required either:

1. **Immediate database migration** (risky in production)
2. **Rollback of all changes** (wasting development time)
3. **Hybrid approach** (complex and error-prone)

---

## The Technical Complexity We Avoided

### AI Provider Logging Impact

Our `aiProviderService.ts` logs every AI request with locale information. The `logAIProviderRequest()` function stores locale in the database, meaning any migration would affect:

- **Historical analytics data** - potentially breaking trend analysis
- **User session continuity** - existing users might lose their history
- **AI interaction logs** - critical for debugging and optimization

### Database Migration Scope

Eight tables across multiple domains meant:

- **Complex rollback procedures** if anything went wrong
- **Extended downtime** during migration
- **Data validation requirements** across all affected systems
- **Testing complexity** that scales exponentially with table count

### Production Safety Concerns

1. **Data integrity risk** - losing historical analytics data
2. **Rollback complexity** - difficult to revert if issues arise
3. **Service disruption** - potential downtime during migration
4. **Testing requirements** - extensive validation needed across all features

---

## The Decision: Additive Strategy

We chose to extend rather than replace:

- **Keep:** `zh` as Traditional Chinese (unchanged, existing users continue working)
- **Add:** `zh-CN` as Simplified Chinese (new functionality)
- **Benefit:** Zero downtime, no data migration, backward compatibility

The final configuration became:

```typescript
export const locales = ["en", "zh", "zh-CN", "th"] as const;
```

Where:

- `zh` = Traditional Chinese (existing users, Hong Kong market)
- `zh-CN` = Simplified Chinese (mainland China market)
- `en` = English
- `th` = Thai

---

## Why This Approach Was Superior

### Production Safety

- **Zero downtime** - no database migration required
- **No data loss risk** - existing user sessions remain valid
- **Immediate rollback** - if issues arise, we can simply disable `zh-CN`

### User Experience

- **Backward compatibility** - existing users continue using `zh`
- **Gradual adoption** - new users can choose `zh-CN` without affecting others
- **Market segmentation** - different locales serve different user segments

### Development Velocity

- **Faster implementation** - no migration planning or testing required
- **Lower risk** - can deploy incrementally and test thoroughly
- **Easier maintenance** - two separate implementations are clearer than migration logic

---

## Lessons Learned

### Technical Architecture

- **Locale changes require careful database migration planning** - e.g., retrieving locale specific data, or when AI logging is involved
- **AI logging makes locale consistency critical** - every request gets stored with locale information
- **TypeScript strict typing helps catch locale mismatches early** - but doesn't prevent runtime database issues

### Product Strategy

- **Additive > Migration** - when possible, extend rather than replace existing functionality
- **User impact assessment** - consider existing user base before making breaking changes
- **Market segmentation** - different locales often serve different user segments with different needs

### Implementation Principles

- **Risk assessment** - database scope changes require careful evaluation of production impact
- **Rollback planning** - always have a reversion strategy that doesn't require complex migrations
- **Testing strategy** - comprehensive validation across all affected systems is essential

---

## The Implementation Status

- ✅ **Decision made:** Additive strategy chosen
- ✅ **All migration changes reverted** via git (clean slate)
- 🔄 **Currently implementing:** `zh-CN` addition
- ⏳ **Pending:** Complete `zh-CN` implementation and testing

---

## Key Takeaways

1. **Migration strategies look correct but carry hidden risks** - especially when involving production databases
2. **AI logging systems make locale changes more complex** - every request gets stored with locale information
3. **Additive approaches often beat replacement strategies** - extend functionality rather than breaking existing
4. **Production safety should trump "correctness"** - a working system is better than a theoretically perfect but risky one
5. **Database migrations across multiple tables require extensive planning** - the complexity scales exponentially
6. **User experience continuity matters** - existing users shouldn't lose functionality during updates
7. **Market segmentation can justify multiple implementations** - different locales serve different user needs

The decision to use an additive strategy saved us from a potentially disastrous database migration while maintaining all existing functionality. Sometimes the "less correct" approach is the right one for production systems where stability and user experience matter more than theoretical purity.
