ARG BASE_IMAGE=agent-sidecar-base:node-py
FROM ${BASE_IMAGE}

USER node
COPY config/parity/extra.base.zshrc /tmp/agent-vm-extra.base.zshrc
RUN cat /tmp/agent-vm-extra.base.zshrc >> /home/node/.zshrc
