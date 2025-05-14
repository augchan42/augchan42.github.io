---
layout: post
title: "Exploring Fortune-Telling NFTs: Integrating I-Ching and Blockchain for Spiritual Insights"
author: "Aug"
date: 2024-03-04
header-style: text
catalog: true
description: "A project exploring the creation of Fortune-Telling NFTs by integrating I-Ching principles (Yin/Yang, Trigrams, Hexagrams) with blockchain technology. Discusses the cultural and personal motivations, the fortune-telling process, and potential Web3 integration."
tags:
  - nft
  - blockchain
  - i-ching
  - taoism
  - yin-yang
  - hexagrams
  - trigrams
  - generative-ai
  - solana
  - ethereum
  - digital-divination
  - web3
  - fortune-telling
  - chinese-culture
  - spirituality
  - cultural-heritage
---

My Dad was heavily into fortune-telling and the I-Ching. He did a lot of self study, and even some programming. I never
quite understood the fascination when I was younger, but now
that I get older, I get more humble about what I know and what is knowable. Fortune-telling requires recognition of some greater power that you can't fathom. For technical folks like me that's really off-putting, but now I'm ok with it.

I've gotten more curious about this whole area after my father's death. He had tons of writings in Chinese that I can't read, tons of partially read books that I've since given away, tons of stuff that I feel was left incomplete. That's part of the motivation for this project. I'd like to finish something that he would have really appreciated. That and I think it would be awfully cool.

**Understanding Yin/Yang lines, Trigrams, and Hexagrams**

One can think of the I-Ching as a 64 entry rainbow table. However, instead of decoding hashes to passwords, each I-Ching entry is a 6 bit hash of a divination(6 lines form a hexagram, each line can be broken-yin or solid-yang). Each hexagram has meaning - based on Taoist concepts of yin/yang, energy flow, and nature. Individual lines in a trigram are read from bottom to top. And the bottom trigram is read before the top to form a hexagram. There are 64 entries because 2^6 is 64.

The hexagram and line statements in the I-Ching are actually optional, if you understand the underpinnings. The broken line is yin which is receptive energy, the solid line is yang which is initiating energy. Contrary to belief, energy does not always flow from yang-solid lines to yin-broken lines (does day go to night, or night go to day?). Rather there is interplay and dynamism in how energy flows between yin/yang, and it's a cycle. It is continuous, dynamic and yin can transform to yang and vice versa.

The position of each line in a Trigram is also important:

Bottom Line - The foundation, youth, new beginnings. The root or base from which action starts.

Middle Line - The mediator, connector. Process, growth. The current state or heart of the matter.

Top Line - culmination/conclusion of the situation. Maturity, wisdom, final stages of the event. Leadership, authority. Represents the Consequences/outcomes/future direction derived from the previous two lines.

The lower trigram is read first and sets the stage (internal states), and the upper trigram represents culmination (outside world).

The imagery and symbolism associated with each trigram can also guide the understanding of energy flow. For example, if the wind (Xun) trigram is below the lake (Dui) trigram, this could symbolize gentle winds spreading over a lake's surface, suggesting a spread of influence or ideas in a calm and steady manner.

**Energy Flow in Conflict with the Situation**

If the flow of energy (as understood through the context of a specific situation or reading) is in conflict with the situation or question (e.g., strong yin in one hexagram, strong yang in the other), this can indicate imbalance, tension, or the need for transformation.

If the situation suggests that things should be evolving or progressing (such as moving from planning to action, or from inertia to change), but the hexagram presents a movement from yang to yin (action leading to passivity), this could highlight an imbalance or a warning. It might suggest that despite a natural inclination or need to move forward, there may be unexpected stagnation or a need for reconsideration.

Conversely, if the situation or question seems to call for stability or reflection, but the hexagram indicates a transition from yin to yang (reflectiveness moving to action), this might point out a premature push, a misunderstanding of the situation, or the need to shift from waiting to acting more swiftly than anticipated.

The I Ching is advising that the actual dynamics at play may be different from what is outwardly apparent or initially understood, urging a closer look at underlying factors or reassessment of one's actions or attitudes.

**Fortune Telling Process**

An animated version of the traditional yarrow stalk ritual is used to generate each line.

Animations depict the flow of energy for each line: smooth flows suggest harmony, while erratic ones indicate tension or conflict. This visual guide enhances your understanding of how each trigram interacts with your query.

The fortune is specific to the question and your 4 Pillars of Destiny and unfolds line by line, forming trigrams and eventually the complete hexagram. You ask your question and enter your birth hour/day/month/year. An animated yarrow stalk ritual is used to generate each line, and as each line is revealed there are animations showing energy flow. The energy flow can be either erratic or smooth depending on if the trigrams/hexagram is in-tune with the question. We can also display and animate changing vs static yin/yang lines differently.

The LLM can detect whether a question is in conflict or in harmony as the fortune progresses to the final hexagram. The energy flow can change behavior as the lines form the bottom trigram, then top trigram, and finally the complete hexagram. After considering any changing yin/yang lines, the hexagram can change again depending on the interplay between the question and changing lines.

As the reading progresses, preliminary interpretations accompany each line and trigram, gradually unveiling the wisdom of the I-Ching. Upon the formation of the final hexagram, a detailed interpretation reveals how the interplay of energies answers your question."

The reason for doing it this way is to teach the fundamentals of Taoism and the I-Ching, yin/yang, elements, and nature. And to better illustrate nature's rhythm through the I-Ching.

**Todos**

Develop prototype (specialized fortunetelling RAG on top of some LLM)

Think about web3 integration/nft collection supply/tokenomics (ERC-404, SPL-22)

**Appendix of Trigrams**

Qian (☰) - Heaven/Sky: Represents strength, creativity, and the initiating force. It is characterized by strong yang energy and is associated with the father, authority, and power. It symbolizes leadership, activity, and the principle of movement and expansion.

Dui (☱) - Lake/Marsh: Symbolizes joy, satisfaction, and openness. Associated with the youngest daughter, it represents the mouth and communication, suggesting openness, pleasure, and the outer world's beauty. Dui is about exchange, eloquence, and the joy derived from interactions and clarity.

Li (☲) - Fire: Represents light, warmth, and clarity. Associated with the middle daughter, it symbolizes the sun, enlightenment, and attachment. Li is about dependence, clarity, intelligence, and the capacity to purify and refine.

Zhen (☳) - Thunder: Symbolizes action, initiative, and movement. Associated with the eldest son, it represents arousal, motivation, and the will to take action. Zhen is about movement that brings about change, awakening, and the stirring of new beginnings.

Xun (☴) - Wind/Wood: Represents penetration, flexibility, and persistence. Associated with the eldest daughter, it symbolizes wood, which bends but does not break. Xun is about gentle influence, adaptability, and determination.

Kan (☵) - Water: Symbolizes danger, the unknown, and the abyss. Associated with the middle son, it represents the moon, hidden depths, and the unconscious. Kan is about facing challenges, exploring the unknown, and learning through experience.

Gen (☶) - Mountain: Represents stillness, stability, and rest. Associated with the youngest son, it symbolizes the mountain – unmoving and serene. Gen is about contemplation, stopping unnecessary movement, and maintaining inner and outer peace.

Kun (☷) - Earth: Represents receptivity, nourishment, and the mother. It is characterized by strong yin energy and symbolizes the earth, motherhood, and support. Kun is about acceptance, devotion, and the sustenance of life.
