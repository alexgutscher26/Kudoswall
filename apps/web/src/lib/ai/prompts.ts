import { z } from "zod";

/**
 * @file prompts.ts
 * @description Advanced AI Prompt Library for KudosWall.
 * Designed using localized 'prompt-engineering' and 'ai-sdk-core' skills.
 */

/**
 * SYSTEM CONTEXT
 * Establishes the core persona and operational boundaries for the AI.
 */
export const SYSTEM_PROMPT = `
# Role
You are the AI Core of "KudosWall," a premium SaaS for managing social proof. 
Your expertise lies in content analysis, sentiment detection, and marketing strategy.

# Capabilities
- Deep analysis of text and video testimonial transcripts.
- Sentiment and tone detection with conflict resolution.
- Strategic summarization for marketing landing pages.
- High-fidelity spam and toxic content filtering.
- Automated generation of case studies and email responses.
- Multilingual translation and localization.

# Guidelines
- Be objective and analytical.
- Identify "mismatch" between user ratings (stars) and written feedback.
- Maintain the original "voice" of the customer—do not over-sanitize.
- Always provide structured JSON output unless explicitly told otherwise.
- For marketing content, prioritize persuasive, high-conversion language.

# Constraints
- Do not hallucinate credentials for authors.
- If content is ambiguous, flag it for human review rather than guessing.
- Keep "Smart Replies" warm but professional.
- For translations, preserve the emotional intensity of the original.
`;

/**
 * SCHEMAS (For AI SDK v6 Output API)
 * These match the expectations of the prompts below.
 */
