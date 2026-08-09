--
-- PostgreSQL database dump
--

\restrict VxJmuvJ2uBNYRy1bAbKsxFaZJrqtRVgRkzHkwcqhPhqEkR7FpEulkmxW2OukqyM

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: awards_page; Type: TABLE DATA; Schema: public; Owner: -
--

SET SESSION AUTHORIZATION DEFAULT;

ALTER TABLE public.awards_page DISABLE TRIGGER ALL;

COPY public.awards_page (id, eyebrow, heading, updated_at, created_at) FROM stdin;
1	AWARDS	AWARD-WINNING IDEAS\nGROUNDED IN GOOD STORYTELLING	2026-06-19 14:00:07.898+08	2026-06-17 21:34:14.119+08
\.


ALTER TABLE public.awards_page ENABLE TRIGGER ALL;

--
-- Data for Name: awards_page_years; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.awards_page_years DISABLE TRIGGER ALL;

COPY public.awards_page_years (_order, _parent_id, id, year) FROM stdin;
1	1	6a34dae7de492b009c35e5f9	2025
2	1	6a34dae7de492b009c35e5ff	2024
3	1	6a34dae7de492b009c35e601	2023
\.


ALTER TABLE public.awards_page_years ENABLE TRIGGER ALL;

--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.media DISABLE TRIGGER ALL;

