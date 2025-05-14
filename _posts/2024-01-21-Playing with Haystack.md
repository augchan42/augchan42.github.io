---
layout: post
title: "Exploring Haystack: Building Advanced NLP Applications with LLMs and Vector Search"
author: "Aug"
date: 2024-01-21
header-style: text
catalog: true
description: "My practical tips and experiences from working with the Haystack LLM framework. I cover version differences (1.x vs. 2.x beta), the benefits of developing with a forked repository, managing Python dependencies for projects like this, and how to contribute back to open-source."
tags:
  - haystack-framework
  - llm
  - nlp
  - vector-search
  - retrieval-augmented-generation
  - python-development
  - open-source
  - git
  - chatbot-development
  - document-search
  - dependency-management
---

I've been diving into [Haystack](https://github.com/deepset-ai/haystack) recently, an end-to-end LLM (Large Language Model) framework that lets you build some pretty advanced NLP (Natural Language Processing) applications. As their GitHub page describes it:

> Haystack is an end-to-end LLM framework that enables you to build applications powered by LLMs, Transformer models, vector search and more. Whether you want to perform retrieval-augmented generation (RAG), documentation search, question answering or answer generation, you can use state-of-the-art embedding models and LLMs with Haystack to build end-to-end NLP applications to solve your use case.

It's a powerful tool, and as I've been getting my hands dirty with it, I've gathered a few practical tips that might be helpful if you're also starting out or looking to contribute.

**1. Understanding Haystack Versions: 1.x vs. 2.x Beta**
When you first approach Haystack, be aware there are two main versions: the stable 1.x and a newer 2.x version (which was in beta when I was working with it). If you fork the `main` branch from their GitHub repository, you'll likely be on the 2.x beta.

**2. Beta Version Feature Gaps (e.g., Chatbot Memory)**
The 2.x beta version, while promising, might not have all the features of 1.x. For instance, I discovered it was missing "memory context." This is a really important feature if you want to build chatbots that can remember earlier parts of your conversation.
I was able to get Haystack 2.x to perform RAG (Retrieval Augmented Generation – where the model retrieves relevant information from your documents before answering a question) with a set of my custom PDFs, and integrating it with Azure Form Recognizer was quite quick. However, when I tried to make it more of a context-aware chatbot, the lack of conversation memory in 2.x became a clear limitation at the time.

**3. Tip: Work with a Fork for Deeper Understanding and Contributions**
My preferred way to use open-source frameworks like Haystack is to "fork" their repository (create my own copy on GitHub). Then, I work with that local copy directly in my code editor (IDE), rather than just installing the official pre-built package (e.g., via `pip install`).
Why do I do this?

- **Clearer Understanding:** Documentation can sometimes be unclear or miss details. Working with the source code directly helps me understand how things _really_ work.
- **Bug Fixes:** If I find a bug, I can fix it directly in my fork.
- **Contributing Back:** If the fix is useful, I can then create a "feature branch" in my fork, commit my changes, and offer it back to the main Haystack project as a Pull Request (PR).

**4. Contributing to Haystack: Setup Linters and Release Notes**
If you plan to contribute code back to Haystack, you'll need to set up your development environment according to their guidelines. This typically includes:

- **Linters:** Tools like `mypy` (for static type checking) and `black` (for code formatting) to ensure your code meets their quality standards.
- **Release Notes Tool:** They use a tool called `reno` for managing release notes.
  Essentially, before you submit a Pull Request, make sure all the automated checks and tests pass.

**5. Python Dependencies with `pyproject.toml`**
Coming from a non-Python-centric background, I was most familiar with installing dependencies using a `requirements.txt` file (`pip install -r requirements.txt`). However, Haystack, like many modern Python projects, uses a `pyproject.toml` file to manage its dependencies and project settings.
To install dependencies for such projects (including Haystack itself in an "editable" mode so your changes are reflected), you typically run this command from the root directory of your forked Haystack repository:

```bash
python -m pip install .
```

For all optional dependencies, the command is:

```bash
python -m pip install '.[all]'
```

**6. Ensuring You're Using Your Forked Version**
To make absolutely sure your project is using the Haystack code from your local fork (and not a version installed globally or in another virtual environment), it's a good idea to uninstall any existing Haystack packages:

- For the 2.x beta: `pip uninstall haystack-ai`
- For the 1.x version: `pip uninstall farm-haystack`

**7. Working with Stable 1.x Releases in Your Fork**
If you need to work with a specific stable 1.x release instead of the main (beta) branch:

1.  **Fetch Tags:** First, make sure your local fork knows about all the release "tags" from the original Haystack repository (which they call `upstream` if you've set it up as a remote).
    ```bash
    git fetch upstream --tags
    ```
    _(You might need to add `upstream` as a remote first: `git remote add upstream https://github.com/deepset-ai/haystack.git`)_
2.  **Checkout Tag:** Find the tag for the release you want (e.g., `v1.23.0`) and check it out. This might put you in a "detached HEAD" state, which is okay for creating a branch.
    ```bash
    git checkout tags/v1.23.0
    ```
3.  **Create Branch:** Create a new local branch based on this release tag.
    ```bash
    git checkout -b my-1.23-branch
    ```
4.  **Verify:** Use `git status` to make sure you're on your new branch and it's tracking the correct code. If you were in a "detached HEAD" state, creating a branch like this attaches your HEAD to the new branch.

**8. Install Your Forked 1.x Version with Dependencies**
Once you're on the branch for the 1.x version you want to work with:

1.  **Upgrade Pip:** It's always good practice: `pip install --upgrade pip`
2.  **Install Editable with Extras:** Install Haystack in editable mode with all its optional dependencies. This should ideally be done within a Python virtual environment to keep your project dependencies isolated.
    ```bash
    pip install -e '.[all]'
    ```
    _(The `-e` flag means "editable," so changes you make in your local Haystack fork's code will be used when you run your project)._

Working with complex frameworks like Haystack can be a learning curve, but by diving into the code and setting up your environment correctly, you can get a lot out of them and even contribute back to the community. Hope these tips help!
