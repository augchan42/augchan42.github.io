---
layout: post
title: "How to Create an Interactive Typing Effect in React with Skip Animation Feature"
author: "Aug"
date: 2024-04-17
header-style: text
catalog: true
description: "A developer's notes and tips on implementing a smooth, multi-paragraph typing effect in React with a skip animation feature. Covers state management, DOM manipulation alternatives, event handling, and internationalization with react-i18next."
tags:
  - react
  - typing-effect
  - animation
  - react-hooks
  - useeffect
  - usestate
  - usecallback
  - dom-manipulation
  - event-handling
  - internationalization
  - react-i18next
  - frontend-development
---

(Notes for myself - you can check out the effect at 8bitoracle.ai)

Getting a typing effect to work properly can be quite challenging. I have a few paragraphs of text and wanted to create a typing effect for it, allowing the user to skip the animation. If a user presses a spacebar or clicks on a paragraph, the current paragraph should complete instantly, and the next one should begin typing.

A few tips:

1. Directly changing the page structure with DOM manipulation can often cause bugs. It is usually better to update HTML elements by changing their content or visibility through React's state.

2. It's simpler to create a typing effect by showing and hiding parts of the text, instead of actually typing out characters one by one or copying them from a hidden place.

Here are the main lessons from the code I used to create a typing effect in React. This effect works for several paragraphs and lets the user skip the animation at any time:

1. State Management:

   - Use the `useState` hook to manage the state of the current paragraph's index (`currentParagraphIndex`) and the number of characters currently visible (`visibleCharacters`).
   - Update these state variables as needed to control the typing and keep track of its progress.

2. Parsing Paragraphs:

   - Get the paragraphs from the `backstory` data. Use the selected language to pick the right text, using JavaScript's `Object.entries` and `map` methods.
   - Make an array of paragraph items. Each item should have an `id` and `text` to make them easier to show and manage.

3. Typing Effect:

   - Use the `useEffect` hook to control the typing effect based on the `visibleCharacters` and `currentParagraphIndex` state variables.
   - Use a timer (`setTimeout`) to slowly show more characters in the current paragraph.
   - After the current paragraph is fully typed, wait a moment and then start typing the next one.
   - To prevent problems (memory leaks), clear the timer if the component is removed or if its dependencies change.

4. Skipping Animation:

   - Create a `skipTypingAnimation` function. This lets the user skip the typing and see the whole current paragraph at once.
   - Use the `useCallback` hook to memoize this function (meaning React will reuse the same function instance if its dependencies haven't changed), which can help optimize performance.

5. Event Handlers:

   - Set up event handlers so that pressing a key (like spacebar) or touching/clicking the screen runs the `skipTypingAnimation` function.
   - Use `useEffect` hooks to add these event listeners when needed and remove them when not, based on certain conditions (dependencies).

6. Rendering:

   - Go through the `paragraphs` array and show each paragraph as a separate `<p>` HTML element.
   - Figure out which parts of each paragraph to show or hide. Use the `currentParagraphIndex` and `visibleCharacters` state values for this.
   - Show the visible text. For the current paragraph, also show a typing cursor. You can also include the hidden text but with a 'hidden' style so it's not seen until typed.
   - Make each paragraph clickable or touchable to let users skip the animation for that paragraph.

7. CSS Styling:

   - Use CSS classes to style the text, the cursor, and the hidden parts.
   - Use CSS animations or transitions to make the typing cursor blink.

8. Performance Optimization:

   - Use `useCallback` (for functions) and `useMemo` (for values) hooks to memoize parts of your component. This means React reuses them if their inputs haven't changed, preventing unnecessary recalculations and improving performance.
   - Make rendering faster by only updating the parts of the component that change when the state changes.

9. Internationalization:
   - Use the `useTranslation` hook from the `react-i18next` library to support different languages (internationalization).
   - Get the correct text translations from the `backstory` data, based on the chosen language.

By using these ideas, you can build a typing effect in React that works well, is interactive, and supports multiple languages.