COPY public.media (id, alt, caption, updated_at, created_at, url, thumbnail_u_r_l, filename, mime_type, filesize, width, height, focal_x, focal_y, sizes_thumbnail_url, sizes_thumbnail_width, sizes_thumbnail_height, sizes_thumbnail_mime_type, sizes_thumbnail_filesize, sizes_thumbnail_filename, sizes_card_url, sizes_card_width, sizes_card_height, sizes_card_mime_type, sizes_card_filesize, sizes_card_filename, sizes_large_url, sizes_large_width, sizes_large_height, sizes_large_mime_type, sizes_large_filesize, sizes_large_filename) FROM stdin;
1	Train To Busan	\N	2026-06-17 21:34:08.09+08	2026-06-17 21:34:08.086+08	/api/media/file/01-busan.jpg	\N	01-busan.jpg	image/jpeg	677955	1921	1081	50	50	/api/media/file/01-busan-400x225.jpg	400	225	image/jpeg	16863	01-busan-400x225.jpg	/api/media/file/01-busan-768x432.jpg	768	432	image/jpeg	48077	01-busan-768x432.jpg	/api/media/file/01-busan-1920x1080.jpg	1920	1080	image/jpeg	209977	01-busan-1920x1080.jpg
2	The Launch of EQ	\N	2026-06-17 21:34:08.729+08	2026-06-17 21:34:08.729+08	/api/media/file/02-eq.png	\N	02-eq.png	image/png	1482447	1921	1081	50	50	/api/media/file/02-eq-400x225.png	400	225	image/png	117409	02-eq-400x225.png	/api/media/file/02-eq-768x432.png	768	432	image/png	330784	02-eq-768x432.png	/api/media/file/02-eq-1920x1080.png	1920	1080	image/png	1527281	02-eq-1920x1080.png
3	The Sustainable Palm Oil Revolution	\N	2026-06-17 21:34:08.926+08	2026-06-17 21:34:08.926+08	/api/media/file/03-mpoc.jpg	\N	03-mpoc.jpg	image/jpeg	543911	1921	1081	50	50	/api/media/file/03-mpoc-400x225.jpg	400	225	image/jpeg	18077	03-mpoc-400x225.jpg	/api/media/file/03-mpoc-768x432.jpg	768	432	image/jpeg	52262	03-mpoc-768x432.jpg	/api/media/file/03-mpoc-1920x1080.jpg	1920	1080	image/jpeg	212383	03-mpoc-1920x1080.jpg
4	Timepiece of tradition	\N	2026-06-17 21:34:09.465+08	2026-06-17 21:34:09.465+08	/api/media/file/04-patek.jpg	\N	04-patek.jpg	image/jpeg	921497	2878	1458	50	50	/api/media/file/04-patek-400x203.jpg	400	203	image/jpeg	16578	04-patek-400x203.jpg	/api/media/file/04-patek-768x389.jpg	768	389	image/jpeg	56223	04-patek-768x389.jpg	/api/media/file/04-patek-1920x973.jpg	1920	973	image/jpeg	220163	04-patek-1920x973.jpg
5	Auchentoshan	\N	2026-06-17 21:34:10.026+08	2026-06-17 21:34:10.026+08	/api/media/file/05-auchentoshan.jpg	\N	05-auchentoshan.jpg	image/jpeg	990635	2880	1508	50	50	/api/media/file/05-auchentoshan-400x209.jpg	400	209	image/jpeg	20516	05-auchentoshan-400x209.jpg	/api/media/file/05-auchentoshan-768x402.jpg	768	402	image/jpeg	59567	05-auchentoshan-768x402.jpg	/api/media/file/05-auchentoshan-1920x1005.jpg	1920	1005	image/jpeg	214381	05-auchentoshan-1920x1005.jpg
6	#JomSapot BeliLokal Integrated Marketing Campaign	\N	2026-06-17 21:34:10.159+08	2026-06-17 21:34:10.159+08	/api/media/file/06-jomsapot.jpg	\N	06-jomsapot.jpg	image/jpeg	450816	1920	1080	50	50	/api/media/file/06-jomsapot-400x225.jpg	400	225	image/jpeg	15781	06-jomsapot-400x225.jpg	/api/media/file/06-jomsapot-768x432.jpg	768	432	image/jpeg	38748	06-jomsapot-768x432.jpg	/api/media/file/06-jomsapot-1920x1080.jpg	1920	1080	image/jpeg	140970	06-jomsapot-1920x1080.jpg
7	Elmina Rainforest Knowledge Centre Sustainability Campaign	\N	2026-06-17 21:34:10.698+08	2026-06-17 21:34:10.698+08	/api/media/file/07-elmina.jpg	\N	07-elmina.jpg	image/jpeg	965290	2864	1510	50	50	/api/media/file/07-elmina-400x211.jpg	400	211	image/jpeg	15343	07-elmina-400x211.jpg	/api/media/file/07-elmina-768x405.jpg	768	405	image/jpeg	47693	07-elmina-768x405.jpg	/api/media/file/07-elmina-1920x1012.jpg	1920	1012	image/jpeg	207294	07-elmina-1920x1012.jpg
8	Gamuda Technology Website	\N	2026-06-17 21:34:12.04+08	2026-06-17 21:34:12.04+08	/api/media/file/08-gamuda.png	\N	08-gamuda.png	image/png	5024927	2880	1800	50	50	/api/media/file/08-gamuda-400x250.png	400	250	image/png	205500	08-gamuda-400x250.png	/api/media/file/08-gamuda-768x480.png	768	480	image/png	662620	08-gamuda-768x480.png	/api/media/file/08-gamuda-1920x1200.png	1920	1200	image/png	3129729	08-gamuda-1920x1200.png
9		\N	2026-06-17 21:34:12.077+08	2026-06-17 21:34:12.077+08	/api/media/file/thestar.png	\N	thestar.png	image/png	6176	154	53	50	50	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
10		\N	2026-06-17 21:34:12.122+08	2026-06-17 21:34:12.122+08	/api/media/file/mstar.png	\N	mstar.png	image/png	7805	139	57	50	50	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
11		\N	2026-06-17 21:34:12.144+08	2026-06-17 21:34:12.144+08	/api/media/file/star-property.png	\N	star-property.png	image/png	9411	157	48	50	50	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
12		\N	2026-06-17 21:34:12.162+08	2026-06-17 21:34:12.162+08	/api/media/file/rage.png	\N	rage.png	image/png	5462	162	62	50	50	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
13		\N	2026-06-17 21:34:12.18+08	2026-06-17 21:34:12.18+08	/api/media/file/kuntum.png	\N	kuntum.png	image/png	13421	169	62	50	50	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
14		\N	2026-06-17 21:34:12.202+08	2026-06-17 21:34:12.202+08	/api/media/file/suria.png	\N	suria.png	image/png	6245	166	67	50	50	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
15		\N	2026-06-17 21:34:12.223+08	2026-06-17 21:34:12.223+08	/api/media/file/988.png	\N	988.png	image/png	6818	107	107	50	50	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
16		\N	2026-06-17 21:34:12.241+08	2026-06-17 21:34:12.241+08	/api/media/file/award1.png	\N	award1.png	image/png	24548	286	258	50	50	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
17		\N	2026-06-17 21:34:12.264+08	2026-06-17 21:34:12.264+08	/api/media/file/award2.png	\N	award2.png	image/png	29749	287	258	50	50	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
18		\N	2026-06-17 21:34:12.285+08	2026-06-17 21:34:12.285+08	/api/media/file/award3.png	\N	award3.png	image/png	32148	287	258	50	50	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
19		\N	2026-06-17 21:34:12.303+08	2026-06-17 21:34:12.303+08	/api/media/file/award4.png	\N	award4.png	image/png	34731	287	258	50	50	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
20		\N	2026-06-17 21:34:12.321+08	2026-06-17 21:34:12.321+08	/api/media/file/award5.png	\N	award5.png	image/png	42053	286	258	50	50	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
21		\N	2026-06-17 21:34:12.338+08	2026-06-17 21:34:12.338+08	/api/media/file/awards-image-1.png	\N	awards-image-1.png	image/png	58603	169	127	50	50	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
22	SMG	\N	2026-06-17 21:34:13.802+08	2026-06-17 21:34:13.802+08	/api/media/file/SMG_Logo-Loop-Animation.gif	\N	SMG_Logo-Loop-Animation.gif	image/gif	58320	1200	480	50	50	/api/media/file/SMG_Logo-Loop-Animation-400x160.gif	400	160	image/gif	13324	SMG_Logo-Loop-Animation-400x160.gif	/api/media/file/SMG_Logo-Loop-Animation-768x307.gif	768	307	image/gif	31541	SMG_Logo-Loop-Animation-768x307.gif	\N	\N	\N	\N	\N	\N
23	Gucci	\N	2026-06-17 21:34:13.824+08	2026-06-17 21:34:13.824+08	/api/media/file/gucci.png	\N	gucci.png	image/png	100860	373	188	50	50	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
24	Nike	\N	2026-06-17 21:34:13.84+08	2026-06-17 21:34:13.84+08	/api/media/file/nikethumb.png	\N	nikethumb.png	image/png	154918	373	188	50	50	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
25	Snickers	\N	2026-06-17 21:34:13.86+08	2026-06-17 21:34:13.86+08	/api/media/file/snickers.png	\N	snickers.png	image/png	197187	373	188	50	50	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
26	McDonald's	\N	2026-06-17 21:34:13.877+08	2026-06-17 21:34:13.877+08	/api/media/file/mcdonalds.png	\N	mcdonalds.png	image/png	124234	373	188	50	50	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
27	SMG Brand Studio	\N	2026-06-17 21:34:13.895+08	2026-06-17 21:34:13.895+08	/api/media/file/smg-brand-studio.png	\N	smg-brand-studio.png	image/png	2234	89	33	50	50	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
28	Facebook	\N	2026-06-17 21:34:13.919+08	2026-06-17 21:34:13.919+08	/api/media/file/facebook.svg	\N	facebook.svg	image/svg+xml	1293	43	43	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
29	Instagram	\N	2026-06-17 21:34:13.938+08	2026-06-17 21:34:13.938+08	/api/media/file/instagram.svg	\N	instagram.svg	image/svg+xml	1548	43	43	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
30	works featured image	\N	2026-06-17 23:13:28.977+08	2026-06-17 23:13:28.977+08	/api/media/file/works-1.png	\N	works-1.png	image/png	197804	517	260	50	50	/api/media/file/works-1-400x201.png	400	201	image/png	133549	works-1-400x201.png	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
31	works	\N	2026-06-18 12:02:00.663+08	2026-06-18 12:02:00.662+08	/api/media/file/works-2.jpg	\N	works-2.jpg	image/jpeg	5570861	4096	2734	50	50	/api/media/file/works-2-400x267.jpg	400	267	image/jpeg	13743	works-2-400x267.jpg	/api/media/file/works-2-768x513.jpg	768	513	image/jpeg	37430	works-2-768x513.jpg	/api/media/file/works-2-1920x1282.jpg	1920	1282	image/jpeg	153675	works-2-1920x1282.jpg
32	works	\N	2026-06-18 12:23:26.565+08	2026-06-18 12:23:26.565+08	/api/media/file/works-3.jpg	\N	works-3.jpg	image/jpeg	7884138	4096	2731	50	50	/api/media/file/works-3-400x267.jpg	400	267	image/jpeg	18973	works-3-400x267.jpg	/api/media/file/works-3-768x512.jpg	768	512	image/jpeg	48301	works-3-768x512.jpg	/api/media/file/works-3-1920x1280.jpg	1920	1280	image/jpeg	180168	works-3-1920x1280.jpg
33	Works	\N	2026-06-18 20:03:15.582+08	2026-06-18 20:03:15.58+08	/api/media/file/works-bg-1.png	\N	works-bg-1.png	image/png	698527	1440	721	50	50	/api/media/file/works-bg-1-400x200.png	400	200	image/png	97193	works-bg-1-400x200.png	/api/media/file/works-bg-1-768x385.png	768	385	image/png	295181	works-bg-1-768x385.png	\N	\N	\N	\N	\N	\N
34	Works	\N	2026-06-18 20:21:04.708+08	2026-06-18 20:21:04.704+08	/api/media/file/works-bg-2.png	\N	works-bg-2.png	image/png	698527	1440	721	50	50	/api/media/file/works-bg-2-400x200.png	400	200	image/png	97193	works-bg-2-400x200.png	/api/media/file/works-bg-2-768x385.png	768	385	image/png	295181	works-bg-2-768x385.png	\N	\N	\N	\N	\N	\N
35	Works	\N	2026-06-18 20:30:51.522+08	2026-06-18 20:30:51.518+08	/api/media/file/works-bg-3.png	\N	works-bg-3.png	image/png	698527	1440	721	50	50	/api/media/file/works-bg-3-400x200.png	400	200	image/png	97193	works-bg-3-400x200.png	/api/media/file/works-bg-3-768x385.png	768	385	image/png	295181	works-bg-3-768x385.png	\N	\N	\N	\N	\N	\N
36	Works	\N	2026-06-19 12:51:57.529+08	2026-06-19 12:51:57.523+08	/api/media/file/works-bg-4.png	\N	works-bg-4.png	image/png	698527	1440	721	50	50	/api/media/file/works-bg-4-400x200.png	400	200	image/png	97193	works-bg-4-400x200.png	/api/media/file/works-bg-4-768x385.png	768	385	image/png	295181	works-bg-4-768x385.png	\N	\N	\N	\N	\N	\N
37	RHB #JomSapot BeliLokal	\N	2026-06-19 12:51:57.851+08	2026-06-19 12:51:57.851+08	/api/media/file/MastheadRHB_Shot.jpg	\N	MastheadRHB_Shot.jpg	image/jpeg	450816	1920	1080	50	50	/api/media/file/MastheadRHB_Shot-400x225.jpg	400	225	image/jpeg	15781	MastheadRHB_Shot-400x225.jpg	/api/media/file/MastheadRHB_Shot-768x432.jpg	768	432	image/jpeg	38748	MastheadRHB_Shot-768x432.jpg	/api/media/file/MastheadRHB_Shot-1920x1080.jpg	1920	1080	image/jpeg	140970	MastheadRHB_Shot-1920x1080.jpg
38	The Sustainable Palm Oil Revolution	\N	2026-06-19 12:51:58.133+08	2026-06-19 12:51:58.133+08	/api/media/file/Copy%20of%20mpoc1.jpg	\N	Copy of mpoc1.jpg	image/jpeg	543911	1921	1081	50	50	/api/media/file/Copy%20of%20mpoc1-400x225.jpg	400	225	image/jpeg	18077	Copy of mpoc1-400x225.jpg	/api/media/file/Copy%20of%20mpoc1-768x432.jpg	768	432	image/jpeg	52262	Copy of mpoc1-768x432.jpg	/api/media/file/Copy%20of%20mpoc1-1920x1080.jpg	1920	1080	image/jpeg	212383	Copy of mpoc1-1920x1080.jpg
39	The Star ESG	\N	2026-06-19 12:51:58.986+08	2026-06-19 12:51:58.986+08	/api/media/file/4433%40712817_PULLOUT_SP03_NAT_27-02-2025_p01.jpg	\N	4433@712817_PULLOUT_SP03_NAT_27-02-2025_p01.jpg	image/jpeg	990635	2880	1508	50	50	/api/media/file/4433%40712817_PULLOUT_SP03_NAT_27-02-2025_p01-400x209.jpg	400	209	image/jpeg	20516	4433@712817_PULLOUT_SP03_NAT_27-02-2025_p01-400x209.jpg	/api/media/file/4433%40712817_PULLOUT_SP03_NAT_27-02-2025_p01-768x402.jpg	768	402	image/jpeg	59567	4433@712817_PULLOUT_SP03_NAT_27-02-2025_p01-768x402.jpg	/api/media/file/4433%40712817_PULLOUT_SP03_NAT_27-02-2025_p01-1920x1005.jpg	1920	1005	image/jpeg	214381	4433@712817_PULLOUT_SP03_NAT_27-02-2025_p01-1920x1005.jpg
40	Works	\N	2026-06-19 13:03:29.716+08	2026-06-19 13:03:29.713+08	/api/media/file/works-bg-5.png	\N	works-bg-5.png	image/png	698527	1440	721	50	50	/api/media/file/works-bg-5-400x200.png	400	200	image/png	97193	works-bg-5-400x200.png	/api/media/file/works-bg-5-768x385.png	768	385	image/png	295181	works-bg-5-768x385.png	\N	\N	\N	\N	\N	\N
41	Elmina Rainforest Knowledge Centre campaign masthead	\N	2026-06-19 13:03:32.467+08	2026-06-19 13:03:32.467+08	/api/media/file/elmina-masthead.gif	\N	elmina-masthead.gif	image/gif	409667	970	250	50	50	/api/media/file/elmina-masthead-400x103.gif	400	103	image/gif	98497	elmina-masthead-400x103.gif	/api/media/file/elmina-masthead-768x198.gif	768	198	image/gif	355203	elmina-masthead-768x198.gif	\N	\N	\N	\N	\N	\N
42	RHB #JomSapot BeliLokal	\N	2026-06-19 13:03:32.62+08	2026-06-19 13:03:32.62+08	/api/media/file/rhb-jomsapot.jpg	\N	rhb-jomsapot.jpg	image/jpeg	348337	1920	1222	50	50	/api/media/file/rhb-jomsapot-400x255.jpg	400	255	image/jpeg	24852	rhb-jomsapot-400x255.jpg	/api/media/file/rhb-jomsapot-768x489.jpg	768	489	image/jpeg	66771	rhb-jomsapot-768x489.jpg	/api/media/file/rhb-jomsapot-1920x1222.jpg	1920	1222	image/jpeg	271241	rhb-jomsapot-1920x1222.jpg
43	RHB #JomSapot BeliLokal masthead	\N	2026-06-19 13:03:32.726+08	2026-06-19 13:03:32.726+08	/api/media/file/rhb-masthead.jpg	\N	rhb-masthead.jpg	image/jpeg	162919	1920	1080	50	50	/api/media/file/rhb-masthead-400x225.jpg	400	225	image/jpeg	17017	rhb-masthead-400x225.jpg	/api/media/file/rhb-masthead-768x432.jpg	768	432	image/jpeg	42059	rhb-masthead-768x432.jpg	/api/media/file/rhb-masthead-1920x1080.jpg	1920	1080	image/jpeg	160251	rhb-masthead-1920x1080.jpg
44	RHB #JomSapot BeliLokal	\N	2026-06-19 13:03:32.835+08	2026-06-19 13:03:32.835+08	/api/media/file/rhb-cta.jpg	\N	rhb-cta.jpg	image/jpeg	189138	1920	1080	50	50	/api/media/file/rhb-cta-400x225.jpg	400	225	image/jpeg	18110	rhb-cta-400x225.jpg	/api/media/file/rhb-cta-768x432.jpg	768	432	image/jpeg	46649	rhb-cta-768x432.jpg	/api/media/file/rhb-cta-1920x1080.jpg	1920	1080	image/jpeg	185691	rhb-cta-1920x1080.jpg
45	TNB Powering The Future	\N	2026-06-19 13:03:32.968+08	2026-06-19 13:03:32.968+08	/api/media/file/tnb-1.jpg	\N	tnb-1.jpg	image/jpeg	418650	1920	1282	50	50	/api/media/file/tnb-1-400x267.jpg	400	267	image/jpeg	27624	tnb-1-400x267.jpg	/api/media/file/tnb-1-768x513.jpg	768	513	image/jpeg	83523	tnb-1-768x513.jpg	/api/media/file/tnb-1-1920x1282.jpg	1920	1282	image/jpeg	376756	tnb-1-1920x1282.jpg
46	TNB Powering The Future	\N	2026-06-19 13:03:33.095+08	2026-06-19 13:03:33.095+08	/api/media/file/tnb-2.jpg	\N	tnb-2.jpg	image/jpeg	412341	1920	1282	50	50	/api/media/file/tnb-2-400x267.jpg	400	267	image/jpeg	32564	tnb-2-400x267.jpg	/api/media/file/tnb-2-768x513.jpg	768	513	image/jpeg	91040	tnb-2-768x513.jpg	/api/media/file/tnb-2-1920x1282.jpg	1920	1282	image/jpeg	368756	tnb-2-1920x1282.jpg
47	TNB Powering The Future	\N	2026-06-19 13:03:33.224+08	2026-06-19 13:03:33.224+08	/api/media/file/tnb-3.jpg	\N	tnb-3.jpg	image/jpeg	325178	1920	1280	50	50	/api/media/file/tnb-3-400x267.jpg	400	267	image/jpeg	24214	tnb-3-400x267.jpg	/api/media/file/tnb-3-768x512.jpg	768	512	image/jpeg	66915	tnb-3-768x512.jpg	/api/media/file/tnb-3-1920x1280.jpg	1920	1280	image/jpeg	291192	tnb-3-1920x1280.jpg
48	TNB Powering The Future	\N	2026-06-19 13:03:33.375+08	2026-06-19 13:03:33.374+08	/api/media/file/tnb-4.jpg	\N	tnb-4.jpg	image/jpeg	452344	1920	1441	50	50	/api/media/file/tnb-4-400x300.jpg	400	300	image/jpeg	33677	tnb-4-400x300.jpg	/api/media/file/tnb-4-768x576.jpg	768	576	image/jpeg	92175	tnb-4-768x576.jpg	/api/media/file/tnb-4-1920x1441.jpg	1920	1441	image/jpeg	401171	tnb-4-1920x1441.jpg
49	Star Next Gen Eco Innovators	\N	2026-06-19 13:03:33.528+08	2026-06-19 13:03:33.527+08	/api/media/file/sngei-1.jpg	\N	sngei-1.jpg	image/jpeg	288013	1920	1282	50	50	/api/media/file/sngei-1-400x267.jpg	400	267	image/jpeg	22529	sngei-1-400x267.jpg	/api/media/file/sngei-1-768x513.jpg	768	513	image/jpeg	62495	sngei-1-768x513.jpg	/api/media/file/sngei-1-1920x1282.jpg	1920	1282	image/jpeg	255726	sngei-1-1920x1282.jpg
50	Star Next Gen Eco Innovators	\N	2026-06-19 13:03:33.655+08	2026-06-19 13:03:33.655+08	/api/media/file/sngei-2.jpg	\N	sngei-2.jpg	image/jpeg	338547	1920	1280	50	50	/api/media/file/sngei-2-400x267.jpg	400	267	image/jpeg	27402	sngei-2-400x267.jpg	/api/media/file/sngei-2-768x512.jpg	768	512	image/jpeg	75974	sngei-2-768x512.jpg	/api/media/file/sngei-2-1920x1280.jpg	1920	1280	image/jpeg	332995	sngei-2-1920x1280.jpg
51	Star Next Gen Eco Innovators	\N	2026-06-19 13:03:33.777+08	2026-06-19 13:03:33.777+08	/api/media/file/sngei-3.jpg	\N	sngei-3.jpg	image/jpeg	366307	1920	1440	50	50	/api/media/file/sngei-3-400x300.jpg	400	300	image/jpeg	22257	sngei-3-400x300.jpg	/api/media/file/sngei-3-768x576.jpg	768	576	image/jpeg	68487	sngei-3-768x576.jpg	/api/media/file/sngei-3-1920x1440.jpg	1920	1440	image/jpeg	360065	sngei-3-1920x1440.jpg
52	Star Next Gen Eco Innovators	\N	2026-06-19 13:03:33.92+08	2026-06-19 13:03:33.92+08	/api/media/file/sngei-4.jpg	\N	sngei-4.jpg	image/jpeg	427134	1920	1440	50	50	/api/media/file/sngei-4-400x300.jpg	400	300	image/jpeg	31684	sngei-4-400x300.jpg	/api/media/file/sngei-4-768x576.jpg	768	576	image/jpeg	93158	sngei-4-768x576.jpg	/api/media/file/sngei-4-1920x1440.jpg	1920	1440	image/jpeg	420483	sngei-4-1920x1440.jpg
53	The Sustainable Palm Oil Revolution	\N	2026-06-19 13:03:34.016+08	2026-06-19 13:03:34.016+08	/api/media/file/mpoc-1.jpg	\N	mpoc-1.jpg	image/jpeg	192108	1920	1080	50	50	/api/media/file/mpoc-1-400x225.jpg	400	225	image/jpeg	16353	mpoc-1-400x225.jpg	/api/media/file/mpoc-1-768x432.jpg	768	432	image/jpeg	46740	mpoc-1-768x432.jpg	/api/media/file/mpoc-1-1920x1080.jpg	1920	1080	image/jpeg	188217	mpoc-1-1920x1080.jpg
54	The Sustainable Palm Oil Revolution	\N	2026-06-19 13:03:34.112+08	2026-06-19 13:03:34.112+08	/api/media/file/mpoc-2.jpg	\N	mpoc-2.jpg	image/jpeg	198031	1920	1080	50	50	/api/media/file/mpoc-2-400x225.jpg	400	225	image/jpeg	19561	mpoc-2-400x225.jpg	/api/media/file/mpoc-2-768x432.jpg	768	432	image/jpeg	51226	mpoc-2-768x432.jpg	/api/media/file/mpoc-2-1920x1080.jpg	1920	1080	image/jpeg	194465	mpoc-2-1920x1080.jpg
55	The Sustainable Palm Oil Revolution	\N	2026-06-19 13:03:34.179+08	2026-06-19 13:03:34.179+08	/api/media/file/mpoc-3.jpg	\N	mpoc-3.jpg	image/jpeg	163600	1200	629	50	50	/api/media/file/mpoc-3-400x210.jpg	400	210	image/jpeg	19436	mpoc-3-400x210.jpg	/api/media/file/mpoc-3-768x403.jpg	768	403	image/jpeg	61978	mpoc-3-768x403.jpg	\N	\N	\N	\N	\N	\N
56	Works	\N	2026-06-19 13:08:26.765+08	2026-06-19 13:08:26.763+08	/api/media/file/works-bg-6.png	\N	works-bg-6.png	image/png	698527	1440	721	50	50	/api/media/file/works-bg-6-400x200.png	400	200	image/png	97193	works-bg-6-400x200.png	/api/media/file/works-bg-6-768x385.png	768	385	image/png	295181	works-bg-6-768x385.png	\N	\N	\N	\N	\N	\N
57	Elmina Rainforest Knowledge Centre campaign creative	\N	2026-06-19 13:08:27.072+08	2026-06-19 13:08:27.072+08	/api/media/file/elmina-halfpage.gif	\N	elmina-halfpage.gif	image/gif	287435	300	600	50	50	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
58	Elmina Rainforest Knowledge Centre campaign creative	\N	2026-06-19 13:08:27.173+08	2026-06-19 13:08:27.173+08	/api/media/file/elmina-mobile-masthead.gif	\N	elmina-mobile-masthead.gif	image/gif	91859	320	200	50	50	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
59	Works	\N	2026-06-19 13:22:44.618+08	2026-06-19 13:22:44.615+08	/api/media/file/works-bg-7.png	\N	works-bg-7.png	image/png	698527	1440	721	50	50	/api/media/file/works-bg-7-400x200.png	400	200	image/png	97193	works-bg-7-400x200.png	/api/media/file/works-bg-7-768x385.png	768	385	image/png	295181	works-bg-7-768x385.png	\N	\N	\N	\N	\N	\N
60	Works	\N	2026-06-19 13:59:04.782+08	2026-06-19 13:59:04.779+08	/api/media/file/works-bg-8.png	\N	works-bg-8.png	image/png	501193	1440	721	50	50	/api/media/file/works-bg-8-400x200.png	400	200	image/png	97193	works-bg-8-400x200.png	/api/media/file/works-bg-8-768x385.png	768	385	image/png	295181	works-bg-8-768x385.png	\N	\N	\N	\N	\N	\N
61	Works	\N	2026-06-19 14:00:07.407+08	2026-06-19 14:00:07.403+08	/api/media/file/works-bg-9.png	\N	works-bg-9.png	image/png	501193	1440	721	50	50	/api/media/file/works-bg-9-400x200.png	400	200	image/png	97193	works-bg-9-400x200.png	/api/media/file/works-bg-9-768x385.png	768	385	image/png	295181	works-bg-9-768x385.png	\N	\N	\N	\N	\N	\N
\.


