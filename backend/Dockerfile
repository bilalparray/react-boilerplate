# ---------- Stage 1: Builder ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force


# ---------- Stage 2: Runtime ----------
FROM node:20-alpine

RUN apk add --no-cache dumb-init wget

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

WORKDIR /app

# Copy only built dependencies
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY . .

# Create upload directory with permissions
RUN mkdir -p /var/www/alpine-uploads && \
    chown -R nodejs:nodejs /var/www

USER nodejs

EXPOSE 8081

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "index.js"]
