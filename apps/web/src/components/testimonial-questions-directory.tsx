"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gooeyToast as toast } from "goey-toast";
import {
  Search,
  Copy,
  Check,
  Plus,
  Trash2,
  Sparkles,
  ExternalLink,
  HelpCircle,
  X,
  ChevronRight,
  ClipboardList,
} from "lucide-react";

interface TestimonialQuestion {
  id: string;
  category: "saas" | "ecommerce" | "courses" | "agencies" | "communities";
  text: string;
  label: string;
  tip: string;
  rationale: string;
}

const CATEGORIES = [
  { id: "all", label: "All Questions", emoji: "✨" },
  { id: "saas", label: "SaaS & B2B Software", emoji: "🚀" },
  { id: "ecommerce", label: "E-Commerce & Brands", emoji: "🛍️" },
  { id: "courses", label: "Courses & Coaching", emoji: "🎓" },
  { id: "agencies", label: "Agencies & Freelance", emoji: "💼" },
  { id: "communities", label: "Communities & Memberships", emoji: "👥" },
] as const;

const QUESTIONS: TestimonialQuestion[] = [
  // SaaS & B2B
  {
    id: "saas-1",
    category: "saas",
    text: "What specific business problem was your team facing before you discovered KudosWall?",
    label: "Pain Point Context",
    tip: "Helps prospects immediately identify themselves in your client's initial struggle.",
    rationale: "Establishes a powerful 'before' narrative.",
  },
  {
    id: "saas-2",
    category: "saas",
    text: "What was your biggest hesitation or doubt before upgrading to our platform?",
    label: "Objection Buster",
    tip: "Addresses concerns (pricing, complexity) directly so other buyers see how they were overcome.",
    rationale: "Defuses skepticism by bringing it to light.",
  },
  {
    id: "saas-3",
    category: "saas",
    text: "Which specific feature or capability has had the largest impact on your team's day-to-day work?",
    label: "Value Spotlight",
    tip: "Directs prospective customers to key high-value functionality that drives engagement.",
    rationale: "Provides descriptive, concrete feature adoption proof.",
  },
  {
    id: "saas-4",
    category: "saas",
    text: "Can you share any measurable metrics (time saved, ROI, signup conversion) you've seen since upgrading?",
    label: "ROI & Metrics",
    tip: "Metrics are the single most convincing piece of social proof for B2B procurement teams.",
    rationale: "Proves monetary value directly.",
  },
  {
    id: "saas-5",
    category: "saas",
    text: "What was the onboarding or stack-migration process like compared to other tools you've used?",
    label: "Friction Reducer",
    tip: "Combats the migration dread—the fear that switching tools will disrupt daily operations.",
    rationale: "Validates seamless transitions and implementation support.",
  },
  {
    id: "saas-6",
    category: "saas",
    text: "If a founder was on the fence about choosing KudosWall, what would you tell them?",
    label: "Unfiltered Pitch",
    tip: "Prompts raw, emotional recommendations that feel highly authentic and persuasive.",
    rationale: "Captures natural peer-to-peer endorsements.",
  },

  // E-Commerce & Retail
  {
    id: "ecom-1",
    category: "ecommerce",
    text: "What was your main worry or doubt about ordering from us for the first time?",
    label: "Trust Bridge",
    tip: "Helps overcome buyer inertia by validating fears regarding quality, sizing, or checkout security.",
    rationale: "Mitigates high-friction first purchases.",
  },
  {
    id: "ecom-2",
    category: "ecommerce",
    text: "How did the product perform compared to your expectations once it arrived at your door?",
    label: "Quality Proof",
    tip: "Shows that your items live up to the pictures and product description.",
    rationale: "Confirms authentic customer satisfaction.",
  },
  {
    id: "ecom-3",
    category: "ecommerce",
    text: "What one design feature or aspect of the product do you love the most?",
    label: "Feature Love",
    tip: "Gives new buyers a single high-impact benefit to focus on during browsing.",
    rationale: "Draws attention to quality details.",
  },
  {
    id: "ecom-4",
    category: "ecommerce",
    text: "How would you describe your experience with our shipping speed and customer support team?",
    label: "Service Quality",
    tip: "Highlights fast delivery and responsive help, building post-checkout trust.",
    rationale: "Proves overall operational excellence.",
  },
  {
    id: "ecom-5",
    category: "ecommerce",
    text: "Where or how do you find yourself using this product the most in your daily life?",
    label: "Lifestyle Match",
    tip: "Helps new prospects paint a mental picture of themselves integrating your item into their routine.",
    rationale: "Generates highly relatable context.",
  },
  {
    id: "ecom-6",
    category: "ecommerce",
    text: "If you could sum up your experience with our brand in just three words, what would they be?",
    label: "Brand Identity",
    tip: "Great for extracting high-impact punchy headings and hero text callouts.",
    rationale: "Condenses emotional sentiment into marketing titles.",
  },

  // Course Creators & Coaching
  {
    id: "course-1",
    category: "courses",
    text: "What specific challenge or professional bottleneck were you facing before joining the course?",
    label: "Student Origin Story",
    tip: "Sets the baseline. Highlights the relatable starting point of a typical successful student.",
    rationale: "Builds a clear arc of transformation.",
  },
  {
    id: "course-2",
    category: "courses",
    text: "What was the single most 'aha!' or mind-blowing lesson you learned inside the syllabus?",
    label: "Curriculum Value",
    tip: "Identifies proprietary insights that separate your course from standard YouTube tutorials.",
    rationale: "Validates depth of academic/educational content.",
  },
  {
    id: "course-3",
    category: "courses",
    text: "What concrete results (salary bump, job offer, new product launch) have you achieved since graduating?",
    label: "Proven Outgrowth",
    tip: "Proves that your education isn't just theory—it delivers real, tangible career upgrades.",
    rationale: "The ultimate marketing credential.",
  },
  {
    id: "course-4",
    category: "courses",
    text: "How would you describe the instructor's personal teaching style and community responsiveness?",
    label: "Support System",
    tip: "Tackles the fear of isolation. Students want to know they will be guided and not ignored.",
    rationale: "Highlights care, mentorship, and community.",
  },
  {
    id: "course-5",
    category: "courses",
    text: "Why did you choose this learning track over other courses or self-taught options?",
    label: "Market Advantage",
    tip: "Highlights your course's unique framework, format, community setup, or project-based approach.",
    rationale: "Highlights competitive differentiators.",
  },

  // Agencies & Freelance
  {
    id: "agency-1",
    category: "agencies",
    text: "What was your biggest fear or hesitation about outsourcing this project to an agency?",
    label: "Vendor Risk",
    tip: "Addresses fears regarding missed deadlines, low quality, and communication drop-offs.",
    rationale: "Shows how your agency neutralizes typical outsource risks.",
  },
  {
    id: "agency-2",
    category: "agencies",
    text: "How did our communication and responsiveness compare to other service partners you've hired?",
    label: "Collaboration Speed",
    tip: "Clients value trust and speed. Proving you keep them updated is highly persuasive.",
    rationale: "Showcases standard of project management.",
  },
  {
    id: "agency-3",
    category: "agencies",
    text: "How did the final deliverable impact your business operations or revenue stream?",
    label: "Bottom-line Impact",
    tip: "Proves that your deliverables directly drive commercial success, justifying premium pricing.",
    rationale: "Elevates your service from cost to investment.",
  },
  {
    id: "agency-4",
    category: "agencies",
    text: "Can you share a specific time during the project where our team went above and beyond for you?",
    label: "Customer Delight",
    tip: "Extracts heroic, memorable stories that paint your team as key long-term allies.",
    rationale: "Captures extraordinary support anecdotes.",
  },
  {
    id: "agency-5",
    category: "agencies",
    text: "Would you partner with our agency again on future strategic projects, and why?",
    label: "Loyalty Metric",
    tip: "Proves long-term satisfaction and recurring vendor relationship strength.",
    rationale: "Validates high customer lifetime value.",
  },

  // Communities & Events
  {
    id: "comm-1",
    category: "communities",
    text: "What was your main motivation or trigger that made you click 'Join' and sign up?",
    label: "Member Motive",
    tip: "Uncovers the key attraction factors that turn passive observers into active members.",
    rationale: "Pinpoints the community's primary hooks.",
  },
  {
    id: "comm-2",
    category: "communities",
    text: "How has your professional network or skill set evolved since engaging in our channels?",
    label: "Growth & Network",
    tip: "Validates the community as a resource for real career progression and connection.",
    rationale: "Highlights networking quality.",
  },
  {
    id: "comm-3",
    category: "communities",
    text: "What is your favorite ritual, virtual event, or weekly channel inside the group, and why?",
    label: "Ritual Love",
    tip: "Gives external prospects a peek into the ongoing weekly life and vibe of the community.",
    rationale: "Proves high peer engagement levels.",
  },
  {
    id: "comm-4",
    category: "communities",
    text: "Can you describe a specific instance where a fellow member stepped in to support or guide you?",
    label: "Peer Bonding",
    tip: "Shows that the member base is welcoming, collaborative, and genuinely helpful.",
    rationale: "Demonstrates overall community culture.",
  },
  {
    id: "comm-5",
    category: "communities",
    text: "How would you describe the general energy and culture of KudoWall's community to an outsider?",
    label: "Vibe Check",
    tip: "Attracts the right demographic by clarifying the overarching tone and atmosphere.",
    rationale: "Establishes a solid cultural fit for new joins.",
  },
];

