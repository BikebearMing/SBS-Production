#!/usr/bin/env bash
#
# Restore (roll back) a backup made by ./scripts/backup.sh:
#
#   ./scripts/restore.sh backups/starbrand-2026-07-07_1530-manual.tar
#
# Safety: before touching anything it takes a fresh backup of the CURRENT
# live state (tagged "pre-restore"), so a restore done by mistake can itself
# be rolled back the same way.
#
# What it restores:
#   - Neon database  (content tables dropped and recreated from the dump,
#                     in a single transaction — a failed restore changes nothing)
#   - media volume   (wiped and replaced with the archived files)
# Code is NOT touched — if you also need the code from that point in time,
# deploy the git commit shown in the archive's meta.txt via Coolify.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
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

ARCHIVE="${1:-}"
if [[ -z "$ARCHIVE" || ! -f "$ARCHIVE" ]]; then
  echo "Usage: ./scripts/restore.sh backups/<archive>.tar"
  echo
  echo "Available backups:"
  ls -1t "$(dirname "$SCRIPT_DIR")/backups"/*.tar 2>/dev/null || echo "  (none found)"
  exit 1
fi

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
tar xf "$ARCHIVE" -C "$WORK"
if [[ ! -f "$WORK/db.dump" || ! -f "$WORK/media.tar.gz" ]]; then
  echo "ERROR: $ARCHIVE does not look like a backup made by scripts/backup.sh"
  exit 1
fi

echo "About to restore this backup over the LIVE site:"
sed 's/^/  /' "$WORK/meta.txt"
echo
echo "A safety backup of the current live state will be taken first."
read -r -p "Type 'restore' to continue: " CONFIRM
if [[ "$CONFIRM" != "restore" ]]; then
  echo "Aborted — nothing was changed."
  exit 1
fi

echo
echo "==> [1/3] Safety backup of current live state..."
"$SCRIPT_DIR/backup.sh" pre-restore

echo "==> [2/3] Restoring database..."
ssh "$VPS_SSH" "docker run --rm -i $PG_IMAGE pg_restore --clean --if-exists --no-owner --no-acl --single-transaction -d $(printf %q "$PROD_DATABASE_URI")" < "$WORK/db.dump"

echo "==> [3/3] Restoring media..."
if [[ -n "${MEDIA_VOLUME:-}" ]]; then
  ssh "$VPS_SSH" "docker run --rm -i -v $(printf %q "$MEDIA_VOLUME"):/data alpine sh -c 'find /data -mindepth 1 -delete && tar xzf - -C /data'" < "$WORK/media.tar.gz"
else
  ssh "$VPS_SSH" "find $(printf %q "$MEDIA_PATH") -mindepth 1 -delete && tar xzf - -C $(printf %q "$MEDIA_PATH")" < "$WORK/media.tar.gz"
fi

echo
echo "OK: restore complete."
echo "If pages look stale, restart the app in Coolify so Payload reconnects cleanly."
