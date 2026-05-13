# ── Stage 1: Build React frontend ──────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# ── Stage 2: Production server ──────────────────────────────────────────────
FROM node:22-alpine

WORKDIR /app

# Install server deps
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev

# Copy server source
COPY server/ ./server/

# Copy built frontend from stage 1
COPY --from=builder /app/client/dist ./client/dist

# SQLite data directory — mount a volume here to persist the database
RUN mkdir -p /data
ENV DB_PATH=/data/library.db

EXPOSE 3001

CMD ["node", "server/index.js"]
