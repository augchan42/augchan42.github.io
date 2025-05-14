---
layout: post
title: "Exploring Divination Techniques: Chainlink VRF vs. Traditional Randomness Methods"
author: "Aug"
date: 2024-04-15
header-style: text
catalog: true
description: "An analysis of using Chainlink VRF for I-Ching divination, comparing it to traditional methods and other randomness generation techniques like PRNGs and client-side randomness. Discusses pros, cons, and includes JavaScript examples for hexagram generation with changing lines."
tags:
  - chainlink-vrf
  - i-ching
  - divination
  - randomness
  - blockchain
  - smart-contracts
  - cryptography
  - javascript
  - prng
  - csprng
  - hexagrams
  - spiritual-technology
  - yin-yang
---

To tell fortunes with the I-Ching, people usually toss coins or use yarrow stalks. This helps them find the yin and yang lines that create a hexagram (a six-line symbol).

I looked into using Chainlink VRF, which is a way to create randomness directly on the blockchain. It's an interesting idea, but I ultimately decided against it for now.

Here's how Chainlink VRF works:

> Chainlink VRF works by having smart contracts request randomness from the Chainlink network. The VRF service then generates a random number along with a cryptographic proof of how that number was determined. The smart contract can verify this proof on-chain before accepting the random number as valid, ensuring the process's integrity and fairness.

My problems with using it for this purpose:

Most users cannot tell the difference between a trusted server and a decentralized network that creates random numbers. They won't be able to distinguish how the randomness is generated.

Using Chainlink VRF costs "Gas" (fees for the blockchain) and also Link tokens (another type of payment) for the VRF call.

I would need to set up smart contracts to use Chainlink VRF, which makes things more complicated.

So, it offers little or no clear benefit to users for this specific application, but it adds many extra costs, requires wallet actions (unless I set up something even more complex like opengsn), and makes development harder.

Here's an AI-generated (Claude) summary of alternative ways to generate randomness:

Alternative approaches for generating randomness:

Pseudorandom number generators (PRNGs): You can use known PRNGs, like the Mersenne Twister algorithm, to create random numbers on your server. PRNGs create a set sequence of numbers that look random and work well for most uses.

Cryptographically secure PRNGs (CSPRNGs): If you need much better randomness, use CSPRNGs. They are made to be unpredictable and are good for security uses. Examples are the Fortuna algorithm or the CSPRNG that comes with your computer's security software.

External randomness services: Some companies offer services (APIs) that give you random numbers, like Random.org or API Fortress. These services say they create randomness from things like atmospheric noise. Although you need to trust the service provider, they can be a simple option instead of decentralized solutions like Chainlink VRF.

Client-side randomness: If you want users to have more control and see how it works, you can create randomness in the user's web browser. You can use JavaScript's built-in `Math.random()` function or stronger tools like `crypto.getRandomValues()`. However, client-side randomness can be changed by users and might not be good for important uses.

Some GPT4-Generated sample code that incorporates changing lines:

To include changing lines in your I-Ching hexagram generator, you can modify the basic random hexagram generation method. In I-Ching, each line of a hexagram can be in one of four states:

1.  **Old Yin (0)**: A broken line that changes into a solid line (yang).
2.  **Young Yang (1)**: A solid line that does not change.
3.  **Young Yin (2)**: A broken line that does not change.
4.  **Old Yang (3)**: A solid line that changes into a broken line (yin).

The changing lines (Old Yin and Old Yang) are what lead to creating a second hexagram. Here's how you can generate a hexagram with possible changing lines, and therefore, an optional second hexagram:

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
  const visualHexagram = hexagram
    .map((line) => {
      switch (line) {
        case 0:
          return "—  —"; // Old Yin
        case 1:
          return "———"; // Young Yang
        case 2:
          return "—  —"; // Young Yin
        case 3:
          return "———"; // Old Yang
      }
    })
    .join("\n");

  // Generate the second hexagram if there are changing lines
  let secondHexagram = null;
  if (changingLines.length > 0) {
    secondHexagram = hexagram
      .map((line, index) => {
        if (changingLines.includes(index)) {
          // Change Old Yin to Young Yang and Old Yang to Young Yin
          return line === 0 ? "———" : "—  —";
        }
        // Keep the original line for non-changing lines
        return line === 1 || line === 3 ? "———" : "—  —";
      })
      .join("\n");
  }

  return {
    firstHexagram: visualHexagram,
    secondHexagram: secondHexagram,
  };
}

const result = generateIChingHexagram();
console.log("First Hexagram:\n" + result.firstHexagram);
if (result.secondHexagram) {
  console.log(
    "\nSecond Hexagram (due to changing lines):\n" + result.secondHexagram
  );
}
```

This code creates a hexagram. Each line gets a random state (0 to 3). Then, it changes these states into the lines you see (like solid or broken lines). If any lines are "changing lines" (Old Yin or Old Yang), the code also creates a second hexagram. It does this by changing Old Yin to Young Yang, and Old Yang to Young Yin, following I-Ching rules.

This method gives a full divination reading. It shows the active nature of I-Ching by including changing lines and creating a second hexagram.

Here's a more secure version using `crypto.getRandomValues()`:

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
  const visualHexagram = hexagram
    .map((line) => {
      switch (line) {
        case 0:
          return "—  —"; // Old Yin
        case 1:
          return "———"; // Young Yang
        case 2:
          return "—  —"; // Young Yin
        case 3:
          return "———"; // Old Yang
      }
    })
    .join("\n");

  // Generate the second hexagram if there are changing lines
  let secondHexagram = null;
  if (changingLines.length > 0) {
    secondHexagram = hexagram
      .map((line, index) => {
        if (changingLines.includes(index)) {
          // Change Old Yin to Young Yang and Old Yang to Young Yin
          return line === 0 ? "———" : "—  —";
        }
        // Keep the original line for non-changing lines
        return line === 1 || line === 3 ? "———" : "—  —";
      })
      .join("\n");
  }

  return {
    firstHexagram: visualHexagram,
    secondHexagram: secondHexagram,
  };
}

const result = generateIChingHexagramSecure();
console.log("First Hexagram:\n" + result.firstHexagram);
if (result.secondHexagram) {
  console.log(
    "\nSecond Hexagram (due to changing lines):\n" + result.secondHexagram
  );
}
```
