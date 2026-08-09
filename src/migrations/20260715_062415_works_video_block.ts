import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "works_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "works_blocks_video" ADD CONSTRAINT "works_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "works_blocks_video_order_idx" ON "works_blocks_video" USING btree ("_order");
  CREATE INDEX "works_blocks_video_parent_id_idx" ON "works_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "works_blocks_video_path_idx" ON "works_blocks_video" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "works_blocks_video" CASCADE;`)
}
