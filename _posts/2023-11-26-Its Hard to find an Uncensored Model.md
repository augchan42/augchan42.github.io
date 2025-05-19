---
layout: post
title: "The Challenge of Finding Uncensored AI Models"
author: "Aug"
date: 2023-11-26
header-style: text
catalog: true
description: "Exploring the difficulties in finding truly uncensored AI models. I discuss the influence of OpenAI's data and look at methods for fine-tuning base models to remove built-in limitations or refusals, mentioning my experiences with some specific models."
tags:
  - uncensored-ai
  - ai-model-training
  - huggingface-models
  - openai
  - gguf
  - ai-ethics
  - data-censorship
  - llm
  - model-finetuning
---

**Abstract:**  
This post explores the challenges of finding truly uncensored AI models, noting the influence of OpenAI's data and built-in "guardrail" limitations. It discusses methods for fine-tuning base models to remove such refusals, referencing Eric Hartford's approach, and shares the author's experience with some specific models, including one found to be particularly responsive.

**Estimated reading time:** _1 minute_

I've found that many AI models seem to be built using data that **comes** from OpenAI in some way. This data often includes "guardrails" – built-in limitations that **stop** the model from responding to certain types of prompts. This makes finding a truly uncensored model **very difficult**.

I **read** an interesting article by Eric Hartford that explains how to fine-tune a base AI model to remove these refusals:

[Uncensored Models by Eric Hartford](https://erichartford.com/uncensored-models) (I'll refer to this as the "Hartford method" below.)

The main idea behind the Hartford method is to retrain a foundational AI model (a "base model") using a dataset that has had all the "refusal" responses (where the model says it _can't_ answer) removed. The goal is to create a model that will answer **more openly**.

However, in my own tests with a model fine-tuned this way, I found it still wouldn't answer some questions I **asked**. I need to look more closely at the filtered dataset Eric Hartford used to understand why this might be happening.

On a related note, the most effective uncensored model I've personally **found** so far is [TheBloke/PiVoT-0.1-Evil-a-GGUF](https://huggingface.co/TheBloke/PiVoT-0.1-Evil-a-GGUF) on Hugging Face. This particular model doesn't require any special instructions (a "system prompt") **to respond**, and it seems willing to answer a very wide range of questions.
