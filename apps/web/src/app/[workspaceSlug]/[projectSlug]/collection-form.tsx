"use client";

import { useState } from "react";
import { Star, ChevronRight, CheckCircle2 } from "lucide-react";
import { submitTestimonial } from "./actions";
import { toast } from "sonner";

interface CollectionFormProps {
  project: {
    id: string;
    name: string;
  };
}

export default function CollectionForm({ project }: CollectionFormProps) {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content || !name) {
      toast.error("Please fill in your name and testimonial");
      return;
    }

    setLoading(true);
    try {
      await submitTestimonial(project.id, {
        rating,
        content,
        authorName: name,
        authorEmail: email,
      });
      setSubmitted(true);
      toast.success("Testimonial submitted!");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-[28px] border border-neutral-100 p-8 sm:p-12 text-center shadow-sm">
        <div className="size-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="size-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Thank you!</h2>
        <p className="text-neutral-500">Your testimonial has been submitted successfully and is pending review.</p>
      </div>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-white rounded-[28px] border border-neutral-100 p-6 sm:p-10 shadow-sm space-y-8"
    >
      <div className="space-y-4">
        <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest pl-1">
          How would you rate us?
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onMouseEnter={() => setHoveredRating(s)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(s)}
              className="p-1 transition-transform active:scale-90"
            >
              <Star
                className={`size-8 sm:size-10 transition-colors ${
                  s <= (hoveredRating || rating)
                    ? "fill-pink-500 text-pink-500"
                    : "text-neutral-100 fill-neutral-100"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest pl-1">
          Your story
        </label>
        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What did you love about our product?"
          rows={5}
          className="w-full px-5 py-4 rounded-2xl border border-neutral-100 bg-neutral-50/30 focus:bg-white focus:ring-2 focus:ring-pink-500/10 focus:border-pink-300 transition-all outline-none text-[15px] resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest pl-1">
            Your name
          </label>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="w-full px-5 py-3.5 rounded-2xl border border-neutral-100 bg-neutral-50/30 focus:bg-white focus:ring-2 focus:ring-pink-500/10 focus:border-pink-300 transition-all outline-none text-[15px]"
          />
        </div>
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest pl-1">
            Email (optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            className="w-full px-5 py-3.5 rounded-2xl border border-neutral-100 bg-neutral-50/30 focus:bg-white focus:ring-2 focus:ring-pink-500/10 focus:border-pink-300 transition-all outline-none text-[15px]"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#171717] text-white font-bold text-[15px] shadow-lg shadow-black/5 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {loading ? (
          <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Post my testimonial
            <ChevronRight className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}
