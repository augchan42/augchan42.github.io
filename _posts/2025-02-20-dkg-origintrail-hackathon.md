---
layout: post
title: "DKG OriginTrail Integration - Consensus HK 2025 Hackathon Win"
date: 2025-02-20
description: "Integrated OriginTrail DKG with Eliza AI and a custom divination backend, enabling on-chain persistence of divinations via a Telegram bot."
tags:
  [
    DKG,
    OriginTrail,
    AI,
    Blockchain,
    Hackathon,
    Telegram,
    JSON-LD,
    SPARQL,
    NodeJS,
  ]
---

In Feb 2025, our project integrating OriginTrail's Decentralized Knowledge Graph (DKG) with a custom divination backend secured a win at the Consensus HK 2025 Hackathon. I led the development and enhancement of this novel system, which enables the persistence of divinations on-chain, accessible and managed via a Telegram bot.

The official announcement of our win can be found on [OriginTrail's Twitter post](https://x.com/origin_trail/status/1892543087479505352). At the time of the event, my Twitter handle was `dao_codepath`; it has since been updated to `hosermage_`.

The project repository can be found on GitHub: [https://github.com/augchan42/pix-origintrail](https://github.com/augchan42/pix-origintrail)

### Project Summary & Key Contributions:

This project enables the persistence of divinations on-chain, accessible and managed via a Telegram bot. Key contributions and recent advancements include:

- **Robust DKG Integration:** Significantly refactored and improved the DKG's JSON-LD generation process. This involved implementing structured data mapping for enhanced clarity and validation (introducing a `DivinationData` interface) and streamlining error handling, particularly for data flowing from the divination oracle.
- **Enhanced Reliability and Observability:** Implemented comprehensive logging and improved error handling mechanisms across DKG actions and data providers. This includes detailed logging for SPARQL query construction and a more resilient JSON-LD generation pipeline with retries and validation checks, crucial for ensuring the integrity of on-chain data.
- **Streamlined Development & Operations:** Updated package dependencies, refined logging configurations, and improved the debug start script to optimize the development workflow. The DKG constants schema was restructured for better clarity, and critical parameters like the DKG insert timeout were adjusted for operational stability.
- **Documentation and Maintenance:** Updated project documentation (README) and maintained repository hygiene (e.g., .gitignore updates).

This work focused on building a resilient and efficient pipeline to capture AI-generated divinations, structure them for the DKG, and reliably persist them on-chain, ultimately making them accessible through a user-friendly Telegram bot interface.