export const schemas = {
  analysis: z.object({
    sentiment: z.enum(["positive", "neutral", "negative"]),
    enthusiasm_score: z.number().min(1).max(10).describe("1-10 scale for enthusiasm sorting"),
    themes: z.array(z.string()).describe("Core themes like Support, Pricing, UI"),
    keywords: z.array(z.string()).describe("Crucial marketing keywords"),
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
  feature_suggestion: z.object({
    feature_name: z.string(),
    customer_need: z.string(),
    frequency_signal: z.enum(["high", "medium", "low"]),
    marketing_angle: z.string().describe("How to pitch this in an FAQ or LP"),
  }),
  email_reply: z.object({
    subject: z.string(),
    body: z.string(),
    tone_verification: z.string().describe("Why this tone was chosen"),
  }),
  case_study: z.object({
    title: z.string(),
    problem: z.string(),
    solution: z.string(),
    result: z.string(),
    key_stat: z.string().describe("A citable metric if found"),
  }),
  translation: z.object({
    translated_text: z.string(),
    language: z.string(),
    cultural_notes: z.string().nullable().describe("Notes on idioms or tone adjustments"),
  }),
  interview_followup: z.object({
    question: z.string(),
    reasoning: z.string().describe("Why this specific follow-up matters for social proof"),
  }),
};

/**
 * PROMPT TEMPLATES
 */
export const AI_PROMPTS = {
  /**
   * TESTIMONIAL ANALYSIS (Few-Shot + CoT)
   * Section 7: Text & Sentiment Analysis / Keyword Extraction
   */
  ANALYZE: {
    prompt: (content: string, rating: number) => `
Context: A customer has submitted feedback for KudosWall. 
Objective: Analyze the content for sentiment, enthusiasm, themes, and keywords to enable advanced dashboard filtering and sorting.
Style: Analytical and precise.
Response: JSON object following the 'analysis' schema.

### Examples:
<examples>
  <example>
    <input>
      Text: "The app is okay, but it crashes every time I try to upload a video. 5 stars for the idea though."
      Rating: 5
    </input>
    <output>
      {
        "sentiment": "negative",
        "enthusiasm_score": 3,
        "is_mismatch": true,
        "themes": ["Bugs", "UX"],
        "keywords": ["video upload", "crashes"],
        "summary": "Technical issues on video upload despite liking the concept.",
        "reasoning": "The user reported a critical functional failure ('crashes'). The 5-star rating is a mismatch for the negative experience described."
      }
    </output>
  </example>
  <example>
    <input>
      Text: "Absolutely changed our workflow! Best $20/mo we've ever spent. Our CEO is obsessed with the new wall."
      Rating: 5
    </input>
    <output>
      {
        "sentiment": "positive",
        "enthusiasm_score": 10,
        "is_mismatch": false,
        "themes": ["ROI", "Efficiency"],
        "keywords": ["workflow", "value", "CEO obsession"],
        "summary": "High ROI and significant workflow improvement.",
        "reasoning": "Highly enthusiastic language ('Absolutely changed', 'obsessed'). Mentions price positively. Clean alignment with 5-star rating."
      }
    </output>
  </example>
</examples>

### Task:
Input text: "${content}"
Rating: ${rating}
`,
  },

  /**
   * SMART SUMMARIZATION (Hero Quote Extraction)
   * Section 7: AI Summary
   */
  SUMMARIZE: {
    prompt: (content: string) => `
Objective: Extract a high-impact "Hero Quote" (5-12 words) for marketing headlines.
Constraint: Must be a direct snippet or minimal edit of the original text.
Tone: Persuasive and punchy.

### Examples:
- "I've tried 10 different tools and KudosWall is the only one that actually works." -> "The only tool that actually works for us."
- "The UI is so glassmorphic and beautiful, my customers keep complimenting it." -> "Beautiful glassmorphic UI that customers love."

### Task:
Testimonial Content: "${content}"
`,
  },

  /**
   * VIDEO TRANSCRIPT REFINEMENT
   * Section 13: Advanced Video Suite / AI Transcription
   */
  CLEANUP_TRANSCRIPT: {
    prompt: (rawText: string) => `
Role: You are a professional transcription editor.
Task: Clean speech-to-text data for subtitles and quotes.
Instructions:
1. Remove disfluencies (um, uh, like).
2. Fix run-on sentences.
3. Keep industry jargon and personal voice.
4. Output only the cleaned text.

Raw Text: "${rawText}"
`,
  },

  /**
   * SPAM & ABUSE DETECTION (Few-Shot)
   * Section 12: Abuse Prevention
   */
  DETECT_SPAM: {
    prompt: (content: string) => `
Objective: Filter out marketing spam, bots, and toxic content.
Constraint: Be strict on external links and profanity.

### Examples:
- "BUY BITCOIN NOW" -> { "is_legit": false, "confidence": 1.0, "reason": "Crypto spam" }
- "i hate you guys [PROFANITY]" -> { "is_legit": false, "confidence": 0.95, "reason": "Toxicity" }
- "Great tool!" -> { "is_legit": true, "confidence": 0.9, "reason": null }

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
Generate a balanced, high-value comparison between KudosWall and ${competitorName}.
Follow Programmatic SEO (PSEO) best practices:
1. **Focus on Search Intent**: The user is looking for a better alternative or specific trade-offs.
2. **Proprietary Insight**: Highlight our unique features (e.g., high-fidelity video collection, glassmorphism UI).
3. **Persuasive Fairness**: Admit where ${competitorName} is strong (e.g., enterprise legacy) but show why KudosWall is the modern choice.

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

  /**
   * INTELLIGENCE ENGINE (Section 7)
   */
  INTELLIGENCE: {
    /**
     * FEATURE SUGGESTION
     * "Your customers often mention X, maybe add it to your FAQ?"
     */
    SUGGEST_FEATURES: {
      prompt: (bulkTestimonials: string[]) => `
Context: Analyzing a collection of recent customer testimonials for KudosWall.
Objective: Identify recurring feature requests, pain points, or praise that could inform product roadmap or FAQ.
Style: Strategic and product-focused.
Input: ${bulkTestimonials.length} testimonials.
Response: A list of objects following the 'feature_suggestion' schema.

Content to analyze:
${bulkTestimonials.join("\n---\n")}
`,
    },

    /**
     * AI-DRIVEN RESPONSE SUGGESTIONS
     * "AI-driven response suggestions for 'Thank You' emails"
     */
    GENERATE_REPLY: {
      prompt: (content: string, authorName: string) => `
Objective: Generate a warm, professional, and personalized 'Thank You' email to a customer who just left a testimonial.
Tone: Gracious, authentic, and slightly excited.
Reference Content: "${content}"
Author: ${authorName}

Instructions:
1. Reference a specific point they made in their feedback.
2. If they mentioned a problem, acknowledge it briefly with a 'we are on it' note.
3. If they are extremely happy, include a small 'referral' nudge.
`,
    },
  },

  /**
   * MARKETING & GROWTH (Section 20)
   */
  MARKETING: {
    /**
     * CASE STUDY GENERATOR
     * Convert a testimonial into a structured case study (Problem/Solution/Result).
     */
    GENERATE_CASE_STUDY: {
      prompt: (content: string, authorContext: string) => `
Role: You are a high-conversion SaaS copywriter.
Task: Transform the provided testimonial into a structured Case Study.
Format: JSON following the 'case_study' schema.
Context: Author profile: ${authorContext}

Steps:
1. Infer the 'Problem' the customer was facing before using us.
2. Detail the 'Solution' they found within KudosWall.
3. Highlight the 'Result' (quantify if stats are present).
4. Extract or derive a 'Key Stat'.
`,
    },
  },

  /**
   * INTERNATIONALIZATION (Section 15)
   */
  I18N: {
    /**
     * AUTO-TRANSLATE
     * Preserving emotional intensity and intent.
     */
    TRANSLATE: {
      prompt: (content: string, targetLanguage: string) => `
Task: Translate this testimonial into ${targetLanguage}.
Constraint: Preserve the sentiment, emotional intensity, and any industry-specific terminology.
Note: If the text is already in ${targetLanguage}, return it as is but provide cultural notes if applicable.

Input Text: "${content}"
`,
    },
  },

  /**
   * FUTURE V2 (Section 21)
   */
  FUTURE: {
    /**
     * AI INTERVIEWER
     * Generate a follow-up question to dig deeper into social proof.
     */
    GENERATE_FOLLOW_UP: {
      prompt: (content: string) => `
Role: You are a customer success interviewer.
Task: Based on the customer's initial testimonial, generate ONE powerful follow-up question that would elicit even stronger social proof or a better 'Result' metric.
Context: "${content}"

Example:
If they say "It saved us time", follow up with "Exactly how many hours per week did your team reclaim, and what did you spend that time on instead?"
`,
    },
  },
};