ALTER TABLE public.media ENABLE TRIGGER ALL;

--
-- Data for Name: awards_page_years_entries; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.awards_page_years_entries DISABLE TRIGGER ALL;

COPY public.awards_page_years_entries (_order, _parent_id, id, organization, award, campaign, image_id) FROM stdin;
1	6a34dae7de492b009c35e5f9	6a34dae7de492b009c35e5f7	MDA D-AWARDS 2025	DIGITAL PUBLISHER OF THE YEAR – SILVER	THE STAR ESG: BRIDGING ESG KNOWLEDGE INTO ACTION	\N
2	6a34dae7de492b009c35e5f9	6a34dae7de492b009c35e5f8	WASTE MANAGEMENT ASSOCIATION OF MALAYSIA (WMAM)	GREEN JOURNALISM AWARD	THE STAR ESG PUBLICATION	\N
1	6a34dae7de492b009c35e5ff	6a34dae7de492b009c35e5fa	WAN-IFRA DIGITAL MEDIA AWARDS ASIA 2024	BEST USE OF AI IN REVENUE STRATEGY – SILVER	#JOMSAPOT BELILOKAL GEN AI-LED INTEGRATED MARKETING CAMPAIGN	\N
2	6a34dae7de492b009c35e5ff	6a34dae7de492b009c35e5fb	MDA D-AWARDS 2024	BEST B2B MARKETING CAMPAIGN - SILVER	#JOMSAPOT BELILOKAL GEN AI- LED INTERGRATED MARKETING CAMPAIGN	\N
3	6a34dae7de492b009c35e5ff	6a34dae7de492b009c35e5fc	MDA D-AWARDS 2024	BEST USE OF DIGITAL MARKETING INNOVATION - SILVER	#JOMSAPOT BELILOKAL GEN AI- LED INTEGRATED MARKETING CAMPAIGN	\N
4	6a34dae7de492b009c35e5ff	6a34dae7de492b009c35e5fd	PMAA DRAGONS OF ASIA 2024	BEST DIGITAL CAMPAIGN 2024 – BRONZE	#JOMSAPOT BELILOKAL GEN AI-LED INTERGRATED MARKETING CAMPAIGN	\N
5	6a34dae7de492b009c35e5ff	6a34dae7de492b009c35e5fe	PMAA DRAGONS OF MALAYSIA 2024	BEST DIGITAL CAMPAIGN 2024 - GOLD	#JOMSAPOT BELILOKAL GEN AI- LED INTERGRATED MARKETING CAMPAIGN	\N
1	6a34dae7de492b009c35e601	6a34dae7de492b009c35e600	WAN-IFRA ASIAN DIGITAL MEDIA AWARDS (ADMA) 2023	BEST NATIVE ADVERTISING/SPONSORED CONTENT CAMPAIGN GOLD	SIME DARBY PROPERTY – ELMINA RAINFOREST KNOWLEDGE CETRE (ERKC) SUSTAINABILITY CAMPAIGN	\N
\.


