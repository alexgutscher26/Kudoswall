"use client";

import { useState } from "react";
import { Star, MessageSquareQuote, User, Mail, Send, CheckCircle2 } from "lucide-react";
import { submitTestimonial } from "./actions";
import { toast } from "sonner";

export default function CollectionForm({ project }: { project: any }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(5);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("projectId", project.id);
    formData.append("rating", rating.toString());

    try {
      const result = await submitTestimonial(formData);
      if (result.success) {
        setSubmitted(true);
        toast.success("Testimonial submitted!");
      }
    } catch (error) {
      toast.error("Failed to submit testimonial");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div 
        className="bg-white rounded-3xl p-8 sm:p-12 text-center shadow-xl border border-neutral-100 flex flex-col items-center animate-in zoom-in-95 duration-500"
      >
        <div className="size-20 rounded-full bg-emerald-50 flex items-center justify-center mb-8">
          <CheckCircle2 className="size-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-4 tracking-tight">Thank you so much!</h2>
        <p className="text-neutral-500 max-w-sm mx-auto leading-relaxed mb-10">
          Your feedback means the world to us. It helps us improve and shows others why they should choose us too!
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-neutral-400 hover:text-neutral-600 font-bold transition-all text-sm uppercase tracking-widest"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-neutral-100 overflow-hidden relative group transition-all duration-300">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500" />
      
      <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-8">
        {/* Rating */}
        <div className="space-y-4 text-center">
          <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest block">
            Your Rating
          </label>
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 hover:scale-125 active:scale-95 transition-all outline-none"
              >
                <Star
                  className={`size-8 transition-colors ${
                    star <= rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-200"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <MessageSquareQuote className="size-4 text-neutral-400" />
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
              Your Review
            </label>
          </div>
          <textarea
            name="content"
            required
            rows={5}
            placeholder="What did you love? How was your experience?"
            className="w-full px-5 py-4 rounded-2xl bg-neutral-50/50 border border-neutral-100 text-[15px] outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500/50 transition-all placeholder:text-neutral-300 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <User className="size-4 text-neutral-400" />
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                Full Name
              </label>
            </div>
            <input
              name="authorName"
              type="text"
              required
              placeholder="e.g. Jane Doe"
              className="w-full px-5 py-3 rounded-2xl bg-neutral-50/50 border border-neutral-100 text-[14px] outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500/50 transition-all placeholder:text-neutral-300"
            />
          </div>

          {/* Email */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Mail className="size-4 text-neutral-400" />
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                Email Address
              </label>
            </div>
            <input
              name="authorEmail"
              type="email"
              required
              placeholder="e.g. jane@company.com"
              className="w-full px-5 py-3 rounded-2xl bg-neutral-50/50 border border-neutral-100 text-[14px] outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500/50 transition-all placeholder:text-neutral-300"
            />
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-neutral-900 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="size-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Send Testimonial
                <Send className="size-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
