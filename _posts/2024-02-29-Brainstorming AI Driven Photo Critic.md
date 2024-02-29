---
layout:       post
title:        "Brainstorming an AI Photo Critic"
author:       "Aug"
header-style: text
catalog:      true
tags:
    - AI
    - Photo Critic
    - multi-modal
    - 
    - 
---

How would you build a service that allows you to upload a photo
for an AI to analyze and give feedback and critiques on it?

**Choosing a Model - CNN vs CLIP vs LLM or.... All?**

App Architecture aside (for prototyping will probably just use npx create-llama) the most important decision will be how to structure the AI processing.  We all know about LLMs and multi-modal LLMs which can recognize photos and audio in addition to text.  But from my experience, it's always better to reduce and refine what needs to be processed upfront before having the LLM work on it.

An AI Photo Critic is a specialized use case of Retrieval Augmented Generation if
you think about it.  The system requires some specific domain knowledge on what makes a good or bad photo.  It needs to know what to focus on in the photo.  It would be useful for the system to recognize what's in the photo (people, food, pets, landscape) and the general attributes of the photo before applying a critique.  

There should be multiple phases of metadata extraction - from simple to complex:

Basic Metadata:
- filename, resolution, camera make and model, colors, gps

Convolutional Neural Networks (CNNs):
- Scene recognition (what's in the photo (monument), what is the setting (Eiffel Tower)
- Location (e.g., Paris - if available from landmarks)
- Face detection, features, expressions

CLIP (Contrastive Language-Image Pre-training) developed by OpenAI:
- Image Captioning - generate descriptive text for a given image
- Aesthetic Eval/Classification - photographer/artist style
- Type of Photo - landscape/urban/portrait
- Outlier detection - unusual subject matter, unconventional composition

The above is part of the context that would be sent to a smart, reasoning Instruct capable LLM.

LLMs:
- Generating a coherent critique based on the RAW findings from the above
- Reason on aesthetics, complementary colors
- Understanding cultural significance (notes on Paris/Eiffel Tower)
- Chatting and back and forth for the critique


**Todos**

CNN investigation - VGGNet, ResNet, Inception

LLM investigation - VLMax, LLava 32B, Cogvlm, Bard

CLIP investigation - OpenAI - maybe I can just use this for the prototype?

