-- =============================================================
--  FIX: blog_views_stats funksiyasini to'liq versiyaga yangilaydi.
--  Avvalgi ishga tushirishda funksiya to'liqmas o'rnatilgan edi
--  (today / byOs / byLocale / byArticle / daily kalitlari yo'q edi).
--
--  Bu faylni Supabase → SQL Editor'da OCHIB, butunlay nusxalab, Run bosing.
--  "create or replace" — jadval va ma'lumotga tegmaydi, faqat funksiyani yangilaydi.
-- =============================================================

create or replace function public.blog_views_stats(since timestamptz)
returns json
language sql
stable
as $$
  select json_build_object(
    'allTime', (select count(*)::int from public.blog_views),
    'total',   (select count(*)::int from public.blog_views where created_at >= since),
    'today',   (select count(*)::int from public.blog_views
                 where created_at >= date_trunc('day', now() at time zone 'Asia/Tashkent') at time zone 'Asia/Tashkent'),

    'byCountry', (select coalesce(json_agg(t), '[]'::json) from (
        select country as key, count(*)::int as count
        from public.blog_views
        where created_at >= since and country is not null
        group by country order by count desc limit 60) t),

    'byCity', (select coalesce(json_agg(t), '[]'::json) from (
        select city as key, count(*)::int as count
        from public.blog_views
        where created_at >= since and city is not null
        group by city order by count desc limit 30) t),

    'byDevice', (select coalesce(json_agg(t), '[]'::json) from (
        select device as key, count(*)::int as count
        from public.blog_views
        where created_at >= since
        group by device order by count desc) t),

    'byBrowser', (select coalesce(json_agg(t), '[]'::json) from (
        select browser as key, count(*)::int as count
        from public.blog_views
        where created_at >= since and browser is not null
        group by browser order by count desc limit 15) t),

    'byOs', (select coalesce(json_agg(t), '[]'::json) from (
        select os as key, count(*)::int as count
        from public.blog_views
        where created_at >= since and os is not null
        group by os order by count desc limit 15) t),

    'byLocale', (select coalesce(json_agg(t), '[]'::json) from (
        select locale as key, count(*)::int as count
        from public.blog_views
        where created_at >= since and locale is not null
        group by locale order by count desc) t),

    'byReferrer', (select coalesce(json_agg(t), '[]'::json) from (
        select coalesce(referrer, 'direct') as key, count(*)::int as count
        from public.blog_views
        where created_at >= since
        group by coalesce(referrer, 'direct') order by count desc limit 15) t),

    'byArticle', (select coalesce(json_agg(t), '[]'::json) from (
        select v.slug as key, coalesce(b.title, v.slug) as title, count(*)::int as count
        from public.blog_views v
        left join public.blog_posts b on b.slug = v.slug
        where v.created_at >= since
        group by v.slug, b.title order by count desc limit 20) t),

    'daily', (select coalesce(json_agg(t order by t.day), '[]'::json) from (
        select to_char(date_trunc('day', created_at at time zone 'Asia/Tashkent'), 'YYYY-MM-DD') as day,
               count(*)::int as count
        from public.blog_views
        where created_at >= since
        group by 1) t)
  );
$$;

grant execute on function public.blog_views_stats(timestamptz) to service_role;