ALTER TABLE public.awards_page_years_entries ENABLE TRIGGER ALL;

--
-- Data for Name: footer; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.footer DISABLE TRIGGER ALL;

COPY public.footer (id, address, updates_label, brand_logo_id, copyright, email, updated_at, created_at) FROM stdin;
1	Menara Star, 15, Jalan 16/11, Seksyen 16, 46350 Petaling Jaya, Selangor Darul Ehsan, Malaysia	GET THE LATEST UPDATES	27	Copyrights © of Star Media Group 2026	SMGBRANDSTUDIO@THESTAR.COM.MY	2026-06-19 14:00:07.861+08	2026-06-17 21:34:14.088+08
\.


ALTER TABLE public.footer ENABLE TRIGGER ALL;

--
-- Data for Name: footer_directory; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.footer_directory DISABLE TRIGGER ALL;

COPY public.footer_directory (_order, _parent_id, id, label, href) FROM stdin;
1	1	6a34dae7de492b009c35e5f2	HOME	/
2	1	6a34dae7de492b009c35e5f3	WORKS	/works
3	1	6a34dae7de492b009c35e5f4	AWARDS	/awards
\.


ALTER TABLE public.footer_directory ENABLE TRIGGER ALL;

--
-- Data for Name: footer_phones; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.footer_phones DISABLE TRIGGER ALL;

COPY public.footer_phones (_order, _parent_id, id, number) FROM stdin;
1	1	6a34dae7de492b009c35e5f0	+603 7967 1388
2	1	6a34dae7de492b009c35e5f1	+60126429027
\.


ALTER TABLE public.footer_phones ENABLE TRIGGER ALL;

--
-- Data for Name: footer_socials; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.footer_socials DISABLE TRIGGER ALL;

COPY public.footer_socials (_order, _parent_id, id, label, href, icon_id) FROM stdin;
1	1	6a34dae7de492b009c35e5f5	Facebook	#	28
2	1	6a34dae7de492b009c35e5f6	Instagram	#	29
\.


ALTER TABLE public.footer_socials ENABLE TRIGGER ALL;

--
-- Data for Name: forms; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.forms DISABLE TRIGGER ALL;

COPY public.forms (id, title, submit_button_label, confirmation_type, confirmation_message, redirect_url, updated_at, created_at) FROM stdin;
1	Contact	Submit	message	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Thanks — we've got your enquiry. We'll be in touch shortly.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr"}], "direction": "ltr"}}	\N	2026-06-19 14:00:08.477+08	2026-06-17 21:34:14.162+08
\.


ALTER TABLE public.forms ENABLE TRIGGER ALL;

--
-- Data for Name: form_submissions; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.form_submissions DISABLE TRIGGER ALL;

COPY public.form_submissions (id, form_id, updated_at, created_at) FROM stdin;
\.


ALTER TABLE public.form_submissions ENABLE TRIGGER ALL;

--
-- Data for Name: form_submissions_submission_data; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.form_submissions_submission_data DISABLE TRIGGER ALL;

COPY public.form_submissions_submission_data (_order, _parent_id, id, field, value) FROM stdin;
\.


ALTER TABLE public.form_submissions_submission_data ENABLE TRIGGER ALL;

--
-- Data for Name: forms_blocks_checkbox; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.forms_blocks_checkbox DISABLE TRIGGER ALL;

COPY public.forms_blocks_checkbox (_order, _parent_id, _path, id, name, label, width, required, default_value, block_name) FROM stdin;
\.


ALTER TABLE public.forms_blocks_checkbox ENABLE TRIGGER ALL;

--
-- Data for Name: forms_blocks_country; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.forms_blocks_country DISABLE TRIGGER ALL;

COPY public.forms_blocks_country (_order, _parent_id, _path, id, name, label, width, required, block_name) FROM stdin;
\.


ALTER TABLE public.forms_blocks_country ENABLE TRIGGER ALL;

--
-- Data for Name: forms_blocks_email; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.forms_blocks_email DISABLE TRIGGER ALL;

COPY public.forms_blocks_email (_order, _parent_id, _path, id, name, label, width, required, block_name) FROM stdin;
3	1	fields	6a34dae8de492b009c35e63f	email	Email Address	50	t	\N
\.


ALTER TABLE public.forms_blocks_email ENABLE TRIGGER ALL;

--
-- Data for Name: forms_blocks_message; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.forms_blocks_message DISABLE TRIGGER ALL;

COPY public.forms_blocks_message (_order, _parent_id, _path, id, message, block_name) FROM stdin;
\.


ALTER TABLE public.forms_blocks_message ENABLE TRIGGER ALL;

--
-- Data for Name: forms_blocks_number; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.forms_blocks_number DISABLE TRIGGER ALL;

COPY public.forms_blocks_number (_order, _parent_id, _path, id, name, label, width, default_value, required, block_name) FROM stdin;
\.


ALTER TABLE public.forms_blocks_number ENABLE TRIGGER ALL;

--
-- Data for Name: forms_blocks_select; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.forms_blocks_select DISABLE TRIGGER ALL;

COPY public.forms_blocks_select (_order, _parent_id, _path, id, name, label, width, default_value, placeholder, required, block_name) FROM stdin;
5	1	fields	6a34dae8de492b009c35e64a	services	What Services Are Required?	100	\N	\N	f	\N
\.


ALTER TABLE public.forms_blocks_select ENABLE TRIGGER ALL;

--
-- Data for Name: forms_blocks_select_options; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.forms_blocks_select_options DISABLE TRIGGER ALL;

COPY public.forms_blocks_select_options (_order, _parent_id, id, label, value) FROM stdin;
1	6a34dae8de492b009c35e64a	6a34dae8de492b009c35e641	Integrated Marketing & Creative Strategy	integrated-marketing
2	6a34dae8de492b009c35e64a	6a34dae8de492b009c35e642	Editorial Storytelling	editorial-storytelling
3	6a34dae8de492b009c35e64a	6a34dae8de492b009c35e643	Video & Multimedia Production	video-production
4	6a34dae8de492b009c35e64a	6a34dae8de492b009c35e644	Youth & Social Impact Programme	social-impact
5	6a34dae8de492b009c35e64a	6a34dae8de492b009c35e645	Research & Insights	research-insights
6	6a34dae8de492b009c35e64a	6a34dae8de492b009c35e646	Social Media & Influencer Engagement	social-influencer
7	6a34dae8de492b009c35e64a	6a34dae8de492b009c35e647	Digital Experiences	digital-experiences
8	6a34dae8de492b009c35e64a	6a34dae8de492b009c35e648	Media Strategy & Buying	media-strategy
9	6a34dae8de492b009c35e64a	6a34dae8de492b009c35e649	Other	other
\.


ALTER TABLE public.forms_blocks_select_options ENABLE TRIGGER ALL;

--
-- Data for Name: forms_blocks_state; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.forms_blocks_state DISABLE TRIGGER ALL;

COPY public.forms_blocks_state (_order, _parent_id, _path, id, name, label, width, required, block_name) FROM stdin;
\.


ALTER TABLE public.forms_blocks_state ENABLE TRIGGER ALL;

--
-- Data for Name: forms_blocks_text; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.forms_blocks_text DISABLE TRIGGER ALL;

COPY public.forms_blocks_text (_order, _parent_id, _path, id, name, label, width, default_value, required, block_name) FROM stdin;
1	1	fields	6a34dae8de492b009c35e63d	fullName	Full Name	100	\N	t	\N
2	1	fields	6a34dae8de492b009c35e63e	company	Company / Organisation	100	\N	f	\N
4	1	fields	6a34dae8de492b009c35e640	phone	Phone Number	50	\N	f	\N
\.


ALTER TABLE public.forms_blocks_text ENABLE TRIGGER ALL;

--
-- Data for Name: forms_blocks_textarea; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.forms_blocks_textarea DISABLE TRIGGER ALL;

