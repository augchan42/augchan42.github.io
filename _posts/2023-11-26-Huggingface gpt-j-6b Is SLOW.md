---
layout: post
title: "Speed Up GPT-J-6B: From Minutes to Seconds with GGML Conversion"
author: "Aug"
date: 2023-11-26
header-style: text
catalog: true
description: "A guide on dramatically improving GPT-J-6B inference speed. I'll show you how I converted a Hugging Face model from its standard format to GGML, slashing wait times from minutes to seconds on my own machine. Covers the conversion process, memory needs, and running the optimized model."
tags:
  - gpt-j
  - llm
  - inference-speed
  - huggingface
  - ggml
  - gguf
  - model-conversion
  - performance-optimization
  - python
  - local-llm
---

**Abstract:**  
This post serves as a guide to dramatically improve the inference speed of the GPT-J-6B language model on a local machine. It details the author's experience converting a Hugging Face `float16` model to the GGML format, which reduced response times from minutes to under 20 seconds. The process covers memory requirements for conversion, the steps to convert the model using `convert-h5-to-ggml.py`, building the necessary `gpt-j` executable from the `ggml` repository, and running the optimized model. A note on the newer GGUF format and an unsuccessful attempt to convert GPT-J to GGUF is also included.

**Estimated reading time:** _6 minutes_

If you've ever tried to get a large language model like EleutherAI's GPT-J-6B (from Hugging Face) to generate text on your own computer, you might have faced the same problem I did. This process, called "inference," can be incredibly slow. I was waiting 15 to 30 minutes just for the model to load and produce a response to my prompts! This was on my ThinkPad X1 Carbon (Gen 11) with 64GB of RAM, so my computer was powerful enough. This performance was too slow for any practical use.

## The GGML Solution: A Massive Speed Boost

Then I discovered a technique that made it much faster: converting the model to the **GGML format**. GGML is a file format created by Georgi Gerganov (ggerganov). It's designed to help large AI models run faster, especially on regular computer CPUs.

I converted the standard `float16` version of the GPT-J-6B model to this GGML format. The `float16` version uses 16-bit floating-point numbers for its internal calculations. Importantly, I did this without any further "quantization" (a process that can shrink models but sometimes reduce accuracy). The results were very impressive.
Response times dropped sharply from many minutes to **under 20 seconds**. The text generation speed was then about **400 milliseconds per token** (a token is roughly a word or part of a word). This made a crucial difference for me!

Here's how I did it, and how you can too.

## Step 1: Convert Your GPT-J Model to GGML Format

First, you'll need to convert the `pytorch_model.bin` file (which is how Hugging Face often stores these models) into the `.bin` GGML format.

**Important Note on Memory:** This conversion uses a lot of RAM (computer memory). I initially tried it in my WSL (Windows Subsystem for Linux) environment on a laptop with 32GB of RAM, but WSL itself was limited to only 16GB. The conversion program kept stopping suddenly (it showed a "Killed" message).
I had success by running the Python conversion script directly in the Windows Command Prompt (cmd.exe). This allowed the process to use the full 32GB of system RAM. Looking at the Task Manager, the script used about 24GB of RAM during the conversion. So, make sure the system you use for conversion has plenty of memory – likely 24GB or more for GPT-J-6B.

**Files You'll Need:**
To run the conversion, you'll need the main model file (usually `pytorch_model.bin` or a similar `.bin` or `.safetensors` file if you're using `float16`) and a few essential configuration files from the Hugging Face repository.

