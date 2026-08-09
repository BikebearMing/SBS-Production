import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_hero_typewriter_words" CASCADE;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_hero_typewriter_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"word" varchar NOT NULL
  );
  
  ALTER TABLE "pages_blocks_hero_typewriter_words" ADD CONSTRAINT "pages_blocks_hero_typewriter_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_typewriter_words_order_idx" ON "pages_blocks_hero_typewriter_words" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_typewriter_words_parent_id_idx" ON "pages_blocks_hero_typewriter_words" USING btree ("_parent_id");`)
}
