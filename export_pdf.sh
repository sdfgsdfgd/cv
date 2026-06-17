#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HTML="$ROOT/index.html"
RENDERER="$ROOT/variants/render_pdf_variant.mjs"

PIPELINES=(
  "current|baseline|current|$ROOT/kaan_osmanagaoglu_cv.pdf|Current baseline web CV"
  "kotlin-android-melbourne|baseline|melbourne|$ROOT/CV_Kaan_West_Melbourne_VIC_3003.pdf|Kotlin/Android baseline, West Melbourne"
  "kotlin-android-sydney|baseline|sydney|$ROOT/CV_Kaan_Potts_Point_NSW_2011.pdf|Kotlin/Android baseline, Potts Point"
  "c-py-melbourne|c-py-systems|melbourne|$ROOT/CV_Kaan_West_Melbourne_C_Py.pdf|C/C++/Python systems CV, West Melbourne"
  "c-py-sydney|c-py-systems|sydney|$ROOT/CV_Kaan_Potts_Point_C_Py.pdf|C/C++/Python systems CV, Potts Point"
)

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

if ! command -v node >/dev/null 2>&1; then
  echo "node not found. Install Node.js or add it to PATH."
  exit 1
fi

list_pipelines() {
  echo "PDF pipelines:"
  local row name track location out desc
  for row in "${PIPELINES[@]}"; do
    IFS="|" read -r name track location out desc <<<"$row"
    printf "  %-24s track=%-12s location=%-9s -> %s\n" "$name" "$track" "$location" "${out#$ROOT/}"
    printf "    %s\n" "$desc"
  done
}

find_pipeline() {
  local wanted="$1"
  local row name track location out desc
  for row in "${PIPELINES[@]}"; do
    IFS="|" read -r name track location out desc <<<"$row"
    if [[ "$name" == "$wanted" ]]; then
      echo "$row"
      return 0
    fi
  done
  return 1
}

export_pdf() {
  local label="$1"
  local track="$2"
  local location="$3"
  local out="$4"
  local safe_label="${label//[^A-Za-z0-9_-]/_}"
  local tmp_html="$ROOT/.tmp_cv_${safe_label}_$$.html"

  trap 'rm -f "$tmp_html"' RETURN
  node "$RENDERER" "$HTML" "$tmp_html" "$track" "$location"

  "$CHROME" \
    --headless \
    --disable-gpu \
    --no-pdf-header-footer \
    --print-to-pdf="$out" \
    --virtual-time-budget=5000 \
    "file://$tmp_html"

  rm -f "$tmp_html"
  trap - RETURN
  echo "Wrote $out"
}

export_pipeline() {
  local name="$1"
  local row track location out desc
  if ! row="$(find_pipeline "$name")"; then
    echo "Unknown pipeline: $name"
    list_pipelines
    exit 1
  fi
  IFS="|" read -r name track location out desc <<<"$row"
  export_pdf "$name" "$track" "$location" "$out"
}

case "${1:-current}" in
  list|--list|-l)
    list_pipelines
    ;;
  all)
    for row in "${PIPELINES[@]}"; do
      IFS="|" read -r name _ <<<"$row"
      export_pipeline "$name"
    done
    ;;
  *.pdf|/*|./*|../*)
    export_pdf "custom" "baseline" "current" "$1"
    ;;
  *)
    export_pipeline "$1"
    ;;
esac
