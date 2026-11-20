#!/usr/bin/env bash
# Blog analitikasi uchun bepul GeoIP bazasini (DB-IP City Lite, CC BY 4.0)
# yuklab oladi. Baza oyda bir yangilanadi; fayl 30 kundan yangi bo'lsa — o'tkazib
# yuboriladi. Xato bo'lsa sayt ishlayveradi, faqat davlat/shahar bo'sh qoladi.
set -euo pipefail

cd "$(dirname "$0")/.."
DIR=geoip
FILE="$DIR/dbip-city-lite.mmdb"
mkdir -p "$DIR"

if [ -f "$FILE" ] && [ -z "$(find "$FILE" -mtime +30)" ]; then
  echo "GeoIP baza yangi: $FILE"
  exit 0
fi

this_month=$(date +%Y-%m)
prev_month=$(date -d "$(date +%Y-%m-01) -1 month" +%Y-%m)

for m in "$this_month" "$prev_month"; do
  url="https://download.db-ip.com/free/dbip-city-lite-$m.mmdb.gz"
  echo "Yuklanmoqda: $url"
  if curl -fsSL --retry 3 "$url" -o "$FILE.gz.tmp"; then
    gunzip -c "$FILE.gz.tmp" > "$FILE.tmp"
    rm -f "$FILE.gz.tmp"
    mv "$FILE.tmp" "$FILE"
    echo "GeoIP baza yangilandi ($m)."
    exit 0
  fi
done

rm -f "$FILE.gz.tmp" "$FILE.tmp"
echo "GeoIP bazani yuklab bo'lmadi." >&2
exit 1
