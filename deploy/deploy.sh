#!/usr/bin/env bash
# Serverda ishga tushiriladi: kodni yangilaydi, image'ni build qiladi va
# konteynerlarni qayta ishga tushiradi. GitHub Actions ham shu skriptni chaqiradi.
#
#   ./deploy/deploy.sh            # main branch
#   DEPLOY_BRANCH=dev ./deploy/deploy.sh
set -euo pipefail

cd "$(dirname "$0")/.."
BRANCH="${DEPLOY_BRANCH:-main}"

if [ ! -f .env ]; then
  echo "XATO: .env fayli topilmadi. .env.example'dan nusxa oling va to'ldiring." >&2
  exit 1
fi

echo "==> Kod yangilanmoqda ($BRANCH)"
git fetch --prune origin "$BRANCH"
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"

echo "==> GeoIP baza"
./deploy/update-geoip.sh || echo "Ogohlantirish: GeoIP yangilanmadi, davom etamiz."

echo "==> Build (eski versiya shu vaqtda ishlab turadi)"
# .env o'zgarsa (masalan, yangi NEXT_PUBLIC_* qiymat) build qayta bajarilsin.
ENV_HASH=$(sha256sum .env | cut -d' ' -f1)
export ENV_HASH
docker compose build web

echo "==> Qayta ishga tushirish"
docker compose up -d --remove-orphans

echo "==> Tekshiruv"
for i in $(seq 1 45); do
  status=$(docker inspect -f '{{.State.Health.Status}}' "$(docker compose ps -q web)" 2>/dev/null || echo "unknown")
  if [ "$status" = "healthy" ]; then
    echo "Sayt ishlayapti ✔"
    docker image prune -f >/dev/null
    docker builder prune -f --filter until=72h >/dev/null || true
    exit 0
  fi
  sleep 2
done

echo "XATO: web konteyner sog'lom holatga o'tmadi. Loglar:" >&2
docker compose logs --tail=80 web >&2
exit 1
