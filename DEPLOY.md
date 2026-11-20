# Pharm Way — o'z serverga ko'chirish va deploy

Sayt Vercel'dan o'z serverga (masalan, AHOST VPS) ko'chiriladi. **Faqat hosting
o'zgaradi**: ma'lumotlar bazasi, rasmlar va admin login Supabase'da qoladi — hech
narsa ko'chirilmaydi.

```
Internet ──► Caddy (80/443, avtomatik HTTPS) ──► web (Next.js, 3000) ──► Supabase
             pharmway.uz → www.pharmway.uz (301)
```

Repodagi fayllar:

| Fayl | Vazifasi |
|---|---|
| `Dockerfile` | Next.js standalone image (Node 22) |
| `docker-compose.yml` | `web` + `caddy` servislar |
| `deploy/Caddyfile` | Domenlar, HTTPS, apex → www redirect |
| `deploy/deploy.sh` | Serverda: `git pull` → build → qayta ishga tushirish → tekshiruv |
| `deploy/update-geoip.sh` | Analitika uchun GeoIP baza (davlat/shahar) |
| `.github/workflows/deploy.yml` | `main`'ga push bo'lganda avtomatik deploy |
| `.env.example` | Barcha muhit o'zgaruvchilari ro'yxati |

> **Muhim tartib:** avval sayt serverda ishga tushadi, keyin DNS o'tkaziladi,
> eng oxirida Vercel uziladi. Vercel'ni birinchi bo'lib uzsangiz, sayt DNS
> o'tguncha ishlamay qoladi.

---

## 1. Server talablari

- Ubuntu 22.04 / 24.04 (yoki Debian 12), root yoki `sudo` SSH kirish
- **RAM: kamida 2 GB** (build vaqtida kerak; 1 GB bo'lsa — swap qo'shing, pastda)
- Ochiq portlar: `22` (SSH), `80` va `443` (sayt). AHOST panelida firewall
  bo'lsa, u yerda ham oching.
- 80/443 portlarni boshqa dastur (nginx, apache, panel) egallamagan bo'lishi kerak:
  `sudo ss -ltnp | grep -E ':80|:443'` — bo'sh chiqishi kerak.

## 2. Serverni tayyorlash (bir marta)

```bash
ssh root@SERVER_IP
```

```bash
apt update && apt upgrade -y && apt install -y git curl dnsutils
```

Docker (rasmiy skript):

```bash
curl -fsSL https://get.docker.com | sh
```

Firewall:

```bash
ufw allow OpenSSH && ufw allow 80/tcp && ufw allow 443/tcp && ufw allow 443/udp && ufw --force enable
```

RAM 2 GB dan kam bo'lsa — 2 GB swap:

