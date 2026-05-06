FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY client/package.json client/package.json
RUN npm install --workspace client --include-workspace-root

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/client/node_modules ./client/node_modules
COPY client ./client
WORKDIR /app/client
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app/client
ENV NODE_ENV=production
COPY --from=builder /app/client/.next ./.next
COPY --from=builder /app/client/public ./public
COPY --from=builder /app/client/package.json ./package.json
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/client/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "run", "start"]
