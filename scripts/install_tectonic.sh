#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VERSION="${TECTONIC_VERSION:-0.17.0}"
URL="https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%40${VERSION}/tectonic-${VERSION}-x86_64-unknown-linux-musl.tar.gz"
mkdir -p "$ROOT/.tools/bin" "$ROOT/.tools/cache"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
curl -sSL -o "$TMP/t.tgz" "$URL"
tar -xzf "$TMP/t.tgz" -C "$TMP" tectonic
mv "$TMP/tectonic" "$ROOT/.tools/bin/tectonic"
"$ROOT/.tools/bin/tectonic" --version
