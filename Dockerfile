# StarBrandStudio — Payload 3 + Next.js 15 production image.
# debian-slim (not alpine) so `sharp` prebuilt binaries work without extra libs.
FROM node:22-slim AS base
WORKDIR /app
ENV NODE_ENV=production

# --- deps ---
FROM base AS deps
# .npmrc (legacy-peer-deps=true) is honored automatically by npm ci.
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# --- build ---
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# payload-types.ts is gitignored, so regenerate it before the type-checked build.
# DEFAULT_* fallbacks mean the build does not require a live DB connection.
ENV DATABASE_URI=postgres://placeholder:placeholder@localhost:5432/placeholder
ENV PAYLOAD_SECRET=build-time-placeholder-secret
RUN npm run generate:types && npm run build

# --- runtime ---
FROM base AS runtime
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/payload.config.ts ./payload.config.ts
COPY --from=build /app/payload-types.ts ./payload-types.ts
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/src ./src
# Media binaries are committed to the repo and baked in here, so they survive
# redeploys and host migrations without a persistent volume. (Self-hosted
# Coolify/Docker deploy — no Vercel Blob.) mkdir is a no-op safety net.
COPY --from=build /app/media ./media
RUN mkdir -p /app/media
EXPOSE 3000
CMD ["npm", "run", "start"]
