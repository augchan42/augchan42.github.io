---
layout: post
title: "Building a Smarter AI Agent with Haystack 1.x: My Journey with RAG and Custom Pipelines"
author: "Aug"
date: 2024-02-01
header-style: text
catalog: true
description: "My experience implementing Retrieval Augmented Generation (RAG) and AI Agents with Haystack 1.x. I cover conversational memory, creating custom data pipelines using FAISS DocumentStore, integrating Google Search, and the challenges of incrementally indexing new knowledge."
tags:
  - retrieval-augmented-generation
  - rag
  - haystack-framework
  - ai-agents
  - faiss
  - vector-database
  - google-search-integration
  - llm
  - nlp
  - custom-pipelines
  - data-indexing
  - conversational-ai
---

**Abstract:**  
This post details the author's experience implementing Retrieval Augmented Generation (RAG) and AI Agents using Haystack 1.x. It covers the setup of conversational memory, the creation of custom data pipelines utilizing a FAISS DocumentStore for local knowledge and integrating Google Search for external information. Key challenges discussed include the nuances of incrementally indexing new knowledge from web searches back into the local vector database and managing potentially inconclusive answers.

**Estimated reading time:** _5 minutes_

One of the most powerful ways to make Large Language Models (LLMs) more useful for specific tasks is through **Retrieval Augmented Generation (RAG)**. In simple terms, RAG is any process that feeds relevant, domain-specific information to an LLM right before it generates a response. This lets you enhance an LLM with new knowledge – say, from your company's documents or live web results – without costly and time-consuming model retraining. The main constraint is the LLM's maximum context size, which dictates how much information you can provide at once.

Combine RAG with the concept of an **AI Agent**, and things get even more interesting. In the context of [Haystack](https://github.com/deepset-ai/haystack), an Agent uses an LLM's reasoning capabilities to figure out what steps (or "Tools") are needed to answer a question or complete a task, and then it executes those steps.

I've been working on building such a system using Haystack 1.x, and here's a look at my setup, some of the technical details, and what I've learned along the way.

**Core Components in My Haystack 1.x Setup**

For this project, I specifically used Haystack 1.x because, at the time, it had more mature support for Agents and conversational memory compared to the 2.x beta. Key components included:

- **Agent:** `ConversationalAgent` – This agent is designed for multi-turn conversations.
- **Chat Memory:** `ConversationSummaryMemory` – This helps the agent remember the gist of the current conversation, providing context for follow-up questions.

**Crafting Custom Pipelines for Information Flow**

I set up a couple of custom pipelines to handle how information was retrieved and processed:

1.  **Web QA & Indexing Pipeline (`WebQAPipeline`):**

    - This custom pipeline was designed to first search the web for an answer.
    - A neat trick I added: It also **indexes the original query and the LLM-generated answer (based on the web document) back into my local `FAISSDocumentStore`**. The goal here is for the system to learn from its web searches.

2.  **Local Knowledge Retrieval Pipeline:**
    - This pipeline performs a similarity search against my local `FAISSDocumentStore` to find relevant documents.
    - It then uses a `PromptNode` with Haystack's `question_answering_with_references` prompt template to generate an answer based on these retrieved local documents.
    - My `FAISSDocumentStore` (a type of vector database that stores data in a way that's efficient for similarity searches) uses `cosine` similarity to compare text. The text is converted into numerical representations (embeddings) using the `intfloat/e5-base-v2` embedding model.

**The Nuances of Indexing New Knowledge in FAISS**

Getting new documents written to the `FAISSDocumentStore` and making them immediately available for search requires a few specific steps in Haystack 1.x:

```python
# Assuming 'document_store' is your FAISSDocumentStore instance
# and 'new_documents' is a list of Haystack Document objects

# 1. Write the new documents
document_store.write_documents(new_documents)

# 2. Update the embeddings in the store so the new documents can be found
document_store.update_embeddings(retriever) # 'retriever' is your configured embedding retriever

# 3. Save the document store (persists changes if it's disk-based)
document_store.save("path_to_my_faiss_store.faiss")
```

Without `update_embeddings`, your new documents might be written but won't show up in similarity searches.

**Designing the Agent's Logic and Tool Use**

My `ConversationalAgent` was set up with two primary `Tool`s to find answers:

1.  **Local FAISS Search Tool:** Performs a similarity search against the local vector database.
2.  **Google Search Tool:** Uses Google Search to find external information. Haystack integrates nicely with services like [serper.dev](https://serper.dev) for this. This tool was also enhanced with the logic to index its findings back into the local FAISS database, as mentioned earlier.

A fascinating aspect of Haystack's `ConversationalAgent` is that its decision-making logic is heavily influenced by a `prompt_template`. I customized this template to instruct the Agent to:

- Try the local database tool _first_.
- If no sufficient answer is found locally, then use the Google Search tool.

The idea is that as the agent answers more questions using Google and indexes those findings, the local database should become progressively "smarter" and more capable of answering questions directly, reducing reliance on external searches.

The `ConversationalAgent` tries to find a conclusive final "Answer." By default, it might try up to 5 times, using its available tools, before giving up and replying with an "Inconclusive" message if it can't find a satisfactory answer.

**Challenges: The Trouble with Indexing Inconclusive Answers**

My approach to incrementally indexing new information from Google searches into the local FAISS store had a flaw:

- If the Agent performed a Google search but the information retrieved didn't lead to a conclusive, satisfactory answer from the LLM, that less-than-perfect generated response (based on the Google search) would still get indexed into the local FAISS database.
- This means if the same (or a very similar) question was asked again, the local database would retrieve this previously generated inconclusive answer. The agent would likely still deem it insufficient, and another Google search would be triggered for the same question.
- Because LLM responses are generative (they can be slightly different each time), this could lead to multiple, slightly varied, inconclusive answers for the same underlying query being indexed.
  The difficulty is that I don't know _at the time of indexing_ whether the information retrieved from a Google search will ultimately lead to a conclusive answer by the LLM. That only becomes apparent after the search results are processed by the LLM.

**Planned Future Improvements**

To address these challenges, I'm considering a few improvements:

1.  **More Deterministic Google Search Indexing:** Make the content indexed from Google searches less generative (perhaps by indexing summaries of the source web pages rather than an LLM's answer _about_ them) to avoid polluting the database with slightly different inconclusive answers to the same core query.
2.  **Enhanced Metadata:** Add more metadata to the documents indexed from Google searches. This would allow for better filtering (e.g., if searching about Bali, I can filter out travel insurance info for the Philippines that might have been indexed from a previous, less related query).
3.  **Refine Agent Search Strategy:** Adjust the Agent's logic so it doesn't necessarily try 5 times. Perhaps trying each available `Tool` once thoroughly is sufficient before concluding.

**Exploring the Code**

If you're interested in the nitty-gritty, you can find the relevant code for this setup in my [Haystack fork on GitHub](https://github.com/augchan42/haystack), specifically in these files:

```
examples/tb_conversational_agent.py
examples/tb_faiss.py
haystack/utils/tb_faiss.py
```

This journey with Haystack, RAG, and AI Agents has been a fantastic learning experience, revealing both the power of these tools and the subtle complexities in making them truly robust and intelligent.
