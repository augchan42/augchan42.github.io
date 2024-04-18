---
layout:       post
title:        "Smooth Typing Effect in React"
author:       "Aug"
header-style: text
catalog:      true
tags:
    - Smooth Typing
    - React
    - Internationalization
---

(Notes for myself - you can check out the effect at 8bitoracle.ai)

Getting a typing effect working properly is pretty hard.  A few tips:

1) DOM Manipulation is frequently buggy, so you are best off updating the html elements themselves.

2) It's easier to simulate a typing effect using hidden/visible rather than trying to 
actually generate characters or copy them from a hidden data element.

Here are the key lessons learned from the provided code for implementing a typing effect in React, applied to mulitple paragraphs of text with a way to skip animation at any time:

1. State Management:
   - Use the `useState` hook to manage the state of the current paragraph index (`currentParagraphIndex`) and the number of visible characters (`visibleCharacters`).
   - Update the state variables accordingly to control the typing effect and track the progress.

2. Parsing Paragraphs:
   - Extract the paragraphs from the `backstory` object based on the selected language using `Object.entries` and `map`.
   - Create an array of paragraph objects with `id` and `text` properties for easier rendering and tracking.

3. Typing Effect:
   - Use the `useEffect` hook to control the typing effect based on the `visibleCharacters` and `currentParagraphIndex` state variables.
   - Set a timeout to gradually increase the number of visible characters for the current paragraph.
   - Move to the next paragraph after a delay when the current paragraph is fully typed.
   - Clear the timeout when the component unmounts or the dependencies change to avoid memory leaks.

4. Skipping Animation:
   - Implement a `skipTypingAnimation` function to allow the user to skip the typing animation and immediately reveal all characters of the current paragraph.
   - Use the `useCallback` hook to memoize the function and optimize performance.

5. Event Handlers:
   - Add event handlers for keyboard and touch events to trigger the `skipTypingAnimation` function.
   - Use `useEffect` hooks to attach and remove the event listeners based on the relevant dependencies.

6. Rendering:
   - Map over the `paragraphs` array to render each paragraph as a separate `<p>` element.
   - Determine the visible and hidden parts of each paragraph based on the `currentParagraphIndex` and `visibleCharacters` state variables.
   - Render the visible text, the typing cursor for the current paragraph, and optionally, the hidden text with a 'hidden' class.
   - Add click and touch event handlers to each paragraph to allow skipping the animation.

7. CSS Styling:
   - Apply appropriate CSS classes to style the text content, cursor, and hidden text.
   - Use CSS animations or transitions to create a blinking effect for the typing cursor.

8. Performance Optimization:
   - Use `useCallback` and `useMemo` hooks to memoize functions and values that don't need to be recomputed on every render.
   - Optimize the rendering by only updating the necessary parts of the component based on state changes.

9. Internationalization:
   - Utilize the `useTranslation` hook from the `react-i18next` library to handle internationalization.
   - Extract the appropriate translations from the `backstory` object based on the selected language.

These are the main lessons learned from the provided code. By understanding and applying these concepts, you can create a typing effect component in React that is efficient, interactive, and supports internationalization.
