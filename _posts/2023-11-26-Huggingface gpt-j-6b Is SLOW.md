---
layout:       post
title:        "Boosting GPT-J Performance: Converting to GGML for Rapid Inference"
author:       "Aug"
header-style: text
catalog:      true
tags:
    - GPT-J Optimization
    - GGML Conversion
    - Huggingface Transformers
    - AI Model Speed
    - Machine Learning Efficiency
    - Python Scripting
    - Model Conversion Techniques
    - AI Inference Acceleration
    - GGUF Format
    - LLM Performance Improvement
---
I've been trying to run inference on a model based on EleutherAI/gpt-j-6B from Huggingface, and it was super slow!
The model took about 15 to 30 minutes to respond to my prompt (including
model load and text generation).  I'm on an X1 carbon gen 11with 64GB of RAM.  Simply unacceptable.

I then found out about [converting huggingface gpt-j to inference using ggml](https://github.com/ggerganov/ggml/blob/master/examples/gpt-j/convert-h5-to-ggml.py).  
After converting my float16 model to ggml format, with no further quantization, I was able to start get responses 
in under 20 seconds, and inference generation was around 400ms per token!

First, you'll need to convert your gpt-j pytorch_model.bin to ggml format.  This will require a fair amount of memory.
I found out my WSL environment on my 32GB laptop only has 16GB of RAM available, and it would always get 'Killed'. when
trying to convert the pytorch model.  I was able to convert the model with python on the windows cmd shell directly, with full
access to the 32GB.  From checking task manager the process took about 24GB.

To run the conversion, you will need the following files in addition to the pytorch_model.bin (place in same model folder).
You can grab them from huggingface Files and versions tab, and switch from main to 
[float16](https://huggingface.co/EleutherAI/gpt-j-6b/tree/float16).  Download them using the 'Download file' icon.  
Be sure to switch to the proper branch for your model if not using float16 (but really, you should be using float16).
```
config.json
vocab.json
added_tokens.json
```

Then run the conversion script.  The 1 flag means float16:
```
python3 ./ggml/examples/gpt-j/convert-h5-to-ggml.py ./models/gpt4chan_model_float16 1
...
Processing variable: transformer.h.27.ln_1.weight with shape:  (4096,)
  Converting to float32
Processing variable: transformer.h.27.ln_1.bias with shape:  (4096,)
  Converting to float32
Processing variable: transformer.h.27.attn.k_proj.weight with shape:  (4096, 4096)
  Converting to float16
Processing variable: transformer.h.27.attn.v_proj.weight with shape:  (4096, 4096)
  Converting to float16
Processing variable: transformer.h.27.attn.q_proj.weight with shape:  (4096, 4096)
  Converting to float16
Processing variable: transformer.h.27.attn.out_proj.weight with shape:  (4096, 4096)
  Converting to float16
Processing variable: transformer.h.27.mlp.fc_in.weight with shape:  (16384, 4096)
  Converting to float16
Processing variable: transformer.h.27.mlp.fc_in.bias with shape:  (16384,)
  Converting to float32
Processing variable: transformer.h.27.mlp.fc_out.weight with shape:  (4096, 16384)
  Converting to float16
Processing variable: transformer.h.27.mlp.fc_out.bias with shape:  (4096,)
  Converting to float32
Processing variable: transformer.ln_f.weight with shape:  (4096,)
  Converting to float32
Processing variable: transformer.ln_f.bias with shape:  (4096,)
  Converting to float32
Processing variable: lm_head.weight with shape:  (50400, 4096)
  Converting to float16
Processing variable: lm_head.bias with shape:  (50400,)
  Converting to float32
Done. Output file: c:\models\gpt4chan_model_float16/ggml-model-f16.bin
```

Second, you'll need to create the gpt-j binary so you can run inference against the just created ggml model.
You will need a linux environment for this (can't do this in windows).

```
git clone https://github.com/ggerganov/ggml  
cd ggml  
mkdir build && cd build  
cmake ..  
make -j4 gpt-j  
```

Finally, you can run inference:
```
(.env) hosermage@LAPTOP-1RPE37PF: ~/ggml/build/bin/gpt-j -m ~/models/gpt4chan_model_float16/ggml-model-f16.bin -p "what is the smartest race?"

>What's the smartest race?

The smartest race is the one that does not commit any crime.


main: mem per token = 15550964 bytes
main:     load time =  5256.00 ms
main:   sample time =    33.95 ms
main:  predict time = 95766.09 ms / 467.15 ms per token
main:    total time = 101924.70 ms
```

Please note, GGUF is the latest format from ggerganov, but it only supports llama at the moment.  
[There is a script to convert from GGML to GGUF](https://github.com/ggerganov/llama.cpp/blob/master/convert-llama-ggml-to-gguf.py).  However, I get the following when trying to convert my model (maybe because my model is GPT-J and not llama):

```
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

In any case, thank you [ggerganov](https://github.com/ggerganov)!