```bash
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile && echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

Deploy uchun alohida foydalanuvchi:

```bash
adduser --disabled-password --gecos "" deploy && usermod -aG docker deploy && mkdir -p /opt/pharmway && chown deploy:deploy /opt/pharmway
```

## 3. Kodni serverga olish

Server GitHub'dan kodni o'qishi uchun **deploy key** (faqat o'qish huquqi):

```bash
su - deploy
```

```bash
ssh-keygen -t ed25519 -C "pharmway-server" -f ~/.ssh/id_ed25519 -N "" && cat ~/.ssh/id_ed25519.pub
```

Chiqgan qatorni GitHub → `pharm_way` repo → **Settings → Deploy keys → Add deploy key**
ga qo'shing ("Allow write access" belgilanmasin). Keyin:

```bash
git clone git@github.com:azizbekherr-sys/pharm_way.git /opt/pharmway
```

## 4. `.env` faylini yaratish

```bash
cd /opt/pharmway && cp .env.example .env && nano .env
```

Qiymatlarni Vercel'dan oling: **Vercel → Project → Settings → Environment
Variables** (Production). Yoki o'z kompyuteringizda:

```bash
npx vercel login
```

```bash
npx vercel link
```

```bash
npx vercel env pull .env.vercel --environment=production
```

> Vercel'da "Sensitive" deb belgilangan qiymatlar bo'sh keladi — ularni asl
> manbadan oling (masalan, Supabase → Project Settings → API).

Majburiylari: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `TELEGRAM_BOT_TOKEN`,
`TELEGRAM_CHAT_ID`. Qolganlari ixtiyoriy.

```bash
chmod 600 .env
```

## 5. Birinchi ishga tushirish (DNS o'zgartirishdan oldin)

```bash
cd /opt/pharmway && ./deploy/deploy.sh
```

Birinchi build 3–6 daqiqa oladi. Oxirida `Sayt ishlayapti ✔` chiqishi kerak.
Ilovani DNS'siz tekshirish:

```bash
docker compose exec web node -e "fetch('http://127.0.0.1:3000/uz').then(r=>console.log('status', r.status))"
```

`status 200` — tayyor. Bu bosqichda Caddy loglarida sertifikat xatolari bo'ladi —
bu normal, DNS serverga qaramaguncha HTTPS sertifikat olinmaydi.

## 6. DNS'ni serverga o'tkazish

1. Domen qayerda boshqarilishini aniqlang (AHOST panel, yoki Vercel DNS bo'lsa —
   nameserverlar `ns1.vercel-dns.com` / `ns2.vercel-dns.com`).
   - Agar nameserverlar **Vercel**'niki bo'lsa: avval Vercel → **Domains** dan
     barcha yozuvlarni (ayniqsa **MX**, **TXT** — pochta va Google tasdiqlash)
     ko'chirib yozib oling, keyin domen registratorida (AHOST) nameserverlarni
     AHOST'nikiga qaytaring va o'sha yozuvlarni qayta yarating.
2. Yozuvlarni o'zgartiring:

   | Turi | Nomi | Qiymati |
   |---|---|---|
   | A | `@` (pharmway.uz) | `SERVER_IP` |
   | A | `www` | `SERVER_IP` |

   Eski Vercel yozuvlarini o'chiring: `A 76.76.21.21` va `CNAME cname.vercel-dns.com`.
   **MX va TXT yozuvlariga tegmang.**
3. Tarqalishini tekshiring (bir necha daqiqadan bir necha soatgacha):

   ```bash
   dig +short pharmway.uz www.pharmway.uz
   ```

4. Ikkalasi ham `SERVER_IP` ni ko'rsatgach, Caddy sertifikatni o'zi oladi.
   Tezlashtirish uchun:

   ```bash
   docker compose restart caddy && docker compose logs -f caddy
   ```

   `certificate obtained successfully` — tayyor.

## 7. Tekshiruv

- `https://www.pharmway.uz/uz` ochiladi, qulf belgisi bor
- `https://pharmway.uz` → `https://www.pharmway.uz` ga yo'naltiradi
- `https://www.pharmway.uz/robots.txt` va `/sitemap.xml` ishlaydi
- Admin panel: `https://www.pharmway.uz/admin/login` — kirish ishlaydi
- Kontakt formasi Telegram'ga xabar yuboradi
- Blog maqolasini oching → admin → Analitika'da yangi ko'rish (davlat/shahar bilan)

## 8. Vercel'dan uzish (sayt serverda ishlagandan keyin)

1. **Vercel → Project → Settings → Domains** — `pharmway.uz` va `www.pharmway.uz`
   ni olib tashlang (aks holda Vercel domenni "o'ziniki" deb ushlab turadi).
