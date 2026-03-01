#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const http = require('node:http');
const net = require('node:net');

function parseArgs(argv) {
  const out = { config: '/opt/gondolin-bridge/guest-loopback-bridge.json' };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--config' && argv[i + 1]) {
      out.config = argv[++i];
    }
  }
  return out;
}

function readConfig(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function now() {
  return new Date().toISOString();
}

let nextId = 1;
function newId(prefix) {
  return `${prefix}-${nextId++}`;
}

function tuneSocket(sock) {
  sock.setNoDelay(true);
  sock.setKeepAlive(true, 30_000);
}

class ServiceBridge {
  constructor(cfg) {
    this.cfg = cfg;
    this.uplinks = [];
    this.waitingClients = [];
    this.activePairs = 0;
    this.totalPairs = 0;
    this.totalRejectedClients = 0;
    this.totalRejectedUplinks = 0;
    this.totalErrors = 0;
    this.clientServer = null;
    this.uplinkServer = null;
  }

  log(msg, extra = {}) {
    const suffix = Object.keys(extra).length ? ` ${JSON.stringify(extra)}` : '';
    process.stdout.write(`${now()} [${this.cfg.name}] ${msg}${suffix}\n`);
  }

  metrics() {
    return {
      name: this.cfg.name,
      clientListen: this.cfg.clientListen,
      uplinkListen: this.cfg.uplinkListen,
      queuedUplinks: this.uplinks.length,
      waitingClients: this.waitingClients.length,
      activePairs: this.activePairs,
      totalPairs: this.totalPairs,
      totalRejectedClients: this.totalRejectedClients,
      totalRejectedUplinks: this.totalRejectedUplinks,
      totalErrors: this.totalErrors,
    };
  }

  async start() {
    await Promise.all([this.startUplinkServer(), this.startClientServer()]);
  }

  async startUplinkServer() {
    this.uplinkServer = net.createServer((sock) => this.onUplink(sock));
    await new Promise((resolve, reject) => {
      this.uplinkServer.once('error', reject);
      this.uplinkServer.listen(this.cfg.uplinkListen.port, this.cfg.uplinkListen.host, () => {
        this.log('uplink-listener-ready', this.cfg.uplinkListen);
        resolve();
      });
    });
  }

  async startClientServer() {
    this.clientServer = net.createServer((sock) => this.onClient(sock));
    await new Promise((resolve, reject) => {
      this.clientServer.once('error', reject);
      this.clientServer.listen(this.cfg.clientListen.port, this.cfg.clientListen.host, () => {
        this.log('client-listener-ready', this.cfg.clientListen);
        resolve();
      });
    });
  }

  onUplink(sock) {
    const id = newId(`${this.cfg.name}-uplink`);
    tuneSocket(sock);
    sock.__bridgeId = id;

    if (this.waitingClients.length > 0) {
      const waiter = this.waitingClients.shift();
      clearTimeout(waiter.timeout);
      this.pair(waiter.sock, sock);
      return;
    }

    if (this.uplinks.length >= this.cfg.maxQueuedUplinks) {
      this.totalRejectedUplinks += 1;
      this.log('uplink-rejected-queue-full', { id, maxQueuedUplinks: this.cfg.maxQueuedUplinks });
      sock.destroy();
      return;
    }

    this.uplinks.push(sock);
    this.log('uplink-queued', { id, queued: this.uplinks.length });

    const remove = () => {
      const index = this.uplinks.indexOf(sock);
      if (index >= 0) {
        this.uplinks.splice(index, 1);
        this.log('uplink-removed', { id, queued: this.uplinks.length });
      }
    };

    sock.on('close', remove);
    sock.on('error', (err) => {
      this.totalErrors += 1;
      this.log('uplink-error', { id, message: String(err && err.message || err) });
      remove();
    });
  }

  onClient(sock) {
    const id = newId(`${this.cfg.name}-client`);
    tuneSocket(sock);
    sock.__bridgeId = id;

    const uplink = this.uplinks.shift();
    if (uplink) {
      this.pair(sock, uplink);
      return;
    }

    this.log('client-waiting-for-uplink', { id, waitForUplinkMs: this.cfg.waitForUplinkMs });

    const timeout = setTimeout(() => {
      const index = this.waitingClients.findIndex((entry) => entry.sock === sock);
      if (index >= 0) this.waitingClients.splice(index, 1);
      this.totalRejectedClients += 1;
      this.log('client-timed-out-no-uplink', { id });
      sock.destroy();
    }, this.cfg.waitForUplinkMs);

    this.waitingClients.push({ sock, timeout });

    const remove = () => {
      const index = this.waitingClients.findIndex((entry) => entry.sock === sock);
      if (index >= 0) {
        clearTimeout(this.waitingClients[index].timeout);
        this.waitingClients.splice(index, 1);
      }
    };

    sock.on('close', remove);
    sock.on('error', (err) => {
      this.totalErrors += 1;
      this.log('client-error-before-pair', { id, message: String(err && err.message || err) });
      remove();
    });
  }

  pair(client, uplink) {
    const pairId = newId(`${this.cfg.name}-pair`);
    const clientId = client.__bridgeId || 'unknown-client';
    const uplinkId = uplink.__bridgeId || 'unknown-uplink';

    this.activePairs += 1;
    this.totalPairs += 1;
    this.log('pair-open', { pairId, clientId, uplinkId, activePairs: this.activePairs });

    const cleanup = () => {
      if (client.__cleaned || uplink.__cleaned) return;
      client.__cleaned = uplink.__cleaned = true;
      this.activePairs -= 1;
      try { client.destroy(); } catch {}
      try { uplink.destroy(); } catch {}
      this.log('pair-close', { pairId, activePairs: this.activePairs });
    };

    client.on('error', (err) => {
      this.totalErrors += 1;
      this.log('pair-client-error', { pairId, message: String(err && err.message || err) });
      cleanup();
    });
    uplink.on('error', (err) => {
      this.totalErrors += 1;
      this.log('pair-uplink-error', { pairId, message: String(err && err.message || err) });
      cleanup();
    });
    client.on('close', cleanup);
    uplink.on('close', cleanup);

    client.pipe(uplink);
    uplink.pipe(client);
  }

  async close() {
    const closeServer = (srv) => new Promise((resolve) => {
      if (!srv) return resolve();
      srv.close(() => resolve());
    });

    for (const uplink of this.uplinks.splice(0)) {
      try { uplink.destroy(); } catch {}
    }
    for (const waiter of this.waitingClients.splice(0)) {
      clearTimeout(waiter.timeout);
      try { waiter.sock.destroy(); } catch {}
    }
    await Promise.all([closeServer(this.uplinkServer), closeServer(this.clientServer)]);
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const config = readConfig(args.config);
  const services = config.services.map((cfg) => new ServiceBridge(cfg));

  await Promise.all(services.map((service) => service.start()));

  let metricsServer = null;
  if (config.metrics && config.metrics.enabled) {
    metricsServer = http.createServer((req, res) => {
      if (!req.url || req.url === '/metrics' || req.url === '/healthz') {
        const body = JSON.stringify({
          status: 'ok',
          ts: now(),
          services: services.map((svc) => svc.metrics()),
        }, null, 2);
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
        res.end(body);
        return;
      }
      res.writeHead(404);
      res.end();
    });

    await new Promise((resolve, reject) => {
      metricsServer.once('error', reject);
      metricsServer.listen(config.metrics.port, config.metrics.host, () => {
        process.stdout.write(`${now()} [metrics] ready ${config.metrics.host}:${config.metrics.port}\n`);
        resolve();
      });
    });
  }

  const shutdown = async () => {
    process.stdout.write(`${now()} [bridge] shutting-down\n`);
    for (const service of services) await service.close();
    if (metricsServer) {
      await new Promise((resolve) => metricsServer.close(resolve));
    }
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

main().catch((err) => {
  process.stderr.write(`${now()} [bridge] fatal ${String(err && err.stack || err)}\n`);
  process.exit(1);
});
