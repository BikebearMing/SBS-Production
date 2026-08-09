import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_hero_messages" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subheading" varchar NOT NULL
  );
  
  ALTER TABLE "pages_blocks_hero_messages" ADD CONSTRAINT "pages_blocks_hero_messages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_messages_order_idx" ON "pages_blocks_hero_messages" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_messages_parent_id_idx" ON "pages_blocks_hero_messages" USING btree ("_parent_id");
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "heading_line1";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "heading_line2";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "subheading";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_hero_messages" CASCADE;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "heading_line1" varchar DEFAULT 'A FULL SUITE OF';
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "heading_line2" varchar DEFAULT 'SERVICES';
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "subheading" varchar DEFAULT 'BUILT FOR BRANDS THAT WANT TO';`)
}
