---
layout:       post
title:        "Exploring Divination Techniques: Chainlink VRF vs. Traditional Randomness Methods"
author:       "Aug"
header-style: text
catalog:      true
tags:
    - Chainlink VRF
    - Divination Techniques
    - I-Ching Hexagrams
    - Cryptographic Randomness
    - Blockchain in Divination
    - Smart Contracts
    - Random Number Generation
    - Spiritual Technology
    - Yin Yang Symbolism
    - Secure Randomness Methods
---

I-Ching divination typically uses coin tosses or a yarrow stalk ceremony
to determine the yin yang lines that make up the hexagram.

I looked into using Chainlink VRF, which is an on-chain way of generating randomness.  Sounds cool, but it I ultimately decided against it for now.

Here's how it works:

> Chainlink VRF works by having smart contracts request randomness from the Chainlink network. The VRF service then generates a random number along with a cryptographic proof of how that number was determined. The smart contract can verify this proof on-chain before accepting the random number as valid, ensuring the process's integrity and fairness.

My problems with it:

Normal end users have no way of evaluating or determining the difference between a trusted server and a decentralized network that somehow generates randomness.  They won't have the ability to make the distinction.

Calling Chainlink VRF requires Gas for the underlying blockchain, and Link tokens to be paid for the VRF call.

I would need to deploy smart contracts to call into Chainlink VRF, which adds complexity.

So little to no apparent benefit to end-users, but a lot of additional costs, wallet transactions (unless I deploy something even more complex like opengsn), and dev complexity.

Here's an AI generated (Claude) summary of alternative approaches:

Alternative approaches for generating randomness:

Pseudorandom number generators (PRNGs): You can use well-established PRNGs, such as the Mersenne Twister algorithm, to generate random numbers on your trusted server. PRNGs provide a deterministic sequence of numbers that appear random and can be suitable for most applications.

Cryptographically secure PRNGs (CSPRNGs): If you require a higher level of randomness, you can use CSPRNGs, which are designed to be unpredictable and suitable for cryptographic purposes. Examples include the Fortuna algorithm or the CSPRNG provided by the operating system's crypto library.

External randomness services: There are centralized services that provide random number generation APIs, such as Random.org or API Fortress. These services claim to generate randomness from atmospheric noise or other external sources. While they rely on trusting the service provider, they can be a simple alternative to decentralized solutions like Chainlink VRF.

Client-side randomness: If you want to give users more control and transparency, you can consider generating randomness on the client-side using JavaScript's built-in Math.random() function or more robust libraries like crypto.getRandomValues(). However, client-side randomness can be vulnerable to tampering and may not be suitable for critical applications.

Some GPT4 Generated sample code that incorporates changing lines:

To incorporate changing lines into your I-Ching hexagram generator, you can extend the basic random hexagram generation method. In I-Ching, each line of a hexagram can be in one of four states:

1. **Old Yin (0)**: Represented as a broken line that changes into a solid line (yang).
2. **Young Yang (1)**: Represented as a solid line that does not change.
3. **Young Yin (2)**: Represented as a broken line that does not change.
4. **Old Yang (3)**: Represented as a solid line that changes into a broken line (yin).

The changing lines (Old Yin and Old Yang) are what lead to the creation of a second hexagram. Here's how you can generate a hexagram with the possibility of changing lines, and thus, an optional second hexagram:

```javascript
function generateIChingHexagram() {
  let hexagram = [];
  let changingLines = [];

  for (let i = 0; i < 6; i++) {
    // Generate a random state for each line (0 to 3)
    const lineState = Math.floor(Math.random() * 4);
    hexagram.push(lineState);

    // Determine if the line is changing
    if (lineState === 0 || lineState === 3) {
      changingLines.push(i); // Store the index of the changing line
    }
  }

  // Convert the hexagram to its visual representation
  const visualHexagram = hexagram.map(line => {
    switch (line) {
      case 0: return "—  —"; // Old Yin
      case 1: return "———"; // Young Yang
      case 2: return "—  —"; // Young Yin
      case 3: return "———"; // Old Yang
    }
  }).join("\n");

  // Generate the second hexagram if there are changing lines
  let secondHexagram = null;
  if (changingLines.length > 0) {
    secondHexagram = hexagram.map((line, index) => {
      if (changingLines.includes(index)) {
        // Change Old Yin to Young Yang and Old Yang to Young Yin
        return line === 0 ? "———" : "—  —";
      }
      // Keep the original line for non-changing lines
      return line === 1 || line === 3 ? "———" : "—  —";
    }).join("\n");
  }

  return {
    firstHexagram: visualHexagram,
    secondHexagram: secondHexagram
  };
}

const result = generateIChingHexagram();
console.log("First Hexagram:\n" + result.firstHexagram);
if (result.secondHexagram) {
  console.log("\nSecond Hexagram (due to changing lines):\n" + result.secondHexagram);
}
```

This solution generates a hexagram where each line has a random state (0 to 3). It then maps these states to their visual representations. If there are changing lines (Old Yin or Old Yang), it also generates a second hexagram by changing Old Yin to Young Yang and Old Yang to Young Yin, as per I-Ching principles.

This approach provides a complete divination experience, reflecting the dynamic nature of I-Ching readings with the inclusion of changing lines and the generation of a subsequent hexagram.

Here's a more secure version using crypto.getRandomValues()

```javascript
function generateIChingHexagramSecure() {
  let hexagram = [];
  let changingLines = [];

  // Create a Uint8Array to hold 6 random values
  const randomBytes = new Uint8Array(6);
  // Fill the array with cryptographically secure random numbers
  window.crypto.getRandomValues(randomBytes);

  for (let i = 0; i < 6; i++) {
    // Map the random byte to a value between 0 and 3
    const lineState = randomBytes[i] % 4;
    hexagram.push(lineState);

    // Determine if the line is changing
    if (lineState === 0 || lineState === 3) {
      changingLines.push(i); // Store the index of the changing line
    }
  }

  // Convert the hexagram to its visual representation
  const visualHexagram = hexagram.map(line => {
    switch (line) {
      case 0: return "—  —"; // Old Yin
      case 1: return "———"; // Young Yang
      case 2: return "—  —"; // Young Yin
      case 3: return "———"; // Old Yang
    }
  }).join("\n");

  // Generate the second hexagram if there are changing lines
  let secondHexagram = null;
  if (changingLines.length > 0) {
    secondHexagram = hexagram.map((line, index) => {
      if (changingLines.includes(index)) {
        // Change Old Yin to Young Yang and Old Yang to Young Yin
        return line === 0 ? "———" : "—  —";
      }
      // Keep the original line for non-changing lines
      return line === 1 || line === 3 ? "———" : "—  —";
    }).join("\n");
  }

  return {
    firstHexagram: visualHexagram,
    secondHexagram: secondHexagram
  };
}

const result = generateIChingHexagramSecure();
console.log("First Hexagram:\n" + result.firstHexagram);
if (result.secondHexagram) {
  console.log("\nSecond Hexagram (due to changing lines):\n" + result.secondHexagram);
}
```
