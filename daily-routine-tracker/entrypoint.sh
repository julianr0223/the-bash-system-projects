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

exec "$@"
