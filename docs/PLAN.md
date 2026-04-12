# PLAN: IP-Based Rate Limiting on Collection Submission Endpoint

Implement robust IP-based rate limiting on the collection submission endpoint using Upstash Redis to prevent abuse and spam submissions. This will replace the current in-memory map which resets on server restarts and doesn't scale across multiple instances.

## 🏁 Goals

- [ ] **Scalability**: Move from `Map<string, ...>` to Upstash Redis to support multi-region/serverless deployments.
- [ ] **Security**: Limit submissions per IP Address (e.g., 5 submissions per 24 hours per IP).
- [ ] **Accuracy**: Utilize robust IP detection (Cloudflare-friendly headers) already present in the endpoint.
- [ ] **Standardization**: Implement `@upstash/ratelimit` and `@upstash/redis`.

---

## 🛠️ Implementation Phases

### Phase 1: Environment & Setup (devops-engineer)

1. **Dependencies**: Install `@upstash/ratelimit` and `@upstash/redis` in the appropriate workspace context.
2. **Environment Configuration**: Ensure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are documented as required.

### Phase 2: Refactoring (backend-specialist)

1. **Location**: Edit `apps/web/src/app/api/collection/[slug]/route.ts`.
2. **Setup Ratelimit**: Initialize the `Ratelimit` using the Upstash Redis client.
3. **Apply Limits**: Check the IP via `ratelimit.limit(ip)`.
4. **Error Handling**: Return a `429 Too Many Requests` status cleanly if `success` is false.
5. **Clean Up**: Remove the old in-memory `rateLimitMap`.

### Phase 3: Verification (security-auditor / test-engineer)

1. **Unit/Integration Check**: Trigger requests to ensure rate limits kick in at the designated threshold.

---

## 📝 Next Steps

1. Approve this plan.
2. Orchestrate implementation agents to carry out the dependency installation and refactoring.
