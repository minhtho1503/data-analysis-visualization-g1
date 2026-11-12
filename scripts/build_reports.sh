#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TECTONIC="${TECTONIC:-$ROOT/.tools/bin/tectonic}"
[ -x "$TECTONIC" ] || TECTONIC="$(command -v tectonic || true)"
[ -n "$TECTONIC" ] || { echo "Chưa có tectonic: chạy scripts/install_tectonic.sh" >&2; exit 1; }
export TECTONIC_CACHE_DIR="${TECTONIC_CACHE_DIR:-$ROOT/.tools/cache}"
BUILD="$ROOT/.build"

build() {  # build <file.tex> <pdf đích>
  local tex="$1" out="$2" dir; dir="$BUILD/$(basename "$(dirname "$out")")"
  mkdir -p "$dir"
  (cd "$(dirname "$tex")" && "$TECTONIC" -X compile --keep-logs --outdir "$dir" "$(basename "$tex")")
  cp "$dir/$(basename "${tex%.tex}").pdf" "$out"
  echo "-> ${out#$ROOT/}"
}

TARGETS=("$@"); [ ${#TARGETS[@]} -gt 0 ] || TARGETS=(tabular text image group)
for t in "${TARGETS[@]}"; do
  if [ "$t" = group ]; then
    build "$ROOT/report/main.tex" "$ROOT/report/G1-report.pdf"
  else
    build "$ROOT/projects/$t/report/report.tex" "$ROOT/projects/$t/$t-report.pdf"
  fi
done
