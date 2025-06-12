FROM node:22.12.0-alpine AS base

ENV NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production YARN_VERSION=4.9.1

RUN apk update && apk upgrade && apk add --no-cache libc6-compat dumb-init openssl cronie

RUN corepack enable && corepack prepare yarn@${YARN_VERSION}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

FROM base AS builder
WORKDIR /app

COPY . .
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install
RUN yarn build

FROM base AS runner
WORKDIR /app

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/scripts /app/scripts

USER nextjs

RUN echo "0 3 * * * cd /app && yarn import-data" | crontab -
CMD ["sh", "-c", "crond && dumb-init node server.js"]
