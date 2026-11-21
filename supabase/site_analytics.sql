-- =============================================================
--  Pharm Way — butun sayt analitikasi (page_views) + pochta holati (mail_state)
--  Supabase Dashboard → SQL Editor'da bir marta ishga tushiring.
--  Hammasi "if not exists / or replace" — mavjud ma'lumotga tegmaydi.
-- =============================================================

-- Har bir sahifa ko'rilishi (blog, xizmatlar, bosh sahifa — hammasi).
-- IP manzil saqlanmaydi: tashrifchi faqat bir tomonlama hash (visitor) bilan belgilanadi.
create table if not exists public.page_views (
  id           bigint generated always as identity primary key,
  path         text        not null,              -- to'liq yo'l: /uz/blog/abc
  page         text        not null,              -- tilsiz yo'l: /blog/abc
  page_type    text        not null default 'other', -- home | blog | blog_post | services | service | ...
  title        text,                              -- sahifa sarlavhasi (document.title)
  locale       text,                              -- uz | ru | en
  visitor      text,                              -- anonim tashrifchi hash'i
  session_id   text,                              -- brauzer sessiyasi (30 daqiqa faolsizlikdan keyin yangilanadi)
  is_entry     boolean     not null default false, -- sessiyaning birinchi sahifasi
  country      text,
  region       text,
  city         text,
  device       text        not null default 'desktop', -- mobile | tablet | desktop
  os           text,
  browser      text,
  referrer     text,                              -- tashqi manba hosti (google.com, t.me ...)
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  created_at   timestamptz not null default now()
);

create index if not exists page_views_created_idx on public.page_views (created_at desc);
create index if not exists page_views_page_idx    on public.page_views (page);
create index if not exists page_views_session_idx on public.page_views (session_id);
create index if not exists page_views_visitor_idx on public.page_views (visitor);

-- Faqat server (service_role) o'qiydi/yozadi.
alter table public.page_views enable row level security;

-- Davr bo'yicha asosiy ko'rsatkichlar (taqqoslash uchun oldingi davrga ham chaqiriladi).
create or replace function public.site_analytics_totals(since timestamptz, until timestamptz)
returns json
language sql
stable
as $$
  with v as (
    select * from public.page_views where created_at >= since and created_at < until
  ),
  s as (
    select session_id,
           count(*) as n,
           extract(epoch from max(created_at) - min(created_at)) as dur
    from v
    where session_id is not null
    group by session_id
  )
  select json_build_object(
    'views',       (select count(*)::int from v),
    'visitors',    (select count(distinct visitor)::int from v),
    'sessions',    (select count(*)::int from s),
    'bounces',     (select count(*)::int from s where n = 1),
    'avgPages',    (select coalesce(round(avg(n)::numeric, 2), 0) from s),
    'avgDuration', (select coalesce(round(avg(dur)::numeric), 0) from s where n > 1)
  );
$$;

-- Barcha kesimlar bitta chaqiruvda.
create or replace function public.site_analytics(since timestamptz)
returns json
language sql
stable
as $$
  with v as (
    select * from public.page_views where created_at >= since
  )
  select json_build_object(
    'online',  (select count(distinct visitor)::int from public.page_views
                 where created_at >= now() - interval '5 minutes'),
    'allTime', (select count(*)::int from public.page_views),
    'firstAt', (select min(created_at) from public.page_views),

    'today', (select json_build_object('views', count(*)::int, 'visitors', count(distinct visitor)::int)
               from public.page_views
               where created_at >= date_trunc('day', now() at time zone 'Asia/Tashkent') at time zone 'Asia/Tashkent'),

    'newVisitors', (select count(*)::int from (
        select visitor, min(created_at) as first_at
        from public.page_views where visitor is not null
        group by visitor) f
      where f.first_at >= since),

    'daily', (select coalesce(json_agg(t order by t.day), '[]'::json) from (
        select to_char(date_trunc('day', created_at at time zone 'Asia/Tashkent'), 'YYYY-MM-DD') as day,
               count(*)::int as views,
               count(distinct visitor)::int as visitors,
               count(distinct session_id)::int as sessions
        from v group by 1) t),

    'hourly', (select coalesce(json_agg(t order by t.hour), '[]'::json) from (
        select extract(hour from created_at at time zone 'Asia/Tashkent')::int as hour, count(*)::int as count
        from v group by 1) t),

    'weekday', (select coalesce(json_agg(t order by t.dow), '[]'::json) from (
        select extract(isodow from created_at at time zone 'Asia/Tashkent')::int as dow, count(*)::int as count
        from v group by 1) t),

    'topPages', (select coalesce(json_agg(t), '[]'::json) from (
        select page as key, max(title) as title, count(*)::int as count, count(distinct visitor)::int as visitors
        from v group by page order by count desc limit 50) t),

    'pageTypes', (select coalesce(json_agg(t), '[]'::json) from (
        select page_type as key, count(*)::int as count
        from v group by page_type order by count desc) t),

    'entryPages', (select coalesce(json_agg(t), '[]'::json) from (
        select page as key, max(title) as title, count(*)::int as count
        from v where is_entry group by page order by count desc limit 20) t),

    'byCountry', (select coalesce(json_agg(t), '[]'::json) from (
        select country as key, count(*)::int as count, count(distinct visitor)::int as visitors
        from v where country is not null
        group by country order by count desc limit 100) t),

    'byCity', (select coalesce(json_agg(t), '[]'::json) from (
        select city as key, max(country) as country, count(*)::int as count, count(distinct visitor)::int as visitors
        from v where city is not null
        group by city order by count desc limit 60) t),

    'byDevice', (select coalesce(json_agg(t), '[]'::json) from (
        select device as key, count(*)::int as count, count(distinct visitor)::int as visitors
        from v group by device order by count desc) t),

    'byOs', (select coalesce(json_agg(t), '[]'::json) from (
        select os as key, count(*)::int as count
        from v where os is not null group by os order by count desc limit 20) t),

    'byBrowser', (select coalesce(json_agg(t), '[]'::json) from (
        select browser as key, count(*)::int as count
        from v where browser is not null group by browser order by count desc limit 20) t),

    'byLocale', (select coalesce(json_agg(t), '[]'::json) from (
        select locale as key, count(*)::int as count
        from v where locale is not null group by locale order by count desc) t),

    'byReferrer', (select coalesce(json_agg(t), '[]'::json) from (
        select coalesce(referrer, 'direct') as key, count(*)::int as count
        from v where is_entry
        group by coalesce(referrer, 'direct') order by count desc limit 30) t),

    'byUtm', (select coalesce(json_agg(t), '[]'::json) from (
        select concat_ws(' / ', utm_source, utm_medium, utm_campaign) as key, count(*)::int as count
        from v where is_entry and utm_source is not null
        group by 1 order by count desc limit 30) t)
  );
$$;

grant execute on function public.site_analytics_totals(timestamptz, timestamptz) to service_role;
grant execute on function public.site_analytics(timestamptz) to service_role;

-- info@pharmway.uz pochtasidan Telegram'ga yuborilgan oxirgi xat (takror yubormaslik uchun).
create table if not exists public.mail_state (
  mailbox      text primary key,
  uid_validity bigint,
  last_uid     bigint not null default 0,
  checked_at   timestamptz,
  last_error   text
);

alter table public.mail_state enable row level security;
