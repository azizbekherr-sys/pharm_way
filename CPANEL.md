# Pharm Way — AHOST cPanel hostingga ko'chirish

Sayt Vercel'dan AHOST cPanel hostingiga (akkaunt `curelife`, server `de.ahost.cloud`)
ko'chiriladi. **Ma'lumotlar Supabase'da qoladi** (baza, rasmlar, admin login) —
ularni ko'chirish shart emas, yangi sayt Supabase'ga to'g'ridan-to'g'ri ulanadi.

Kerak bo'ladi:
- `pharmway-cpanel.zip` — tayyor sayt (`bash scripts/build-cpanel.sh` yig'adi)
- cPanel'ga kirish
- Supabase va boshqa kalitlar (1-qadam)

Taxminiy vaqt: 20–30 daqiqa + DNS tarqalishi.

---

## 0. cPanel'da Node.js borligini tekshiring

cPanel → **Software** bo'limi → **Setup Node.js App** bormi?

- **Bor** — davom eting.
- **Yo'q** — sayt Node.js'siz ishlamaydi. AHOST qo'llab-quvvatlashiga yozing:

  > Assalomu alaykum. curelife cPanel akkauntimda (server de.ahost.cloud) Next.js
  > (Node.js) saytini ishga tushirmoqchiman. Iltimos, "Setup Node.js App"
  > (CloudLinux Node.js Selector) funksiyasini Node.js 20 yoki 22 versiyasi bilan
  > yoqib bering. Shuningdek, Node.js ilovalar uchun RAM va CPU limitlarini ayting.

## 1. Kalitlarni tayyorlab qo'ying

Ular 4-qadamda cPanel'ga kiritiladi (chatga yoki boshqa joyga yozmang).

| O'zgaruvchi | Qayerdan olinadi |
|---|---|
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → loyiha → **Project Settings → API Keys** → `anon` `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | O'sha joy → `service_role` (maxfiy!) |
| `TELEGRAM_BOT_TOKEN` | Vercel → Project → Settings → Environment Variables (yoki BotFather) |
| `TELEGRAM_CHAT_ID` | Vercel → Environment Variables |
| `ANTHROPIC_API_KEY` | Vercel → Environment Variables (admin'dagi AI tarjima/to'ldirish uchun) |
| `UNSPLASH_ACCESS_KEY` | Vercel → Environment Variables (admin'dagi avto-rasm uchun) |

Vercel limiti tugagan bo'lsa ham dashboard ochiladi va qiymatlarni ko'rish mumkin.

Supabase'da loyiha holati **Active** ekanini ham tekshiring. **Paused** bo'lsa,
**Restore** tugmasini bosing.

## 2. Domenni cPanel'ga qo'shish

1. cPanel → **Domains → Domains → Create A New Domain**
2. Domain: `pharmway.uz`
3. **"Share document root" belgisini olib tashlang** (alohida papka: `pharmway.uz`)
4. **Submit**

### DNS

`pharmway.uz` ning DNS'i hozir **Webspace**'da (`dns1–4.webspace.uz`), yozuvlar
esa Vercel'ga qaragan (2026-11-20 holatiga). Eng oddiy yo'l — nameserverlarni
o'zgartirmasdan, **Webspace DNS panelida** 2 ta yozuvni almashtirish:

1. cPanel → o'ng paneldagi **General Information → Shared IP Address** ni
   ko'ring (odatda `167.235.222.200` — `de.ahost.cloud`).
2. Webspace → `pharmway.uz` → DNS yozuvlari:

   | Turi | Nomi | Eski (Vercel) — o'chiring | Yangi |
   |---|---|---|---|
   | A | `@` | `216.198.79.1` | `SHARED_IP` |
   | CNAME → A | `www` | `…vercel-dns-017.com` | A `SHARED_IP` |

   **MX va TXT yozuvlariga tegmang** (pochta, Google tasdiqlash).

Muqobil: nameserverlarni `ns1.ahost.cloud` / `ns2.ahost.cloud` ga o'zgartirish
(domen ro'yxatdan o'tgan joyda). Bunda avval Webspace'dagi barcha MX/TXT
yozuvlarini cPanel → **Zone Editor** ga ko'chiring.

## 3. Saytni yuklash

1. cPanel → **Files → File Manager** → bosh papka (`/home/curelife`)
2. **Upload** → `pharmway-cpanel.zip` ni yuklang
3. ZIP ustida o'ng tugma → **Extract** → `/home/curelife` → `pharmway` papka paydo bo'ladi
4. ZIP faylni o'chiring

Natija:

```
/home/curelife/pharmway/
  app.js          <- ishga tushirish fayli
  package.json
  app/            <- sayt
  deploy/update-geoip.sh
```

## 4. Node.js ilovani yaratish

cPanel → **Software → Setup Node.js App → Create Application**:

| Maydon | Qiymat |
|---|---|
| Node.js version | eng yangisi: **22.x** yoki **20.x** (kamida 18.18) |
| Application mode | **Production** |
| Application root | `pharmway` |
| Application URL | `pharmway.uz` (yo'l bo'sh qoladi) |
| Application startup file | `app.js` |

**Environment variables → Add Variable** — 1-qadamdagi 6 ta o'zgaruvchini kiriting.

**Create** → keyin **Restart**. "Run NPM Install" tugmasini bosish shart emas —
barcha kutubxonalar `app/` ichida.

> O'zgaruvchilarni keyin o'zgartirsangiz — saqlang va **Restart** bosing.

## 5. HTTPS

DNS serverga qaragach (bir necha daqiqadan bir necha soatgacha):

1. cPanel → **Security → SSL/TLS Status** → `pharmway.uz` va `www.pharmway.uz`
   ni belgilang → **Run AutoSSL**
2. cPanel → **Domains** → `pharmway.uz` → **Force HTTPS Redirect** ni yoqing

`pharmway.uz` → `https://www.pharmway.uz` yo'naltirishni sayt o'zi bajaradi.

## 6. Tekshiruv

- [ ] `https://www.pharmway.uz/uz` ochiladi, qulf belgisi bor
- [ ] `https://pharmway.uz` → `https://www.pharmway.uz` ga o'tadi
- [ ] Bosh sahifada hamkorlar logotiplari chiqadi (birinchi ochilishdan keyin 1–2 daqiqada)
- [ ] Blog, xizmatlar, hamkorlar sahifalari ochiladi
- [ ] `https://www.pharmway.uz/admin/login` — kirish ishlaydi
- [ ] Kontakt formasi Telegram'ga xabar yuboradi

## 7. Vercel'ni uzish

Sayt AHOST'da ishlagandan keyin:

1. **Vercel → Project → Settings → Domains** — `pharmway.uz` va `www.pharmway.uz` ni olib tashlang
2. **Settings → Git → Disconnect**
3. (Ixtiyoriy) **Settings → Advanced → Delete Project**
4. **Supabase → Authentication → URL Configuration** — Site URL /
   Redirect URLs'da `*.vercel.app` bo'lsa, `https://www.pharmway.uz` ga almashtiring

## 8. (Ixtiyoriy) Analitikada davlat/shahar

Admin → Analitika'dagi davlat/shahar uchun GeoIP baza kerak (~130 MB, RAM'da
ham shuncha joy oladi). cPanel → **Advanced → Cron Jobs** → oyiga bir marta:

```
0 4 3 * * bash /home/curelife/pharmway/deploy/update-geoip.sh && mkdir -p /home/curelife/pharmway/tmp && touch /home/curelife/pharmway/tmp/restart.txt
```

Birinchi marta darhol yuklash uchun vaqtni 2–3 daqiqa keyinga qo'yib, keyin
oylik jadvalga qaytaring. Hosting RAM limiti kichik bo'lsa va sayt sekinlashsa —
cron'ni o'chirib, `pharmway/geoip` papkani o'chiring.

## 9. Saytni yangilash

1. Yangi `pharmway-cpanel.zip` (`bash scripts/build-cpanel.sh`)
2. File Manager → `pharmway/app` papkani o'chiring → ZIP'ni `/home/curelife` ga
   yuklab **Extract** qiling (mavjud fayllar ustidan yozilsin)
3. Setup Node.js App → **Restart**

`.env` kerak emas — barcha kalitlar cPanel'da saqlanadi.

## Muammolar

| Belgi | Yechim |
|---|---|
| "Incomplete response" / 503 / sayt ochilmaydi | Setup Node.js App → ilova **Started** holatidami? Startup file `app.js`, root `pharmway` ekanini tekshiring. Xatoni ko'rish uchun "Passenger log file" maydoniga `/home/curelife/pharmway/app.log` yozib, Restart qiling va shu faylni oching |
| Admin login "Email yoki parol noto'g'ri", parol to'g'ri bo'lsa ham | `NEXT_PUBLIC_SUPABASE_ANON_KEY` to'g'ri kiritilganini tekshiring → Restart |
| Kontakt formasi xabar yubormaydi | `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` → Restart |
| "Resource Limit Is Reached" (508) | Hosting CPU/RAM limiti — AHOST'dan limitni so'rang |
| SSL olinmaydi | DNS hali tarqalmagan yoki nameserverlar AHOST'niki emas (2-qadam) |