1.  Go to the Hugging Face model page for GPT-J-6B, for example, [EleutherAI/gpt-j-6b](https://huggingface.co/EleutherAI/gpt-j-6b).
2.  Navigate to the "Files and versions" tab.
3.  **Crucially**, if you're using the `float16` version (which I highly recommend for a balance of performance and quality before GGML conversion), select the `float16` branch from the branches dropdown. If you are using a different precision (like `main` for `float32`), select that branch.
4.  Download the following files into a dedicated folder for your model (e.g., `models/my-gpt-j-float16`):
    - `pytorch_model.bin` (or the equivalent for your chosen precision, like `model-00001-of-00002.bin` if sharded)
    - `config.json`
    - `vocab.json`
    - `added_tokens.json` (if present)

These files give the conversion program information about the model's structure and the words it uses.

**Running the Conversion Script:**
Once you have all the necessary files in your model's folder (e.g., `C:\models\my-gpt-j-float16\` or `~/models/my-gpt-j-float16/`), you'll use the `convert-h5-to-ggml.py` script from ggerganov's `ggml` repository.

1.  **Get the script**: If you don't have it, clone the `ggml` repository:
    ```bash
    git clone https://github.com/ggerganov/ggml
    ```
2.  **Run the script**: Run the Python script, telling it the location of your model's folder. The final argument `1` tells the script you're converting a `float16` model. If you were converting a `float32` model, you'd use `0`.
    ```bash
    python3 ./ggml/examples/gpt-j/convert-h5-to-ggml.py ./models/my-gpt-j-float16 1
    ```
    _(Adjust the paths like `./ggml/...` and `./models/...` to match where you cloned `ggml` and where your model folder is located relative to your current directory)._

The output will show the script processing different parts (called "variables") of the model:

```text
Processing variable: transformer.h.27.ln_1.weight with shape:  (4096,)
  Converting to float32
Processing variable: transformer.h.27.ln_1.bias with shape:  (4096,)
  Converting to float32
... (many similar lines) ...
Processing variable: lm_head.bias with shape:  (50400,)
  Converting to float32
Done. Output file: C:\\models\\my-gpt-j-float16/ggml-model-f16.bin
```

The script will save the converted model as `ggml-model-f16.bin` (if you converted `float16`) inside your model's folder.

## Step 2: Build the GPT-J Executable

Now that you have your model in GGML format, you need a program to use it. The `ggml` repository includes example code that you can compile (build) into an executable program for this.

**Important:** You will probably need a Linux-like system (such as Linux itself, macOS, or WSL on Windows) to build this. I did this part in WSL.

1.  Navigate into the `ggml` directory you cloned earlier.
2.  Create a build directory and move into it:
    ```bash
    cd ggml
    mkdir build && cd build
    ```
3.  Use `cmake` to prepare the build (this tool checks your system and prepares the files for building):
    ```bash
    cmake ..
    ```
4.  Compile the code. The `make` command builds the programs. For example, `make -j4` tells it to use 4 processor cores to build faster (you can change the number 4). We're specifically building the `gpt-j` tool:
    ```bash
    make -j4 gpt-j
    ```
    This will create several executable files in the `ggml/build/bin/` directory, including one named `gpt-j`.

## Step 3: Run Inference with Your GGML Model!

Now you're ready! You can use the `gpt-j` executable you just built to load your converted GGML model and generate text.

Run it from your terminal like this:

```bash
# Example from within the ggml/build/bin directory:
./gpt-j -m ~/models/my-gpt-j-float16/ggml-model-f16.bin -p "What is the meaning of life?"

# Or, if your executable is elsewhere, use the full path to gpt-j:
# ~/ggml/build/bin/gpt-j -m ~/models/my-gpt-j-float16/ggml-model-f16.bin -p "What is the meaning of life?"
```

Replace `~/models/my-gpt-j-float16/ggml-model-f16.bin` with the correct path to _your_ converted model file, and `"What is the meaning of life?"` with your desired prompt.

You should see the model load, then your prompt, and finally the generated text:

```text
> What is the meaning of life?

The meaning of life is to find out what the meaning of life is.


main: mem per token = 15550964 bytes # Memory used per token
main:     load time =  5256.00 ms    # Time to load the model
main:   sample time =    33.95 ms    # Time for sampling strategy
main:  predict time = 95766.09 ms / 467.15 ms per token # Total prediction time and per-token speed
main:    total time = 101924.70 ms   # Total time for the whole operation
```

The performance numbers show its speed. The "ms per token" value is a key measure of how fast text is generated.

## A Note on GGUF: The Newer Format

It's worth mentioning that Georgi Gerganov has since developed an even newer model format called **GGUF**. GGUF is designed to be an improvement on GGML. It offers better model information (metadata), is easier to extend, and provides better compatibility with future model designs. Many tools, like `llama.cpp` (also from ggerganov), now mainly use GGUF.

When I worked on this (in late 2023), GGUF mostly supported Llama-type models. There are scripts to convert GGML models to GGUF, like [`convert-llama-ggml-to-gguf.py`](https://github.com/ggerganov/llama.cpp/blob/master/convert-llama-ggml-to-gguf.py) in the `llama.cpp` repository.

However, when I tried to convert my GPT-J GGML model to GGUF, I ran into an error. Here's the command I used and the traceback:

```text
C:\projects\llama.cpp>python convert-llama-ggml-to-gguf.py -i c:\Models\gpt4chan_model_float16\ggml-model-f16.bin -o c:\models\gpt4chan_model_float16\gguf-model-f16.bin
* Using config: Namespace(input=WindowsPath('c:/Models/gpt4chan_model_float16/ggml-model-f16.bin'), output=WindowsPath('c:/models/gpt4chan_model_float16/gguf-model-f16.bin'), name=None, desc=None, gqa=1, eps='5.0e-06', context_length=2048, model_metadata_dir=None, vocab_dir=None, vocabtype='spm')

=== WARNING === Be aware that this conversion script is best-effort. Use a native GGUF model if possible. === WARNING ===

- Note: If converting LLaMA2, specifying "--eps 1e-5" is required. 70B models also need "--gqa 8".
* Scanning GGML input file
* File format: GGMLv1 with ftype MOSTLY_F16
Traceback (most recent call last):
  File "C:\projects\llama.cpp\convert-llama-ggml-to-gguf.py", line 445, in <module>
    main()
  File "C:\projects\llama.cpp\convert-llama-ggml-to-gguf.py", line 419, in main
    offset = model.load(data, 0)  # noqa
  File "C:\projects\llama.cpp\convert-llama-ggml-to-gguf.py", line 181, in load
    offset += vocab.load(data, offset, hp.n_vocab)
  File "C:\projects\llama.cpp\convert-llama-ggml-to-gguf.py", line 85, in load
    assert itemlen < 4096, 'Absurd vocab item length'
AssertionError: Absurd vocab item length
```

The error `AssertionError: Absurd vocab item length` suggested the script was not compatible with my GPT-J model's vocabulary. This is likely because the script is specifically for Llama models, as its name indicates. So, for GPT-J, GGML was the best option I found at the time to achieve this speedup.

For newer models, particularly Llama-based ones, you should consider GGUF first.

## Conclusion: GGML Improves GPT-J Speed

Converting my GPT-J-6B model to GGML significantly increased its speed on my local machine, from painfully slow to impressively fast. If you're experiencing similar slow performance with GPT-J, I highly recommend trying this conversion process.

A big thank you to [ggerganov](https://github.com/ggerganov) for creating `ggml` and these tools that make running large models much more accessible!
