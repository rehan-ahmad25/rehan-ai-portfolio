# Building a GPT-Style Language Model From Scratch

Most language model projects start with a pretrained checkpoint. This one started with an empty weight matrix.

The goal was not to build a competitive model. The goal was to understand, at implementation level, how a decoder-only Transformer turns raw text into coherent next-token predictions. That required writing every major component instead of importing them.


## Problem Statement

Modern language models are widely used, yet many practitioners interact with them only through APIs or fine-tuning wrappers. The internal mechanics — tokenization trade-offs, causal masking, residual pathways, and the relationship between context length and memory — remain opaque.

Existing educational resources often stop at theory or rely on high-level libraries that hide the details. There was a clear gap between reading the original Transformer paper and actually shipping a working training and generation pipeline.


## Project Overview

AstraGPT is a small decoder-only language model trained entirely from scratch in PyTorch. The system covers the full pipeline:

- Custom BPE tokenizer training
- Efficient binary dataset preparation
- Model implementation (embeddings, multi-head causal attention, Transformer blocks)
- Custom training loop with checkpointing
- Autoregressive text generation

The model is intentionally modest in size so that the complete workflow remains runnable on a single free-tier GPU.


## System Architecture

The data flow is linear and explicit:

```
Raw text corpus
      │
      ▼
Custom BPE Tokenizer (vocab size 20,000)
      │
      ▼
Tokenized binary files (train.bin / val.bin via memmap)
      │
      ▼
Decoder-only Transformer
  - Token + Positional Embeddings
  - 6 × Transformer Blocks
  - Language Model Head
      │
      ▼
Training loop (next-token prediction)
      │
      ▼
Checkpoints → Autoregressive generation
```

At inference time the model receives a prompt, encodes it with the same tokenizer, and repeatedly samples the next token, feeding each prediction back into the context window.


## Technology Stack and Design Decisions

**PyTorch** was chosen because it gives full control over every tensor operation. Higher-level frameworks would have hidden the attention implementation and residual connections that were the actual learning target.

**Hugging Face tokenizers** provided a reliable BPE implementation without requiring a from-scratch byte-pair encoder. The decision was pragmatic: the educational value of writing a BPE trainer from zero was lower than the value of correctly integrating a production-grade tokenizer into the rest of the pipeline.

**numpy.memmap** was used for the training data. Loading hundreds of millions of tokens into RAM on every run is unnecessary and quickly becomes a bottleneck on constrained hardware. Memory-mapping keeps the working set small while still allowing random batch sampling.

**Google Colab T4** defined the practical size limits. The final configuration (256 embedding dimension, 6 layers, 8 heads, 256 context length) was the largest that could train stably without constant out-of-memory failures.


## Implementation Details

### Tokenizer
A BPE tokenizer was trained on the full corpus with a vocabulary of 20,000 tokens and standard special tokens. The resulting `tokenizer.json` is loaded once at the start of both training and inference so the same mapping is used throughout the system.

### Dataset
The entire corpus was encoded offline and stored as `uint32` binary files. Training and validation splits are read through memmap, which allows the `get_batch` function to sample random 256-token windows without loading the full dataset.

### Model
The architecture follows the standard GPT-style decoder-only design:

- Token embedding + learned positional embedding
- Six identical blocks, each containing multi-head causal self-attention and a feed-forward network
- Residual connections and layer normalization around both sub-layers
- Final layer norm followed by a linear language-model head

The causal mask is a lower-triangular matrix registered as a buffer so it moves with the model across devices.

### Training
A minimal training loop samples batches, computes cross-entropy loss on the shifted targets, and periodically evaluates on the validation set. Checkpoints are written so progress survives runtime disconnects.

### Generation
Generation is pure autoregressive decoding. The prompt is encoded, the model produces logits for the next position, a token is sampled, and the process repeats until a length limit or stop condition is reached.


## Challenges and Trade-offs

The causal mask was the source of the most persistent bugs. Incorrect broadcasting produced silent NaNs that only appeared after several training steps. Explicit shape assertions and intermediate tensor prints were required to isolate the error.

Context length versus memory formed a hard constraint. Extending the context beyond 256 tokens on the available hardware forced either a reduction in batch size or model width, both of which slowed learning. The final 256-token window was a deliberate compromise.

Early training runs produced repetitive or degenerate text. This was expected for a small model on limited data, but it still required careful monitoring of validation loss and occasional restarts from earlier checkpoints.

The decision to keep the entire implementation in a single notebook simplified iteration at the cost of long-term maintainability. For a portfolio piece this was acceptable; for a larger system it would not be.


## Results

The model learns to produce short, locally coherent continuations that reflect the style of the training corpus. It does not generate long-form coherent text, nor does it follow complex instructions. Those capabilities were never the target.

What the project demonstrates is a complete, working pipeline from raw text to generated tokens, with every component under the author’s control.


## Lessons Learned

Implementing multi-head causal attention from scratch forces a concrete understanding of the QKV projections, scaling, masking, and residual pathways that abstract descriptions leave vague.

Tokenizer quality and data preparation decisions have outsized impact on final behavior. A carefully trained 20k vocabulary proved more useful than an off-the-shelf tokenizer mismatched to the domain.

Hardware constraints are not an afterthought. They shape architecture, batch size, and even the decision of what “done” looks like.

Finally, the gap between a model that can reduce loss and a model that produces usable text is larger than loss curves suggest. Generation quality must be inspected directly.


## Limitations

AstraGPT is an educational model. Context length is limited to 256 tokens. Training data volume is modest by modern standards. There is no instruction tuning, preference optimization, or safety alignment. Generation quality remains far below commercial systems. These constraints were accepted from the beginning.


## Future Improvements

Realistic next steps include:

- Scaling the model modestly once more compute is available
- Adding a proper project structure with separate modules for data, model, and training
- Experimenting with rotary positional embeddings
- Building a small evaluation suite beyond simple loss

None of these change the core educational value of the current implementation.


## Conclusion

Building a language model from scratch is slower and more error-prone than fine-tuning an existing checkpoint. It is also one of the most effective ways to internalize how these systems actually work.

AstraGPT does not compete with production models. It makes the internal machinery visible and editable. That visibility was the entire point of the project.
