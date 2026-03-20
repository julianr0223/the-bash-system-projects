#!/bin/sh
set -e

DATA_DIR="${DATA_DIR:-/app/data}"

# Validate data directory exists
if [ ! -d "$DATA_DIR" ]; then
  echo "[entrypoint] ERROR: Data directory does not exist: $DATA_DIR"
  echo "[entrypoint] Ensure the volume is mounted correctly."
  exit 1
fi

# Validate data directory is writable
TEST_FILE="$DATA_DIR/.write-test-$$"
if ! touch "$TEST_FILE" 2>/dev/null; then
  echo "[entrypoint] ERROR: Data directory is not writable: $DATA_DIR"
  echo "[entrypoint] Current user: $(id)"
  echo "[entrypoint] Directory permissions: $(ls -ld "$DATA_DIR")"
  echo "[entrypoint] Fix: ensure the volume has correct ownership (UID 1001, GID 1001)."
  exit 1
fi
rm -f "$TEST_FILE"

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

exec "$@"