export default function TestimonialQuestionsDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedQuestions, setSelectedQuestions] = useState<TestimonialQuestion[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter & Search Logic
  const filteredQuestions = useMemo(() => {
    return QUESTIONS.filter((q) => {
      const matchesCategory = selectedCategory === "all" || q.category === selectedCategory;
      const matchesSearch =
        q.text.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        q.label.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        q.tip.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Copy Single Question
  const handleCopySingle = (q: TestimonialQuestion) => {
    navigator.clipboard.writeText(q.text);
    setCopiedId(q.id);
    toast("Question copied to clipboard!", { duration: 1500 });
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Add / Remove from Form builder
  const toggleQuestionSelection = (q: TestimonialQuestion) => {
    if (selectedQuestions.some((item) => item.id === q.id)) {
      setSelectedQuestions((prev) => prev.filter((item) => item.id !== q.id));
      toast("Question removed from custom list", { duration: 1500 });
    } else {
      if (selectedQuestions.length >= 5) {
        toast("We recommend asking at most 5 questions to maximize completion rates!", {
          duration: 3000,
        });
      }
      setSelectedQuestions((prev) => [...prev, q]);
      toast("Question added to custom list!", { duration: 1500 });
    }
  };

  // Copy Entire Script
  const handleCopyScript = () => {
    if (selectedQuestions.length === 0) return;
    const scriptText = selectedQuestions.map((q, idx) => `${idx + 1}. ${q.text}`).join("\n\n");
    navigator.clipboard.writeText(scriptText);
    toast("Complete question script copied!", { duration: 2000 });
  };

  // Generate KudosWall Form Link
  const getKudosWallFormLink = () => {
    const encodedQs = encodeURIComponent(JSON.stringify(selectedQuestions.map((q) => q.text)));
    return `/login?redirect=${encodeURIComponent(`/dashboard/collection/new?prefilled_questions=${encodedQs}`)}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Decorative Blur Gradients */}
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[500px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.04),transparent_60%)]" />

      {/* Hero Section */}
      <div className="mb-14 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-3.5 py-1 text-xs font-semibold text-indigo-700 backdrop-blur-xs">
          <Sparkles className="size-3.5" />
          <span>Testimonial Questions Generator</span>
        </div>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          Ask questions that <br />
          <span className="bg-linear-to-r from-indigo-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
            extract high-converting ROI.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-500">
          Generic prompts like <span className="italic">"Tell us what you think"</span> yield
          generic, low-converting testimonials. Use our directory of proven strategic questions to
          capture outcomes, overcome doubts, and secure massive social proof.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="mb-10 space-y-6">
        {/* Search Input */}
        <div className="relative mx-auto max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="size-5" />
          </div>
          <input
            id="questions-search-field"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. ROI, doubt, fear)..."
            className="h-12 w-full rounded-full border border-slate-200 bg-white pr-4 pl-10 text-slate-800 shadow-xs outline-hidden transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          {searchQuery !== "" && (
            <button
              id="clear-search-btn"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Categories Tab Swiper */}
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-tab-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative flex items-center gap-2 rounded-full px-4.5 py-2 text-sm font-semibold tracking-wide transition-all duration-300 ${
                  isActive
                    ? "scale-105 bg-slate-900 text-white shadow-md shadow-slate-900/10"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions Directory Grid */}
      <div className="mb-20">
        <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredQuestions.map((q) => {
              const isSelected = selectedQuestions.some((item) => item.id === q.id);
              const isCopied = copiedId === q.id;

              // Color classes based on strategic labels
              let tagColor = "bg-indigo-50 text-indigo-700 border-indigo-100";
              if (q.label.includes("ROI") || q.label.includes("Quality")) {
                tagColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
              } else if (q.label.includes("Objection") || q.label.includes("Friction")) {
                tagColor = "bg-amber-50 text-amber-700 border-amber-100";
              } else if (q.label.includes("Unfiltered") || q.label.includes("Loyalty")) {
                tagColor = "bg-pink-50 text-pink-700 border-pink-100";
              }

              return (
                <motion.div
                  key={q.id}
                  id={`question-card-${q.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-200 hover:shadow-md"
                >
                  <div className="space-y-4">
                    {/* Header: Label & Category */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${tagColor}`}
                      >
                        {q.label}
                      </span>
                      <span className="text-[10px] font-black tracking-widest text-slate-300 uppercase">
                        {q.category}
                      </span>
                    </div>

                    {/* Question Text */}
                    <p className="text-base leading-snug font-bold text-slate-900">"{q.text}"</p>
                  </div>

                  {/* Educational Tooltip Panel */}
                  <div className="mt-5 space-y-4 border-t border-slate-100 pt-4">
                    <div className="flex items-start gap-2.5 rounded-2xl bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-500">
                      <HelpCircle className="mt-0.5 size-4 shrink-0 text-indigo-500" />
                      <div>
                        <span className="font-bold text-slate-700">Strategic Tip: </span>
                        {q.tip}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex gap-2">
                      {/* Copy Question Button */}
                      <button
                        id={`btn-copy-${q.id}`}
                        onClick={() => handleCopySingle(q)}
                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold transition-all ${
                          isCopied
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="size-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3.5 text-slate-400 group-hover:text-slate-600" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      {/* Add to Custom builder */}
                      <button
                        id={`btn-toggle-select-${q.id}`}
                        onClick={() => toggleQuestionSelection(q)}
                        className={`flex items-center justify-center rounded-full p-2 transition-all ${
                          isSelected
                            ? "scale-105 bg-indigo-600 text-white"
                            : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                        }`}
                        title={isSelected ? "Remove from builder" : "Add to custom list"}
                      >
                        {isSelected ? <X className="size-4" /> : <Plus className="size-4" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredQuestions.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-20 text-center">
            <p className="text-lg font-medium text-slate-400">
              No testimonial questions found matching "{searchQuery}"
            </p>
            <button
              id="reset-search-btn"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 text-sm font-bold text-indigo-600 hover:text-indigo-800"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Floating Active Questions Tray Component */}
      <AnimatePresence>
        {selectedQuestions.length > 0 && (
          <motion.div
            id="questions-script-builder-tray"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-6 left-1/2 z-40 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/95 p-5 shadow-2xl backdrop-blur-md md:p-6"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Left: Heading details */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-black text-white">
                    {selectedQuestions.length}
                  </div>
                  <h4 className="text-base font-extrabold tracking-tight text-slate-900">
                    Your Custom Collection Script
                  </h4>
                </div>
                <p className="text-xs text-slate-500">
                  You've selected the perfect set of questions to guide your happy customers.
                </p>
              </div>

              {/* Center: List of questions mini pills */}
              <div className="flex flex-wrap gap-1.5 py-2 lg:flex-1 lg:justify-center lg:px-6">
                {selectedQuestions.map((q) => (
                  <div
                    key={q.id}
                    id={`tray-pill-${q.id}`}
                    className="flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/50 py-1 pr-1.5 pl-2.5 text-[11px] font-bold text-indigo-700"
                  >
                    <span className="max-w-[120px] truncate">{q.label}</span>
                    <button
                      id={`btn-remove-tray-${q.id}`}
                      onClick={() => toggleQuestionSelection(q)}
                      className="rounded-full p-0.5 text-indigo-500 transition-colors hover:bg-indigo-100 hover:text-indigo-700"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Right: Triggers */}
              <div className="flex gap-2">
                {/* Copy All */}
                <button
                  id="btn-copy-full-script"
                  onClick={handleCopyScript}
                  className="flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition-all hover:bg-slate-50 active:scale-95"
                >
                  <Copy className="size-3.5 text-slate-400" />
                  <span>Copy Script</span>
                </button>

                {/* Build Form Free (Onboarding growth loop) */}
                <a
                  id="link-build-form-kudoswall"
                  href={getKudosWallFormLink()}
                  className="flex items-center justify-center gap-1.5 rounded-full bg-indigo-600 px-4.5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-indigo-600/15 transition-all hover:bg-indigo-700 active:scale-95"
                >
                  <ClipboardList className="size-3.5" />
                  <span>Build Form Free</span>
                  <ChevronRight className="size-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
