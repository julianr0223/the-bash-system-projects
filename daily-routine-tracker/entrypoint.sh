#!/bin/sh
set -e

DATA_DIR="${DATA_DIR:-/app/data}"

# Validate data directory exists
if [ ! -d "$DATA_DIR" ]; then
  echo "[entrypoint] Creating data directory: $DATA_DIR"
  mkdir -p "$DATA_DIR"
fi

# Fix ownership (runs as root, then drops to nextjs)
chown -R 1001:1001 "$DATA_DIR"
echo "[entrypoint] Data directory OK: $DATA_DIR"

# Check if /app/data is a mounted volume (different device than root filesystem)
ROOT_DEV=$(stat -c '%d' / 2>/dev/null || echo "unknown")
DATA_DEV=$(stat -c '%d' "$DATA_DIR" 2>/dev/null || echo "unknown")
if [ "$ROOT_DEV" != "unknown" ] && [ "$DATA_DEV" != "unknown" ]; then
  if [ "$ROOT_DEV" != "$DATA_DEV" ]; then
    echo "[entrypoint] Volume mount detected at $DATA_DIR"
  else
    echo "[entrypoint] WARNING: $DATA_DIR is NOT a mounted volume. Data will be lost on container restart."
  fi
fi

# Check for existing database
if [ -f "$DATA_DIR/data.db" ]; then
  echo "[entrypoint] Existing database found at $DATA_DIR/data.db"
else
  echo "[entrypoint] No existing database found. A new one will be created."
fi

# Drop privileges and run as nextjs user
exec su-exec 1001:1001 "$@"
