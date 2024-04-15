---
layout:       post
title:        "Using Chainlink VRF for Divination"
author:       "Aug"
header-style: text
catalog:      true
tags:
    - VRF Verifiable Random Function
    - I-Ching, Hexgrams, Divination, Fortunetelling
---

I-Ching divination typically uses coin tosses or a yarrow stalk ceremony
to determine the yin yang lines that make up the hexagram.

I looked into using Chainlink VRF, which is an on-chain way of generating randomness.  Sounds cool, but it I ultimately decided against it for now.

Here's how it works:

> Chainlink VRF works by having smart contracts request randomness from the Chainlink network. The VRF service then generates a random number along with a cryptographic proof of how that number was determined. The smart contract can verify this proof on-chain before accepting the random number as valid, ensuring the process's integrity and fairness.

My problems with it:

From a normal end-perspective they have no way of evaluating or determining the difference between a trusted server and a decentralized network that somehow generates randomness.  They won't have the ability to make the distinction.

Gas needs to be paid to the blockchain network, and Link tokens need to be paid for the VRF call.

I would need to deploy smart contracts to call into Chainlink VRF, so added complexity.

So little to no apparent benefit to my end-user, but a lot of additional costs, wallet transactions (unless I deploy something even more complex like opengsn), and dev complexity.

Here's an AI generated (Claude) summary of alternative approaches:

Alternative approaches for generating randomness:

Pseudorandom number generators (PRNGs): You can use well-established PRNGs, such as the Mersenne Twister algorithm, to generate random numbers on your trusted server. PRNGs provide a deterministic sequence of numbers that appear random and can be suitable for most applications.

Cryptographically secure PRNGs (CSPRNGs): If you require a higher level of randomness, you can use CSPRNGs, which are designed to be unpredictable and suitable for cryptographic purposes. Examples include the Fortuna algorithm or the CSPRNG provided by the operating system's crypto library.

External randomness services: There are centralized services that provide random number generation APIs, such as Random.org or API Fortress. These services claim to generate randomness from atmospheric noise or other external sources. While they rely on trusting the service provider, they can be a simple alternative to decentralized solutions like Chainlink VRF.

Client-side randomness: If you want to give users more control and transparency, you can consider generating randomness on the client-side using JavaScript's built-in Math.random() function or more robust libraries like crypto.getRandomValues(). However, client-side randomness can be vulnerable to tampering and may not be suitable for critical applications.

