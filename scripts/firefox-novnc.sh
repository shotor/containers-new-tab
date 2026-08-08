#!/usr/bin/env bash
# Start Xvfb + fluxbox + x11vnc + noVNC, then launch the extension in Firefox.
# Open http://localhost:6080/vnc.html (or the forwarded port) in your browser.
#
# Uses Vite *dev* (HMR) for the new-tab UI. Requires Firefox 147+ so temporary
# MV3 add-ons may load scripts from http://localhost (see bug 1864284).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

DISPLAY_NUM="${DISPLAY_NUM:-99}"
export DISPLAY=":${DISPLAY_NUM}"
VNC_PORT="${VNC_PORT:-5900}"
NOVNC_PORT="${NOVNC_PORT:-6080}"
# Sized for a ~2560×1440 host window minus browser/noVNC chrome.
SCREEN="${SCREEN:-2200x1280x24}"
PROFILE_DIR="${PROFILE_DIR:-$ROOT/.web-ext-profile}"
VITE_HOST="${VITE_HOST:-127.0.0.1}"
VITE_PORT="${VITE_PORT:-5173}"
# Firefox release with localhost CSP for temporary MV3 add-ons (147+).
FIREFOX_MIN_MAJOR="${FIREFOX_MIN_MAJOR:-147}"
FIREFOX_CACHE="${FIREFOX_CACHE:-$ROOT/.cache/firefox}"
# Pin a known-good linux-x86_64 build; override with FIREFOX_VERSION=… if needed.
FIREFOX_VERSION="${FIREFOX_VERSION:-153.0.3}"

NOVNC_WEB=""
for candidate in /usr/share/novnc /usr/share/novnc/utils/.. /usr/share/novnc; do
  if [[ -f "${candidate}/vnc.html" ]] || [[ -f "${candidate}/vnc_lite.html" ]]; then
    NOVNC_WEB="$(cd "$candidate" && pwd)"
    break
  fi
done
if [[ -z "$NOVNC_WEB" ]]; then
  echo "noVNC web files not found. Rebuild the devcontainer (Firefox/noVNC packages)." >&2
  exit 1
fi

firefox_major() {
  local bin="$1"
  local ver
  ver="$("$bin" --version 2>/dev/null | grep -oE '[0-9]+' | head -1 || true)"
  echo "${ver:-0}"
}

ensure_firefox() {
  local system_bin cached_bin major url tarball

  cached_bin="$FIREFOX_CACHE/firefox/firefox"
  if [[ -x "$cached_bin" ]]; then
    major="$(firefox_major "$cached_bin")"
    if (( major >= FIREFOX_MIN_MAJOR )); then
      FIREFOX_BIN="$cached_bin"
      echo "Using cached Firefox ${major} ($cached_bin)."
      return
    fi
  fi

  system_bin="$(command -v firefox || command -v firefox-esr || true)"
  if [[ -n "$system_bin" ]]; then
    major="$(firefox_major "$system_bin")"
    if (( major >= FIREFOX_MIN_MAJOR )); then
      FIREFOX_BIN="$system_bin"
      echo "Using system Firefox ${major} ($system_bin)."
      return
    fi
    echo "System Firefox is ${major}; HMR needs ${FIREFOX_MIN_MAJOR}+ (localhost CSP)."
  else
    echo "No system Firefox found."
  fi

  mkdir -p "$FIREFOX_CACHE"
  tarball="$FIREFOX_CACHE/firefox-${FIREFOX_VERSION}.tar.xz"
  url="https://download-installer.cdn.mozilla.net/pub/firefox/releases/${FIREFOX_VERSION}/linux-x86_64/en-US/firefox-${FIREFOX_VERSION}.tar.xz"

  if [[ ! -f "$tarball" ]]; then
    echo "Downloading Firefox ${FIREFOX_VERSION} for HMR…"
    curl -fsSL -L -o "$tarball.partial" "$url"
    mv "$tarball.partial" "$tarball"
  fi

  echo "Extracting Firefox ${FIREFOX_VERSION}…"
  rm -rf "$FIREFOX_CACHE/firefox"
  tar -xJf "$tarball" -C "$FIREFOX_CACHE"
  FIREFOX_BIN="$cached_bin"
  if [[ ! -x "$FIREFOX_BIN" ]]; then
    echo "Failed to install Firefox at $FIREFOX_BIN" >&2
    exit 1
  fi
  echo "Using Firefox $(firefox_major "$FIREFOX_BIN") ($FIREFOX_BIN)."
}

# Signed AMO XPI for Multi-Account Containers (sideloaded into the persistent profile).
MAC_ADDON_ID="@testpilot-containers"
MAC_XPI_URL="${MAC_XPI_URL:-https://addons.mozilla.org/firefox/downloads/latest/multi-account-containers/latest.xpi}"
ADDONS_CACHE="${ADDONS_CACHE:-$ROOT/.cache/addons}"

ensure_mac_extension() {
  local dest="$PROFILE_DIR/extensions/${MAC_ADDON_ID}.xpi"
  local cached="$ADDONS_CACHE/${MAC_ADDON_ID}.xpi"

  mkdir -p "$PROFILE_DIR/extensions" "$ADDONS_CACHE"

  if [[ ! -f "$cached" ]]; then
    echo "Downloading Multi-Account Containers…"
    curl -fsSL -L -o "$cached.partial" "$MAC_XPI_URL"
    mv "$cached.partial" "$cached"
  fi

  if [[ ! -f "$dest" ]] || ! cmp -s "$cached" "$dest"; then
    cp -f "$cached" "$dest"
    echo "Installed Multi-Account Containers into profile (${MAC_ADDON_ID})."
  else
    echo "Multi-Account Containers already in profile."
  fi
}

