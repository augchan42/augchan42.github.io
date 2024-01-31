---
layout:       post
title:        "Agents and RAG on Haystack"
author:       "Aug"
header-style: text
catalog:      true
tags:
    - RAG
    - Vector DB
    - Haystack
    - Google Search
    - FAISS
---
What's RAG (Retrieval Augmented Generation)?

I define RAG as any process that adds domain specific or proprietary context to the prompt being sent to your LLM.  This means you can enhance your LLM with additional knowledge without any expensive finetuning.  Of course, that means the available context size that your LLM can handle will determine how smart you can make the LLM with additional info sent in the prompt.

What's an AI Agent?

For Haystack an Agent uses the smarts and knowledge of an LLM to determine the actions needed to complete a task, and then executes them.  

Some pointers on using Agents in [Haystack](https://github.com/deepset-ai/haystack):

1) Only 1.x supports Agents and Chat memory.

2) I used:

Agent + Chat Memory: `ConversationalAgent`, `ConversationSummaryMemory`

Pipelines: 

A custom `WebQAPipeline` that also indexes the query + generated answer using the retrieved web document into my `FAISSDocumentStore`.  

A custom pipeline that performs a faiss similarity search to retrieve relevant documents, then uses a PromptNode with `question_answering_with_references` prompt template to return an answer.  The `FAISSDocumentStore` uses `cosine` similarity with `intfloat/e5-base-v2` embedding model.

It can be tricky to actually save new documents and have them available for similarity search in the vector db, you need to do the following steps:

    ```
    document_store.write_documents
    document_store.update_embeddings
    document_store.save
    ```

3) The Agent is setup with two `Tool`s to find answers - one that uses Google search (now enhanced with logic to index anything it finds in the local vector db) and another that does a similarity search against the local vector FAISS db.  I customized the Agent logic (by customizing the `prompt_template` used in the `ConversationalAgent` - it's wild) to use the tools in sequence, and to try to find answers in the local database before searching Google.  With the custom indexing logic I added, the local db should slowly get smarter with new information and if the same question is asked again, the local db should be able to handle it.

BTW Haystack integrates with [serper.dev](https://serper.dev) for Google searches.

4) The Agent works by trying to find a conclusive final Answer.  The `ConversationalAgent` defaults to try up to 5 times among the tools it has to try to arrive at a final Answer.  If it can't it will reply with an 'Inconclusive'.  This is controlled by the `prompt_template` provided to the `ConversationalAgent` configuration.

5) There are some deficiencies with my approach to incrementally new information in the local FAISS vector db:

If a conclusive answer isn't found from the Google search, the response will still get indexed.  This means that the local FAISS vector still won't have a conclusive answer either, and a Google search would be fired for the same question again.  Which then indexes another inconclusive answer (as it's generative and slightly different from the previous inconclusive answer)

6) Future improvements:  

I will make the responses from the Google searches more deterministic (likely by eliminating the generative portion) so that I can avoid creating new documents for the same search results to the same questions over and over.

I will add some more metadata to the indexed google responses so that I can filter irrelevant information more easily (e.g., I don't need travel insurance info for the Philippines if I'm doing a search on Bali)

For the code, please check the following at my [github](https://github.com/augchan42/haystack):

```
examples/tb_conversational_agent.py
examples/tb_faiss.py
haystack/utils/tb_faiss.py
```