# Stage 1: Install dependencies and build
FROM node:22-alpine AS build
WORKDIR /app

# Copy package files for layer caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy all source code
COPY . .

# Build the Next.js application
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 2: Production runtime
FROM node:22-alpine AS runtime
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copy standalone output
COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

EXPOSE 3000

USER nextjs

CMD ["node", "server.js"]