COPY public.forms_blocks_textarea (_order, _parent_id, _path, id, name, label, width, default_value, required, block_name) FROM stdin;
6	1	fields	6a34dae8de492b009c35e64b	enquiry	Leave Your Project Enquiry	100	\N	f	\N
\.


ALTER TABLE public.forms_blocks_textarea ENABLE TRIGGER ALL;

--
-- Data for Name: forms_emails; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.forms_emails DISABLE TRIGGER ALL;

COPY public.forms_emails (_order, _parent_id, id, email_to, cc, bcc, reply_to, email_from, subject, message) FROM stdin;
\.


ALTER TABLE public.forms_emails ENABLE TRIGGER ALL;

--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.pages DISABLE TRIGGER ALL;

COPY public.pages (id, title, slug, meta_title, meta_description, meta_image_id, updated_at, created_at) FROM stdin;
1	Home	home	\N	\N	\N	2026-06-19 14:00:07.72+08	2026-06-17 21:34:13.987+08
\.


ALTER TABLE public.pages ENABLE TRIGGER ALL;

--
-- Data for Name: pages_blocks_awards; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.pages_blocks_awards DISABLE TRIGGER ALL;

COPY public.pages_blocks_awards (_order, _parent_id, _path, id, title, button_label, caption, recognitions, block_name) FROM stdin;
5	1	layout	6a34dae7de492b009c35e5d9	AWARDS	VIEW ALL AWARDS	AWARD-WINNING IDEAS \nGROUNDED IN GOOD\nSTORYTELLING	& RECOGNITIONS	\N
\.


ALTER TABLE public.pages_blocks_awards ENABLE TRIGGER ALL;

--
-- Data for Name: pages_blocks_awards_items; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.pages_blocks_awards_items DISABLE TRIGGER ALL;

COPY public.pages_blocks_awards_items (_order, _parent_id, id, image_id, alt) FROM stdin;
1	6a34dae7de492b009c35e5d9	6a34dae7de492b009c35e5d3	16	\N
2	6a34dae7de492b009c35e5d9	6a34dae7de492b009c35e5d4	17	\N
3	6a34dae7de492b009c35e5d9	6a34dae7de492b009c35e5d5	18	\N
4	6a34dae7de492b009c35e5d9	6a34dae7de492b009c35e5d6	19	\N
5	6a34dae7de492b009c35e5d9	6a34dae7de492b009c35e5d7	20	\N
6	6a34dae7de492b009c35e5d9	6a34dae7de492b009c35e5d8	21	\N
\.


ALTER TABLE public.pages_blocks_awards_items ENABLE TRIGGER ALL;

--
-- Data for Name: pages_blocks_hero; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.pages_blocks_hero DISABLE TRIGGER ALL;

COPY public.pages_blocks_hero (_order, _parent_id, _path, id, heading_line1, heading_line2, subheading, block_name) FROM stdin;
1	1	layout	6a34dae7de492b009c35e5c5	A FULL SUITE OF	SERVICES	BUILT FOR BRANDS THAT WANT TO	\N
\.


ALTER TABLE public.pages_blocks_hero ENABLE TRIGGER ALL;

--
-- Data for Name: pages_blocks_hero_carousel; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.pages_blocks_hero_carousel DISABLE TRIGGER ALL;

COPY public.pages_blocks_hero_carousel (_order, _parent_id, id, image_id, brand, copy) FROM stdin;
1	6a34dae7de492b009c35e5c5	6a34dae7de492b009c35e5bd	1	Train To Busan	Resorts World Genting
2	6a34dae7de492b009c35e5c5	6a34dae7de492b009c35e5be	2	The Launch of EQ	Mercedes-Benz
3	6a34dae7de492b009c35e5c5	6a34dae7de492b009c35e5bf	3	The Sustainable Palm Oil Revolution	Malaysian Palm Oil Council
4	6a34dae7de492b009c35e5c5	6a34dae7de492b009c35e5c0	4	Timepiece of tradition	The origins of Patek Philippe's Calatrava wristwatch
5	6a34dae7de492b009c35e5c5	6a34dae7de492b009c35e5c1	5	Auchentoshan	The single malt whisky with a love for three
6	6a34dae7de492b009c35e5c5	6a34dae7de492b009c35e5c2	6	#JomSapot BeliLokal Integrated Marketing Campaign	\N
7	6a34dae7de492b009c35e5c5	6a34dae7de492b009c35e5c3	7	Elmina Rainforest Knowledge Centre Sustainability Campaign	\N
8	6a34dae7de492b009c35e5c5	6a34dae7de492b009c35e5c4	8	Gamuda Technology Website	\N
\.


ALTER TABLE public.pages_blocks_hero_carousel ENABLE TRIGGER ALL;

--
-- Data for Name: pages_blocks_hero_typewriter_words; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.pages_blocks_hero_typewriter_words DISABLE TRIGGER ALL;

COPY public.pages_blocks_hero_typewriter_words (_order, _parent_id, id, word) FROM stdin;
1	6a34dae7de492b009c35e5c5	6a34dae7de492b009c35e5b9	LEAD
2	6a34dae7de492b009c35e5c5	6a34dae7de492b009c35e5ba	INSPIRE
3	6a34dae7de492b009c35e5c5	6a34dae7de492b009c35e5bb	SELL
4	6a34dae7de492b009c35e5c5	6a34dae7de492b009c35e5bc	GROW
\.


ALTER TABLE public.pages_blocks_hero_typewriter_words ENABLE TRIGGER ALL;

--
-- Data for Name: pages_blocks_logos; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.pages_blocks_logos DISABLE TRIGGER ALL;

COPY public.pages_blocks_logos (_order, _parent_id, _path, id, block_name) FROM stdin;
4	1	layout	6a34dae7de492b009c35e5d2	\N
\.


ALTER TABLE public.pages_blocks_logos ENABLE TRIGGER ALL;

--
-- Data for Name: pages_blocks_logos_items; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.pages_blocks_logos_items DISABLE TRIGGER ALL;

COPY public.pages_blocks_logos_items (_order, _parent_id, id, logo_id) FROM stdin;
1	6a34dae7de492b009c35e5d2	6a34dae7de492b009c35e5cb	9
2	6a34dae7de492b009c35e5d2	6a34dae7de492b009c35e5cc	10
3	6a34dae7de492b009c35e5d2	6a34dae7de492b009c35e5cd	11
4	6a34dae7de492b009c35e5d2	6a34dae7de492b009c35e5ce	12
5	6a34dae7de492b009c35e5d2	6a34dae7de492b009c35e5cf	13
6	6a34dae7de492b009c35e5d2	6a34dae7de492b009c35e5d0	14
7	6a34dae7de492b009c35e5d2	6a34dae7de492b009c35e5d1	15
\.


ALTER TABLE public.pages_blocks_logos_items ENABLE TRIGGER ALL;

--
-- Data for Name: pages_blocks_pillars; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.pages_blocks_pillars DISABLE TRIGGER ALL;

COPY public.pages_blocks_pillars (_order, _parent_id, _path, id, heading, block_name) FROM stdin;
3	1	layout	6a34dae7de492b009c35e5ca	ROOTED IN AUDIENCE INSIGHTS AND \nCREDIBLE JOURNALISM, WE DELIVER :	\N
\.


ALTER TABLE public.pages_blocks_pillars ENABLE TRIGGER ALL;

--
-- Data for Name: pages_blocks_pillars_items; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.pages_blocks_pillars_items DISABLE TRIGGER ALL;

COPY public.pages_blocks_pillars_items (_order, _parent_id, id, label, copy) FROM stdin;
1	6a34dae7de492b009c35e5ca	6a34dae7de492b009c35e5c7	CREDIBILITY	We bring editorial authority to your brand, built on decades of trusted journalism. Our newsroom experience shapes how we research, question, and craft stories with clarity and integrity.
2	6a34dae7de492b009c35e5ca	6a34dae7de492b009c35e5c8	TRUSTED IMPACT	Where credibility meets creativity. We don’t just tell stories—we deliver content that informs, engages, and moves audiences to action.
3	6a34dae7de492b009c35e5ca	6a34dae7de492b009c35e5c9	AUDIENCE-CENTRIC\nCREATIVITY	Creativity grounded in data, culture, and human insight. We combine audience understanding with multimedia storytelling to produce content that captures attention and builds trust.
\.


ALTER TABLE public.pages_blocks_pillars_items ENABLE TRIGGER ALL;

--
-- Data for Name: pages_blocks_projects; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.pages_blocks_projects DISABLE TRIGGER ALL;

COPY public.pages_blocks_projects (_order, _parent_id, _path, id, heading_before, heading_highlight, block_name) FROM stdin;
6	1	layout	6a34dae7de492b009c35e5e6	FEATURED	PROJECTS	\N
\.


ALTER TABLE public.pages_blocks_projects ENABLE TRIGGER ALL;

--
-- Data for Name: pages_blocks_projects_items; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.pages_blocks_projects_items DISABLE TRIGGER ALL;

COPY public.pages_blocks_projects_items (_order, _parent_id, id, key, title, year, thumbnail_id, hover_video_url, copy) FROM stdin;
1	6a34dae7de492b009c35e5e6	6a34dae7de492b009c35e5dc	gucci	GUCCI WALK YOUR WAY	2025	23	https://streamable.com/l/ulxzt8/mp4.mp4	A FASHION-FORWARD CAMPAIGN CELEBRATING SELF-EXPRESSION THROUGH WALKING, BLENDING ICONIC HOUSE CODES WITH STREET CULTURE.
2	6a34dae7de492b009c35e5e6	6a34dae7de492b009c35e5df	nike	NIKE EVERYTHING IS POSSIBLE	2025	24	https://streamable.com/l/xx3sll/mp4-high.mp4	A BOLD MANIFESTO PROVING THAT NO LIMIT IS FIXED — TURNING ATHLETES' DOUBT INTO PROOF THROUGH UNFLINCHING STORYTELLING.
3	6a34dae7de492b009c35e5e6	6a34dae7de492b009c35e5e2	snickers	SNICKERS YOU'RE NOT YOU WHEN YOU'RE HUNGRY	2025	25	\N	A WITTY INTEGRATED CAMPAIGN LEANING INTO THE INSIGHT THAT HUNGER CHANGES WHO YOU ARE — BUILT FOR SOCIAL AND OUT-OF-HOME.
4	6a34dae7de492b009c35e5e6	6a34dae7de492b009c35e5e5	mcdonalds	MCDONALD'S I'M LOVIN' IT	2025	26	\N	AN INTEGRATED BRAND CAMPAIGN DESIGNED TO SPARK AWARENESS, TURN AUDIENCES INTO ADVOCATES ACROSS DIGITAL TOUCHPOINTS.
\.


