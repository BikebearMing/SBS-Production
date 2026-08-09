import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "works_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "works_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "works_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"name" varchar
  );
  
  ALTER TABLE "works_blocks_gallery_images" ADD CONSTRAINT "works_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "works_blocks_gallery_images" ADD CONSTRAINT "works_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."works_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "works_blocks_gallery" ADD CONSTRAINT "works_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "works_awards" ADD CONSTRAINT "works_awards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "works_awards" ADD CONSTRAINT "works_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "works_blocks_gallery_images_order_idx" ON "works_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "works_blocks_gallery_images_parent_id_idx" ON "works_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "works_blocks_gallery_images_image_idx" ON "works_blocks_gallery_images" USING btree ("image_id");
  CREATE INDEX "works_blocks_gallery_order_idx" ON "works_blocks_gallery" USING btree ("_order");
  CREATE INDEX "works_blocks_gallery_parent_id_idx" ON "works_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "works_blocks_gallery_path_idx" ON "works_blocks_gallery" USING btree ("_path");
  CREATE INDEX "works_awards_order_idx" ON "works_awards" USING btree ("_order");
  CREATE INDEX "works_awards_parent_id_idx" ON "works_awards" USING btree ("_parent_id");
  CREATE INDEX "works_awards_image_idx" ON "works_awards" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "works_blocks_gallery_images" CASCADE;
  DROP TABLE "works_blocks_gallery" CASCADE;
  DROP TABLE "works_awards" CASCADE;`)
}
