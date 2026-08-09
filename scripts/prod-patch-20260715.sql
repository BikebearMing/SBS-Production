-- ============================================================================
-- Prod schema patch — 2026-07-15
-- Brings prod Postgres in line with the committed migrations:
--   20260714_072826_hero_messages
--   20260714_072852_drop_hero_typewriter_words
--   20260714_074822_awards_item_name
--   20260715_032623_works_gallery_awards   ← the one breaking /api/works
--
-- Idempotent: every statement is guarded, so it's safe to run over a
-- partially patched database (e.g. if the hero part was already applied).
--
-- Run inside the prod Postgres container:
--   psql -U <user> -d <database> -f prod-patch-20260715.sql
-- ============================================================================

-- ── Hero: cycling messages (replaces headingLine1/2, subheading, typewriter) ──
CREATE TABLE IF NOT EXISTS "pages_blocks_hero_messages" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"heading" varchar NOT NULL,
	"subheading" varchar NOT NULL
);
DO $$ BEGIN
	ALTER TABLE "pages_blocks_hero_messages" ADD CONSTRAINT "pages_blocks_hero_messages_parent_id_fk"
		FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "pages_blocks_hero_messages_order_idx" ON "pages_blocks_hero_messages" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "pages_blocks_hero_messages_parent_id_idx" ON "pages_blocks_hero_messages" USING btree ("_parent_id");
ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "heading_line1";
ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "heading_line2";
ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "subheading";
DROP TABLE IF EXISTS "pages_blocks_hero_typewriter_words" CASCADE;

-- ── Homepage awards strip: hover name field ─────────────────────────────────
ALTER TABLE "pages_blocks_awards_items" ADD COLUMN IF NOT EXISTS "name" varchar;

-- ── Works: gallery block + per-work awards section ──────────────────────────
CREATE TABLE IF NOT EXISTS "works_blocks_gallery" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"block_name" varchar
);
CREATE TABLE IF NOT EXISTS "works_blocks_gallery_images" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"image_id" integer NOT NULL
);
CREATE TABLE IF NOT EXISTS "works_awards" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"image_id" integer NOT NULL,
	"name" varchar
);
DO $$ BEGIN
	ALTER TABLE "works_blocks_gallery" ADD CONSTRAINT "works_blocks_gallery_parent_id_fk"
		FOREIGN KEY ("_parent_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
	ALTER TABLE "works_blocks_gallery_images" ADD CONSTRAINT "works_blocks_gallery_images_image_id_media_id_fk"
		FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
	ALTER TABLE "works_blocks_gallery_images" ADD CONSTRAINT "works_blocks_gallery_images_parent_id_fk"
		FOREIGN KEY ("_parent_id") REFERENCES "public"."works_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
	ALTER TABLE "works_awards" ADD CONSTRAINT "works_awards_image_id_media_id_fk"
		FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
	ALTER TABLE "works_awards" ADD CONSTRAINT "works_awards_parent_id_fk"
		FOREIGN KEY ("_parent_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "works_blocks_gallery_order_idx" ON "works_blocks_gallery" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "works_blocks_gallery_parent_id_idx" ON "works_blocks_gallery" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "works_blocks_gallery_path_idx" ON "works_blocks_gallery" USING btree ("_path");
CREATE INDEX IF NOT EXISTS "works_blocks_gallery_images_order_idx" ON "works_blocks_gallery_images" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "works_blocks_gallery_images_parent_id_idx" ON "works_blocks_gallery_images" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "works_blocks_gallery_images_image_idx" ON "works_blocks_gallery_images" USING btree ("image_id");
CREATE INDEX IF NOT EXISTS "works_awards_order_idx" ON "works_awards" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "works_awards_parent_id_idx" ON "works_awards" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "works_awards_image_idx" ON "works_awards" USING btree ("image_id");

-- ── Bookkeeping: mark these migrations as applied (only if the migrations
--    table exists), so a future successful `payload migrate` won't re-run
--    them and fail on "already exists". ───────────────────────────────────────
DO $$ BEGIN
	IF to_regclass('public.payload_migrations') IS NOT NULL THEN
		INSERT INTO payload_migrations (name, batch)
		SELECT m.name, (SELECT COALESCE(MAX(batch), 0) + 1 FROM payload_migrations)
		FROM (VALUES
			('20260714_072826_hero_messages'),
			('20260714_072852_drop_hero_typewriter_words'),
			('20260714_074822_awards_item_name'),
			('20260715_032623_works_gallery_awards')
		) AS m(name)
		WHERE NOT EXISTS (SELECT 1 FROM payload_migrations p WHERE p.name = m.name);
	END IF;
END $$;
