"use client";

import { useState, useTransition } from "react";
import { 
  Star, 
  User, 
  Check, 
  Archive, 
  Trash2, 
  Clock, 
  MessageSquareQuote,
  Search,
  Filter,
  ExternalLink,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@my-better-t-app/ui/components/dropdown-menu";
import { updateTestimonialStatus, deleteTestimonial } from "../actions";
import { formatDistanceToNow } from "date-fns";

interface Testimonial {
  id: string;
  projectId: string;
  content: string;
  authorName: string;
  authorEmail: string;
  authorImage: string | null;
  rating: number;
  status: "pending" | "approved" | "archived";
  type: "text" | "video";
  videoUrl?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface InboxProps {
  initialTestimonials: Testimonial[];
  project: {
    id: string;
    name: string;
    slug: string;
  };
}

export function TestimonialInbox({ initialTestimonials, project }: InboxProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "archived">("pending");
  const [typeFilter, setTypeFilter] = useState<"all" | "video" | "text">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [minRating, setMinRating] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredTestimonials = testimonials.filter((t) => {
    const matchesTab = activeTab === "all" || t.status === activeTab;
    const matchesType = typeFilter === "all" || t.type === typeFilter;
    const matchesSearch = 
      t.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.authorEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = minRating === null || t.rating >= minRating;
    return matchesTab && matchesType && matchesSearch && matchesRating;
  });

  const handleStatusUpdate = async (id: string, status: "approved" | "archived" | "pending") => {
    startTransition(async () => {
      try {
        await updateTestimonialStatus(id, status);
        setTestimonials((prev) => 
          prev.map((t) => (t.id === id ? { ...t, status } : t))
        );
        toast.success(`Testimonial ${status}`);
      } catch (error) {
        toast.error("Failed to update status");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    
    startTransition(async () => {
      try {
        await deleteTestimonial(id);
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        toast.success("Testimonial deleted");
      } catch (error) {
        toast.error("Failed to delete testimonial");
      }
    });
  };

  const tabs = [
    { id: "pending", label: "Pending", icon: Clock },
    { id: "approved", label: "Approved", icon: Check },
    { id: "archived", label: "Archived", icon: Archive },
    { id: "all", label: "All", icon: MessageSquareQuote },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Rating Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search testimonials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-50/50 border border-neutral-100 rounded-xl py-2 pl-10 pr-4 text-[14px] focus:outline-hidden focus:ring-2 focus:ring-pink-100 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`
                relative flex items-center gap-2 text-[13px] font-medium px-3 py-2 rounded-xl border transition-all outline-none
                ${minRating !== null 
                  ? "bg-pink-50 border-pink-200 text-pink-600" 
                  : "bg-white border-neutral-100 text-neutral-600 hover:bg-neutral-50"
                }
              `}
            >
              <Filter className={`size-3.5 ${minRating !== null ? "text-pink-500" : ""}`} />
              Rating
              {minRating !== null && (
                <span className="absolute -top-1 -right-1 size-2 bg-pink-500 rounded-full border-2 border-white shadow-sm" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl border-neutral-100 shadow-xl bg-white">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-2 py-1.5">
                  Minimum Rating
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-neutral-50" />
                <DropdownMenuRadioGroup 
                  value={minRating?.toString() || "all"} 
                  onValueChange={(val) => setMinRating(val === "all" ? null : parseInt(val))}
                >
                  <DropdownMenuRadioItem value="all" className="rounded-lg text-[13px]">
                    All Ratings
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="5" className="rounded-lg text-[13px] flex items-center gap-2">
                      <Star className="size-3 text-amber-400 fill-amber-400" />
                      <span>5 Stars only</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="4" className="rounded-lg text-[13px] flex items-center gap-2">
                      <Star className="size-3 text-amber-400 fill-amber-400" />
                      <span>4+ Stars</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="3" className="rounded-lg text-[13px] flex items-center gap-2">
                      <Star className="size-3 text-amber-400 fill-amber-400" />
                      <span>3+ Stars</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
              
              {minRating !== null && (
                <>
                  <DropdownMenuSeparator className="bg-neutral-50" />
                  <DropdownMenuItem 
                    onClick={() => setMinRating(null)}
                    className="rounded-lg text-[12px] text-pink-600 font-medium focus:text-pink-700 focus:bg-pink-50 cursor-pointer"
                  >
                    Clear Filter
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filter Toolbar (Type Switchers & Status Tabs) */}
      <div className="flex flex-wrap items-center justify-between gap-6 px-1">
        {/* Type Switchers (Pills) */}
        <div className="flex items-center gap-2.5">
          {(["all", "video", "text"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`
                px-5 py-2 rounded-full text-[13px] font-bold transition-all duration-200 capitalize border
                ${typeFilter === type
                  ? "bg-pink-50 text-pink-600 border-pink-200 shadow-sm"
                  : "bg-white text-neutral-400 border-neutral-100 hover:text-neutral-500 hover:border-neutral-200"
                }
              `}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100/50 rounded-xl w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count = testimonials.filter((t) => tab.id === "all" || t.status === tab.id).length;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all
                  ${isActive 
                    ? "bg-white text-neutral-900 shadow-sm border border-black/5" 
                    : "text-neutral-500 hover:text-neutral-700 hover:bg-white/50"
                  }
                `}
              >
                <Icon className={`size-3.5 ${isActive ? "text-pink-500" : "text-neutral-400"}`} />
                {tab.label}
                <span className={`
                  ml-1 text-[11px] px-1.5 py-0.5 rounded-full border
                  ${isActive ? "bg-neutral-50 border-neutral-100 text-neutral-600" : "bg-neutral-50/50 border-transparent text-neutral-400"}
                `}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTestimonials.length > 0 ? (
          filteredTestimonials.map((t) => (
            <TestimonialCard 
              key={t.id} 
              testimonial={t} 
              onUpdateStatus={handleStatusUpdate}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="text-center py-24 bg-white rounded-[32px] border border-dashed border-neutral-200">
            <div className="bg-neutral-50 size-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-100">
              <MessageSquareQuote className="size-8 text-neutral-300" />
            </div>
            <h3 className="text-[16px] font-bold text-neutral-900">No testimonials found</h3>
            <p className="text-[14px] text-neutral-500 mt-1 max-w-xs mx-auto leading-relaxed">
              {searchQuery || typeFilter !== "all" || minRating !== null 
                ? "Try adjusting your filters to find what you're looking for." 
                : "You haven't received any testimonials for this project yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function TestimonialCard({ 
  testimonial, 
  onUpdateStatus, 
  onDelete 
}: { 
  testimonial: Testimonial; 
  onUpdateStatus: (id: string, status: "approved" | "archived" | "pending") => void;
  onDelete: (id: string) => void;
}) {
  const t = testimonial;
  return (
    <div className="bg-white rounded-[24px] border border-neutral-100 p-6 sm:p-7 hover:shadow-xl hover:shadow-black/5 transition-all group relative overflow-hidden">
      {/* Status Accent Line */}
      <div 
        className={`absolute top-0 left-0 bottom-0 w-1 ${
          t.status === "approved" ? "bg-green-500" : t.status === "pending" ? "bg-amber-500" : "bg-neutral-300"
        }`} 
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`size-4 ${i < t.rating ? "text-amber-400 fill-amber-400" : "text-neutral-100 fill-neutral-100"}`} 
                />
              ))}
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-300">
              · {t.type} Testimonial
            </span>
          </div>

          <p 
            className="text-[17px] sm:text-[18px] leading-relaxed text-neutral-800 font-medium italic mb-8"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            "{t.content}"
          </p>

          <footer className="flex items-center gap-4">
            <div className="size-11 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center overflow-hidden shrink-0">
              {t.authorImage ? (
                <img src={t.authorImage} alt={t.authorName} className="size-full object-cover" />
              ) : (
                <User className="size-6 text-neutral-200" />
              )}
            </div>
            <div className="min-w-0">
              <h4 className="text-[15px] font-bold text-neutral-900 truncate">
                {t.authorName}
              </h4>
              <p className="text-[13px] text-neutral-400 flex items-center gap-2">
                {t.authorEmail}
                <span className="size-1 rounded-full bg-neutral-200" />
                {formatDistanceToNow(new Date(t.createdAt), { addSuffix: true })}
              </p>
            </div>
          </footer>
        </div>

        {/* Action Controls */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 lg:border-l border-neutral-100 pt-6 lg:pt-0 lg:pl-10 shrink-0 gap-6">
          <div className="flex lg:flex-col items-center gap-2.5">
            {t.status !== "approved" && (
              <button 
                onClick={() => onUpdateStatus(t.id, "approved")}
                className="flex items-center justify-center gap-2 px-4 h-10 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-all border border-green-200/50 font-bold text-[13px]"
              >
                <Check className="size-4" />
                Approve
              </button>
            )}
            {t.status === "approved" && (
              <button 
                onClick={() => onUpdateStatus(t.id, "pending")}
                className="flex items-center justify-center gap-2 px-4 h-10 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all border border-amber-200/50 font-bold text-[13px]"
              >
                <Clock className="size-4" />
                Waitlist
              </button>
            )}
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => onUpdateStatus(t.id, "archived")}
                className={`flex items-center justify-center size-10 rounded-xl transition-all border ${
                  t.status === "archived" 
                    ? "bg-neutral-900 text-white border-neutral-900" 
                    : "bg-white text-neutral-400 hover:text-neutral-900 hover:border-neutral-200 border-neutral-100 shadow-sm"
                }`}
                title="Archive"
              >
                <Archive className="size-4.5" />
              </button>
              <button 
                onClick={() => onDelete(t.id)}
                className="flex items-center justify-center size-10 rounded-xl bg-neutral-50 text-neutral-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all border border-neutral-100"
                title="Delete"
              >
                <Trash2 className="size-4.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
             <button className="flex items-center gap-2 text-[12px] font-bold text-neutral-300 hover:text-neutral-600 transition-colors uppercase tracking-widest">
               <ExternalLink className="size-3.5" />
               Raw Data
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
