#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HTML="$ROOT/index.html"
OUT="${1:-$ROOT/kaan_osmanagaoglu_cv.pdf}"
URL="file://$HTML"

CHROME=""
CANDIDATES=(
  "google-chrome"
  "chromium"
  "chromium-browser"
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  "/Applications/Chromium.app/Contents/MacOS/Chromium"
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
)

for c in "${CANDIDATES[@]}"; do
  if command -v "$c" >/dev/null 2>&1; then
    CHROME="$(command -v "$c")"
    break
  fi
  if [[ -x "$c" ]]; then
    CHROME="$c"
    break
  fi
done

if [[ -z "$CHROME" ]]; then
  echo "Chrome/Chromium not found. Install one or add it to PATH."
  exit 1
fi

"$CHROME" \
  --headless \
  --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf="$OUT" \
  --virtual-time-budget=5000 \
  "$URL"

echo "Wrote $OUT"
