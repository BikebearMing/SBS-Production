import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Works text sections: textarea → WYSIWYG (`bodyRich`, Lexical richText).
 * Additive only — the legacy `body` column is kept (hidden in the admin), and
 * every existing plain-text body is copied into `body_rich` as a minimal
 * Lexical state, so live content survives the redeploy and shows up in the
 * new editor. "\n" becomes a linebreak node, matching how the textarea
 * rendered newlines as <br>.
 */
function textToLexical(text: string) {
  const lines = text.split('\n')
  const children: Record<string, unknown>[] = []
  lines.forEach((line, i) => {
    if (line) {
      children.push({
        type: 'text',
        text: line,
        format: 0,
        style: '',
        mode: 'normal',
        detail: 0,
        version: 1,
      })
    }
    if (i < lines.length - 1) children.push({ type: 'linebreak', version: 1 })
  })
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          textFormat: 0,
          textStyle: '',
          children,
        },
      ],
    },
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "works_blocks_text_section" ADD COLUMN IF NOT EXISTS "body_rich" jsonb;`)

  const result = await db.execute(sql`
   SELECT "id", "body" FROM "works_blocks_text_section"
   WHERE "body" IS NOT NULL AND btrim("body") <> '' AND "body_rich" IS NULL;`)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = ((result as any).rows ?? result) as { id: string; body: string }[]

  for (const row of rows) {
    await db.execute(sql`
     UPDATE "works_blocks_text_section"
     SET "body_rich" = ${JSON.stringify(textToLexical(row.body))}::jsonb
     WHERE "id" = ${row.id};`)
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "works_blocks_text_section" DROP COLUMN IF EXISTS "body_rich";`)
}
