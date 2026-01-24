# =============================================================================
# nodepy.base.dockerfile - AI Coder Sidecar (Python/Node/TS)
# =============================================================================
# Pattern: {variant}.{tier}.dockerfile
#   - Variant: nodepy (this), rust, python
#   - Tier: base (ai-tools), repo (committed), local (gitignored)
#
# Override with:
#   - .devcontainer/nodepy.local.dockerfile (personal, gitignored)
#   - .devcontainer/nodepy.repo.dockerfile  (team, committed)
#
# Other variants (in ai_coder_sidecar/):
#   - rust.base.dockerfile   (Rust + Python/Node) - TODO
#   - python.base.dockerfile (Python only) - TODO
# =============================================================================

FROM nikolaik/python-nodejs:python3.13-nodejs24-slim

ARG TZ
ENV TZ="$TZ"

# The nikolaik image comes with a 'pn' user (UID 1000). 
# We rename it to 'node' to match our existing configuration.
RUN usermod -l node pn && \
    groupmod -n node pn && \
    usermod -d /home/node -m node && \
    apt-get update && apt-get install -y sudo && \
    echo "node ALL=(root) NOPASSWD:ALL" > /etc/sudoers.d/node && \
    chmod 0440 /etc/sudoers.d/node

ARG USERNAME=node

# Install basic development tools and iptables/ipset
RUN apt-get update && apt-get install -y --no-install-recommends \
    less \
    git \
    procps \
    sudo \
    zsh \
    man-db \
    unzip \
    gnupg2 \
    gh \
    iptables \
    ipset \
    dnsmasq \
    iproute2 \
    dnsutils \
    aggregate \
    jq \
    nano \
    vim \
    curl \
    ca-certificates \
    wget \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install AWS CLI v2
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-$(uname -m).zip" -o "awscliv2.zip" && \
  unzip awscliv2.zip && ./aws/install && rm -rf aws awscliv2.zip

# Playwright dependencies + Xvfb for headed mode (Electron apps, screenshots)
RUN apt-get update && apt-get install -y --no-install-recommends \
    xvfb \
    libgtk-3-0 \
    libgbm-dev \
    libxss1 \
    libxtst6 \
    libnss3 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    fonts-liberation \
    fonts-noto-color-emoji \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy
ENV VIRTUAL_ENV=/workspace/.venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# pnpm (Corepack) + make global pnpm binaries visible to all users
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN npm install -g corepack@latest \
  && corepack enable \
  && corepack prepare pnpm@latest-10 --activate \
  && mkdir -p /pnpm \
  && chown -R node:node /pnpm

# Ensure default node user has access to /usr/local/share
RUN mkdir -p /usr/local/share/npm-global && \
  chown -R node:node /usr/local/share

# Persist zsh history.
RUN mkdir /commandhistory \
  && touch /commandhistory/.zsh_history \
  && chown -R node /commandhistory

# Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true
ENV TERM=xterm-direct
ENV COLORTERM=truecolor
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

# Create workspace and config directories and set permissions
RUN mkdir -p /workspace /home/node/.claude && \
  chown -R node:node /workspace /home/node/.claude

# fallback
WORKDIR /workspace

# Install git-delta
ARG GIT_DELTA_VERSION=0.18.2
RUN ARCH=$(dpkg --print-architecture) && \
  wget "https://github.com/dandavison/delta/releases/download/${GIT_DELTA_VERSION}/git-delta_${GIT_DELTA_VERSION}_${ARCH}.deb" && \
  dpkg -i "git-delta_${GIT_DELTA_VERSION}_${ARCH}.deb" && \
  rm "git-delta_${GIT_DELTA_VERSION}_${ARCH}.deb"

# Install micro
RUN curl https://getmic.ro | bash && mv micro /usr/local/bin

# Set up non-root user
USER node

# Install Atuin
RUN curl --proto '=https' --tlsv1.2 -LsSf https://setup.atuin.sh | sh
ENV PATH="/home/node/.atuin/bin:$PATH"

# Install global packages
ENV NPM_CONFIG_PREFIX=/usr/local/share/npm-global
ENV PATH=$PATH:/usr/local/share/npm-global/bin

# Set the default shell to zsh rather than sh
ENV SHELL=/bin/zsh
ENV HISTFILE=/home/node/.zsh_history

# Set the default editor and visual
ENV EDITOR=micro
ENV VISUAL=micro

# Default powerline10k theme
ARG ZSH_IN_DOCKER_VERSION=1.2.0
RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v${ZSH_IN_DOCKER_VERSION}/zsh-in-docker.sh)" -- \
  -p git \
  -a 'export HISTSIZE=10000' \
  -a 'export SAVEHIST=10000' \
  -a 'export TERM=xterm-256color' \
  -a 'export COLORTERM=truecolor' \
  -a 'export LANG=C.UTF-8' \
  -a 'export LC_ALL=C.UTF-8' \
  -a 'export FORCE_COLOR=1' \
  -x

# Install Zap non-interactively for the node user
RUN zsh -c 'curl -s https://raw.githubusercontent.com/zap-zsh/zap/master/install.zsh | zsh -s -- --branch release-v1 -k'

# Copy zshrc layers (.base.zshrc, .repo.zshrc, .local.zshrc)
# This preserves the Oh-My-Zsh/Powerlevel10k base from zsh-in-docker
COPY setup/.base.zshrc .repo.zshr[c] .local.zshr[c] /tmp/
RUN cat /tmp/.base.zshrc >> /home/node/.zshrc && \
    if [ -f /tmp/.repo.zshrc ]; then cat /tmp/.repo.zshrc >> /home/node/.zshrc; fi && \
    if [ -f /tmp/.local.zshrc ]; then cat /tmp/.local.zshrc >> /home/node/.zshrc; fi

# Pre-install plugins during build to bake them into the image
# We ignore the exit code here as Zap might return 1 after a clean install in some environments
RUN zsh -c 'source /home/node/.zshrc' || true

# System-wide fallbacks and final setup
USER root
RUN git clone https://github.com/zsh-users/zsh-syntax-highlighting.git /usr/share/zsh-syntax-highlighting
USER node

# Install Claude Code (native installer - better performance, security, auto-updates)
RUN curl -fsSL https://claude.ai/install.sh | bash
RUN pnpm add -g @openai/codex
RUN pnpm add -g @google/gemini-cli
RUN curl -fsSL https://opencode.ai/install | bash
RUN curl -fsSL https://cursor.com/install | bash

# Install Playwright MCP and Chromium browser
RUN pnpm add -g @playwright/mcp@latest
RUN npx playwright install chromium --with-deps

# Set DISPLAY for Xvfb (virtual display for headed mode)
ENV DISPLAY=:99

# Copy and set up firewall script
COPY setup/firewall.sh /usr/local/bin/firewall.sh
USER root
RUN chmod +x /usr/local/bin/firewall.sh && \
  echo "node ALL=(root) NOPASSWD:SETENV: /usr/local/bin/firewall.sh" > /etc/sudoers.d/node-firewall && \
  chmod 0440 /etc/sudoers.d/node-firewall

USER node
