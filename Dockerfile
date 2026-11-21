# syntax=docker/dockerfile:1.7
#
# Pharm Way — production image (Next.js standalone).
# Build:  docker compose build   (.env faylini build-secret sifatida oladi)
# Run:    docker compose up -d

FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---------- 1. Dependencies ----------
FROM base AS deps
COPY package.json package-lock.json ./
# `postinstall` -> `prisma generate` uchun sxema kerak.
COPY prisma ./prisma
RUN npm ci --no-audit --no-fund

# ---------- 2. Build ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* qiymatlari build vaqtida JS'ga yoziladi, shuning uchun .env
# build paytida kerak. U secret sifatida ulanadi (image qatlamlariga tushmaydi).
# Next standalone build .env.production'ni .next/standalone'ga nusxalaydi —
# o'sha RUN ichida o'chiramiz, aks holda maxfiy kalitlar image'da qolib ketadi.
# BuildKit secret mazmunini kesh kalitiga kiritmaydi: ENV_HASH (.env xeshi,
# deploy.sh hisoblaydi) .env o'zgarganda shu qadamni qayta ishga tushiradi.
ARG ENV_HASH=""
RUN --mount=type=secret,id=app_env,target=/app/.env.production,required=true \
  npm run build \
  && rm -f .next/standalone/.env .next/standalone/.env.production

# ---------- 3. Runtime ----------
FROM base AS runner
ENV NODE_ENV=production \
  PORT=3000 \
  HOSTNAME=0.0.0.0
RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/robots.txt').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
