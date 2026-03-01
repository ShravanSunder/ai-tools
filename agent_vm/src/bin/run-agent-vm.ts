#!/usr/bin/env node

import { runRunAgentVmCli } from '#src/features/cli/run-agent-vm.js';

void runRunAgentVmCli(process.argv.slice(2));
