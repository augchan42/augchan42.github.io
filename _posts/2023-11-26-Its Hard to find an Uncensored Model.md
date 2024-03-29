---
layout:       post
title:        "Its Hard to find an Uncensored Model"
author:       "Aug"
header-style: text
catalog:      true
tags:
    - AI
    - LLM
    - Huggingface
    - GPT
    - GGUF
    - Uncensored
---
Turns out most models are based on data from OpenAI somehow, and this data has guardrails.

Found this post on how to finetune a base model after removing all refusals:

[Based post on making uncensored models](https://erichartford.com/uncensored-models)

The basic idea is to train from the base model, but the dataset needs to have all refusals/guardrails removed first.
Then voila, your model is uncensored!

However, from my testing, it was still censored on things I wanted to ask, so I'll need to look into Eric Hartfords
filtered dataset further to see why.

BTW, best uncensored model I've found is [Pivot Evil](https://huggingface.co/TheBloke/PiVoT-0.1-Evil-a-GGUF).  This requires no special system prompt and will pretty much answer any question...
