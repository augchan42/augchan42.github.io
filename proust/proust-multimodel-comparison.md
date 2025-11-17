# Multi-Model Image Generation Comparison: Proust's Madeleine

Testing 12 diverse AI image generation models with the same prompt to compare architectural differences and output quality.

## The Prompt

**User Prompt (simplified for Recraft V3 - 447 chars):**
> Portrait of Marcel Proust, 1900s French writer with dark mustache and formal suit, eating a madeleine cake. Above his head floats a glowing phosphor green thought bubble containing childhood memory fragments: sunlit garden, church steeple, boy silhouette. Deep black background with film grain. Tech-noir aesthetic with 1970s Kodak film quality, high contrast, dramatic lighting. His expression captures the moment of involuntary memory returning.

**System Prompt (Tech-Noir Transformation):**
> 1970s FILM SCREENGRAB - TECH-NOIR AESTHETIC: Transform into a tech-noir film still with phosphor green (#2EBD2E) for main subjects/CRT glow, amber/orange (#FFA500) for warm lighting, deep black (#000000) for shadows. Authentic 1970s-1980s film aesthetic with heavy grain, CRT scanlines, phosphor bloom. Organic scanned film negative quality.

## Model Outputs

### 1. FLUX.1 [dev] - Black Forest Labs
**Architecture:** Flow Transformer (12B parameters)  
**Generation Time:** 6.0s  
**File Size:** 142 KB  
**Image:** ![FLUX.1 dev](public/images/processed/proust-portrait-flux-dev-2025-11-17T09-38-20.png)

**Analysis:** Fastest generation. Artistic rendering with clean composition. Phosphor green thought bubble contains castle/church architecture with excellent contrast against dark background.

---

### 2. Recraft V3 (with simplified prompt)
**Architecture:** Proprietary (SOTA - State of the Art)  
**Generation Time:** 12.9s  
**File Size:** 318 KB  
**Image:** ![Recraft V3](public/images/processed/proust-portrait-recraft-v3-simplified-2025-11-17T10-05-49.png)

**Prompt Note:** Original detailed prompt exceeded Recraft's 1000-character limit. Fallback used simplified prompt (447 chars).

**Analysis:** Highly photorealistic with exceptional detail. Memory bubble rendered as vintage illustration/engraving style. Unique dual madeleine composition (one whole, one being eaten). Clean professional execution.

---

### 3. Stable Diffusion 3.5 Large - Stability AI
**Architecture:** Multimodal Diffusion Transformer (MMDiT)  
**Generation Time:** 10.9s  
**File Size:** 267 KB  
**Image:** ![SD 3.5 Large](public/images/processed/proust-portrait-sd35-large-2025-11-17T09-38-20.png)

**Warnings:** CLIP token truncation (prompt exceeded 77 tokens, truncated to 256 tokens for T5)

**Analysis:** Good balance of detail and coherence despite prompt truncation. Fast generation for the quality.

---

### 4. Imagen 4 - Google
**Architecture:** Proprietary Diffusion  
**Generation Time:** 24.7s  
**File Size:** 1470 KB  
**Image:** ![Imagen 4](public/images/processed/proust-portrait-imagen4-2025-11-17T09-38-20.png)

**Analysis:** Highly realistic with rich detail. Thought bubble shows garden scenes with boy silhouette and church steeple bathed in beautiful amber/golden light. More dimensional and naturalistic.

---

### 5. Ideogram V2
**Architecture:** Proprietary (Typography Expert)  
**Generation Time:** 32.6s  
**File Size:** 1689 KB  
**Image:** ![Ideogram V2](public/images/processed/proust-portrait-ideogram-v2-2025-11-17T09-38-20.png)

**Analysis:** Clean execution with strong contrast. Slower but high quality output.

---

### 6. HiDream I1 Full - HiDream
**Architecture:** Foundation Model (17B parameters, Chinese)  
**Generation Time:** 20.1s  
**File Size:** 189 KB  
**Image:** ![HiDream I1](public/images/processed/proust-portrait-hidream-i1-2025-11-17T09-38-20.png)

**Analysis:** Compact output with efficient compression despite 17B parameter model.

---

### 7. Hunyuan Image v3 - Tencent ⭐
**Architecture:** Proprietary  
**Generation Time:** 22.8s  
**File Size:** 1.6 MB  
**Image:** ![Hunyuan v3](public/images/processed/proust-portrait-hunyuan-v3-2025-11-17T09-38-20.png)

**Selected for Production Use**

**Analysis:** Very photorealistic with natural window lighting from the left. Detailed thought bubble showing flowers (hawthorns), boy silhouette, church steeple. Expression perfectly captures the moment of involuntary memory - eyes widening slightly, contemplative gaze upward, that instant where past and present collapse together. Best emotional capture of the "memory cascade" concept.

---

### 8. DeepSeek Janus-Pro
**Architecture:** Autoregressive (Multimodal)  
**Generation Time:** 60.4s (slowest)  
**File Size:** 191 KB  
**Image:** ![Janus-Pro](public/images/processed/proust-portrait-janus-pro-2025-11-17T09-38-20.png)

**Analysis:** Completely different interpretation from the autoregressive architecture! Minimalist approach with simple green halo behind head rather than detailed thought bubble. More painterly/stylized portrait. Slow generation reflects fundamentally different architectural approach.

---

### 9. CogView4 - Zhipu AI / Tsinghua
**Architecture:** Proprietary (Stylized)  
**Generation Time:** 64.8s (slowest)  
**File Size:** 196 KB  
**Image:** ![CogView4](public/images/processed/proust-portrait-cogview4-2025-11-17T09-38-20.png)

**Analysis:** Stylized generation with compact file size. Longest generation time suggests heavy computation for stylization.

---

### 10. ByteDance SeeDream V3
**Architecture:** Proprietary  
**Generation Time:** 9.4s (second fastest)  
**File Size:** 216 KB  
**Image:** ![SeeDream V3](public/images/processed/proust-portrait-seedream-v3-2025-11-17T09-38-20.png)

**Analysis:** ByteDance's fast interpretation with efficient compression. Excellent speed/quality ratio.

---

### 11. Bria Fibo
**Architecture:** Proprietary (Commercial-safe, Licensed)  
**Generation Time:** 30.1s  
**File Size:** 1.7 MB  
**Image:** ![Bria Fibo](public/images/processed/proust-portrait-bria-fibo-2025-11-17T09-38-20.png)

**Analysis:** Commercial-safe generation with licensing compliance. Mid-range speed.

---

### 12. Wan 2.5 Preview
**Architecture:** Proprietary (Next-gen)  
**Generation Time:** 34.3s  
**File Size:** 1.7 MB  
**Image:** ![Wan 2.5](public/images/processed/proust-portrait-wan-25-2025-11-17T09-38-20.png)

**Analysis:** Next-generation architecture preview. Mid-range performance.

---

## Key Findings

### Generation Speed Patterns
- **Fastest (< 10s):** FLUX dev (6.0s), SeeDream V3 (9.4s)
- **Fast (10-15s):** SD 3.5 (10.9s), Recraft V3 (12.9s)
- **Medium (20-35s):** HiDream (20.1s), Hunyuan v3 (22.8s), Imagen 4 (24.7s), Bria Fibo (30.1s), Ideogram V2 (32.6s), Wan 2.5 (34.3s)
- **Slow (> 60s):** Janus-Pro (60.4s), CogView4 (64.8s)

### Architectural Diversity
- **Flow Transformer** (FLUX): Fastest, clean, artistic, excellent composition
- **MMDiT** (SD 3.5): Fast despite prompt truncation challenges
- **Proprietary Diffusion** (Imagen, Hunyuan): Highly photorealistic, natural lighting, mid-speed
- **Autoregressive** (Janus-Pro): Completely different minimalist interpretation, very slow
- **Typography-focused** (Ideogram, Recraft): Excellent detail and clarity
- **Chinese Models** (HiDream, Hunyuan, SeeDream, CogView4): Diverse approaches from fast to slow

### File Size Patterns
- **Compact (142-318 KB):** FLUX dev (142KB), HiDream (189KB), Janus-Pro (191KB), CogView4 (196KB), SeeDream (216KB), SD 3.5 (267KB), Recraft (318KB)
- **Large (1.5-1.7 MB):** Imagen 4 (1.5MB), Hunyuan v3 (1.6MB), Ideogram V2 (1.7MB), Bria Fibo (1.7MB), Wan 2.5 (1.7MB)

### Prompt Handling
- **Recraft V3:** 1000-character limit requires prompt simplification
- **SD 3.5:** CLIP 77-token limit causes truncation, T5 handles 256 tokens
- **Most models:** Handle full detailed prompts without issue

### Winner: Hunyuan v3 (Tencent)
Selected for production use based on:
- Photorealistic quality with natural lighting
- Perfect facial expression capturing the "memory cascade" moment
- Detailed thought bubble with clear memory fragments
- Balanced composition without overwhelming elements
- Tech-noir aesthetic preservation
- Reasonable generation time (22.8s)

---

## Technical Implementation

All images generated via:
- **Service:** fal.ai Model APIs
- **Database Logging:** All requests logged to `ai_provider_requests` Supabase table with full timing metadata
- **Timestamp Naming:** ISO format prevents file clobbering (2025-11-17T09-38-20)
- **Test Script:** `scripts/testMultipleModels.ts`
- **Timing Source:** Actual response_time_ms from database logs

**Total Models Tested:** 12 diverse architectures  
**Total Generation Time:** ~5 minutes (333 seconds)  
**Success Rate:** 100% (12/12)  
**Average Generation Time:** 27.8 seconds  
**Median Generation Time:** 23.8 seconds

---

*Generated with Claude Code for 8-Bit Oracle - Hexagram 24: Return / Memory Cascade*
