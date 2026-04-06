import { z } from "zod";

/**
 * @file prompts.ts
 * @description Advanced AI Prompt Library for TestimonialWall.
 * Designed using localized 'prompt-engineering' and 'ai-sdk-core' skills.
 */

/**
 * SYSTEM CONTEXT
 * Establishes the core persona and operational boundaries for the AI.
 */
export const SYSTEM_PROMPT = `
# Role
You are the AI Core of "TestimonialWall," a premium SaaS for managing social proof. 
Your expertise lies in content analysis, sentiment detection, and marketing strategy.

# Capabilities
- Deep analysis of text and video testimonial transcripts.
- Sentiment and tone detection with conflict resolution.
- Strategic summarization for marketing landing pages.
- High-fidelity spam and toxic content filtering.

# Guidelines
- Be objective and analytical.
- Identify "mismatch" between user ratings (stars) and written feedback.
- Maintain the original "voice" of the customer—do not over-sanitize.
- Always provide structured JSON output unless explicitly told otherwise.

# Constraints
- Do not hallucinate credentials for authors.
- If content is ambiguous, flag it for human review rather than guessing.
- Keep "Smart Replies" warm but professional.
`;

/**
 * SCHEMAS (For AI SDK v6 Output API)
 * These match the expectations of the prompts below.
 */
export const schemas = {
  analysis: z.object({
    sentiment: z.enum(["positive", "neutral", "negative"]),
    themes: z.array(z.string()).describe("Core themes like Support, Pricing, UI"),
    is_mismatch: z.boolean().describe("True if stars/rating does not match the text"),
    suggested_tags: z.array(z.string()),
    reasoning: z.string().describe("Chain-of-thought analysis step"),
    summary: z.string().max(100),
  }),
  spam: z.object({
    is_legit: z.boolean(),
    confidence: z.number().min(0).max(1),
    reason: z.string().nullable(),
  }),
};

/**
 * PROMPT TEMPLATES
 */