2. **Settings → Git → Disconnect** — GitHub push'larida Vercel build qilmaydi.
3. (Ixtiyoriy) **Settings → Advanced → Delete Project** — loyihani butunlay o'chirish.
4. **GitHub → Settings → Applications → Vercel → Configure** — `pharm_way` repoga
   ruxsatni olib tashlang (yoki ilovani butunlay o'chiring).
5. **Supabase → Authentication → URL Configuration** — Site URL /
   Redirect URLs'da `*.vercel.app` manzil bo'lsa, `https://www.pharmway.uz` ga almashtiring.

## 9. Avtomatik deploy (GitHub Actions)

`main` branchga har push'dan keyin GitHub serverga kirib `deploy/deploy.sh` ni
ishga tushiradi. Sozlash (o'z kompyuteringizda):

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ./gh_actions_key -N ""
```

`gh_actions_key.pub` ichidagi qatorni serverda (root sifatida) `deploy`
foydalanuvchisiga qo'shing — `OCHIQ_KALIT` o'rniga o'sha qatorni qo'ying:

```bash
mkdir -p /home/deploy/.ssh && echo "OCHIQ_KALIT" >> /home/deploy/.ssh/authorized_keys && chown -R deploy:deploy /home/deploy/.ssh && chmod 700 /home/deploy/.ssh && chmod 600 /home/deploy/.ssh/authorized_keys
```

Server fingerprint'i:

```bash
ssh-keyscan -p 22 SERVER_IP
```

GitHub → repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Qiymati |
|---|---|
| `SSH_HOST` | `SERVER_IP` |
| `SSH_USER` | `deploy` |
| `SSH_PRIVATE_KEY` | `gh_actions_key` faylining to'liq matni |
| `SSH_KNOWN_HOSTS` | `ssh-keyscan` natijasi |
| `SSH_PORT` | faqat 22 bo'lmasa |

Keyin **Actions → Deploy → Run workflow** bilan sinab ko'ring. `gh_actions_key`
faylini GitHub'ga qo'shgandan so'ng o'chirib tashlang.

## 10. Kundalik ishlar

Loglar:

```bash
cd /opt/pharmway && docker compose logs -f --tail=100 web
```

`.env` o'zgartirilgandan keyin (masalan, yangi `NEXT_PUBLIC_GTM_ID`) — qayta deploy
shart, chunki `NEXT_PUBLIC_*` build vaqtida saytga yoziladi:

```bash
cd /opt/pharmway && ./deploy/deploy.sh
```

Qayta ishga tushirish:

```bash
cd /opt/pharmway && docker compose restart web
```

Orqaga qaytarish: GitHub'da muammoli commit'ni **Revert** qiling — avtomatik
deploy eski holatni qaytaradi.

GeoIP bazasi har deploy'da (30 kundan eski bo'lsa) yangilanadi. Deploy kam
bo'lsa, oyiga bir marta yangilash uchun `deploy` foydalanuvchisining `crontab -e` siga:

```
0 4 3 * * cd /opt/pharmway && ./deploy/update-geoip.sh && docker compose restart web
```

## 11. Muammolar

| Belgi | Sabab va yechim |
|---|---|
| Build `Killed` / `JavaScript heap out of memory` bilan to'xtaydi | RAM yetmaydi — 2-bo'limdagi swap'ni qo'shing |
| `bind: address already in use` (80/443) | Serverda nginx/apache ishlayapti: `systemctl disable --now nginx apache2` |
| HTTPS ishlamaydi | `dig` bilan DNS'ni tekshiring; firewall'da 80/443 ochiqligini tekshiring; `docker compose logs caddy` |
| Analitikada davlat/shahar bo'sh | `ls -la geoip/` — baza yo'q bo'lsa `./deploy/update-geoip.sh` ni ishga tushiring |
| `.env` o'zgarishi saytda ko'rinmaydi | `docker compose up` emas, `./deploy/deploy.sh` ishlating |

Analitika geo ma'lumoti: [DB-IP](https://db-ip.com) IP Geolocation Lite (CC BY 4.0).
Agar sayt keyinchalik Cloudflare orqasiga qo'yilsa, Cloudflare'ning
`cf-ipcountry` / `cf-ipcity` sarlavhalari avtomatik ishlatiladi.
