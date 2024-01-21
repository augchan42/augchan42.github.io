## Playing with Haystack

According to their github:
>Haystack is an end-to-end LLM framework that enables you to build applications powered by LLMs, Transformer models, vector search and more. Whether you want to perform retrieval-augmented generation (RAG), documentation search, question answering or answer generation, you can use state-of-the-art embedding models and LLMs with Haystack to build end-to-end NLP applications to solve your use case.

Some tips on developing with [Haystack](https://github.com/deepset-ai/haystack):

1) There's two versions - 1.x and 2.x in beta.  If you fork from main, you are on the 2.x beta

2) The beta version is missing some things.  I just found out that it lacks memory context for building chatbots.
To me, this is a critical feature.  I was able to get 2.x to perform RAG against a set of custom PDF's, integrated
to Azure Form Recognizer pretty quickly, but once I started trying to make it more of a context aware chatbot
I quickly saw the need for memory, and this does not exist in 2.x yet.


3) The way I like to use open source frameworks is to fork them, then work with them directly in my IDE rather
than just installing and using it as a package.  This is because often times the docs are lacking or not clear, and
if there are any bugs you can just fix it and push the commit to your own fork, and offer it up as a PR if necessary
(after creating a feature branch of course)

4) If you are contributing to Haystack, you'll need to setup `mypy`+`black` linters, and `reno` for release notes.  Basically when creating a PR make sure all checks pass.

5) I'm not a python guy, I always thought dependencies were installed with `pip -r requirements.txt`, but for pyproject.toml
you install dependencies with `python -m pip install .`

6) To make sure you are using your forked Haystack and not one from the package, run `pip uninstall haystack-ai` to remove
the beta package and `pip uninstall farm-haystack` to remove any 1.x package.

7) To work on 1.x in your fork, you'll need to fetch all the upstream tags from your fork with `git fetch upstream --tags`,
then checkout the latest 1.x release.  For me that was `git checkout tags/v1.23.0`, then `git branch my-branch` to create
a new branch based on this release, and then `git status` to make sure your branch is up to date and you are not in 
any detached state.

    If you are in a detached state, `git checkout tags/v1.23.0` should reattach your head to that specific version.
