#!/usr/bin/env bash
#
# Full-site backup — one WordPress-style archive file.
#
#   ./scripts/backup.sh              → backups/starbrand-2026-07-07_1530-manual.tar
#   ./scripts/backup.sh pre-launch   → backups/starbrand-2026-07-07_1530-pre-launch.tar
#
# The archive contains:
#   db.dump       — Neon Postgres dump (all content, form submissions, users)
#   media.tar.gz  — the media volume on the VPS (admin uploads)
#   meta.txt      — date, git commit, sizes
#
# Everything heavy runs on the VPS over SSH (it has Docker), so nothing needs
# to be installed on this machine. Roll back with:
#   ./scripts/restore.sh backups/<archive>.tar

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
CONFIG="$SCRIPT_DIR/backup.env"

if [[ ! -f "$CONFIG" ]]; then
  echo "Missing scripts/backup.env"
  echo "Copy scripts/backup.env.example to scripts/backup.env and fill it in."
  exit 1
fi
# shellcheck source=backup.env.example
source "$CONFIG"

: "${VPS_SSH:?VPS_SSH is not set in scripts/backup.env}"
: "${PROD_DATABASE_URI:?PROD_DATABASE_URI is not set in scripts/backup.env}"
if [[ -z "${MEDIA_VOLUME:-}" && -z "${MEDIA_PATH:-}" ]]; then
  echo "Set MEDIA_VOLUME or MEDIA_PATH in scripts/backup.env"
  exit 1
fi
PG_IMAGE="${PG_IMAGE:-postgres:17-alpine}"

TAG="${1:-manual}"
STAMP="$(date +%Y-%m-%d_%H%M)"
NAME="starbrand-${STAMP}-${TAG}"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
mkdir -p "$ROOT_DIR/backups"

echo "==> [1/3] Dumping Neon database (via Docker on the VPS)..."
ssh "$VPS_SSH" "docker run --rm $PG_IMAGE pg_dump --format=custom --no-owner --no-acl $(printf %q "$PROD_DATABASE_URI")" > "$WORK/db.dump"
[[ -s "$WORK/db.dump" ]] || { echo "ERROR: database dump came back empty."; exit 1; }

echo "==> [2/3] Archiving media from the VPS..."
if [[ -n "${MEDIA_VOLUME:-}" ]]; then
  ssh "$VPS_SSH" "docker run --rm -v $(printf %q "$MEDIA_VOLUME"):/data alpine tar czf - -C /data ." > "$WORK/media.tar.gz"
else
  ssh "$VPS_SSH" "tar czf - -C $(printf %q "$MEDIA_PATH") ." > "$WORK/media.tar.gz"
fi
[[ -s "$WORK/media.tar.gz" ]] || { echo "ERROR: media archive came back empty."; exit 1; }

echo "==> [3/3] Bundling..."
{
  echo "created:    $(date)"
  echo "tag:        $TAG"
  echo "git commit: $(git -C "$ROOT_DIR" rev-parse HEAD 2>/dev/null || echo 'n/a')"
  echo "db.dump:    $(du -h "$WORK/db.dump" | cut -f1)"
  echo "media:      $(du -h "$WORK/media.tar.gz" | cut -f1)"
} > "$WORK/meta.txt"

ARCHIVE="$ROOT_DIR/backups/$NAME.tar"
tar cf "$ARCHIVE" -C "$WORK" meta.txt db.dump media.tar.gz

echo
echo "OK: backups/$NAME.tar ($(du -h "$ARCHIVE" | cut -f1))"
echo "Roll back with: ./scripts/restore.sh backups/$NAME.tar"
