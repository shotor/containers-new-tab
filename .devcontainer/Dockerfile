FROM mcr.microsoft.com/devcontainers/javascript-node:24-trixie

USER root

RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    jq \
    lsd \
    tmux \
    vim \
    zsh \
    # Firefox + browser remote desktop (noVNC) for extension testing
    firefox-esr \
    xvfb \
    x11vnc \
    novnc \
    websockify \
    fluxbox \
    xterm \
    dbus-x11 \
    fonts-liberation \
    ca-certificates \
  && curl -fsSL https://starship.rs/install.sh \
    | sh -s -- -y --bin-dir /usr/local/bin \
  && npm install -g @openai/codex@latest \
  && npm cache clean --force \
  && rm -rf /var/lib/apt/lists/*

RUN install -d -o node -g node \
  /home/node/.cache \
  /home/node/.config \
  /home/node/.local \
  /home/node/.local/share \
  && chsh -s /usr/bin/zsh node

USER node

RUN curl -fsS https://cursor.com/install | bash

COPY --chown=node:node .zshrc /home/node/.zshrc
COPY --chown=node:node starship.toml /home/node/.config/starship.toml

WORKDIR /workspace