ALTER TABLE public.pages_blocks_projects_items ENABLE TRIGGER ALL;

--
-- Data for Name: pages_blocks_projects_items_tags; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.pages_blocks_projects_items_tags DISABLE TRIGGER ALL;

COPY public.pages_blocks_projects_items_tags (_order, _parent_id, id, tag) FROM stdin;
1	6a34dae7de492b009c35e5dc	6a34dae7de492b009c35e5da	FASHION
2	6a34dae7de492b009c35e5dc	6a34dae7de492b009c35e5db	BRAND FILM
1	6a34dae7de492b009c35e5df	6a34dae7de492b009c35e5dd	SPORTS
2	6a34dae7de492b009c35e5df	6a34dae7de492b009c35e5de	VIDEO PRODUCTION & MEDIA
1	6a34dae7de492b009c35e5e2	6a34dae7de492b009c35e5e0	FMCG
2	6a34dae7de492b009c35e5e2	6a34dae7de492b009c35e5e1	INTEGRATED CAMPAIGN
1	6a34dae7de492b009c35e5e5	6a34dae7de492b009c35e5e3	F&B
2	6a34dae7de492b009c35e5e5	6a34dae7de492b009c35e5e4	DIGITAL & SOCIAL
\.


ALTER TABLE public.pages_blocks_projects_items_tags ENABLE TRIGGER ALL;

--
-- Data for Name: pages_blocks_services; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.pages_blocks_services DISABLE TRIGGER ALL;

COPY public.pages_blocks_services (_order, _parent_id, _path, id, block_name) FROM stdin;
7	1	layout	6a34dae7de492b009c35e5ef	\N
\.


ALTER TABLE public.pages_blocks_services ENABLE TRIGGER ALL;

--
-- Data for Name: pages_blocks_services_items; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.pages_blocks_services_items DISABLE TRIGGER ALL;

COPY public.pages_blocks_services_items (_order, _parent_id, id, title, copy) FROM stdin;
1	6a34dae7de492b009c35e5ef	6a34dae7de492b009c35e5e7	INTEGRATED MARKETING & CREATIVE STRATEGY	By connecting strategy, storytelling, and media across platforms, we create campaigns that reach the right audiences and deliver results for your brand.
2	6a34dae7de492b009c35e5ef	6a34dae7de492b009c35e5e8	EDITORIAL STORYTELLING	We craft narratives with the discipline of journalism and the impact of great creative.
3	6a34dae7de492b009c35e5ef	6a34dae7de492b009c35e5e9	VIDEO & MULTIMEDIA PRODUCTION	From short-form social cuts to long-form documentary, we produce video content that conveys the brand message with clarity and craft.
4	6a34dae7de492b009c35e5ef	6a34dae7de492b009c35e5ea	YOUTH & SOCIAL IMPACT PROGRAMME	We design programmes that engage young audiences around causes that matter through meaningful partnerships.
5	6a34dae7de492b009c35e5ef	6a34dae7de492b009c35e5eb	RESEARCH & INSIGHTS	Quantitative rigour meets qualitative depth. We uncover the audience truths that shape sharper strategy and more resonant creative work.
6	6a34dae7de492b009c35e5ef	6a34dae7de492b009c35e5ec	SOCIAL MEDIA & INFLUENCER ENGAGEMENT	We manage always-on presence and hand-picked creator partnerships as a single integrated system — brand voice, community, and earned attention in lockstep.
7	6a34dae7de492b009c35e5ef	6a34dae7de492b009c35e5ed	DIGITAL EXPERIENCES	Websites, apps, interactive campaigns. We design and build digital products that carry the same narrative discipline as editorial work.
8	6a34dae7de492b009c35e5ef	6a34dae7de492b009c35e5ee	MEDIA STRATEGY & BUYING	Data-led planning across paid, owned and earned — designed to put the right message in front of the right people at the moment it matters.
\.


ALTER TABLE public.pages_blocks_services_items ENABLE TRIGGER ALL;

--
-- Data for Name: pages_blocks_what_we_do; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.pages_blocks_what_we_do DISABLE TRIGGER ALL;

COPY public.pages_blocks_what_we_do (_order, _parent_id, _path, id, label, heading_before, inline_logo_id, heading_after, showreel_url, showreel_thumbnail, block_name) FROM stdin;
2	1	layout	6a34dae7de492b009c35e5c6	WHAT WE DO	Across every platform—digital, radio, on-ground, print and social—we bring brand	22	ideas to life, creating moments that spark connection and inspire action.	https://streamable.com/l/q9wy22/mp4.mp4	https://streamable.com/l/q9wy22/mp4.mp4	\N
\.


ALTER TABLE public.pages_blocks_what_we_do ENABLE TRIGGER ALL;

--
-- Data for Name: works; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.works DISABLE TRIGGER ALL;

COPY public.works (id, _order, title, slug, image_id, year, description, updated_at, created_at) FROM stdin;
7	a6	ELMINA RAINFOREST KNOWLEDGE CENTRE SUSTAINABILITY CAMPAIGN	elmina-rainforest-knowledge-centre	7	2023	A thought-leadership sustainability campaign for Sime Darby Property that reframed biodiversity conservation as an emotionally engaging human story.	2026-06-19 14:00:07.955+08	2026-06-19 12:51:59.377+08
8	a7	RHB #JOMSAPOT BELILOKAL	rhb-jomsapot-belilokal	42	2024	A scalable SME empowerment platform for RHB Bank, combining AI-driven personalisation, celebrity influence, and hyperlocal discovery.	2026-06-19 14:00:08.016+08	2026-06-19 12:51:59.41+08
9	a8	TNB POWERING THE FUTURE	tnb-powering-the-future	45	\N	A youth-focused energy-literacy programme for Tenaga Nasional Berhad, turning national sustainability goals into lived, experiential learning.	2026-06-19 14:00:08.08+08	2026-06-19 12:51:59.435+08
10	a9	STAR NEXT GEN ECO INNOVATORS	star-next-gen-eco-innovators	49	\N	A youth-led innovation platform for The Coca-Cola Company that reframed plastic waste from pollution to potential.	2026-06-19 14:00:08.149+08	2026-06-19 12:51:59.46+08
11	aa	RESIPI JADI REZEKI WITH KIMBALL MALAYSIA	resipi-jadi-rezeki	61	\N	A four-phase entrepreneurial transformation journey for Kimball Malaysia, turning everyday cooking into a sustainable livelihood.	2026-06-19 14:00:08.209+08	2026-06-19 12:51:59.485+08
12	ab	THE SUSTAINABLE PALM OIL REVOLUTION	sustainable-palm-oil-revolution	53	\N	An impact-journalism platform for MPOC that reframed palm oil through verified facts and evidence-led storytelling.	2026-06-19 14:00:08.269+08	2026-06-19 12:51:59.512+08
13	ac	THE STAR ESG	the-star-esg	39	\N	A monthly editorial pull-out by Star Media Group that makes complex ESG topics clear, credible, and accessible to Malaysians.	2026-06-19 14:00:08.328+08	2026-06-19 12:51:59.546+08
14	ad	A SHARED HOME — CAREY ISLAND	a-shared-home-carey-island	61	2026	A multi-dimensional storytelling ecosystem for SD Guthrie that turned an abstract ESG narrative into a place audiences could see and connect with.	2026-06-19 14:00:08.38+08	2026-06-19 12:51:59.624+08
\.


ALTER TABLE public.works ENABLE TRIGGER ALL;

--
-- Data for Name: works_blocks_one_image; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.works_blocks_one_image DISABLE TRIGGER ALL;

COPY public.works_blocks_one_image (_order, _parent_id, _path, id, image_id, block_name) FROM stdin;
6	7	content	6a34dae7de492b009c35e609	41	\N
6	9	content	6a34dae8de492b009c35e619	48	\N
6	10	content	6a34dae8de492b009c35e622	52	\N
\.


ALTER TABLE public.works_blocks_one_image ENABLE TRIGGER ALL;

--
-- Data for Name: works_blocks_text_section; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.works_blocks_text_section DISABLE TRIGGER ALL;

