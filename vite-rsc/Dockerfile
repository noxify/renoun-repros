# Base stage with Node.js and dependencies
FROM node:22-alpine AS base

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# hadolint ignore=DL3018
RUN apk update && \
    apk add --no-cache libc6-compat && \
    rm -rf /var/cache/apk/*

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Verify installations
RUN pnpm -v && node -v && npm -v

# Dependencies stage
FROM base AS deps
WORKDIR /app

COPY vite-rsc/package.json vite-rsc/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Builder stage
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY vite-rsc/ ./
COPY shared/content ./content

# Build the application
RUN pnpm build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 vite-rsc

# Install only serve-handler
RUN pnpm add serve-handler@latest

# Copy necessary files
COPY --from=builder --chown=vite-rsc:nodejs /app/dist ./dist
COPY --from=builder --chown=vite-rsc:nodejs /app/localserver.mjs ./localserver.mjs
COPY --from=builder --chown=vite-rsc:nodejs /app/public ./public

USER vite-rsc

EXPOSE 3000

CMD ["node", "localserver.mjs"]
