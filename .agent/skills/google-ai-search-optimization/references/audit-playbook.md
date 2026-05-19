# Google AI Search Audit Playbook

Use this reference for practical audits, roadmaps, and implementation checklists.

## Contents

- Audit Output Shape
- Technical Checklist
- Content Checklist
- Media Checklist
- Structured Data Checklist
- Ecommerce and Local Checklist
- Agent-Friendly Checklist
- Prioritization Heuristic
- Response Patterns

## Audit Output Shape

Lead with the highest-impact issues. Use this structure:

1. Executive readout: the main readiness verdict in plain language.
2. Priority findings: issue, evidence, impact, fix, validation.
3. Backlog: grouped by technical, content, media, structured data, ecommerce/local, and measurement.
4. Myths to ignore: unsupported tactics the client/team is considering.
5. Next validation: tools or checks to run.

Avoid presenting a generic checklist as if it were an audit. Tie every finding to observed evidence or clearly label it as an assumption.

Avoid making SEO feel like ceremony. A page does not need every optimization in this playbook to succeed; prioritize fixes that improve user satisfaction, crawlability, indexability, understanding, trust, or eligible Search appearance.

## Technical Checklist

Check:

- Important pages return `200`.
- Pages intended for visibility are not blocked by robots.txt, login walls, `noindex`, or contradictory crawl/index rules.
- Pages have indexable textual content in the HTML or rendered DOM.
- Google can access CSS, JS, images, video files, and other resources needed to understand the page.
- Internal links use crawlable `<a href>` links.
- Each meaningful page or app state has a stable URL.
- HTML is readable and semantic where practical, without treating perfect markup as a hard requirement.
- Canonical tags point to the preferred indexable URL.
- Duplicate, faceted, sorted, parameterized, or thin URLs are consolidated, canonicalized, blocked from crawling when appropriate, or removed from the crawl path.
- XML sitemaps list important and recently updated URLs.
- Title links and meta descriptions are unique and useful.
- The site is mobile-friendly, secure, fast enough for users, and avoids intrusive interstitials.
- Rendered output is tested for JavaScript-heavy pages.

Validation tools:

- Search Console URL Inspection.
- Search Console Page Indexing and Crawl Stats reports.
- Rich Results Test.
- PageSpeed Insights or Lighthouse.
- Server logs for crawl errors on large sites.

## Content Checklist

For each important page, check:

- A clear audience and purpose.
- A reason the page is better than generic search-result summaries.
- Firsthand experience, expert analysis, original data, examples, or a unique point of view.
- Enough detail for the reader to complete their task or make a decision.
- Clear evidence, sourcing, author context, site/about context, and review/update process where relevant.
- Descriptive title and main heading without exaggeration.
- Logical sections and headings.
- Helpful internal and external links.
- Relevant media that clarifies the topic.
- No filler written for word count.
- No mass-produced templates with swapped keywords.
- No fake freshness, unsupported promises, or invented answers.

Good content brief requirements:

- Audience and job-to-be-done.
- Original angle or firsthand evidence to include.
- Questions the page should answer directly.
- Proof points, examples, images, videos, tables, or comparisons.
- Trust signals: author, reviewer, sources, dates, methodology, limitations.
- Conversion or next-step path that does not bury the main answer.

## Media Checklist

For images:

- Use `<img>` or `<picture>` with a fallback `src`.
- Use descriptive alt text for meaningful images.
- Put images near relevant text.
- Use descriptive filenames where practical.
- Use representative high-resolution preview images in metadata or structured data when useful.
- Avoid CSS-only images for content Google should discover.
- Use image sitemaps for images that are hard to discover.

For videos:

- Make the video prominent on the watch page.
- Use a unique title and description.
- Provide a valid thumbnail.
- Add VideoObject structured data when eligible.
- Allow Google to fetch the video file or streaming URL when previews/key moments matter.
- Use Clip or SeekToAction structured data, or YouTube timestamps, for key moments when useful.
- Monitor Video indexing and Video rich result reports when Search Console access exists.

## Structured Data Checklist

Use structured data to make visible page facts explicit, not to stuff invisible claims.

Common useful types:

- `Organization` for official site, logo, and business identity.
- `BreadcrumbList` for page hierarchy.
- `Article` or equivalent only when the page is actually article-like.
- `Product`, offer, review, shipping, and return policy markup for ecommerce pages when accurate.
- `LocalBusiness` for local business details.
- `VideoObject` for video pages.
- `ImageObject` or `primaryImageOfPage` when preferred image selection matters.

Validate with Rich Results Test. Fix policy mismatches, missing required fields, and structured data that disagrees with visible content.

## Ecommerce and Local Checklist

For ecommerce:

- Verify Merchant Center is set up for the business.
- Ensure products are uploaded through an appropriate method: automatic crawl via schema.org, ecommerce platform integration, feed file, Google Sheets, manual entry, or API.
- Keep price, availability, shipping, return, identifiers, product images, and descriptions fresh.
- Make product pages crawlable and indexable unless intentionally excluded.
- Add Product structured data that matches visible product information.
- Consider Business Agent only when eligibility and rollout apply.

For local businesses:

- Claim and maintain Google Business Profile.
- Keep name, address, phone, hours, categories, photos, services, and support methods accurate.
- Ensure the website reinforces the same business facts.
- Add Organization/LocalBusiness and breadcrumb structured data where useful.

## Agent-Friendly Checklist

Check whether a browser agent could complete key user tasks:

- Buttons are `<button>` elements and navigation uses `<a href>`.
- Non-semantic controls have correct `role`, `tabindex`, labels, and action states if native controls cannot be used.
- Form fields have labels, names, visible states, and linked `<label for>` relationships where possible.
- Add-to-cart, booking, filtering, sorting, and checkout state changes are visible.
- Layout does not shift unexpectedly during the task.
- Transparent overlays, popups, and sticky elements do not hide controls.
- Critical information is present in text, not only in images, canvas, or video.
- Required interactive elements have a visible area larger than 8 square pixels and expected action cues such as `cursor: pointer`.
- Accessibility tree names and roles match the visible UI.

## Prioritization Heuristic

Use this order when a site has many problems:

1. Eligibility blockers: crawl, index, `200`, `noindex`, robots, auth, canonical mistakes.
2. Content value: commodity pages, missing expertise, thin or duplicated content.
3. Page understanding: titles, headings, internal links, visible text, media context, structured data.
4. User experience: mobile, speed, intrusive elements, main-content clarity.
5. Richer surfaces: images, videos, Merchant Center, Business Profile, Business Agent, agent-friendly improvements.
6. Measurement: Search Console reports, URL Inspection, performance tracking, ongoing content review.

## Response Patterns

For a myth-check:

- State whether Google supports the tactic.
- Explain the closest real Google mechanism.
- Recommend the user-centered/search-centered alternative.

For a content plan:

- Start from audience value and original evidence.
- Map query families to fewer stronger pages, not many thin variants.
- Add sections that answer related user needs naturally.
- Specify media and proof requirements.

For an implementation task:

- Make the smallest code/content changes that improve eligibility, understanding, or user value.
- Validate with local rendering, structured data tests, or crawl/index diagnostics when possible.
