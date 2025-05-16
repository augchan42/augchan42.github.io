---
layout: post
title: "Key Contributions to ai16z Eliza AI Project (Nov 2024)"
date: 2024-11-15
description: "Detailing significant enhancements to the ai16z Eliza AI project, focusing on local-first capabilities, model optimization, and backend stability."
tags:
  [AI, LLM, Embeddings, Python, Ollama, Claude-3-Haiku, Postgres, Open-Source]
---

In November 2024, as a top 20 contributor to the [ai16z Eliza project](https://github.com/augchan42/eliza), my work on the ai16z Eliza project involved a major update focused on enhancing its capabilities, particularly around local-first functionality and overall performance.

The core of this update is captured in commit [`638eac6`](https://github.com/augchan42/eliza/commit/638eac67a83bd3346bb48ae5d5921857f44cf980), which introduced several key improvements:

### Developing Local-First Capabilities and Performance

I implemented support for BGE-Small and Ollama embeddings, enabling high-quality semantic understanding with reduced reliance on external APIs. This offers significant benefits for privacy, cost-reduction, and offline capability. The system was designed to be flexible, allowing embedding choices to be configured via environment variables (`USE_OPENAI_EMBEDDING`, `USE_OLLAMA_EMBEDDING`), defaulting to local/self-hosted options.

Strategically, the core language model was upgraded to Claude 3 Haiku. This transition was driven by its superior price-performance ratio, offering a 4x cost reduction compared to its predecessor while demonstrating better instruction-following capabilities.

### Key Changes in Commit `638eac6`

1.  **Enhanced Embedding Options:**

    - **Local BGE-Small Embeddings:** Added support for local BGE-Small embeddings, noted as providing "~70-80% of OpenAI quality."
    - **Ollama Embeddings Support:** Integrated Ollama, allowing the use of various locally run models for embeddings (e.g., "mxbai-embed-large").
    - **Environment Variable Configuration:** Made embedding choices configurable, prioritizing local/self-hosted options.

2.  **Language Model Update:**

    - **Switched to Claude 3 Haiku:** Replaced the previous model, achieving:
      - 4x cheaper cost.
      - Better instruction following.
      - Improved overall price/performance ratio.

3.  **Improved Connectivity and Reliability:**

    - **Postgres Connectivity:** Enhanced Postgres database connectivity and reliability.
    - **Transcription Error Handling:** Fixed error handling in the transcription service.

This work aimed to make the Eliza project more robust, cost-effective, and adaptable to various operational environments, particularly those prioritizing data control and local processing.

[View Commit on GitHub](https://github.com/augchan42/eliza/commit/638eac67a83bd3346bb48ae5d5921857f44cf980)
