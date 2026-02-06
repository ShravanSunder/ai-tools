# =============================================================================
# node-py.overlay.dockerfile - Per-repo customization layer
# =============================================================================
# Adds per-repo customizations on top of the shared base image.
# Auto-selected by run-agent-sidecar.sh when per-repo customizations exist
# (EXTRA_APT_PACKAGES, build-extra.sh, or extra zshrc files).
#
# Build context: a temporary directory assembled by run-agent-sidecar.sh
# containing only the per-repo files needed (build-extra.sh, extra.*.zshrc).
#
# Custom Dockerfiles in .agent_sidecar/ should follow the same pattern:
#   ARG BASE_IMAGE=agent-sidecar-base:node-py
#   FROM ${BASE_IMAGE}
# =============================================================================

ARG BASE_IMAGE=agent-sidecar-base:node-py
FROM ${BASE_IMAGE}

# Per-repo apt packages (passed via --build-arg)
ARG EXTRA_APT_PACKAGES=""
USER root
RUN if [ -n "$EXTRA_APT_PACKAGES" ]; then \
      echo "Installing extra apt packages: $EXTRA_APT_PACKAGES" && \
      apt-get update && \
      apt-get install -y --no-install-recommends $EXTRA_APT_PACKAGES && \
      apt-get clean && rm -rf /var/lib/apt/lists/*; \
    fi

# Per-repo zshrc additions (copied to build context by run-agent-sidecar.sh)
USER node
COPY extra.repo.zshr[c] extra.local.zshr[c] /tmp/
RUN if [ -f /tmp/extra.repo.zshrc ]; then cat /tmp/extra.repo.zshrc >> /home/node/.zshrc; fi && \
    if [ -f /tmp/extra.local.zshrc ]; then cat /tmp/extra.local.zshrc >> /home/node/.zshrc; fi

# Per-repo build-extra script (runs as root with full network access)
# Copied to build context by run-agent-sidecar.sh from .agent_sidecar/build-extra.{repo,local}.sh
USER root
COPY build-extra.s[h] /tmp/build-extra/
RUN if [ -f /tmp/build-extra/build-extra.sh ]; then \
      echo "Running build-extra.sh..." && \
      chmod +x /tmp/build-extra/build-extra.sh && \
      /tmp/build-extra/build-extra.sh && \
      rm -rf /tmp/build-extra; \
    else \
      rm -rf /tmp/build-extra; \
    fi

USER node
