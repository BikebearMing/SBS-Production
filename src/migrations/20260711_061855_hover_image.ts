import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_projects_items" ADD COLUMN "hover_image_id" integer;
  ALTER TABLE "pages_blocks_projects_items" ADD CONSTRAINT "pages_blocks_projects_items_hover_image_id_media_id_fk" FOREIGN KEY ("hover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_projects_items_hover_image_idx" ON "pages_blocks_projects_items" USING btree ("hover_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_projects_items" DROP CONSTRAINT "pages_blocks_projects_items_hover_image_id_media_id_fk";
  
  DROP INDEX "pages_blocks_projects_items_hover_image_idx";
  ALTER TABLE "pages_blocks_projects_items" DROP COLUMN "hover_image_id";`)
}