COPY public.works_blocks_text_section (_order, _parent_id, _path, id, heading, body, block_name) FROM stdin;
5	12	content	6a34dae8de492b009c35e62f	The Execution	The campaign took an impact-journalism approach, countering misinformation through structured storytelling rather than persuasion. Built as a guided discovery experience, it rested on three principles:\n\nReframing through context and data: Fact-led comparisons highlighted palm oil's land-use efficiency and productivity, and the importance of distinguishing conventional from certified sustainable production.\n\nCredibility through independent validation: Key insights were anchored in trusted external sources — including WWF, Conservation International, and Wild Asia — so the narrative rested on independent expertise, not industry-only positioning.\n\nComplexity made simple: A dedicated interactive platform, The Sustainable Palm Oil Revolution, turned complex sustainability data into an immersive editorial experience through long-form storytelling, data visualisation, and explainer videos — letting audiences navigate claims, context, and evidence in an accessible format.\n\nBy replacing defensive rhetoric with evidence-led storytelling, the initiative gave international audiences a more informed, data-grounded lens on Malaysia's role in advancing sustainable agriculture.	\N
1	13	content	6a34dae8de492b009c35e632	Client	Star Media Group — an owned editorial platform	\N
2	13	content	6a34dae8de492b009c35e633	The Background	In Malaysia, ESG has moved from a reputational nice-to-have to a business reality: sustainability reporting is now mandatory for Bursa Malaysia's larger listed companies and is being phased in across the rest of the market, with expectations increasingly cascading to the SMEs in their supply chains. Yet for most Malaysians — businesses, SMEs, policymakers, and consumers alike — the landscape remains abstract, jargon-heavy, and clouded by greenwashing, with no sustained, credible, easy-to-follow platform making it relevant to a broad local audience.	\N
3	13	content	6a34dae8de492b009c35e634	The Big Idea	Expert-led ESG, made accessible to all. A dedicated monthly editorial pull-out that pairs journalistic credibility with subject-matter expertise — turning complex ESG topics into clear, relevant narratives, and giving Malaysians a trusted ongoing guide rather than scattered, one-off coverage.	\N
4	13	content	6a34dae8de492b009c35e635	The Execution	StarESG breaks down emerging trends, regulatory developments, and the real-world challenges organisations face — combining our editorial expertise with the perspectives of policymakers, industry leaders, and businesses to give a balanced, authoritative view that surfaces both the risks and the opportunities of a changing ESG landscape. It's built around a consistent set of editorial pillars:\n\nCover stories — topical features with expert and policymaker insight across environmental, social, and governance themes.\n\nSME focus — accessible content that helps SMEs understand and adopt ESG.\n\nESG news — timely updates on the policies, regulations, and trends shaping the landscape.\n\nBrand stories — corporate initiatives, commitments, and challenges.\n\n"Small Act, Big Impact" — community-driven narratives that inspire collective action.\n\nPublished monthly, StarESG has grown into a sustained platform for more informed, responsible decision-making.	\N
1	14	content	6a34dae8de492b009c35e638	Client	SD Guthrie Berhad	\N
2	14	content	6a34dae8de492b009c35e639	The Background	SD Guthrie is more than a palm oil producer. With a heritage spanning nearly two centuries, it has continually evolved to lead the industry in sustainable production, biodiversity conservation and community development. Through its "Beyond Zero" sustainability framework, the company has committed not only to reducing its environmental footprint but also to restoring ecosystems and transforming lives and livelihoods through three strategic pillars: Zero, Restore and Transform.\n\nYet despite these commitments, SD Guthrie operates within an industry often viewed through a lens of scepticism. Palm oil continues to carry significant reputational challenges, where genuine progress is frequently overshadowed by concerns around environmental impact and accusations of corporate greenwashing. This created three fundamental barriers: a perception gap (an industry often judged before its actions are understood), a credibility gap (sustainability commitments audiences may dismiss without tangible proof), and an abstraction gap (meaningful initiatives documented in reports but rarely experienced by the public). The challenge was not a lack of substance. It was making real impact visible, relatable and believable.	\N
3	14	content	6a34dae8de492b009c35e63a	The Big Idea	"A Shared Home: A Legacy, Keepers of the Future." Instead of asking audiences to trust another sustainability claim, the campaign invited them to experience one. It repositioned Carey Island as the narrative centrepiece of SD Guthrie's sustainability journey — a living landscape where certified sustainable palm oil production exists alongside biodiversity conservation, ecological restoration, heritage preservation and thriving local communities. Rather than serving as a backdrop, the island became the campaign's proof point: a place where sustainability could be seen, explored and understood. Grounded in the "Beyond Zero" pillars of Zero, Restore and Transform, the campaign translated corporate commitments into tangible human stories and real places — shifting the narrative from defending sustainability claims to demonstrating stewardship through lived experience.	\N
1	7	content	6a34dae7de492b009c35e604	Client	Sime Darby Property	\N
2	7	content	6a34dae7de492b009c35e605	The Background	Sime Darby Property wanted to position the Elmina Rainforest Knowledge Centre (ERKC) as more than a sustainability initiative — establishing the brand as a credible advocate for biodiversity conservation and future-ready communities where people and nature coexist. The challenge was to cut through sustainability clutter and greenwashing with authentic, educational storytelling that could build trust, simplify complex environmental topics, and make biodiversity relevant to everyday audiences.	\N
3	7	content	6a34dae7de492b009c35e606	The Big Idea	"Imagine a World Without Biodiversity." Instead of leading with corporate sustainability messaging, we reframed conservation as a human story — inviting audiences to imagine a world where nature disappears from everyday life. Built on a thought-leadership content strategy and developed with the Tropical Rainforest Conservation & Research Centre (TRCRC), the campaign turned complex environmental issues into accessible, emotionally engaging narratives — positioning ERKC as both an educational platform and a symbol of sustainable urban living.	\N
4	7	content	6a34dae7de492b009c35e607	The Execution	At its heart was a co-branded multimedia microsite housed within The Star Online, giving audiences a dedicated, distraction-free space to explore ERKC's biodiversity initiatives. To sustain engagement across six months, the campaign rolled out in three phases, each introducing one clear message at a time.\n\nPhase 1 — Imagine a World Without Biodiversity: An emotionally driven opening built on documentary-style storytelling, impactful visuals, interactive quizzes, and simplified educational content, inviting audiences to picture — and reflect on — a future without biodiversity.\n\nPhase 2 — A Force for Good: A shift to Sime Darby Property's conservation and reforestation efforts through ERKC, reinforcing its role as a credible sustainability advocate rather than simply a developer.\n\nPhase 3 — Rewilding the Future of Urban Living: Stories on rewilding, urban forests, and city–nature coexistence, framing sustainable living as a practical vision for future communities.\n\nDelivered through long-form editorial, rich media, documentary video, infographics, and interactive experiences, the campaign turned a complex sustainability topic into an accessible public conversation.	\N
5	7	content	6a34dae7de492b009c35e608	Awards	WAN-IFRA Asian Digital Media Awards — Best Native Advertising / Sponsored Content Campaign (Gold)	\N
1	8	content	6a34dae8de492b009c35e60c	Client	RHB Bank	\N
2	8	content	6a34dae8de492b009c35e60d	The Background	RHB Bank and Star Media Group came together to support Malaysian SMEs facing declining visibility and rising marketing costs in the post-pandemic economy. SMEs form the backbone of the economy, yet many lack the resources to compete in an increasingly digital, crowded marketplace. The initiative set out to give local businesses accessible marketing support — and to encourage Malaysians to rediscover and back their neighbourhood merchants.	\N
4	8	content	6a34dae8de492b009c35e60f	The Big Idea	Turning every local business into a discoverable brand. Rather than another awareness campaign, we built #JomSapot BeliLokal into a scalable SME empowerment platform — combining AI-driven personalisation, celebrity influence, and hyperlocal discovery to help small businesses market themselves like major brands. At its centre was The BeliLokal Guide, an ecosystem that made local businesses easier to discover while giving SMEs promotional assets normally beyond their budgets. Using AI-powered facial and voice recognition, merchants could instantly generate personalized video ads featuring Sazzy Falak as their virtual brand ambassador — at no cost.	\N
5	8	content	6a34dae8de492b009c35e610	The Execution	The campaign paired AI-generated branded content with location-based targeting to drive both awareness and real-world discovery. SMEs were onboarded onto a co-branded ecosystem spanning the RHB #JomSapot platform and SMG's BeliLokal network, gaining exposure across digital, print, radio, and social. Consumers discovered nearby merchants through QR-enabled journeys and geo-targeted recommendations powered by The BeliLokal Guide. By merging technology, media reach, and community-driven commerce, the campaign turned SME support from a corporate initiative into an interactive nationwide movement.	\N
6	8	content	6a34dae8de492b009c35e611	Awards	WAN-IFRA Digital Media Awards Asia — Best Use of AI in Revenue Strategy (Silver)\nMDA d-Awards — Best B2B Marketing Campaign (Silver)\nMDA d-Awards — Best Use of Digital Marketing Innovation (Silver)\nPMAA Dragons of Malaysia — Best Digital Campaign (Gold)\nPMAA Dragons of Asia — Best Digital Campaign (Bronze)	\N
1	9	content	6a34dae8de492b009c35e614	Client	Tenaga Nasional Berhad (Malaysia Energy Literacy Programme)	\N
2	9	content	6a34dae8de492b009c35e615	The Background	Malaysia faces a growing energy trilemma — balancing security, affordability, and sustainability — amid accelerating climate pressures. Awareness of climate change is rising, but a persistent "say–do gap" remains: stated intentions to be energy-efficient rarely translate into action, held back by comfort-first habits, scepticism over individual impact, and reluctance to invest in change. As Malaysia pursues its Net Zero 2050 ambition, behavioural adoption remains the missing link. Through the Malaysia Energy Literacy Programme (MELP), Tenaga Nasional Berhad partnered with Star Media Group to translate national sustainability goals into a youth-focused education initiative — building understanding of energy transition, renewable energy, and ESG through lived experience rather than passive learning. The premise: if energy behaviour is to change, it must begin early.	\N
4	9	content	6a34dae8de492b009c35e617	The Big Idea	"Start young to change the energy future." (Small actions today, big impact tomorrow.) Rather than treating energy education as information delivery, the programme reframed it as early behaviour formation — challenging the misconception that climate impact comes only from large-scale policy or corporate action, and positioning students as active contributors whose everyday habits, multiplied across millions, become a force for systemic change.	\N
5	9	content	6a34dae8de492b009c35e618	The Execution	Powering The Future was designed as an experiential learning programme that moves energy education from theory into lived experience. Rather than classroom learning, students were placed in real-world energy decision scenarios through interactive workshops, energy-saving challenges, and practical simulations — making abstract concepts tangible and personally relevant. First piloted across 10 schools, the programme was scaled to 60 schools and has since expanded across multiple states, refining its engagement design with each rollout. It continues today as a sustained national initiative, with a long-term mission to embed energy-conscious behaviour early and cultivate a generation of Malaysians who actively contribute to a more sustainable energy future.	\N
7	9	content	6a34dae8de492b009c35e61a	Awards	WAN-IFRA Digital Media Awards Asia — Best Marketing Campaign for a News Brand (Silver)	\N
1	10	content	6a34dae8de492b009c35e61d	Client	The Coca-Cola Company (Malaysia)	\N
2	10	content	6a34dae8de492b009c35e61e	The Background	Plastic waste is one of Malaysia's most complex environmental challenges — driven by high consumption, limited recycling efficiency, and systemic leakage into natural ecosystems. The plastic manufacturing sector contributes significantly to national growth (annual sales exceeding RM61 billion, 4–5% of GDP), yet Malaysia is also among ASEAN's highest per-capita consumers of plastic packaging, generating over a million tonnes of plastic waste a year — only around 24% of which is recycled. Plastic, in other words, is not just an environmental issue but a systems problem spanning consumption behaviour, waste infrastructure, and circular-economy readiness.\n\nFor The Coca-Cola Company in Malaysia, this carried added reputational complexity. As a major user of plastic packaging, the brand sits at the centre of public scrutiny on waste — while investing in global circular-economy commitments and sustainable-packaging goals. A clear trust gap remained, particularly among Gen Z: highly eco-conscious, yet deeply sceptical of corporate sustainability messaging. In response, Coca-Cola backed a youth-led innovation platform built to move beyond awareness into hands-on circular-economy experimentation — positioning students as co-creators of solutions rather than passive recipients of messaging.	\N
4	10	content	6a34dae8de492b009c35e620	The Big Idea	"Flip plastic from pollution to potential." Instead of framing plastic as a burden, the programme reframed it as a designable material system — something the next generation could reimagine, repurpose, and re-engineer. This shifted youth from observers of the climate crisis to active system designers, building real-world solutions through innovation, collaboration, and circular thinking.	\N
5	10	content	6a34dae8de492b009c35e621	The Execution	Next Gen Eco Innovators launched as a national, university-based innovation platform focused on plastic circularity and sustainable design thinking. Five universities took part in a structured programme of education, ideation, and rapid prototyping: students were grounded in circular-economy principles, then challenged to apply them in a high-intensity 24-hour innovation sprint tackling Malaysia's plastic-waste and circularity gaps. Standout teams were shortlisted to represent their university at a grand finale at Menara Star, where ideas were judged by industry and sustainability experts on feasibility, innovation, and impact potential.	\N
1	11	content	6a34dae8de492b009c35e625	Client	Kimball Malaysia	\N
2	11	content	6a34dae8de492b009c35e626	The Background	Despite Malaysia's growing emphasis on SME empowerment and food entrepreneurship, many B40 and PPR home cooks remain trapped in informal, low-income cooking with no clear path to professionalisation. Three barriers persist: capital risk (high upfront costs to start a food business), an infrastructure gap (limited access to hygienic, MOH-compliant kitchens for scaling), and market marginalisation (limited branding, pricing power, and digital literacy). Many already have strong culinary skills — what they lack is the system, support, and structure to turn cooking into a sustainable livelihood. Kimball, long known as a kitchen-staple brand, saw an opportunity to evolve beyond product utility and become an enabler of income generation and community upliftment.	\N
3	11	content	6a34dae8de492b009c35e627	The Big Idea	"Resipi Jadi Rezeki — turning everyday cooking into sustainable livelihood." Rather than focusing on product usage, the campaign positioned Kimball as an enabling system that unlocks income-generating potential within everyday cooking. The belief at its core: with the right system and support, even a single recipe can become a sustainable source of income. By pairing Kimball's cost-efficient base sauces with structured entrepreneurial training, participants could adopt a "high-volume, low-margin" model — selling quality meals at an accessible RM5 "Menu Rahmah" price point while staying profitable. Food, empowerment, and economic inclusion came together in a scalable ecosystem for everyday livelihood creation.	\N
4	11	content	6a34dae8de492b009c35e628	The Execution	The campaign was built as a four-phase entrepreneurial transformation journey, taking participants from home cooks to validated micro-entrepreneurs.\n\nPhase 1 — Recruitment: A talent-discovery phase identified high-potential home cooks from B40 and PPR communities through Suria FM outreach and grassroots networks, balancing national reach with hyperlocal authenticity.\n\nPhase 2 — Training & Development: Hands-on workshops equipped participants with digital marketing, food storytelling, content creation, and commercial cooking skills, and guided them to develop their RM5 "Menu Rahmah" offerings.\n\nPhase 3 — Live Market Rally: A real-world bazaar "stress test," where participants operated as independent vendors under time pressure — managing sales, cooking, and public engagement.\n\nPhase 4 — Expanding Community Impact: The journey extended beyond participants, channeling RM10,000 of Kimball products to five welfare homes, reinforcing that entrepreneurial success should benefit the wider community.	\N
1	12	content	6a34dae8de492b009c35e62b	Client	Malaysia Palm Oil Council (MPOC)	\N
2	12	content	6a34dae8de492b009c35e62c	The Background	Oil palm is one of the world's most efficient oil-producing crops, needing far less land than other vegetable oils for the same yield — which, with its affordability and versatility, has made palm oil one of the most widely used ingredients in global food and consumer supply chains. It is also one of the most contested commodities. Rising demand has raised legitimate concerns around deforestation, biodiversity loss, land-use change, labour practices, and sustainability governance — concerns that have hardened into a simplified global narrative casting palm oil as inherently harmful, with little distinction between conventional and certified sustainable production. As one of the world's largest producers and exporters, Malaysia sits at the centre of this debate. Working with the Malaysia Palm Oil Council (MPOC), the challenge was to ensure sustainably sourced palm oil is understood accurately — in relation to its environmental safeguards, certification systems, and role in more efficient land use and conservation.	\N
4	12	content	6a34dae8de492b009c35e62e	The Big Idea	Reframing palm oil through verified facts. Rather than defending the industry or reacting to criticism, the campaign reframed the challenge as an information-gap problem, not a perception battle — moving global audiences away from simplified assumptions toward evidence-based understanding, where palm oil is assessed through verified data, credible science, and differentiated sustainability practices.	\N
4	14	content	6a34dae8de492b009c35e63b	The Execution	The campaign was designed as a multi-dimensional storytelling ecosystem, with each format playing a distinct role and reinforcing the others.\n\nDocumentary — the emotional centrepiece that brought Carey Island to life through immersive storytelling, showcasing SD Guthrie's stewardship in practice and translating sustainability from concept into lived reality through people, place and progress.\n\nLong-form Editorial Feature — the credibility anchor. An in-depth article providing narrative depth around SD Guthrie's legacy, the "Beyond Zero" framework, and Carey Island as a real-world demonstration of integrated sustainability across biodiversity conservation, heritage preservation and community development.\n\nSocial Media Amplification — the distribution engine. Social platforms drove awareness, traffic and engagement, directing audiences toward the documentary and long-form editorial content and ensuring the story reached both broad public and news- and business-oriented communities.\n\nIntegrated Audience Journey — each touchpoint worked in sequence: social amplification sparked discovery, the documentary delivered emotional engagement, and the editorial feature provided context, credibility and depth — turning awareness into understanding.	\N
5	14	content	6a34dae8de492b009c35e63c	The Outcome	By turning an abstract ESG narrative into a place people could see and connect with, "A Shared Home" reframed SD Guthrie's sustainability story. Instead of asking audiences to accept corporate claims at face value, it invited them to witness a living example where certified sustainable palm oil production, biodiversity conservation, heritage and community coexist within a shared landscape. In doing so, the campaign repositioned SD Guthrie not simply as a palm oil producer, but as a long-term steward of people, nature and place — demonstrating that the strongest sustainability stories are those that can be experienced as well as told.	\N
\.


