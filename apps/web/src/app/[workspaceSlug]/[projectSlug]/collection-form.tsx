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
      <div className="rounded-[28px] border border-neutral-100 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-green-50">
          <CheckCircle2 className="size-8 text-green-500" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-neutral-900">Thank you!</h2>
        <p className="text-neutral-500">
          Your testimonial has been submitted successfully and is pending review.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-[28px] border border-neutral-100 bg-white p-6 shadow-sm sm:p-10"
    >
      <div className="space-y-4">
        <label className="pl-1 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
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
                className={`size-8 transition-colors sm:size-10 ${
                  s <= (hoveredRating || rating)
                    ? "fill-pink-500 text-pink-500"
                    : "fill-neutral-100 text-neutral-100"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="pl-1 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
          Your story
        </label>
        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What did you love about our product?"
          rows={5}
          className="w-full resize-none rounded-2xl border border-neutral-100 bg-neutral-50/30 px-5 py-4 text-[15px] transition-all outline-none focus:border-pink-300 focus:bg-white focus:ring-2 focus:ring-pink-500/10"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          <label className="pl-1 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
            Your name
          </label>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="w-full rounded-2xl border border-neutral-100 bg-neutral-50/30 px-5 py-3.5 text-[15px] transition-all outline-none focus:border-pink-300 focus:bg-white focus:ring-2 focus:ring-pink-500/10"
          />
        </div>
        <div className="space-y-3">
          <label className="pl-1 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
            Email (optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            className="w-full rounded-2xl border border-neutral-100 bg-neutral-50/30 px-5 py-3.5 text-[15px] transition-all outline-none focus:border-pink-300 focus:bg-white focus:ring-2 focus:ring-pink-500/10"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#171717] py-4 text-[15px] font-bold text-white shadow-lg shadow-black/5 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? (
          <div className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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
