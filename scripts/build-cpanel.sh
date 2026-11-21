#!/usr/bin/env bash
# cPanel "Setup Node.js App" uchun tayyor ZIP yig'adi (Linux x64 da ishga tushiring).
#
#   bash scripts/build-cpanel.sh
#   -> dist/cpanel/pharmway-cpanel.zip   (ichida pharmway/ papka)
#
# Supabase anon kaliti va barcha maxfiy kalitlar ZIP ichiga yozilmaydi —
# ular cPanel'da Environment variables sifatida kiritiladi (CPANEL.md).
set -euo pipefail

cd "$(dirname "$0")/.."
OUT="dist/cpanel"
PKG="$OUT/pharmway"

# Build vaqtida kerak bo'ladigan qiymatlar. Supabase URL o'zgarmaydi va
# brauzer JS'iga yoziladi; server kalitlari esa faqat import xatosiz o'tishi
# uchun vaqtinchalik — ishlaganda cPanel'dagi haqiqiy qiymatlar o'qiladi.
export NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-https://akqjbbrclrlblrpxlutc.supabase.co}"
export SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-build-placeholder}"
export ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY:-build-placeholder}"
export NEXT_TELEMETRY_DISABLED=1

rm -rf .next "$OUT"
npm run build

mkdir -p "$PKG"
cp -a .next/standalone "$PKG/app"
# Next .env / .env.production'ni standalone'ga nusxalaydi — paketga kirmasin.
rm -f "$PKG/app/.env" "$PKG/app/.env.production" "$PKG/app/.env.local"
cp -a .next/static "$PKG/app/.next/static"
cp -a public "$PKG/app/public"
cp deploy/cpanel/app.js deploy/cpanel/package.json "$PKG/"
mkdir -p "$PKG/deploy"
cp deploy/update-geoip.sh "$PKG/deploy/"

if grep -rqs "build-placeholder" "$PKG/app"; then
  echo "XATO: vaqtinchalik kalit paketga tushib qoldi." >&2
  exit 1
fi

(cd "$OUT" && zip -qr -X pharmway-cpanel.zip pharmway)
echo "Tayyor: $OUT/pharmway-cpanel.zip ($(du -h "$OUT/pharmway-cpanel.zip" | cut -f1))"