export const AI_PROMPTS = {
  /**
   * TESTIMONIAL ANALYSIS (Few-Shot + CoT)
   */
  ANALYZE: {
    prompt: (content: string, rating: number) => `
Analyze this testimonial. First, think step-by-step about the user's intent and tone, then provide the structured analysis.

### Examples:
Input text: "The app is okay, but it crashes every time I try to upload a video. 5 stars for the idea though."
Rating: 5
Output reasoning: The user praised the concept ("idea") but reported a critical functional failure ("crashes"). The 5-star rating is clearly a "mismatch" given the technical issues described.
Output: { "sentiment": "negative", "is_mismatch": true, "themes": ["Bugs", "UX"], "summary": "Technical issues on video upload despite liking the concept." }

Input text: "Absolutely changed our workflow! Best \$20/mo we've ever spent."
Rating: 5
Output reasoning: Highly enthusiastic, mentions value-to-price ratio. No mismatch.
Output: { "sentiment": "positive", "is_mismatch": false, "themes": ["ROI", "Pricing", "Efficiency"], "summary": "Great ROI and workflow impact." }

### Task:
Input text: "${content}"
Rating: ${rating}

Follow the schema and provide your chain-of-thought reasoning in the 'reasoning' field.
`,
  },

  /**
   * SMART SUMMARIZATION (Hero Quote Extraction)
   */
  SUMMARIZE: {
    prompt: (content: string) => `
Extract a "Hero Quote" from the following testimonial. A Hero Quote is a punchy, 5-12 word snippet that would look perfect as a headline.

### Examples:
Testimonial: "I've tried 10 different tools and TestimonialWall is the only one that actually works for our enterprise scale."
Hero Quote: "The only tool that works for our enterprise scale."

Testimonial: "Support was fast, the UI is clean, and our conversion rate went up by 15% in two weeks."
Hero Quote: "Our conversion rate went up by 15% in two weeks."

### Task:
Testimonial: "${content}"
Hero Quote:
`,
  },

  /**
   * VIDEO TRANSCRIPT REFINEMENT
   */
  CLEANUP_TRANSCRIPT: {
    prompt: (rawText: string) => `
You are a transcription editor. Clean the following raw speech-to-text data for readability while maintaining the speaker's personality.

### Instructions:
1. Remove speech disfluencies (um, uh, like, you know).
2. Fix run-on sentences with proper punctuation.
3. Keep industry jargon intact.
4. Do not paraphrase; keep it as close to the original words as possible.

Raw Text: "${rawText}"
Cleaned Text:
`,
  },

  /**
   * SPAM & ABUSE DETECTION (Few-Shot)
   */
  DETECT_SPAM: {
    prompt: (content: string) => `
Evaluate if the following testimonial is legitimate or spam/abusive.

### Examples:
Input: "BUY BITCOIN NOW AT HTTP://SCAM-SITE.COM"
Output: { "is_legit": false, "confidence": 1.0, "reason": "External marketing link / Crypto spam" }

Input: "i hate this company so much you guys are [PROFANITY]"
Output: { "is_legit": false, "confidence": 0.95, "reason": "Abusive language / Toxicity" }

Input: "The dashboard is a bit slow on mobile."
Output: { "is_legit": true, "confidence": 0.9, "reason": null }

### Task:
Input: "${content}"
`,
  },

  /**
   * PROGRAMMATIC SEO (PSEO) & GEO GEN
   * Prompts for generating high-value landing page content at scale.
   */
  SEO: {
    /**
     * PSEO: COMPARISON PAGE GENERATOR
     * Target Pattern: "[Our Product] vs [Competitor]"
     */
    GENERATE_COMPARISON: {
      prompt: (competitorName: string, competitorFeatures: string[]) => `
Generate a balanced, high-value comparison between TestimonialWall and ${competitorName}.
Follow Programmatic SEO (PSEO) best practices:
1. **Focus on Search Intent**: The user is looking for a better alternative or specific trade-offs.
2. **Proprietary Insight**: Highlight our unique features (e.g., high-fidelity video collection, glassmorphism UI).
3. **Persuasive Fairness**: Admit where ${competitorName} is strong (e.g., enterprise legacy) but show why TestimonialWall is the modern choice.

### Inputs:
Competitor: ${competitorName}
Competitor Weaknesses (for context): ${competitorFeatures.join(", ")}

### Sections to Generate:
- A "TL;DR" summary comparison (for GEO/AI engines).
- A 3-point feature showdown.
- A "When to Choose Us" vs "When to Choose Them" conclusion.
`,
    },

    /**
     * GEO: AI-CITABLE ENRICHMENT
     * Refines a testimonial or case study to be cited by Perplexity/ChatGPT.
     */
    ENRICH_FOR_GEO: {
      prompt: (testimonialContent: string, authorTitle: string) => `
Refine the following testimonial for Generative Engine Optimization (GEO). 
Goal: Make this content highly "extricable" and "citable" by AI engines.

### Instructions:
1. **Entity Clarity**: Clearly define the user's role and company context.
2. **Data Extraction**: If the testimonial mentions numbers (e.g. "it saved us hours"), convert them into clear, citable stats (e.g. "Resulted in a 40% reduction in manual effort").
3. **Expert Persona**: Use the author's title (${authorTitle}) to establish authority.
4. **Formatting**: Use bullet points and bold key insights.

Testimonial: "${testimonialContent}"
`,
    },

    /**
     * PSEO: PERSONA LANDING PAGE
     * Target Pattern: "Testimonials for [Industry/Role]"
     */
    GENERATE_PERSONA_PAGE: {
      prompt: (industryName: string) => `
Generate unique, high-value content for a landing page targeting "${industryName}".
Avoid "thin content" penalties by providing industry-specific insights.

### Content Strategy:
1. **Industry Pain Points**: What specific challenges do ${industryName} face with social proof?
2. **Solution Mapping**: How does a "Wall of Love" solve those specific challenges?
3. **Trust Signals**: What specific metrics do ${industryName} care about (e.g. Trust, Conversion, Retention)?

Output must be in Markdown format with clear H2/H3 headers.
`,
    },
  },
};