ALTER TABLE public.works_blocks_text_section ENABLE TRIGGER ALL;

--
-- Data for Name: works_blocks_two_images; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.works_blocks_two_images DISABLE TRIGGER ALL;

COPY public.works_blocks_two_images (_order, _parent_id, _path, id, left_id, right_id, block_name) FROM stdin;
3	8	content	6a34dae8de492b009c35e60e	43	44	\N
3	9	content	6a34dae8de492b009c35e616	46	47	\N
3	10	content	6a34dae8de492b009c35e61f	50	51	\N
3	12	content	6a34dae8de492b009c35e62d	54	55	\N
\.


ALTER TABLE public.works_blocks_two_images ENABLE TRIGGER ALL;

--
-- Data for Name: works_tags; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.works_tags DISABLE TRIGGER ALL;

COPY public.works_tags (_order, _parent_id, id, label) FROM stdin;
1	7	6a34dae7de492b009c35e602	SUSTAINABILITY
2	7	6a34dae7de492b009c35e603	CONTENT CAMPAIGN
1	8	6a34dae8de492b009c35e60a	INTEGRATED CAMPAIGN
2	8	6a34dae8de492b009c35e60b	AI INNOVATION
1	9	6a34dae8de492b009c35e612	ENERGY
2	9	6a34dae8de492b009c35e613	YOUTH PROGRAMME
1	10	6a34dae8de492b009c35e61b	SUSTAINABILITY
2	10	6a34dae8de492b009c35e61c	YOUTH PROGRAMME
1	11	6a34dae8de492b009c35e623	SOCIAL IMPACT
2	11	6a34dae8de492b009c35e624	INTEGRATED CAMPAIGN
1	12	6a34dae8de492b009c35e629	SUSTAINABILITY
2	12	6a34dae8de492b009c35e62a	EDITORIAL STORYTELLING
1	13	6a34dae8de492b009c35e630	EDITORIAL PLATFORM
2	13	6a34dae8de492b009c35e631	ESG
1	14	6a34dae8de492b009c35e636	SUSTAINABILITY
2	14	6a34dae8de492b009c35e637	MULTIMEDIA STORYTELLING
\.


ALTER TABLE public.works_tags ENABLE TRIGGER ALL;

--
-- Name: awards_page_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.awards_page_id_seq', 1, true);


--
-- Name: footer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.footer_id_seq', 1, true);


--
-- Name: form_submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.form_submissions_id_seq', 1, false);


--
-- Name: forms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.forms_id_seq', 1, true);


--
-- Name: media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.media_id_seq', 61, true);


--
-- Name: pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pages_id_seq', 1, true);


--
-- Name: payload_kv_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_kv_id_seq', 1, false);


--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_locked_documents_id_seq', 9, true);


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_locked_documents_rels_id_seq', 13, true);


--
-- Name: payload_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_migrations_id_seq', 1, true);


--
-- Name: payload_preferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_preferences_id_seq', 5, true);


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_preferences_rels_id_seq', 7, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: works_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.works_id_seq', 14, true);


--
-- PostgreSQL database dump complete
--

\unrestrict VxJmuvJ2uBNYRy1bAbKsxFaZJrqtRVgRkzHkwcqhPhqEkR7FpEulkmxW2OukqyM

