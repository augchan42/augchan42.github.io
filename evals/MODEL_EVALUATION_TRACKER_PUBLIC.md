# LLM Model Evaluation Tracker (Multi-Language)

**Purpose:** Track model evaluations for 8-Bit Oracle
**Last Updated:** 2025-12-13

---

## Methodology: Vibe-Coded Evals with LLM-as-a-Judge

This evaluation tracker was built using **Claude Code** in combination with **8-Bit Oracle's OpenRouter infrastructure** — essentially "vibe coding" an eval framework.

### LLM-as-a-Judge Approach

Rather than traditional benchmarks, these evaluations use the **LLM-as-a-Judge** paradigm, where a strong language model evaluates outputs from other models against domain-specific criteria.

**Judge Model:** Claude Opus 4.5 (claude-opus-4-5-20251101) — the default model in Claude Code

The "LLM-as-a-Judge" concept was formalized in the paper ["Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena"](https://arxiv.org/abs/2306.05685) (Zheng et al., June 2023) by the LMSYS team at UC Berkeley. Their research demonstrated that strong LLMs like GPT-4 can achieve >80% agreement with human preferences.

More recently, Andrej Karpathy's [LLM Council](https://github.com/karpathy/llm-council) project expanded on this concept — using multiple models to judge each other anonymously and synthesize consensus answers. Karpathy noted that "models are surprisingly willing to select another LLM's response as superior to their own."

### Evaluation Workflow

1. **Test Prompts** — Domain-specific queries sent via OpenRouter to candidate models
2. **Output Collection** — Structured responses captured with latency/cost metrics
3. **Judge Evaluation** — Claude Opus 4.5 scores outputs on format compliance, content quality, and multi-language accuracy
4. **Aggregation** — Results compiled into tiered recommendations

This "vibe code" approach enabled rapid iteration on eval criteria while maintaining consistency through the Opus 4.5 judge baseline.

---

## Evaluation Summary

| Eval Date  | Locales           | Models Tested   | Best Performers                   | Notes                                                         |
| ---------- | ----------------- | --------------- | --------------------------------- | ------------------------------------------------------------- |
| 2025-11-28 | en                | 10              | Claude Haiku, Sonnet, Qwen 235B   | Initial baseline                                              |
| 2025-11-29 | zh                | 10              | Claude Haiku, GPT-5.1 (bilingual) | Traditional Chinese                                           |
| 2025-11-29 | zh-CN             | 10              | Claude Haiku, Qwen 235B           | Simplified Chinese                                            |
| 2025-11-29 | en, zh, zh-CN     | 4 Google        | Gemini 2.5 Flash, Gemini 3 Pro    | Gemini 3 Pro fastest (3.9s)                                   |
| 2025-11-29 | en, zh, th        | 3 Moonshot      | Kimi Linear 48B                   | Fast, cheap, excellent Chinese                                |
| 2025-11-29 | en, zh, th        | 5 Unified       | **Qwen 235B**                     | 🏆 Recommended default                                        |
| 2025-12-04 | en, zh, zh-CN, th | 1 Amazon (free) | —                                 | Not evaluable - data policy restrictions                      |
| 2025-12-04 | en, zh, zh-CN, th | 1 Amazon (paid) | Nova 2 Lite                       | Budget tier - good quality at $0.004                          |
| 2025-12-05 | en, zh, zh-CN, th | 1 xAI (paid)    | **Grok 4.1 Fast**                 | 🆕 Budget champion - $0.001, 7/10, ~14s                       |
| 2025-12-05 | en, zh, zh-CN, th | 1 IBM           | —                                 | ❌ Not recommended - 17-90s latency, 2.5/5 quality            |
| 2025-12-06 | en, zh, zh-CN, th | 1 Qwen          | **Qwen 235B 2507**                | 🆕 Ultra-budget champion - $0.0008, 7.5/10                    |
| 2025-12-06 | th                | 1 Google        | **Gemini 2.5 Flash Lite**         | 🚀 Speed Champion - ~0.9s EN/ZH, $0.0007                      |
| 2025-12-06 | en, zh, zh-CN, th | 1 DeepSeek      | —                                 | ❌ Not recommended - 12-178s latency, 75% timeout rate for TH |

---

## Quick Reference

| Priority              | Model                 | Cost    | Latency     | Quality          | Use Case                         |
| --------------------- | --------------------- | ------- | ----------- | ---------------- | -------------------------------- |
| 🏆 **Default**        | Qwen 235B             | $0.002  | ~13s        | ⭐⭐⭐¾ (7.5/10) | Best value across EN/ZH/TH       |
| Quality               | Claude Haiku          | $0.008  | ~14s        | ⭐⭐⭐⭐ (8/10)  | Quality benchmark                |
| Premium               | Claude Sonnet         | $0.025  | ~39s        | ⭐⭐⭐⭐½ (9/10) | Emotionally complex questions    |
| **🚀 Speed Champion** | Gemini 2.5 Flash Lite | $0.0007 | **~0.9s\*** | ⭐⭐⭐½ (7/10)   | 🆕 Sub-second EN/ZH (\*TH ~6s)   |
| **Budget Champion**   | Grok 4.1 Fast         | $0.001  | ~14s        | ⭐⭐⭐½ (7/10)   | Best budget option (EN-primary)  |
| Speed Niche           | Gemini 3 Pro          | $0.020  | ~4s         | ⭐⭐⭐½ (7/10)   | Sub-5s latency only (10x cost)   |
| **Ultra-Budget**      | Qwen 235B 2507        | $0.0008 | ~10-17s\*   | ⭐⭐⭐¾ (7.5/10) | 🏆 Same quality, 60% cheaper     |
| Budget                | Kimi Linear 48B       | $0.0013 | ~6.5s       | ⭐⭐⭐ (6/10)    | Fast + cheap + excellent Chinese |
| Budget                | Nova 2 Lite           | $0.004  | ~10s        | ⭐⭐⭐¼ (6.5/10) | Overshadowed by Grok             |
| ❌ Not Viable         | Granite 4.0 H Micro   | $0.0002 | 17-90s      | ⭐⭐½ (2.5/5)    | Too slow + quality issues        |

_\*Latency varies by provider — some models require provider filtering for consistent performance_

---

## All Evaluated Models

### Tier 1: Production Ready

| Model                                            | Quality   | Emotional Depth | Latency     | Cost/Req    | Chinese      | Thai  |
| ------------------------------------------------ | --------- | --------------- | ----------- | ----------- | ------------ | ----- |
| **qwen/qwen3-vl-235b-a22b-instruct**             | Excellent | ★★★★ (7.5/10)   | ~13s        | **$0.002**  | Native ★★★★★ | ★★★★  |
| anthropic/claude-haiku-4.5                       | Excellent | ★★★★ (8/10)     | ~14s        | $0.008      | Excellent    | ★★★★+ |
| anthropic/claude-sonnet-4.5                      | Excellent | ★★★★★ (9/10)    | ~39s        | $0.025      | Excellent    | —     |
| google/gemini-2.5-flash-preview-09-2025          | Excellent | ★★★★ (7/10)     | ~11s        | $0.004      | Excellent    | —     |
| **google/gemini-2.5-flash-lite-preview-09-2025** | Good      | ★★★½ (7/10)     | **~0.9s\*** | **$0.0007** | Excellent    | Good  |

_\*Gemini 2.5 Flash Lite: ~0.9s for EN/ZH/ZH-CN, ~6s for Thai_

### Tier 2: Strong Alternatives

| Model                         | Quality            | Emotional Depth | Latency       | Cost/Req    | Chinese      | Notes                                   |
| ----------------------------- | ------------------ | --------------- | ------------- | ----------- | ------------ | --------------------------------------- |
| **qwen/qwen3-235b-a22b-2507** | Excellent (7.5/10) | ★★★★            | **~10-17s\*** | **$0.0008** | Native ★★★★★ | Ultra-budget - 60% cheaper than default |
| **x-ai/grok-4.1-fast**        | Good (7/10)        | ★★★½            | **~14s**      | **$0.001**  | Good (7/10)  | Budget champion - 50% cheaper than Qwen |

_Tier 2 is selective - only models with quality ≥7/10 AND good value proposition_

### Tier 3: Budget & Speed Options

| Model                                   | Quality       | Latency   | Cost/Req | Chinese   | Thai | Notes                          |
| --------------------------------------- | ------------- | --------- | -------- | --------- | ---- | ------------------------------ |
| google/gemini-3-pro-preview             | Good (7/10)   | **~3.9s** | $0.020   | Excellent | —    | Speed champion (10x Qwen cost) |
| openai/gpt-5.1-chat                     | Good (7/10)   | ~8s       | $0.016   | Strong    | —    | Bilingual output               |
| moonshotai/kimi-linear-48b-a3b-instruct | Good (6/10)   | **~6.5s** | $0.0013  | Excellent | Good | Fast + cheap + native Chinese  |
| deepseek/deepseek-v3.1-terminus         | Mid (6.5/10)  | ~18s      | $0.0014  | Mid       | —    | Budget backup                  |
| amazon/nova-2-lite-v1                   | Good (6.5/10) | **~10s**  | $0.004   | Good      | Good | Overshadowed by Grok           |
| qwen/qwen3-vl-30b-a3b                   | Mid           | ~12s      | $0.0018  | Mid       | —    | Missing headers sometimes      |
| openai/gpt-5.1-codex-mini               | Mid           | ~7s       | $0.005   | Mid       | —    | Mechanical tone                |
| google/gemma-3-27b-it:free              | Adequate      | ~1.1s     | FREE     | Mixed     | —    | Tag problems, free tier        |

### Tier 4: Not Recommended

| Model                               | Quality      | Latency     | Cost/Req | Issue                                     |
| ----------------------------------- | ------------ | ----------- | -------- | ----------------------------------------- |
| **deepseek/deepseek-v3.2**          | Good (7/10)  | **12-178s** | $0.001   | ❌ Too slow + unreliable (75% TH timeout) |
| **moonshotai/kimi-k2-0905**         | Good (7/10)  | **~35s**    | $0.0038  | ❌ Too slow for production                |
| moonshotai/kimi-k2-thinking         | Excellent    | ~50s        | $0.004   | ❌ Too slow for production                |
| **ibm-granite/granite-4.0-h-micro** | Poor (2.5/5) | **17-90s**  | $0.0002  | ❌ Too slow + quality issues              |
| qwen/qwen3-vl-8b                    | Lower        | ~45s        | $0.001   | ❌ Too slow for quality level             |
| baidu/ernie-4.5-vl-424b-a47b        | Lower        | ~18s        | $0.003   | ❌ Formatting issues                      |

---

## Pricing Reference (OpenRouter API-verified 2025-12-05)

| Model                                        | Input $/1M | Output $/1M | Est. Cost/Request\* |
| -------------------------------------------- | ---------- | ----------- | ------------------- |
| **qwen/qwen3-235b-a22b-2507**                | **$0.071** | **$0.463**  | **$0.0008** 🆕      |
| **qwen/qwen3-vl-235b-a22b-instruct**         | **$0.20**  | **$1.20**   | **$0.002** 🏆       |
| **x-ai/grok-4.1-fast**                       | **$0.20**  | **$0.50**   | **$0.0009** 🆕      |
| **ibm-granite/granite-4.0-h-micro**          | **$0.02**  | **$0.11**   | **$0.0002** ❌      |
| anthropic/claude-haiku-4.5                   | $1.00      | $5.00       | $0.008              |
| anthropic/claude-sonnet-4.5                  | $3.00      | $15.00      | $0.025              |
| google/gemini-3-pro-preview                  | $2.00      | $12.00      | $0.020              |
| google/gemini-2.5-flash-preview-09-2025      | $0.30      | $2.50       | $0.004              |
| google/gemini-2.5-flash-lite-preview-09-2025 | $0.10      | $0.40       | $0.0007             |
| openai/gpt-5.1-chat                          | $1.25      | $10.00      | $0.016              |
| deepseek/deepseek-v3.1-terminus              | $0.22      | $0.80       | $0.0014             |
| **deepseek/deepseek-v3.2**                   | **$0.28**  | **$0.40**   | **$0.001** ❌       |
| moonshotai/kimi-linear-48b-a3b-instruct      | $0.50      | $0.60       | $0.0013             |
| amazon/nova-2-lite-v1                        | $0.30      | $2.50       | $0.004              |
| google/gemma-3-27b-it:free                   | $0.00      | $0.00       | FREE                |

_Estimated based on ~800 input tokens, ~1500 output tokens per request_

---

## Quality Criteria

### Output Format Compliance

- Structured output with analysis and answer sections
- Proper formatting and headers
- Domain-specific tags/markers as required

### Content Quality

1. **Direct Answer** - Clear, actionable response
2. **Domain Knowledge** - Accurate interpretation of context
3. **Practical Guidance** - Specific, actionable steps

### Multi-Language Quality

- Correct character set (Traditional 繁體 vs Simplified 简体)
- Natural phrasing (not machine-translated)
- Cultural appropriateness

---

## Key Findings

### Speed vs Cost Trade-offs

| Strategy          | Model                 | Latency | Cost    | Quality |
| ----------------- | --------------------- | ------- | ------- | ------- |
| **Sub-second**    | Gemini 2.5 Flash Lite | 0.9s    | $0.0007 | 7/10    |
| **Balanced**      | Qwen 235B             | 13s     | $0.002  | 7.5/10  |
| **Ultra-budget**  | Qwen 235B 2507        | 10-17s  | $0.0008 | 7.5/10  |
| **Quality-first** | Claude Haiku          | 14s     | $0.008  | 8/10    |
| **Premium**       | Claude Sonnet         | 39s     | $0.025  | 9/10    |

### Multi-Language Performance

| Model             | English | Chinese | Thai  | Notes                       |
| ----------------- | ------- | ------- | ----- | --------------------------- |
| Qwen 235B         | ★★★★    | ★★★★★   | ★★★★  | Best overall multi-language |
| Claude Haiku      | ★★★★    | ★★★★    | ★★★★+ | Consistent quality          |
| Grok 4.1 Fast     | ★★★★    | ★★★½    | ★★★½  | EN-primary, good value      |
| Kimi Linear       | ★★★½    | ★★★★★   | ★★★½  | Native Chinese, fast        |
| Gemini Flash Lite | ★★★★    | ★★★★    | ★★★   | Sub-second EN/ZH            |

### Provider Variance (Critical Finding)

**Same model, different providers = vastly different latency**

Example: Qwen 235B 2507 across providers

- Fast providers: 10-17s
- Slow providers: 50-118s

**Key insight:** When using model aggregators like OpenRouter, provider selection can be more important than model selection for latency-sensitive applications.

---

## Change Log Highlights

### 2025-12-06

- **DeepSeek V3.2** — ❌ Not recommended (12-178s latency, 75% Thai timeout)
- **Gemini 2.5 Flash Lite** — 🚀 Promoted to Tier 1 Speed Champion (~0.9s)
- **Qwen 235B 2507** — ✅ Ultra-budget champion ($0.0008, same 7.5/10 quality)

### 2025-12-05

- **Grok 4.1 Fast** — Budget champion ($0.001, 7/10, ~14s)
- **IBM Granite 4.0 H Micro** — ❌ Not recommended (17-90s latency)
- Major pricing update from OpenRouter API

### 2025-11-29

- **Qwen 235B** promoted to production default
- Unified multi-language evaluation (EN/ZH/TH) completed
- Thai language quality verified across models
