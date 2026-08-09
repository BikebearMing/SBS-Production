import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// NOTE: the auto-generated version of this migration also tried to ADD COLUMN
// "body_rich" because the hand-written 20260721_050000_works_text_body_rich
// migration has no drizzle snapshot — that column already exists everywhere,
// so this migration only adds the new right-column field (guarded, so it can
// never fail on a hand-patched database).

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "works_blocks_text_section" ADD COLUMN IF NOT EXISTS "body_rich_right" jsonb;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "works_blocks_text_section" DROP COLUMN IF EXISTS "body_rich_right";`)
}
