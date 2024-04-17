---
layout:       post
title:        "Smooth Typing Effect in React"
author:       "Aug"
header-style: text
catalog:      true
tags:
    - Smooth Typing
    - React
---

(Notes for myself - you can check out the effect at 8bitoracle.ai)

To achieve a smooth and error-free typing animation in your React component, several key requirements and adjustments were necessary:

1. **Use of [useRef](vscode-remote://wsl%2Bubuntu-20.04/home/hosermage/projects/8bitoracle-react/src/components/Title.js#1%2C51-1%2C51) for Interval ID**: 
   - Switching from [useState](vscode-remote://wsl%2Bubuntu-20.04/home/hosermage/projects/8bitoracle-react/src/components/Title.js#1%2C17-1%2C17) to [useRef](vscode-remote://wsl%2Bubuntu-20.04/home/hosermage/projects/8bitoracle-react/src/components/Title.js#1%2C51-1%2C51) for managing the typing interval ID ([typingIntervalId](vscode-remote://wsl%2Bubuntu-20.04/home/hosermage/projects/8bitoracle-react/src/components/Title.js#10%2C9-10%2C9)) was crucial. This change prevents unnecessary re-renders that [useState](vscode-remote://wsl%2Bubuntu-20.04/home/hosermage/projects/8bitoracle-react/src/components/Title.js#1%2C17-1%2C17) could cause and ensures that the interval ID can be accessed and modified directly without triggering component updates.

2. **Stable [clearTypingInterval](vscode-remote://wsl%2Bubuntu-20.04/home/hosermage/projects/8bitoracle-react#15%2C65-15%2C65) Function**:
   - Wrapping the [clearTypingInterval](vscode-remote://wsl%2Bubuntu-20.04/home/hosermage/projects/8bitoracle-react#15%2C65-15%2C65) function with [useCallback](vscode-remote://wsl%2Bubuntu-20.04/home/hosermage/projects/8bitoracle-react#14%2C226-14%2C226) without any dependencies ensures that it has a stable reference across renders. This stability is important for including it in dependency arrays of other [useEffect](vscode-remote://wsl%2Bubuntu-20.04/home/hosermage/projects/8bitoracle-react#14%2C70-14%2C70) or [useCallback](vscode-remote://wsl%2Bubuntu-20.04/home/hosermage/projects/8bitoracle-react#14%2C226-14%2C226) hooks without causing infinite loops or excessive executions.

3. **Direct Management of Interval with Ref**:
   - Directly managing the interval using the `.current` property of the [useRef](vscode-remote://wsl%2Bubuntu-20.04/home/hosermage/projects/8bitoracle-react/src/components/Title.js#1%2C51-1%2C51) object allows for starting, updating, and clearing the typing animation interval without relying on state updates. This approach simplifies the logic and avoids potential issues with asynchronous state updates.

4. **Proper Cleanup**:
   - Ensuring proper cleanup of the interval when the component unmounts or before starting a new typing animation prevents memory leaks and ensures that only one typing animation runs at a time. This is achieved by clearing the interval in the [clearTypingInterval](vscode-remote://wsl%2Bubuntu-20.04/home/hosermage/projects/8bitoracle-react#15%2C65-15%2C65) function and calling this function both in the cleanup phase of [useEffect](vscode-remote://wsl%2Bubuntu-20.04/home/hosermage/projects/8bitoracle-react#14%2C70-14%2C70) and before setting a new interval in the [typeEffect](vscode-remote://wsl%2Bubuntu-20.04/home/hosermage/projects/8bitoracle-react/src/components/Title.js#13%2C5-13%2C5) function.

5. **Conditional Rendering for Cursor**:
   - Implementing conditional rendering for the cursor ([|](vscode-remote://wsl%2Bubuntu-20.04/home/hosermage/projects/8bitoracle-react/src/index.css#1%2C2-1%2C2)) based on whether the displayed title matches the current title adds a dynamic aspect to the typing animation, making it more realistic.

6. **Handling Language Changes and User Interactions**:
   - Reacting to language changes (using `i18n.language` as a dependency) and user interactions (like keyboard events and clicks) dynamically by re-triggering the typing animation ensures that the component is responsive and interactive.

7. **Memoization of Functions**:
   - Using [useCallback](vscode-remote://wsl%2Bubuntu-20.04/home/hosermage/projects/8bitoracle-react#14%2C226-14%2C226) for functions like [getRandomTitle](vscode-remote://wsl%2Bubuntu-20.04/home/hosermage/projects/8bitoracle-react/src/components/Title.js#13%2C16-13%2C16) and [typeEffect](vscode-remote://wsl%2Bubuntu-20.04/home/hosermage/projects/8bitoracle-react/src/components/Title.js#13%2C5-13%2C5) with appropriate dependencies ensures that these functions are memoized and only recreated when necessary. This optimization prevents unnecessary re-executions of effects that depend on these functions.

By carefully managing the typing interval, ensuring function stability, and handling cleanup and user interactions appropriately, you can create a smooth and visually appealing typing animation in React. These adjustments and practices contribute to a more efficient and error-free implementation.
