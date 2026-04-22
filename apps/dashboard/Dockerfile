FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json /app/package.json
COPY apps/dashboard/package.json /app/apps/dashboard/package.json
RUN npm install --workspace @jarvis/dashboard

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN npm --workspace @jarvis/dashboard run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/dashboard/.next/standalone ./
COPY --from=builder /app/apps/dashboard/.next/static ./apps/dashboard/.next/static
COPY --from=builder /app/apps/dashboard/public ./apps/dashboard/public
EXPOSE 3001
CMD ["node", "apps/dashboard/server.js"]