wait_for_vite() {
  local i html
  echo "Waiting for Vite HMR server on ${VITE_HOST}:${VITE_PORT}…"
  for i in $(seq 1 90); do
    if [[ -f dist/manifest.json ]] && [[ -f dist/src/index.html ]]; then
      html="$(cat dist/src/index.html)"
      if [[ "$html" == *"http://localhost:${VITE_PORT}/@vite/client"* ]] \
        || [[ "$html" == *"http://127.0.0.1:${VITE_PORT}/@vite/client"* ]]; then
        if curl -fsS "http://${VITE_HOST}:${VITE_PORT}/@vite/client" >/dev/null 2>&1; then
          echo "Vite HMR ready."
          return 0
        fi
      fi
    fi
    sleep 0.5
  done
  echo "Vite did not become ready. Last log:" >&2
  tail -n 40 /tmp/vite-dev.log >&2 || true
  exit 1
}

cleanup() {
  local pids
  if [[ -n "${VITE_PID:-}" ]]; then
    kill "$VITE_PID" 2>/dev/null || true
  fi
  pids="$(jobs -p 2>/dev/null || true)"
  if [[ -n "${pids}" ]]; then
    kill ${pids} 2>/dev/null || true
  fi
}
# Only tear down on Ctrl-C / explicit stop — not when Firefox/web-ext exits alone.
trap cleanup INT TERM

ensure_firefox

# HMR: Vite serves new-tab modules; dist/ holds manifest + rewritten HTML + background.
if curl -fsS "http://${VITE_HOST}:${VITE_PORT}/@vite/client" >/dev/null 2>&1 \
  && [[ -f dist/src/index.html ]] \
  && grep -q "@vite/client" dist/src/index.html 2>/dev/null; then
  echo "Reusing existing Vite HMR server on :${VITE_PORT}."
else
  # Drop stale production dist so we don't load bundled JS without HMR.
  rm -rf dist
  echo "Starting Vite HMR (npm run dev)…"
  # nohup: survive the launcher shell exiting / SIGHUP (blank new-tab otherwise).
  nohup npm run dev >/tmp/vite-dev.log 2>&1 &
  VITE_PID=$!
  disown || true
  wait_for_vite
fi

mkdir -p "$PROFILE_DIR"
# Stale locks from a previous crash make the next launch exit immediately.
rm -f "$PROFILE_DIR/.parentlock" "$PROFILE_DIR/lock"
ensure_mac_extension

# Restart the display stack if Xvfb is missing or using a different geometry.
if pgrep -f "Xvfb ${DISPLAY} " >/dev/null 2>&1; then
  if ! pgrep -af "Xvfb ${DISPLAY} " | grep -F "${SCREEN}" >/dev/null 2>&1; then
    echo "Xvfb geometry changed (${SCREEN}) — restarting display servers…"
    pkill -f "Xvfb ${DISPLAY} " 2>/dev/null || true
    pkill -f "x11vnc.*${VNC_PORT}" 2>/dev/null || true
    pkill -f "websockify.*${NOVNC_PORT}" 2>/dev/null || true
    sleep 0.5
  fi
fi

if ! pgrep -f "Xvfb ${DISPLAY} " >/dev/null 2>&1; then
  echo "Starting Xvfb on ${DISPLAY} (${SCREEN})…"
  Xvfb "$DISPLAY" -screen 0 "$SCREEN" -ac -nolisten tcp >/tmp/xvfb.log 2>&1 &
  disown || true
  sleep 0.5
fi

if ! pgrep -x fluxbox >/dev/null 2>&1; then
  fluxbox >/tmp/fluxbox.log 2>&1 &
  disown || true
fi

if ! pgrep -f "x11vnc.*${VNC_PORT}" >/dev/null 2>&1; then
  echo "Starting x11vnc on :${VNC_PORT}…"
  x11vnc -display "$DISPLAY" -rfbport "$VNC_PORT" -forever -shared -nopw -listen 0.0.0.0 \
    -noxdamage >/tmp/x11vnc.log 2>&1 &
  disown || true
fi

if ! pgrep -f "websockify.*${NOVNC_PORT}" >/dev/null 2>&1; then
  echo "Starting noVNC on :${NOVNC_PORT} (web root: ${NOVNC_WEB})…"
  websockify --web="$NOVNC_WEB" "$NOVNC_PORT" "localhost:${VNC_PORT}" \
    >/tmp/websockify.log 2>&1 &
  disown || true
fi

echo
echo "┌─────────────────────────────────────────────────────────┐"
echo "│  Open noVNC:  http://localhost:${NOVNC_PORT}/vnc.html    │"
echo "│  Firefox:     ${FIREFOX_BIN}                            │"
echo "│  Edit src/ → Vite HMR updates the new-tab page live.    │"
echo "│  (Needs Firefox ${FIREFOX_MIN_MAJOR}+; ESR cannot load localhost scripts.) │"
echo "└─────────────────────────────────────────────────────────┘"
echo

# Restart Firefox if it exits (e.g. reload race); leave noVNC / Vite running.
while true; do
  rm -f "$PROFILE_DIR/.parentlock" "$PROFILE_DIR/lock"
  npx web-ext run \
    -s dist \
    --firefox "$FIREFOX_BIN" \
    --firefox-profile "$PROFILE_DIR" \
    --keep-profile-changes \
    --pref privacy.userContext.enabled=true \
    --pref browser.startup.page=0 \
    --start-url about:newtab \
    --arg="--display=${DISPLAY}" \
    --arg="--start-maximized" \
    || true
  echo "Firefox/web-ext exited — restarting in 2s (noVNC kept alive)…"
  sleep 2
done
